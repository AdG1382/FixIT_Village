import crypto from 'crypto';
import { GamePhase } from './types.js';
import { Events } from './events.js';
import { stateReducer, createInitialState } from './stateReducer.js';
import { deckRepository, shuffle } from './deckRepository.js';
import { pluginRegistry } from './plugins/registry.js';

export class GameEngine {
  constructor() {
    this.rooms = new Map(); // roomCode -> { roomId, state, events, decks }
    this.roomsById = new Map(); // roomId -> roomCode
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  emitEvent(room, event) {
    room.events.push(event);
    room.state = stateReducer(room.state, event);
    return event;
  }

  createRoom(hostPlayerId, nickname, targetScore = 25, theme = 'village') {
    const roomId = crypto.randomUUID();
    const code = this.generateRoomCode();
    const cleanNick = (nickname || 'Host').trim();

    const initialState = createInitialState(roomId, code, hostPlayerId, cleanNick, targetScore);
    const room = {
      roomId,
      code,
      theme,
      state: initialState,
      events: [],
      decks: null
    };

    this.rooms.set(code, room);
    this.roomsById.set(roomId, code);

    this.emitEvent(room, Events.playerJoined(roomId, hostPlayerId, cleanNick, true));
    return room.state;
  }

  joinRoom(code, playerId, nickname) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found. Check the code and try again.');

    const cleanNick = (nickname || 'Player').trim();

    if (room.state.phase !== GamePhase.LOBBY) {
      // Check if existing player reconnecting
      const existing = room.state.players.find(p => p.id === playerId || p.nickname.toLowerCase() === cleanNick.toLowerCase());
      if (existing) {
        this.emitEvent(room, Events.playerReconnected(room.roomId, existing.id));
        return room.state;
      }
      throw new Error('Game has already started in this room.');
    }

    // Check duplicate name
    let finalNick = cleanNick;
    const nameExists = room.state.players.some(p => p.nickname.toLowerCase() === cleanNick.toLowerCase() && p.id !== playerId);
    if (nameExists) {
      finalNick = `${cleanNick} (${room.state.players.length + 1})`;
    }

    this.emitEvent(room, Events.playerJoined(room.roomId, playerId, finalNick, false));
    return room.state;
  }

  disconnectPlayer(code, playerId) {
    const room = this.rooms.get(code);
    if (!room) return null;
    const player = room.state.players.find(p => p.id === playerId);
    if (player) {
      this.emitEvent(room, Events.playerLeft(room.roomId, playerId, player.nickname));
    }
    return room.state;
  }

  startGame(code, hostId) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found');
    if (room.state.hostId !== hostId) throw new Error('Only the host can start the game');
    if (room.state.players.length < 2) throw new Error('FixIT requires at least 2 players to start');

    const gameId = crypto.randomUUID();
    const playerIds = room.state.players.map(p => p.id);

    // Initialize decks (clean Card IDs)
    room.decks = deckRepository.createThemeDecks(room.theme, room.state.players.length);

    this.emitEvent(room, Events.gameStarted(room.roomId, gameId, room.state.targetScore, playerIds, room.theme));

    // Deal 5 tool IDs to each player
    const hands = {};
    for (const player of room.state.players) {
      hands[player.id] = [];
      for (let i = 0; i < 5; i++) {
        if (room.decks.toolDeck.length === 0 && room.decks.toolDiscard.length > 0) {
          room.decks.toolDeck = shuffle(room.decks.toolDiscard);
          room.decks.toolDiscard = [];
        }
        const cardId = room.decks.toolDeck.pop();
        if (cardId) hands[player.id].push(cardId);
      }
    }

    this.emitEvent(room, Events.cardsDealt(room.roomId, hands));
    this.emitEvent(room, Events.boardRefilled(room.roomId, room.decks.boardRequests));

    return room.state;
  }

  selectTurnAction(code, playerId, payloadOrReqId, maybeToolCardIds) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found');
    if (room.state.phase !== GamePhase.PLAYER_TURN) throw new Error('Not in player turn phase');

    let requestId, toolCardIds;
    if (typeof payloadOrReqId === 'object' && payloadOrReqId !== null && !Array.isArray(payloadOrReqId)) {
      requestId = payloadOrReqId.requestId;
      toolCardIds = payloadOrReqId.toolCardIds;
    } else {
      requestId = payloadOrReqId;
      toolCardIds = maybeToolCardIds;
    }

    const currentPlayer = room.state.players[room.state.currentTurnIndex];
    if (currentPlayer.id !== playerId) throw new Error('It is not your turn');

    if (!room.decks.boardRequests.includes(requestId)) {
      throw new Error('Selected Village Request not found on board');
    }

    if (!Array.isArray(toolCardIds) || toolCardIds.length === 0) {
      throw new Error('You must select at least 1 tool card to tell your story');
    }

    for (const tid of toolCardIds) {
      const isBorrowed = room.state.borrowedTool && room.state.borrowedTool.cardId === tid;
      if (!currentPlayer.hand.includes(tid) && !isBorrowed) {
        throw new Error('One or more selected tool cards are not in your hand');
      }
    }

    const turnId = crypto.randomUUID();
    this.emitEvent(room, Events.storyStarted(room.roomId, turnId, playerId, requestId, toolCardIds));

    return room.state;
  }

  finishStorytelling(code, playerId) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found');
    if (room.state.phase !== GamePhase.STORYTELLING) throw new Error('Not in storytelling phase');

    const currentPlayer = room.state.players[room.state.currentTurnIndex];
    if (currentPlayer.id !== playerId && room.state.hostId !== playerId) {
      throw new Error('Only the current storyteller or host can finish storytelling');
    }

    this.emitEvent(room, Events.storyFinished(room.roomId, room.state.currentTurnId, currentPlayer.id));
    return room.state;
  }

  toggleObjection(code, playerId, hasObjection) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found');
    if (room.state.phase !== GamePhase.DISCUSSION) throw new Error('Not in discussion phase');

    const currentPlayer = room.state.players[room.state.currentTurnIndex];
    if (currentPlayer.id === playerId) {
      throw new Error('Storyteller cannot object to their own story');
    }

    const player = room.state.players.find(p => p.id === playerId);
    if (!player) throw new Error('Player not found');

    if (hasObjection) {
      this.emitEvent(room, Events.objectionRaised(room.roomId, room.state.currentTurnId, playerId, player.nickname));
    } else {
      this.emitEvent(room, Events.objectionCleared(room.roomId, room.state.currentTurnId, playerId, player.nickname));
    }

    return room.state;
  }

  proceedToVote(code, hostId) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found');
    if (room.state.phase !== GamePhase.DISCUSSION) throw new Error('Not in discussion phase');
    if (room.state.hostId !== hostId) throw new Error('Only the host can proceed to vote');

    // Run beforeVote plugins if any
    for (const tid of room.state.selectedToolIds) {
      const plugin = pluginRegistry.getPlugin(tid);
      if (plugin) {
        plugin.beforeVote({ state: room.state, objections: room.state.objections });
      }
    }

    this.emitEvent(room, Events.votingOpened(room.roomId, room.state.currentTurnId));
    return room.state;
  }

  castVote(code, playerId, vote) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found');
    if (room.state.phase !== GamePhase.VOTING) throw new Error('Not in voting phase');

    const currentPlayer = room.state.players[room.state.currentTurnIndex];
    if (currentPlayer.id === playerId) {
      throw new Error('Storyteller cannot vote on their own story');
    }

    if (vote !== 'accept' && vote !== 'reject') {
      throw new Error('Invalid vote value. Must be accept or reject');
    }

    const voteId = crypto.randomUUID();
    this.emitEvent(room, Events.voteSubmitted(room.roomId, room.state.currentTurnId, voteId, playerId, vote));

    // Check if all connected eligible non-storytellers have voted
    const eligibleVoters = room.state.players.filter(p => p.id !== currentPlayer.id && p.connected);
    const votedCount = eligibleVoters.filter(p => room.state.votes[p.id]).length;

    if (votedCount >= eligibleVoters.length && eligibleVoters.length > 0) {
      this.resolveVote(room);
    }

    return room.state;
  }

  resolveVote(room) {
    if (room.state.phase !== GamePhase.VOTING) return;

    const currentPlayer = room.state.players[room.state.currentTurnIndex];
    const eligibleVoters = room.state.players.filter(p => p.id !== currentPlayer.id);

    let acceptCount = 0;
    let rejectCount = 0;
    for (const voter of eligibleVoters) {
      const v = room.state.votes[voter.id];
      if (v === 'accept') acceptCount++;
      else if (v === 'reject') rejectCount++;
    }

    const isSuccess = acceptCount > rejectCount;
    const requestCard = deckRepository.getCard(room.state.activeRequestId, room.theme);
    let basePoints = isSuccess && requestCard ? requestCard.points : 0;

    // Check Happy Accident (SP08) extra request points
    let extraRequestCard = null;
    if (room.state.extraRequestId) {
      extraRequestCard = deckRepository.getCard(room.state.extraRequestId, room.theme);
    }

    // Run afterVote plugins (e.g. HappyAccidentPlugin)
    if (room.state.playedSpecialCardId) {
      const plugin = pluginRegistry.getPlugin(room.state.playedSpecialCardId);
      if (plugin) {
        const mod = plugin.afterVote({
          isSuccess,
          pointsAwarded: basePoints,
          extraRequestPoints: extraRequestCard ? (extraRequestCard.points || 5) : 5
        });
        if (mod && typeof mod.pointsAwarded === 'number') {
          basePoints = mod.pointsAwarded;
        }
      }
    }

    this.emitEvent(
      room,
      Events.voteRevealed(
        room.roomId,
        room.state.currentTurnId,
        { ...room.state.votes },
        isSuccess,
        acceptCount,
        rejectCount,
        eligibleVoters.length,
        basePoints
      )
    );

    if (isSuccess && basePoints > 0) {
      const newScore = currentPlayer.score + basePoints;
      this.emitEvent(room, Events.scoreAwarded(room.roomId, room.state.currentTurnId, currentPlayer.id, basePoints, newScore));
    }

    // Determine tool cards to discard (exclude borrowed cards from SP04)
    let cardsToDiscard = [...room.state.selectedToolIds];
    if (room.state.borrowedTool) {
      cardsToDiscard = cardsToDiscard.filter(id => id !== room.state.borrowedTool.cardId);
    }

    // Discard played tool cards
    if (cardsToDiscard.length > 0) {
      this.emitEvent(room, Events.cardsPlayed(room.roomId, room.state.currentTurnId, currentPlayer.id, cardsToDiscard));
      room.decks.toolDiscard.push(...cardsToDiscard);
    }

    // Replenish player hand back to 5 cards
    const freshPlayer = room.state.players.find(p => p.id === currentPlayer.id);
    const drawn = [];
    while ((freshPlayer ? freshPlayer.hand.length : 0) + drawn.length < 5) {
      if (room.decks.toolDeck.length === 0 && room.decks.toolDiscard.length > 0) {
        room.decks.toolDeck = shuffle(room.decks.toolDiscard);
        room.decks.toolDiscard = [];
      }
      const cardId = room.decks.toolDeck.pop();
      if (!cardId) break;
      drawn.push(cardId);
    }
    if (drawn.length > 0) {
      this.emitEvent(room, Events.cardsDrawn(room.roomId, currentPlayer.id, drawn));
    }

    // If success: discard active request and refill board
    if (isSuccess) {
      const completedRequests = [room.state.activeRequestId];
      if (room.state.extraRequestId) {
        completedRequests.push(room.state.extraRequestId);
      }

      for (const reqId of completedRequests) {
        const reqIndex = room.decks.boardRequests.indexOf(reqId);
        if (reqIndex !== -1) {
          const [completedId] = room.decks.boardRequests.splice(reqIndex, 1);
          room.decks.requestDiscard.push(completedId);
        }
      }

      // Replenish board up to (playerCount + 1)
      const targetBoardCount = room.state.players.length + 1;
      while (room.decks.boardRequests.length < targetBoardCount) {
        if (room.decks.requestDeck.length === 0 && room.decks.requestDiscard.length > 0) {
          room.decks.requestDeck = shuffle(room.decks.requestDiscard);
          room.decks.requestDiscard = [];
        }
        if (room.decks.requestDeck.length > 0) {
          room.decks.boardRequests.push(room.decks.requestDeck.pop());
        } else {
          break;
        }
      }
      this.emitEvent(room, Events.boardRefilled(room.roomId, room.decks.boardRequests));
    }
  }

  playSpecialCard(code, playerId, cardIdOrPayload, maybeParams = {}) {
    let cardId;
    let params;
    if (typeof cardIdOrPayload === 'object' && cardIdOrPayload !== null) {
      cardId = cardIdOrPayload.cardId;
      params = cardIdOrPayload.params || {};
    } else {
      cardId = cardIdOrPayload;
      params = maybeParams || {};
    }

    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found');

    const currentPlayer = room.state.players[room.state.currentTurnIndex];
    const player = room.state.players.find(p => p.id === playerId);
    if (!player) throw new Error('Player not found');

    if (!player.hand.includes(cardId)) {
      throw new Error('Special Card is not in your hand');
    }

    if (room.state.playedSpecialCardId) {
      throw new Error('You may play at most one Special Card during your turn');
    }

    const cardDef = deckRepository.getCard(cardId, room.theme);
    if (!cardDef || cardDef.type !== 'special') {
      throw new Error('Invalid Special Card');
    }

    // Check timing & phase
    if (cardDef.timing === 'BEFORE_STORY') {
      if (room.state.phase !== GamePhase.PLAYER_TURN) {
        throw new Error(`${cardDef.name} must be played before telling your story (during turn selection)`);
      }
      if (currentPlayer.id !== playerId) {
        throw new Error('Only the current player can play this card');
      }
    } else if (cardDef.timing === 'DURING_STORY') {
      if (room.state.phase !== GamePhase.PLAYER_TURN && room.state.phase !== GamePhase.STORYTELLING) {
        throw new Error(`${cardDef.name} must be played during your story`);
      }
      if (currentPlayer.id !== playerId) {
        throw new Error('Only the current player can play this card');
      }
    } else if (cardDef.timing === 'AFTER_STORY') {
      if (room.state.phase !== GamePhase.DISCUSSION && room.state.phase !== GamePhase.VOTING) {
        throw new Error(`${cardDef.name} must be played after telling your story (during discussion/voting)`);
      }
      if (currentPlayer.id !== playerId) {
        throw new Error('Only the current storyteller can play this card');
      }
    }

    const effectDetails = {
      cardName: cardDef.name,
      description: cardDef.description
    };

    const drawHelper = (count) => {
      const drawn = [];
      for (let i = 0; i < count; i++) {
        if (room.decks.toolDeck.length === 0 && room.decks.toolDiscard.length > 0) {
          room.decks.toolDeck = shuffle(room.decks.toolDiscard);
          room.decks.toolDiscard = [];
        }
        const cid = room.decks.toolDeck.pop();
        if (cid) drawn.push(cid);
      }
      return drawn;
    };

    if (cardId.startsWith('SP01')) {
      // SP01 - Lucky Find: Draw 2 Tool cards. Keep 1, return the other to the bottom of the deck.
      const drawn = drawHelper(2);
      if (drawn.length > 0) {
        const keepId = (params.keepCardId && drawn.includes(params.keepCardId)) ? params.keepCardId : drawn[0];
        const keepIndex = drawn.indexOf(keepId);
        const returnId = drawn.find((_, idx) => idx !== keepIndex);
        if (returnId) {
          room.decks.toolDeck.unshift(returnId);
        }
        this.emitEvent(room, Events.cardsDrawn(room.roomId, playerId, [keepId]));
        effectDetails.keptCard = keepId;
      }
    } else if (cardId.startsWith('SP02')) {
      // SP02 - Helping Hand: Ask any player for 1 Tool card.
      const targetPlayer = room.state.players.find(p => p.id === params.targetPlayerId && p.id !== playerId);
      if (targetPlayer && targetPlayer.hand.length > 0) {
        const cardToGive = params.givenCardId && targetPlayer.hand.includes(params.givenCardId)
          ? params.givenCardId
          : targetPlayer.hand[0];
        this.emitEvent(room, Events.cardsPlayed(room.roomId, room.state.currentTurnId || 'prep', targetPlayer.id, [cardToGive]));
        this.emitEvent(room, Events.cardsDrawn(room.roomId, playerId, [cardToGive]));
        effectDetails.receivedCard = cardToGive;
        effectDetails.fromPlayer = targetPlayer.nickname;
      }
    } else if (cardId.startsWith('SP03')) {
      // SP03 - Second Chance: Return Tool cards to deck, shuffle & redraw same number.
      const returnIds = Array.isArray(params.returnedCardIds) ? params.returnedCardIds : [];
      const validReturns = returnIds.filter(id => player.hand.includes(id) && id !== cardId);
      if (validReturns.length > 0) {
        this.emitEvent(room, Events.cardsPlayed(room.roomId, room.state.currentTurnId || 'prep', playerId, validReturns));
        room.decks.toolDeck.push(...validReturns);
        room.decks.toolDeck = shuffle(room.decks.toolDeck);
        const drawn = drawHelper(validReturns.length);
        if (drawn.length > 0) {
          this.emitEvent(room, Events.cardsDrawn(room.roomId, playerId, drawn));
        }
        effectDetails.redrawnCount = validReturns.length;
      }
    } else if (cardId.startsWith('SP04')) {
      // SP04 - Borrowed Tool: Use 1 Tool card from another player's hand.
      const targetPlayer = room.state.players.find(p => p.id === params.targetPlayerId && p.id !== playerId);
      const cardToBorrow = params.borrowedCardId || (targetPlayer && targetPlayer.hand[0]);
      if (targetPlayer && cardToBorrow) {
        effectDetails.borrowedTool = {
          cardId: cardToBorrow,
          ownerId: targetPlayer.id,
          ownerPlayerId: targetPlayer.id,
          ownerNickname: targetPlayer.nickname
        };
      }
    } else if (cardId.startsWith('SP05')) {
      // SP05 - Brilliant Idea: Add 1 extra Tool card from hand before scoring.
      if (params.addedToolId && player.hand.includes(params.addedToolId)) {
        effectDetails.addedToolId = params.addedToolId;
      }
    } else if (cardId.startsWith('SP06')) {
      // SP06 - Hidden Toolbox: Draw 3 Tool cards, discard 2 from hand.
      const drawn = drawHelper(3);
      if (drawn.length > 0) {
        this.emitEvent(room, Events.cardsDrawn(room.roomId, playerId, drawn));
      }
      const discardIds = Array.isArray(params.discardCardIds) ? params.discardCardIds.slice(0, 2) : [];
      if (discardIds.length > 0) {
        this.emitEvent(room, Events.cardsPlayed(room.roomId, room.state.currentTurnId || 'prep', playerId, discardIds));
        room.decks.toolDiscard.push(...discardIds);
      }
      effectDetails.drawnCount = drawn.length;
      effectDetails.discardCount = discardIds.length;
    } else if (cardId.startsWith('SP07')) {
      // SP07 - Wild Inspiration: 1 Tool card represents any tool needed.
      if (params.targetToolId && player.hand.includes(params.targetToolId)) {
        effectDetails.wildToolMapping = {
          toolId: params.targetToolId,
          represents: params.wildToolName || 'Any Tool'
        };
      }
    } else if (cardId.startsWith('SP08')) {
      // SP08 - Happy Accident: Complete 1 additional Small (5pt) Request.
      const reqId = params.extraRequestId || room.decks.boardRequests.find(id => {
        const c = deckRepository.getCard(id, room.theme);
        return c && c.points === 5;
      });
      if (reqId) {
        const extraReq = deckRepository.getCard(reqId, room.theme);
        effectDetails.extraRequestId = reqId;
        effectDetails.extraRequestName = extraReq?.name || extraReq?.title || 'Extra Request';
      }
    }

    // Special card is placed in toolDiscard
    room.decks.toolDiscard.push(cardId);

    this.emitEvent(
      room,
      Events.specialCardPlayed(
        room.roomId,
        room.state.currentTurnId || 'turn_prep',
        playerId,
        cardId,
        cardDef.timing,
        effectDetails
      )
    );

    return room.state;
  }

  advanceTurn(code) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found');
    if (room.state.phase !== GamePhase.TURN_RESULT) return room.state;

    const currentTurns = room.state.turnsInCurrentRound + 1;
    const isRoundComplete = (currentTurns % room.state.players.length) === 0;

    if (isRoundComplete) {
      const maxScore = Math.max(...room.state.players.map(p => p.score));
      if (maxScore >= room.state.targetScore) {
        // Game Over
        const winners = room.state.players.filter(p => p.score === maxScore);
        const finalScores = {};
        for (const p of room.state.players) finalScores[p.id] = p.score;
        const durationSeconds = Math.round((Date.now() - (room.state.startedAt || Date.now())) / 1000);

        this.emitEvent(room, Events.gameEnded(room.roomId, room.state.gameId, winners, finalScores, durationSeconds));
        return room.state;
      }
    }

    const nextIndex = (room.state.currentTurnIndex + 1) % room.state.players.length;
    const nextPlayer = room.state.players[nextIndex];
    const nextRound = isRoundComplete ? room.state.roundNumber + 1 : room.state.roundNumber;
    const nextTurnId = `turn_${nextRound}_${nextIndex}`;

    this.emitEvent(room, Events.turnEnded(room.roomId, nextTurnId, nextRound, nextPlayer.id));
    return room.state;
  }

  hostAction(code, hostId, action, params = {}) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error('Room not found');
    if (room.state.hostId !== hostId) throw new Error('Only the host can execute moderation actions');

    this.emitEvent(room, Events.hostActionExecuted(room.roomId, hostId, action, params));

    switch (action) {
      case 'skipPlayer': {
        const currentPlayer = room.state.players[room.state.currentTurnIndex];
        // Advance without points
        this.advanceTurn(code);
        break;
      }
      case 'forceNextPhase': {
        if (room.state.phase === GamePhase.PLAYER_TURN) {
          const reqId = room.decks.boardRequests[0];
          const currentPlayer = room.state.players[room.state.currentTurnIndex];
          const toolId = currentPlayer.hand[0] || 'T01';
          this.selectTurnAction(code, currentPlayer.id, { requestId: reqId, toolCardIds: [toolId] });
        } else if (room.state.phase === GamePhase.STORYTELLING) {
          const currentPlayer = room.state.players[room.state.currentTurnIndex];
          this.finishStorytelling(code, currentPlayer.id);
        } else if (room.state.phase === GamePhase.DISCUSSION) {
          this.proceedToVote(code, hostId);
        } else if (room.state.phase === GamePhase.VOTING) {
          this.resolveVote(room);
        } else if (room.state.phase === GamePhase.TURN_RESULT) {
          this.advanceTurn(code);
        }
        break;
      }
      case 'endGame': {
        const maxScore = Math.max(...room.state.players.map(p => p.score));
        const winners = room.state.players.filter(p => p.score === maxScore);
        const finalScores = {};
        for (const p of room.state.players) finalScores[p.id] = p.score;
        const durationSeconds = Math.round((Date.now() - (room.state.startedAt || Date.now())) / 1000);
        this.emitEvent(room, Events.gameEnded(room.roomId, room.state.gameId, winners, finalScores, durationSeconds));
        break;
      }
    }

    return room.state;
  }

  /**
   * Replays an entire game from an ordered array of events
   */
  static replay(events = []) {
    if (events.length === 0) return null;
    const first = events[0];
    const initial = createInitialState(first.payload.roomId, 'REPLAY', first.payload.playerId, first.payload.nickname);

    let state = initial;
    for (const ev of events) {
      state = stateReducer(state, ev);
    }
    return state;
  }

  /**
   * Returns sanitized state for a specific player view
   */
  getSanitizedState(code, viewerPlayerId) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) return null;

    const state = room.state;
    const currentPlayer = state.players[state.currentTurnIndex];
    const isViewerHost = state.hostId === viewerPlayerId;
    const isViewerCurrentPlayer = currentPlayer && currentPlayer.id === viewerPlayerId;

    // Hydrate player hands: only show full card objects for viewer; show counts for others
    const sanitizedPlayers = state.players.map(p => {
      const isMe = p.id === viewerPlayerId;
      const handCards = isMe ? deckRepository.getCards(p.hand, room.theme) : [];
      return {
        id: p.id,
        nickname: p.nickname,
        score: p.score,
        isHost: p.isHost,
        connected: p.connected,
        handCount: p.hand ? p.hand.length : 0,
        hand: handCards
      };
    });

    // Hydrate board requests
    const boardRequests = room.decks
      ? deckRepository.getCards(room.decks.boardRequests, room.theme)
      : [];

    // Hydrate active request card
    const activeRequest = state.activeRequestId
      ? deckRepository.getCard(state.activeRequestId, room.theme)
      : null;

    // Hydrate extra request card (SP08 Happy Accident)
    const extraRequest = state.extraRequestId
      ? deckRepository.getCard(state.extraRequestId, room.theme)
      : null;

    // Hydrate played tool cards
    const playedToolCards = deckRepository.getCards(state.selectedToolIds, room.theme);

    // Sanitized votes: mask other player choices during VOTING phase
    let sanitizedVotes = {};
    if (state.phase === GamePhase.VOTING) {
      for (const [pid, v] of Object.entries(state.votes)) {
        sanitizedVotes[pid] = pid === viewerPlayerId ? v : 'VOTED';
      }
    } else {
      sanitizedVotes = state.votes;
    }

    return {
      roomId: state.roomId,
      code: state.code,
      gameId: state.gameId,
      hostId: state.hostId,
      isViewerHost,
      isViewerCurrentPlayer,
      viewerPlayerId,
      targetScore: state.targetScore,
      phase: state.phase,
      players: sanitizedPlayers,
      currentTurnIndex: state.currentTurnIndex,
      currentPlayer: currentPlayer ? { id: currentPlayer.id, nickname: currentPlayer.nickname } : null,
      roundNumber: state.roundNumber,
      turnsInCurrentRound: state.turnsInCurrentRound,
      boardRequests,
      activeRequest,
      extraRequest,
      selectedToolIds: state.selectedToolIds,
      playedToolCards,
      playedSpecialCardId: state.playedSpecialCardId,
      wildToolMapping: state.wildToolMapping,
      extraRequestId: state.extraRequestId,
      borrowedTool: state.borrowedTool,
      objections: state.objections,
      votes: sanitizedVotes,
      lastTurnResult: state.lastTurnResult,
      winner: state.winner,
      activityLog: state.activityFeed.slice(-30)
    };
  }
}

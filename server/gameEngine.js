import { initializeDecks, dealInitialHands, replenishHand, replenishBoardRequests } from './deckManager.js';

export class GameEngine {
  constructor() {
    this.rooms = new Map(); // code -> roomState
    this.socketToPlayer = new Map(); // socketId -> { roomCode, playerId }
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

  createRoom(hostPlayerId, nickname, targetScore = 25) {
    const code = this.generateRoomCode();
    const host = {
      id: hostPlayerId,
      nickname: nickname.trim() || 'Host',
      score: 0,
      hand: [],
      isHost: true,
      connected: true,
      socketId: null,
      joinedAt: Date.now()
    };

    const room = {
      code,
      hostId: hostPlayerId,
      targetScore: Number(targetScore) || 25,
      phase: 'LOBBY', // 'LOBBY', 'PLAYER_TURN', 'STORYTELLING', 'DISCUSSION', 'VOTING', 'TURN_RESULT', 'GAME_OVER'
      players: [host],
      currentTurnIndex: 0,
      roundNumber: 1,
      turnsInCurrentRound: 0,
      activeRequest: null,
      selectedToolIds: [],
      objections: {}, // playerId -> boolean
      votes: {}, // playerId -> 'accept' | 'reject'
      lastTurnResult: null,
      winner: null,
      decks: null,
      activityLog: [
        { type: 'SYSTEM', text: `Room created by ${host.nickname}`, timestamp: Date.now() }
      ]
    };

    this.rooms.set(code, room);
    return room;
  }

  joinRoom(code, playerId, nickname) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) {
      throw new Error('Room not found. Check the code and try again.');
    }

    if (room.phase !== 'LOBBY') {
      // Check if this is an existing player reconnecting
      const existingPlayer = room.players.find(p => p.id === playerId || p.nickname.toLowerCase() === nickname.toLowerCase().trim());
      if (existingPlayer) {
        existingPlayer.connected = true;
        return room;
      }
      throw new Error('Game has already started in this room.');
    }

    // Check if player already exists
    let player = room.players.find(p => p.id === playerId);
    if (player) {
      player.nickname = nickname.trim() || player.nickname;
      player.connected = true;
      return room;
    }

    // Prevent duplicate nicknames in lobby
    const cleanNick = nickname.trim() || `Player ${room.players.length + 1}`;
    const nameExists = room.players.some(p => p.nickname.toLowerCase() === cleanNick.toLowerCase());
    const finalNick = nameExists ? `${cleanNick} (${room.players.length + 1})` : cleanNick;

    player = {
      id: playerId,
      nickname: finalNick,
      score: 0,
      hand: [],
      isHost: false,
      connected: true,
      socketId: null,
      joinedAt: Date.now()
    };

    room.players.push(player);
    room.activityLog.push({
      type: 'JOIN',
      text: `${player.nickname} joined the room`,
      timestamp: Date.now()
    });

    return room;
  }

  bindSocket(code, playerId, socketId) {
    const room = this.rooms.get(code);
    if (!room) return null;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.socketId = socketId;
      player.connected = true;
      this.socketToPlayer.set(socketId, { roomCode: code, playerId });
    }
    return room;
  }

  handleDisconnect(socketId) {
    const binding = this.socketToPlayer.get(socketId);
    if (!binding) return null;

    const { roomCode, playerId } = binding;
    this.socketToPlayer.delete(socketId);

    const room = this.rooms.get(roomCode);
    if (!room) return null;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.connected = false;
      // If host disconnected and in lobby, reassign host to first connected player
      if (player.isHost) {
        const nextConnected = room.players.find(p => p.connected && p.id !== player.id);
        if (nextConnected) {
          player.isHost = false;
          nextConnected.isHost = true;
          room.hostId = nextConnected.id;
          room.activityLog.push({
            type: 'SYSTEM',
            text: `${nextConnected.nickname} is now the host.`,
            timestamp: Date.now()
          });
        }
      }
    }

    // Clean up empty rooms after some grace period if all disconnected
    const allDisconnected = room.players.every(p => !p.connected);
    if (allDisconnected) {
      setTimeout(() => {
        const r = this.rooms.get(roomCode);
        if (r && r.players.every(p => !p.connected)) {
          this.rooms.delete(roomCode);
        }
      }, 10 * 60 * 1000); // 10 minutes
    }

    return room;
  }

  startGame(code, hostId) {
    const room = this.rooms.get(code);
    if (!room) throw new Error('Room not found');
    if (room.hostId !== hostId) throw new Error('Only the host can start the game');
    if (room.players.length < 2) throw new Error('FixIT requires at least 2 players');

    // Initialize decks and deal hands
    room.decks = initializeDecks(room.players.length);
    dealInitialHands(room.players, room.decks);

    room.phase = 'PLAYER_TURN';
    room.currentTurnIndex = 0;
    room.roundNumber = 1;
    room.turnsInCurrentRound = 0;
    room.activeRequest = null;
    room.selectedToolIds = [];
    room.objections = {};
    room.votes = {};
    room.lastTurnResult = null;
    room.winner = null;

    const firstPlayer = room.players[0];
    room.activityLog.push({
      type: 'PHASE',
      text: `Game started! Round 1 begins with ${firstPlayer.nickname}.`,
      timestamp: Date.now()
    });

    return room;
  }

  selectTurnAction(code, playerId, { requestId, toolCardIds }) {
    const room = this.rooms.get(code);
    if (!room) throw new Error('Room not found');
    if (room.phase !== 'PLAYER_TURN') throw new Error('Not in player turn phase');

    const currentPlayer = room.players[room.currentTurnIndex];
    if (currentPlayer.id !== playerId) throw new Error("It is not your turn");

    const requestCard = room.decks.boardRequests.find(r => r.id === requestId);
    if (!requestCard) throw new Error('Selected Village Request not found on board');

    if (!Array.isArray(toolCardIds) || toolCardIds.length === 0) {
      throw new Error('You must select at least 1 tool card to tell your story');
    }

    // Verify player owns all selected tool cards
    const playerToolIds = currentPlayer.hand.map(c => c.id);
    for (const tid of toolCardIds) {
      if (!playerToolIds.includes(tid)) {
        throw new Error('One or more selected tool cards are not in your hand');
      }
    }

    room.activeRequest = requestCard;
    room.selectedToolIds = toolCardIds;
    room.phase = 'STORYTELLING';
    room.objections = {};
    room.votes = {};

    room.activityLog.push({
      type: 'STORY',
      text: `${currentPlayer.nickname} chose "${requestCard.title}" with ${toolCardIds.length} tool card(s) and is telling the story!`,
      timestamp: Date.now()
    });

    return room;
  }

  finishStorytelling(code, playerId) {
    const room = this.rooms.get(code);
    if (!room) throw new Error('Room not found');
    if (room.phase !== 'STORYTELLING') throw new Error('Not in storytelling phase');

    const currentPlayer = room.players[room.currentTurnIndex];
    // Either the storyteller or the host can conclude storytelling
    if (currentPlayer.id !== playerId && room.hostId !== playerId) {
      throw new Error('Only the current storyteller or host can finish storytelling');
    }

    room.phase = 'DISCUSSION';
    room.objections = {};

    room.activityLog.push({
      type: 'PHASE',
      text: `${currentPlayer.nickname} finished their story. Floor opened for discussion!`,
      timestamp: Date.now()
    });

    return room;
  }

  toggleObjection(code, playerId, hasObjection) {
    const room = this.rooms.get(code);
    if (!room) throw new Error('Room not found');
    if (room.phase !== 'DISCUSSION') throw new Error('Not in discussion phase');

    const player = room.players.find(p => p.id === playerId);
    if (!player) throw new Error('Player not found');

    const currentPlayer = room.players[room.currentTurnIndex];
    if (currentPlayer.id === playerId) {
      throw new Error('Storyteller cannot object to their own story');
    }

    room.objections[playerId] = Boolean(hasObjection);

    room.activityLog.push({
      type: 'OBJECTION',
      text: `${player.nickname} ${hasObjection ? 'raised an objection' : 'withdrew their objection'}.`,
      timestamp: Date.now()
    });

    return room;
  }

  proceedToVote(code, hostId) {
    const room = this.rooms.get(code);
    if (!room) throw new Error('Room not found');
    if (room.phase !== 'DISCUSSION') throw new Error('Not in discussion phase');
    if (room.hostId !== hostId) throw new Error('Only the host can proceed to vote');

    room.phase = 'VOTING';
    room.votes = {};

    room.activityLog.push({
      type: 'PHASE',
      text: `Host opened the vote! Non-storytellers, cast your secret vote.`,
      timestamp: Date.now()
    });

    return room;
  }

  castVote(code, playerId, vote) {
    const room = this.rooms.get(code);
    if (!room) throw new Error('Room not found');
    if (room.phase !== 'VOTING') throw new Error('Not in voting phase');

    const currentPlayer = room.players[room.currentTurnIndex];
    if (currentPlayer.id === playerId) {
      throw new Error('Storyteller cannot vote on their own story');
    }

    if (vote !== 'accept' && vote !== 'reject') {
      throw new Error('Invalid vote value');
    }

    room.votes[playerId] = vote;

    // Check if all eligible connected non-storytellers have voted
    const eligibleVoters = room.players.filter(p => p.id !== currentPlayer.id && p.connected);
    const votedCount = eligibleVoters.filter(p => room.votes[p.id]).length;

    if (votedCount >= eligibleVoters.length && eligibleVoters.length > 0) {
      // Auto resolve vote!
      this.resolveVote(code);
    }

    return room;
  }

  resolveVote(code, forceByHost = false) {
    const room = this.rooms.get(code);
    if (!room) throw new Error('Room not found');
    if (room.phase !== 'VOTING') return room;

    const currentPlayer = room.players[room.currentTurnIndex];
    const eligibleVoters = room.players.filter(p => p.id !== currentPlayer.id);

    let acceptCount = 0;
    let rejectCount = 0;

    for (const voter of eligibleVoters) {
      const v = room.votes[voter.id];
      if (v === 'accept') acceptCount++;
      else if (v === 'reject') rejectCount++;
      // If unvoted during force, treated as abstain or not counted
    }

    // Success if strictly majority Accept (acceptCount > rejectCount && acceptCount > 0)
    // In 2-player game, 1 voter: accept = 1 => success.
    const isSuccess = acceptCount > rejectCount;
    const pointsAwarded = isSuccess ? room.activeRequest.points : 0;

    if (isSuccess) {
      currentPlayer.score += pointsAwarded;
    }

    // Discard played tool cards from player's hand
    const playedCards = currentPlayer.hand.filter(c => room.selectedToolIds.includes(c.id));
    currentPlayer.hand = currentPlayer.hand.filter(c => !room.selectedToolIds.includes(c.id));
    room.decks.toolDiscard.push(...playedCards);

    // Replenish player hand to 5 cards
    replenishHand(currentPlayer, room.decks, 5);

    // If success: discard active Village Request and replenish board
    if (isSuccess) {
      const reqIndex = room.decks.boardRequests.findIndex(r => r.id === room.activeRequest.id);
      if (reqIndex !== -1) {
        const [completedReq] = room.decks.boardRequests.splice(reqIndex, 1);
        room.decks.requestDiscard.push(completedReq);
      }
      replenishBoardRequests(room.decks, room.players.length + 1);
    }

    room.lastTurnResult = {
      success: isSuccess,
      votes: { ...room.votes },
      acceptCount,
      rejectCount,
      totalVoters: eligibleVoters.length,
      pointsAwarded,
      storyPlayer: { id: currentPlayer.id, nickname: currentPlayer.nickname },
      request: { ...room.activeRequest },
      usedToolIds: [...room.selectedToolIds],
      forced: forceByHost
    };

    room.phase = 'TURN_RESULT';

    room.activityLog.push({
      type: 'RESULT',
      text: `${isSuccess ? '🎉 SUCCESS' : '❌ REJECTED'}: ${currentPlayer.nickname}'s story ${isSuccess ? `was accepted (+${pointsAwarded} pts)` : 'was not accepted'}. (${acceptCount} Accept, ${rejectCount} Reject)`,
      timestamp: Date.now()
    });

    return room;
  }

  advanceToNextTurn(code) {
    const room = this.rooms.get(code);
    if (!room) throw new Error('Room not found');
    if (room.phase !== 'TURN_RESULT') return room;

    room.turnsInCurrentRound += 1;

    // Check if a full round just completed (all players had a turn)
    const isRoundComplete = (room.turnsInCurrentRound % room.players.length) === 0;

    if (isRoundComplete) {
      // Check if anyone reached targetScore (default 25)
      const maxScore = Math.max(...room.players.map(p => p.score));
      if (maxScore >= room.targetScore) {
        // Game Over! Determine winners
        const winners = room.players.filter(p => p.score === maxScore);
        room.phase = 'GAME_OVER';
        room.winner = winners;
        room.activityLog.push({
          type: 'GAME_OVER',
          text: `🏆 GAME OVER! ${winners.map(w => w.nickname).join(', ')} won with ${maxScore} points!`,
          timestamp: Date.now()
        });
        return room;
      }

      room.roundNumber += 1;
      room.activityLog.push({
        type: 'ROUND',
        text: `--- Round ${room.roundNumber} Begins ---`,
        timestamp: Date.now()
      });
    }

    // Advance turn clockwise
    room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length;
    room.phase = 'PLAYER_TURN';
    room.activeRequest = null;
    room.selectedToolIds = [];
    room.objections = {};
    room.votes = {};

    const nextPlayer = room.players[room.currentTurnIndex];
    room.activityLog.push({
      type: 'TURN',
      text: `It is now ${nextPlayer.nickname}'s turn.`,
      timestamp: Date.now()
    });

    return room;
  }

  hostAction(code, hostId, action, params = {}) {
    const room = this.rooms.get(code);
    if (!room) throw new Error('Room not found');
    if (room.hostId !== hostId) throw new Error('Only the host can perform this action');

    switch (action) {
      case 'skipPlayer': {
        const currentPlayer = room.players[room.currentTurnIndex];
        // Replenish hand if any selected
        replenishHand(currentPlayer, room.decks, 5);
        room.phase = 'TURN_RESULT';
        room.lastTurnResult = {
          success: false,
          votes: {},
          acceptCount: 0,
          rejectCount: 0,
          totalVoters: 0,
          pointsAwarded: 0,
          storyPlayer: { id: currentPlayer.id, nickname: currentPlayer.nickname },
          request: room.activeRequest || { title: 'Skipped Turn' },
          usedToolIds: [],
          skipped: true
        };
        room.activityLog.push({
          type: 'HOST',
          text: `Host skipped ${currentPlayer.nickname}'s turn.`,
          timestamp: Date.now()
        });
        this.advanceToNextTurn(code);
        break;
      }

      case 'forceNextPhase': {
        if (room.phase === 'PLAYER_TURN') {
          // If no request selected, pick first request & first tool
          const currentPlayer = room.players[room.currentTurnIndex];
          if (!room.activeRequest && room.decks.boardRequests.length > 0) {
            room.activeRequest = room.decks.boardRequests[0];
          }
          if (room.selectedToolIds.length === 0 && currentPlayer.hand.length > 0) {
            room.selectedToolIds = [currentPlayer.hand[0].id];
          }
          room.phase = 'STORYTELLING';
        } else if (room.phase === 'STORYTELLING') {
          room.phase = 'DISCUSSION';
        } else if (room.phase === 'DISCUSSION') {
          this.proceedToVote(code, hostId);
        } else if (room.phase === 'VOTING') {
          this.resolveVote(code, true);
        } else if (room.phase === 'TURN_RESULT') {
          this.advanceToNextTurn(code);
        }
        room.activityLog.push({
          type: 'HOST',
          text: `Host forced next phase (${room.phase}).`,
          timestamp: Date.now()
        });
        break;
      }

      case 'kickPlayer': {
        const targetId = params.targetPlayerId;
        if (!targetId || targetId === hostId) {
          throw new Error('Cannot kick host or invalid player');
        }
        const targetIndex = room.players.findIndex(p => p.id === targetId);
        if (targetIndex !== -1) {
          const kicked = room.players[targetIndex];
          room.players.splice(targetIndex, 1);
          if (room.currentTurnIndex >= room.players.length) {
            room.currentTurnIndex = 0;
          }
          room.activityLog.push({
            type: 'HOST',
            text: `Host kicked ${kicked.nickname} from the room.`,
            timestamp: Date.now()
          });
        }
        break;
      }

      case 'restartGame': {
        room.decks = initializeDecks(room.players.length);
        dealInitialHands(room.players, room.decks);
        for (const p of room.players) {
          p.score = 0;
        }
        room.phase = 'PLAYER_TURN';
        room.currentTurnIndex = 0;
        room.roundNumber = 1;
        room.turnsInCurrentRound = 0;
        room.activeRequest = null;
        room.selectedToolIds = [];
        room.objections = {};
        room.votes = {};
        room.lastTurnResult = null;
        room.winner = null;

        room.activityLog.push({
          type: 'HOST',
          text: `Host restarted the game.`,
          timestamp: Date.now()
        });
        break;
      }

      case 'endGame': {
        const maxScore = Math.max(...room.players.map(p => p.score));
        room.winner = room.players.filter(p => p.score === maxScore);
        room.phase = 'GAME_OVER';
        room.activityLog.push({
          type: 'HOST',
          text: `Host ended the game.`,
          timestamp: Date.now()
        });
        break;
      }

      default:
        throw new Error('Unknown host action');
    }

    return room;
  }

  /**
   * Sanitizes state for a specific client viewing the room
   */
  getSanitizedState(code, viewerPlayerId) {
    const room = this.rooms.get(code);
    if (!room) return null;

    const currentPlayer = room.players[room.currentTurnIndex];
    const isViewerCurrentPlayer = currentPlayer && currentPlayer.id === viewerPlayerId;
    const isViewerHost = room.hostId === viewerPlayerId;

    // Filter players: only show hand for viewer, show hand count for others
    const sanitizedPlayers = room.players.map(p => {
      const isMe = p.id === viewerPlayerId;
      return {
        id: p.id,
        nickname: p.nickname,
        score: p.score,
        isHost: p.isHost,
        connected: p.connected,
        handCount: p.hand ? p.hand.length : 0,
        hand: isMe ? p.hand : [] // Private hand
      };
    });

    // During VOTING phase, hide who voted what until TURN_RESULT, but show who has submitted their vote
    let sanitizedVotes = {};
    if (room.phase === 'VOTING') {
      for (const [pid, v] of Object.entries(room.votes)) {
        if (pid === viewerPlayerId) {
          sanitizedVotes[pid] = v; // Show own vote
        } else {
          sanitizedVotes[pid] = 'VOTED'; // Mask others' vote value
        }
      }
    } else {
      sanitizedVotes = room.votes; // Revealed in TURN_RESULT
    }

    // Storytelling tools: when in storytelling / discussion / voting / result, show played tools
    let playedToolCards = [];
    if (room.decks && room.selectedToolIds.length > 0 && currentPlayer) {
      // Find tool objects from player's hand or tool deck/discard
      const allKnownTools = [
        ...(currentPlayer.hand || []),
        ...(room.decks.toolDeck || []),
        ...(room.decks.toolDiscard || [])
      ];
      playedToolCards = room.selectedToolIds.map(tid => 
        allKnownTools.find(t => t.id === tid) || { id: tid, name: 'Tool' }
      );
    }

    return {
      code: room.code,
      hostId: room.hostId,
      isViewerHost,
      isViewerCurrentPlayer,
      viewerPlayerId,
      targetScore: room.targetScore,
      phase: room.phase,
      players: sanitizedPlayers,
      currentTurnIndex: room.currentTurnIndex,
      currentPlayer: currentPlayer ? { id: currentPlayer.id, nickname: currentPlayer.nickname } : null,
      roundNumber: room.roundNumber,
      turnsInCurrentRound: room.turnsInCurrentRound,
      boardRequests: room.decks ? room.decks.boardRequests : [],
      activeRequest: room.activeRequest,
      selectedToolIds: room.selectedToolIds,
      playedToolCards,
      objections: room.objections,
      votes: sanitizedVotes,
      lastTurnResult: room.lastTurnResult,
      winner: room.winner,
      deckCounts: room.decks ? {
        toolsRemaining: room.decks.toolDeck.length,
        toolsDiscarded: room.decks.toolDiscard.length,
        requestsRemaining: room.decks.requestDeck.length
      } : null,
      activityLog: room.activityLog.slice(-25)
    };
  }
}

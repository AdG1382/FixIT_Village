import { EventType, GamePhase } from './types.js';

export function createInitialState(roomId, roomCode, hostPlayerId, hostNickname, targetScore = 25) {
  return {
    roomId,
    code: roomCode,
    gameId: null,
    hostId: hostPlayerId,
    targetScore: Number(targetScore) || 25,
    phase: GamePhase.LOBBY,
    players: [
      {
        id: hostPlayerId,
        nickname: hostNickname,
        score: 0,
        hand: [], // Array of Card IDs e.g. ["T01", "T05"]
        isHost: true,
        connected: true,
        joinedAt: Date.now()
      }
    ],
    currentTurnIndex: 0,
    currentTurnId: null,
    roundNumber: 1,
    turnsInCurrentRound: 0,
    activeRequestId: null,
    selectedToolIds: [],
    playedSpecialCardId: null, // Track 1 special card limit per turn
    wildToolMapping: null,     // SP07 Wild Inspiration
    extraRequestId: null,      // SP08 Happy Accident
    borrowedTool: null,        // SP04 Borrowed Tool { cardId, ownerPlayerId }
    objections: {}, // playerId -> boolean
    votes: {}, // playerId -> 'accept' | 'reject'
    lastTurnResult: null,
    winner: null,
    decks: null,
    startedAt: null,
    endedAt: null,
    activityFeed: [
      {
        id: 'init',
        type: 'SYSTEM',
        text: `Room created by ${hostNickname}`,
        timestamp: Date.now()
      }
    ]
  };
}

/**
 * Pure Event Reducer
 * Computes nextState from currentState and an immutable event.
 */
export function stateReducer(state, event) {
  const { type, payload, timestamp, eventId } = event;

  switch (type) {
    case EventType.PLAYER_JOINED: {
      const existing = state.players.find(p => p.id === payload.playerId);
      let players;
      if (existing) {
        players = state.players.map(p =>
          p.id === payload.playerId ? { ...p, nickname: payload.nickname, connected: true } : p
        );
      } else {
        players = [
          ...state.players,
          {
            id: payload.playerId,
            nickname: payload.nickname,
            score: 0,
            hand: [],
            isHost: Boolean(payload.isHost),
            connected: true,
            joinedAt: timestamp
          }
        ];
      }

      return {
        ...state,
        players,
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'JOIN',
            text: `${payload.nickname} joined the table`,
            timestamp
          }
        ]
      };
    }

    case EventType.PLAYER_LEFT: {
      const players = state.players.map(p =>
        p.id === payload.playerId ? { ...p, connected: false } : p
      );
      return {
        ...state,
        players,
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'LEAVE',
            text: `${payload.nickname} disconnected`,
            timestamp
          }
        ]
      };
    }

    case EventType.PLAYER_RECONNECTED: {
      const players = state.players.map(p =>
        p.id === payload.playerId ? { ...p, connected: true } : p
      );
      return {
        ...state,
        players
      };
    }

    case EventType.GAME_STARTED: {
      return {
        ...state,
        gameId: payload.gameId,
        targetScore: payload.targetScore,
        phase: GamePhase.PLAYER_TURN,
        currentTurnIndex: 0,
        currentTurnId: `turn_${state.roundNumber}_0`,
        roundNumber: 1,
        turnsInCurrentRound: 0,
        activeRequestId: null,
        selectedToolIds: [],
        objections: {},
        votes: {},
        lastTurnResult: null,
        winner: null,
        startedAt: timestamp,
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'SYSTEM',
            text: `FixIT Match started! Round 1 begins with ${state.players[0]?.nickname}.`,
            timestamp
          }
        ]
      };
    }

    case EventType.CARDS_DEALT: {
      // payload.hands = { [playerId]: [cardIds] }
      const players = state.players.map(p => ({
        ...p,
        hand: payload.hands[p.id] ? [...payload.hands[p.id]] : p.hand
      }));
      return {
        ...state,
        players
      };
    }

    case EventType.BOARD_REFILLED: {
      return {
        ...state,
        decks: {
          ...state.decks,
          boardRequests: payload.requestIds
        }
      };
    }

    case EventType.STORY_STARTED: {
      const storyteller = state.players.find(p => p.id === payload.storytellerId);
      return {
        ...state,
        phase: GamePhase.STORYTELLING,
        currentTurnId: payload.turnId,
        activeRequestId: payload.requestId,
        selectedToolIds: payload.toolIds,
        objections: {},
        votes: {},
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'STORY_SELECT',
            actor: storyteller?.nickname,
            text: `${storyteller?.nickname} selected request ${payload.requestId} with ${payload.toolIds.length} tool(s)`,
            timestamp
          }
        ]
      };
    }

    case EventType.STORY_FINISHED: {
      const storyteller = state.players.find(p => p.id === payload.storytellerId);
      return {
        ...state,
        phase: GamePhase.DISCUSSION,
        objections: {},
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'DISCUSSION',
            actor: storyteller?.nickname,
            text: `Discussion started for ${storyteller?.nickname}'s story.`,
            timestamp
          }
        ]
      };
    }

    case EventType.OBJECTION_RAISED: {
      return {
        ...state,
        objections: {
          ...state.objections,
          [payload.playerId]: true
        },
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'OBJECTION',
            actor: payload.nickname,
            text: `${payload.nickname} objected to the solution.`,
            timestamp
          }
        ]
      };
    }

    case EventType.OBJECTION_CLEARED: {
      return {
        ...state,
        objections: {
          ...state.objections,
          [payload.playerId]: false
        },
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'OBJECTION_CLEAR',
            actor: payload.nickname,
            text: `${payload.nickname} withdrew their objection.`,
            timestamp
          }
        ]
      };
    }

    case EventType.VOTING_OPENED: {
      return {
        ...state,
        phase: GamePhase.VOTING,
        votes: {},
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'VOTING_OPEN',
            text: `Secret voting opened. Villagers are casting their votes.`,
            timestamp
          }
        ]
      };
    }

    case EventType.VOTE_SUBMITTED: {
      return {
        ...state,
        votes: {
          ...state.votes,
          [payload.voterId]: payload.vote
        }
      };
    }

    case EventType.VOTE_REVEALED: {
      const storyteller = state.players[state.currentTurnIndex];
      return {
        ...state,
        phase: GamePhase.TURN_RESULT,
        lastTurnResult: {
          success: payload.isSuccess,
          votes: payload.votes,
          acceptCount: payload.acceptCount,
          rejectCount: payload.rejectCount,
          totalVoters: payload.totalVoters,
          pointsAwarded: typeof payload.pointsAwarded === 'number' ? payload.pointsAwarded : 0,
          storyPlayer: storyteller ? { id: storyteller.id, nickname: storyteller.nickname } : null,
          requestId: state.activeRequestId,
          extraRequestId: state.extraRequestId,
          usedToolIds: [...state.selectedToolIds]
        },
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'VOTE_RESULT',
            text: `Vote: ${payload.acceptCount} 👍  ${payload.rejectCount} 👎 — ${payload.isSuccess ? 'Story Accepted!' : 'Story Rejected'}`,
            timestamp
          }
        ]
      };
    }

    case EventType.SCORE_AWARDED: {
      const players = state.players.map(p =>
        p.id === payload.playerId ? { ...p, score: payload.newScore } : p
      );
      const player = state.players.find(p => p.id === payload.playerId);
      return {
        ...state,
        players,
        lastTurnResult: state.lastTurnResult ? {
          ...state.lastTurnResult,
          pointsAwarded: typeof payload.points === 'number' ? payload.points : state.lastTurnResult.pointsAwarded
        } : null,
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'SCORE',
            actor: player?.nickname,
            text: `${player?.nickname || 'Storyteller'} earned +${payload.points ?? 0} points! (Total: ${payload.newScore ?? 0})`,
            timestamp
          }
        ]
      };
    }

    case EventType.CARDS_PLAYED: {
      // Remove played tool IDs from player's hand
      const players = state.players.map(p =>
        p.id === payload.playerId
          ? { ...p, hand: p.hand.filter(id => !payload.cardIds.includes(id)) }
          : p
      );
      return {
        ...state,
        players
      };
    }

    case EventType.CARDS_DRAWN: {
      // Add drawn card IDs to player's hand
      const players = state.players.map(p =>
        p.id === payload.playerId
          ? { ...p, hand: [...p.hand, ...payload.cardIds] }
          : p
      );
      return {
        ...state,
        players
      };
    }

    case EventType.SPECIAL_CARD_PLAYED: {
      const player = state.players.find(p => p.id === payload.playerId);
      const updatedPlayers = state.players.map(p => {
        if (p.id === payload.playerId) {
          // Remove special card from hand
          return {
            ...p,
            hand: p.hand.filter(id => id !== payload.cardId)
          };
        }
        return p;
      });

      const nextState = {
        ...state,
        players: updatedPlayers,
        playedSpecialCardId: payload.cardId,
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'SPECIAL_CARD',
            actor: player?.nickname,
            text: `${player?.nickname} played Special Card: ${payload.effectDetails?.cardName || payload.cardId}! (${payload.effectDetails?.description || ''})`,
            timestamp
          }
        ]
      };

      // If Wild Inspiration (SP07), store wild mapping
      if (payload.cardId.startsWith('SP07') && payload.effectDetails?.wildToolMapping) {
        nextState.wildToolMapping = payload.effectDetails.wildToolMapping;
      }

      // If Happy Accident (SP08), store extra request
      if (payload.cardId.startsWith('SP08') && payload.effectDetails?.extraRequestId) {
        nextState.extraRequestId = payload.effectDetails.extraRequestId;
      }

      // If Brilliant Idea (SP05), add extra tool
      if (payload.cardId.startsWith('SP05') && payload.effectDetails?.addedToolId) {
        if (!nextState.selectedToolIds.includes(payload.effectDetails.addedToolId)) {
          nextState.selectedToolIds = [...nextState.selectedToolIds, payload.effectDetails.addedToolId];
        }
      }

      // If Borrowed Tool (SP04), store borrowed info
      if (payload.cardId.startsWith('SP04') && payload.effectDetails?.borrowedTool) {
        nextState.borrowedTool = payload.effectDetails.borrowedTool;
        if (!nextState.selectedToolIds.includes(payload.effectDetails.borrowedTool.cardId)) {
          nextState.selectedToolIds = [...nextState.selectedToolIds, payload.effectDetails.borrowedTool.cardId];
        }
      }

      return nextState;
    }

    case EventType.TURN_ENDED: {
      const nextIndex = state.players.findIndex(p => p.id === payload.nextPlayerId);
      const nextPlayer = state.players[nextIndex !== -1 ? nextIndex : 0];
      return {
        ...state,
        phase: GamePhase.PLAYER_TURN,
        roundNumber: payload.roundNumber,
        currentTurnIndex: nextIndex !== -1 ? nextIndex : 0,
        currentTurnId: payload.turnId,
        turnsInCurrentRound: state.turnsInCurrentRound + 1,
        activeRequestId: null,
        selectedToolIds: [],
        playedSpecialCardId: null,
        wildToolMapping: null,
        extraRequestId: null,
        borrowedTool: null,
        objections: {},
        votes: {},
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'TURN_START',
            actor: nextPlayer?.nickname,
            text: `It is now ${nextPlayer?.nickname}'s turn.`,
            timestamp
          }
        ]
      };
    }

    case EventType.GAME_ENDED: {
      return {
        ...state,
        phase: GamePhase.GAME_OVER,
        winner: payload.winners,
        endedAt: timestamp,
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'GAME_OVER',
            text: `🏆 GAME OVER! ${payload.winners.map(w => w.nickname).join(' & ')} won with ${payload.finalScores[payload.winners[0]?.id] || 0} pts!`,
            timestamp
          }
        ]
      };
    }

    case EventType.HOST_ACTION_EXECUTED: {
      return {
        ...state,
        activityFeed: [
          ...state.activityFeed,
          {
            id: eventId,
            type: 'HOST',
            text: `Host executed action: ${payload.action}`,
            timestamp
          }
        ]
      };
    }

    default:
      return state;
  }
}

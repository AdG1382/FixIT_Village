import crypto from 'crypto';
import { EventType } from './types.js';

export function createEvent(type, payload = {}) {
  return {
    eventId: crypto.randomUUID(),
    timestamp: Date.now(),
    type,
    payload
  };
}

export const Events = {
  playerJoined: (roomId, playerId, nickname, isHost) =>
    createEvent(EventType.PLAYER_JOINED, { roomId, playerId, nickname, isHost }),

  playerLeft: (roomId, playerId, nickname) =>
    createEvent(EventType.PLAYER_LEFT, { roomId, playerId, nickname }),

  playerReconnected: (roomId, playerId) =>
    createEvent(EventType.PLAYER_RECONNECTED, { roomId, playerId }),

  gameStarted: (roomId, gameId, targetScore, playerIds, theme) =>
    createEvent(EventType.GAME_STARTED, { roomId, gameId, targetScore, playerIds, theme }),

  cardsDealt: (roomId, hands) =>
    createEvent(EventType.CARDS_DEALT, { roomId, hands }),

  boardRefilled: (roomId, requestIds) =>
    createEvent(EventType.BOARD_REFILLED, { roomId, requestIds }),

  storyStarted: (roomId, turnId, storytellerId, requestId, toolIds) =>
    createEvent(EventType.STORY_STARTED, { roomId, turnId, storytellerId, requestId, toolIds }),

  storyFinished: (roomId, turnId, storytellerId) =>
    createEvent(EventType.STORY_FINISHED, { roomId, turnId, storytellerId }),

  objectionRaised: (roomId, turnId, playerId, nickname) =>
    createEvent(EventType.OBJECTION_RAISED, { roomId, turnId, playerId, nickname }),

  objectionCleared: (roomId, turnId, playerId, nickname) =>
    createEvent(EventType.OBJECTION_CLEARED, { roomId, turnId, playerId, nickname }),

  votingOpened: (roomId, turnId) =>
    createEvent(EventType.VOTING_OPENED, { roomId, turnId }),

  voteSubmitted: (roomId, turnId, voteId, voterId, vote) =>
    createEvent(EventType.VOTE_SUBMITTED, { roomId, turnId, voteId, voterId, vote }),

  voteRevealed: (roomId, turnId, votes, isSuccess, acceptCount, rejectCount, totalVoters, pointsAwarded = 0) =>
    createEvent(EventType.VOTE_REVEALED, { roomId, turnId, votes, isSuccess, acceptCount, rejectCount, totalVoters, pointsAwarded }),

  scoreAwarded: (roomId, turnId, playerId, points, newScore) =>
    createEvent(EventType.SCORE_AWARDED, { roomId, turnId, playerId, points, newScore }),

  cardsPlayed: (roomId, turnId, playerId, cardIds) =>
    createEvent(EventType.CARDS_PLAYED, { roomId, turnId, playerId, cardIds }),

  cardsDrawn: (roomId, playerId, cardIds) =>
    createEvent(EventType.CARDS_DRAWN, { roomId, playerId, cardIds }),

  specialCardPlayed: (roomId, turnId, playerId, cardId, timing, effectDetails) =>
    createEvent(EventType.SPECIAL_CARD_PLAYED, { roomId, turnId, playerId, cardId, timing, effectDetails }),

  turnEnded: (roomId, turnId, roundNumber, nextPlayerId) =>
    createEvent(EventType.TURN_ENDED, { roomId, turnId, roundNumber, nextPlayerId }),

  gameEnded: (roomId, gameId, winners, finalScores, durationSeconds) =>
    createEvent(EventType.GAME_ENDED, { roomId, gameId, winners, finalScores, durationSeconds }),

  hostActionExecuted: (roomId, hostId, action, params) =>
    createEvent(EventType.HOST_ACTION_EXECUTED, { roomId, hostId, action, params })
};

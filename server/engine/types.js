/**
 * Game Phases
 */
export const GamePhase = Object.freeze({
  LOBBY: 'LOBBY',
  PLAYER_TURN: 'PLAYER_TURN',
  STORYTELLING: 'STORYTELLING',
  DISCUSSION: 'DISCUSSION',
  VOTING: 'VOTING',
  TURN_RESULT: 'TURN_RESULT',
  GAME_OVER: 'GAME_OVER'
});

/**
 * Domain Event Types
 */
export const EventType = Object.freeze({
  PLAYER_JOINED: 'PlayerJoined',
  PLAYER_LEFT: 'PlayerLeft',
  PLAYER_RECONNECTED: 'PlayerReconnected',
  GAME_STARTED: 'GameStarted',
  CARDS_DEALT: 'CardsDealt',
  BOARD_REFILLED: 'BoardRefilled',
  STORY_STARTED: 'StoryStarted',
  STORY_FINISHED: 'StoryFinished',
  OBJECTION_RAISED: 'ObjectionRaised',
  OBJECTION_CLEARED: 'ObjectionCleared',
  VOTING_OPENED: 'VotingOpened',
  VOTE_SUBMITTED: 'VoteSubmitted',
  VOTE_REVEALED: 'VoteRevealed',
  SCORE_AWARDED: 'ScoreAwarded',
  CARDS_PLAYED: 'CardsPlayed',
  CARDS_DRAWN: 'CardsDrawn',
  SPECIAL_CARD_PLAYED: 'SpecialCardPlayed',
  TURN_ENDED: 'TurnEnded',
  GAME_ENDED: 'GameEnded',
  HOST_ACTION_EXECUTED: 'HostActionExecuted'
});

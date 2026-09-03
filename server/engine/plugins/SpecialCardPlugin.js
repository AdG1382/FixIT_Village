/**
 * SpecialCardPlugin
 * Base interface for all Special Card mechanics.
 * Adding or altering special card behavior requires zero changes to the core GameEngine.
 */
export class SpecialCardPlugin {
  constructor(cardId, name, description) {
    this.cardId = cardId;
    this.name = name;
    this.description = description;
  }

  /**
   * Determine if the card can currently be played by the player
   * @param {Object} context - { state, playerId, phase, requestId, toolCardIds }
   * @returns {boolean}
   */
  canPlay(context) {
    return true;
  }

  /**
   * Executed when the card is played/selected
   * @param {Object} context - { state, event, playerId }
   * @returns {Array<Object>} List of additional events or state modifications
   */
  play(context) {
    return [];
  }

  /**
   * Hook executed immediately before voting begins
   * @param {Object} context - { state, activeRequest, toolCardIds, objections }
   */
  beforeVote(context) {
    return [];
  }

  /**
   * Hook executed when votes are counted and before score is finalized
   * @param {Object} context - { state, acceptCount, rejectCount, isSuccess, pointsAwarded }
   * @returns {Object} Modified result params if any (e.g. multiplier)
   */
  afterVote(context) {
    return context;
  }

  /**
   * Hook executed at the conclusion of the turn
   * @param {Object} context - { state, lastTurnResult }
   */
  afterTurn(context) {
    return [];
  }
}

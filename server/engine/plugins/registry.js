import { SpecialCardPlugin } from './SpecialCardPlugin.js';

/**
 * SP01 - Lucky Find
 * Timing: BEFORE_STORY
 * Description: Draw 2 Tool cards. Keep 1, return the other to the bottom of the deck.
 */
export class LuckyFindPlugin extends SpecialCardPlugin {
  constructor() {
    super('SP01', 'Lucky Find', 'Draw 2 Tool cards. Keep 1, return the other to the bottom of the deck.');
    this.timing = 'BEFORE_STORY';
  }

  canPlay(context) {
    return context.phase === 'PLAYER_TURN';
  }
}

/**
 * SP02 - Helping Hand
 * Timing: BEFORE_STORY
 * Description: Ask any player for one Tool card. They may choose any card to give you.
 */
export class HelpingHandPlugin extends SpecialCardPlugin {
  constructor() {
    super('SP02', 'Helping Hand', 'Ask any player for one Tool card. They may choose any card to give you.');
    this.timing = 'BEFORE_STORY';
  }

  canPlay(context) {
    return context.phase === 'PLAYER_TURN' && context.state.players.length > 1;
  }
}

/**
 * SP03 - Second Chance
 * Timing: BEFORE_STORY
 * Description: Return any number of Tool cards from your hand to the deck. Shuffle and draw the same number of cards.
 */
export class SecondChancePlugin extends SpecialCardPlugin {
  constructor() {
    super('SP03', 'Second Chance', 'Return any number of Tool cards from your hand to the deck. Shuffle the deck and draw the same number of cards.');
    this.timing = 'BEFORE_STORY';
  }

  canPlay(context) {
    return context.phase === 'PLAYER_TURN';
  }
}

/**
 * SP04 - Borrowed Tool
 * Timing: BEFORE_STORY
 * Description: Use one Tool card from another player's hand for this story. Return the card to that player after scoring.
 */
export class BorrowedToolPlugin extends SpecialCardPlugin {
  constructor() {
    super('SP04', 'Borrowed Tool', 'Use one Tool card from another player\'s hand for this story. Return the card to that player after scoring.');
    this.timing = 'BEFORE_STORY';
  }

  canPlay(context) {
    return context.phase === 'PLAYER_TURN' && context.state.players.length > 1;
  }
}

/**
 * SP05 - Brilliant Idea
 * Timing: AFTER_STORY
 * Description: After telling your story, add one extra Tool card from your hand to improve it before scoring.
 */
export class BrilliantIdeaPlugin extends SpecialCardPlugin {
  constructor() {
    super('SP05', 'Brilliant Idea', 'After telling your story, add one extra Tool card from your hand to improve it before scoring.');
    this.timing = 'AFTER_STORY';
  }

  canPlay(context) {
    return context.phase === 'DISCUSSION' || context.phase === 'VOTING';
  }
}

/**
 * SP06 - Hidden Toolbox
 * Timing: BEFORE_STORY
 * Description: Immediately draw 3 Tool cards. Then discard 2 of them from your hand.
 */
export class HiddenToolboxPlugin extends SpecialCardPlugin {
  constructor() {
    super('SP06', 'Hidden Toolbox', 'Immediately draw 3 Tool cards. Then discard 2 of them from your hand.');
    this.timing = 'BEFORE_STORY';
  }

  canPlay(context) {
    return context.phase === 'PLAYER_TURN';
  }
}

/**
 * SP07 - Wild Inspiration
 * Timing: DURING_STORY
 * Description: Choose one Tool card in your hand. For this turn, it may represent any Tool card you need.
 */
export class WildInspirationPlugin extends SpecialCardPlugin {
  constructor() {
    super('SP07', 'Wild Inspiration', 'Choose one Tool card in your hand. For this turn, it may represent any Tool card you need.');
    this.timing = 'DURING_STORY';
  }

  canPlay(context) {
    return context.phase === 'PLAYER_TURN';
  }
}

/**
 * SP08 - Happy Accident
 * Timing: AFTER_STORY
 * Description: Complete one additional Small (5-point) Village Request using the same set of Tool cards.
 */
export class HappyAccidentPlugin extends SpecialCardPlugin {
  constructor() {
    super('SP08', 'Happy Accident', 'Complete one additional Small (5-point) Village Request using the same set of Tool cards.');
    this.timing = 'AFTER_STORY';
  }

  canPlay(context) {
    return context.phase === 'DISCUSSION' || context.phase === 'VOTING';
  }

  afterVote(context) {
    if (context.isSuccess && context.extraRequestPoints) {
      return {
        ...context,
        pointsAwarded: context.pointsAwarded + context.extraRequestPoints,
        specialEffect: `Happy Accident completed an extra Small Request (+${context.extraRequestPoints} pts)!`
      };
    }
    return context;
  }
}

export class PluginRegistry {
  constructor() {
    this.plugins = new Map();
    this.registerPlugin(new LuckyFindPlugin());
    this.registerPlugin(new HelpingHandPlugin());
    this.registerPlugin(new SecondChancePlugin());
    this.registerPlugin(new BorrowedToolPlugin());
    this.registerPlugin(new BrilliantIdeaPlugin());
    this.registerPlugin(new HiddenToolboxPlugin());
    this.registerPlugin(new WildInspirationPlugin());
    this.registerPlugin(new HappyAccidentPlugin());
  }

  registerPlugin(plugin) {
    this.plugins.set(plugin.cardId, plugin);
  }

  getPlugin(cardId) {
    if (!cardId) return null;
    const baseId = cardId.replace(/_[a-z0-9]+$/, '');
    return this.plugins.get(baseId) || null;
  }

  hasPlugin(cardId) {
    if (!cardId) return false;
    const baseId = cardId.replace(/_[a-z0-9]+$/, '');
    return this.plugins.has(baseId);
  }
}

export const pluginRegistry = new PluginRegistry();

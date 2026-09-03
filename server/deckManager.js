import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load base card data
const toolsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards', 'tools.json'), 'utf8'));
const requestsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards', 'requests.json'), 'utf8'));
const specialsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards', 'specials.json'), 'utf8'));

/**
 * Fisher-Yates shuffle
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Create initial decks for a game
 */
export function initializeDecks(playerCount) {
  // Multiply tool deck if 5+ players to ensure plenty of tool cards
  let baseTools = [...toolsData];
  if (playerCount >= 4) {
    // Add another set of tools for 4+ players
    baseTools = [...toolsData, ...toolsData.map(t => ({ ...t, id: `${t.id}_b` }))];
  }

  const toolDeck = shuffle(baseTools);
  const requestDeck = shuffle([...requestsData]);
  const specialDeck = shuffle([...specialsData]);

  // Reveal (Players + 1) village requests on board
  const boardRequestCount = Math.min(playerCount + 1, requestDeck.length);
  const boardRequests = [];
  for (let i = 0; i < boardRequestCount; i++) {
    if (requestDeck.length > 0) {
      boardRequests.push(requestDeck.pop());
    }
  }

  return {
    toolDeck,
    toolDiscard: [],
    requestDeck,
    requestDiscard: [],
    specialDeck,
    specialDiscard: [],
    boardRequests
  };
}

/**
 * Deal 5 tool cards to each player
 */
export function dealInitialHands(players, decks) {
  for (const player of players) {
    player.hand = [];
    for (let i = 0; i < 5; i++) {
      drawToolCard(player, decks);
    }
  }
}

/**
 * Draw a single tool card into player's hand, reshuffling discard if deck is empty
 */
export function drawToolCard(player, decks) {
  if (decks.toolDeck.length === 0) {
    if (decks.toolDiscard.length > 0) {
      decks.toolDeck = shuffle(decks.toolDiscard);
      decks.toolDiscard = [];
    } else {
      return null; // No cards left
    }
  }
  const card = decks.toolDeck.pop();
  if (card) {
    player.hand.push(card);
  }
  return card;
}

/**
 * Ensure player has 5 cards in hand
 */
export function replenishHand(player, decks, targetCount = 5) {
  while (player.hand.length < targetCount) {
    const card = drawToolCard(player, decks);
    if (!card) break;
  }
}

/**
 * Replenish village requests on the board up to targetCount (playerCount + 1)
 */
export function replenishBoardRequests(decks, targetCount) {
  while (decks.boardRequests.length < targetCount && (decks.requestDeck.length > 0 || decks.requestDiscard.length > 0)) {
    if (decks.requestDeck.length === 0 && decks.requestDiscard.length > 0) {
      decks.requestDeck = shuffle(decks.requestDiscard);
      decks.requestDiscard = [];
    }
    if (decks.requestDeck.length > 0) {
      decks.boardRequests.push(decks.requestDeck.pop());
    } else {
      break;
    }
  }
}

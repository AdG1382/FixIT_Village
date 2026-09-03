import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DECKS_ROOT = path.join(__dirname, '..', 'decks');

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

export class DeckRepository {
  constructor(decksDir = DECKS_ROOT) {
    this.decksDir = decksDir;
    this.themes = new Map(); // themeName -> { tools, requests, specials, cardCatalog: Map<id, card> }
    this.loadAllThemes();
  }

  loadAllThemes() {
    if (!fs.existsSync(this.decksDir)) return;
    const themes = fs.readdirSync(this.decksDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const theme of themes) {
      this.loadTheme(theme);
    }
  }

  loadTheme(themeName) {
    const themeDir = path.join(this.decksDir, themeName);
    const toolsPath = path.join(themeDir, 'tools.json');
    const requestsPath = path.join(themeDir, 'requests.json');
    const specialsPath = path.join(themeDir, 'specials.json');

    const tools = fs.existsSync(toolsPath) ? JSON.parse(fs.readFileSync(toolsPath, 'utf8')) : [];
    const requests = fs.existsSync(requestsPath) ? JSON.parse(fs.readFileSync(requestsPath, 'utf8')) : [];
    const specials = fs.existsSync(specialsPath) ? JSON.parse(fs.readFileSync(specialsPath, 'utf8')) : [];

    const cardCatalog = new Map();
    for (const card of [...tools, ...requests, ...specials]) {
      cardCatalog.set(card.id, card);
    }

    this.themes.set(themeName, {
      tools,
      requests,
      specials,
      cardCatalog
    });
  }

  getTheme(themeName = 'village') {
    if (!this.themes.has(themeName)) {
      this.loadTheme(themeName);
    }
    return this.themes.get(themeName);
  }

  getCard(cardId, themeName = 'village') {
    const theme = this.getTheme(themeName);
    if (!theme) return null;

    // Direct ID match
    if (theme.cardCatalog.has(cardId)) {
      return theme.cardCatalog.get(cardId);
    }

    // Check for cloned deck IDs (e.g. T01_b)
    const baseId = cardId.replace(/_[a-z0-9]+$/, '');
    if (theme.cardCatalog.has(baseId)) {
      const baseCard = theme.cardCatalog.get(baseId);
      return { ...baseCard, id: cardId };
    }

    return null;
  }

  getCards(cardIds = [], themeName = 'village') {
    return cardIds.map(id => this.getCard(id, themeName)).filter(Boolean);
  }

  /**
   * Initializes shuffled decks holding CARD IDs (not full card objects).
   * Storage in state is clean string IDs.
   */
  createThemeDecks(themeName = 'village', playerCount = 2) {
    const theme = this.getTheme(themeName);
    if (!theme) throw new Error(`Unknown theme: ${themeName}`);

    // Scale standard Tool cards
    const copiesNeeded = Math.max(2, Math.ceil((playerCount * 5 + 10) / theme.tools.length));
    let toolIds = [];
    for (let c = 0; c < copiesNeeded; c++) {
      const suffix = c === 0 ? '' : `_${String.fromCharCode(97 + c)}`;
      toolIds.push(...theme.tools.map(t => `${t.id}${suffix}`));
    }

    // Official Rule: Shuffle all 8 Special Cards into the Tool deck before game begins
    const specialIds = (theme.specials || []).map(s => s.id);
    const combinedToolPool = [...toolIds, ...specialIds];

    const shuffledToolDeck = shuffle(combinedToolPool);
    const shuffledRequestDeck = shuffle(theme.requests.map(r => r.id));

    // Reveal (playerCount + 1) initial board requests
    const initialBoardCount = Math.min(playerCount + 1, shuffledRequestDeck.length);
    const initialBoardRequests = [];
    for (let i = 0; i < initialBoardCount; i++) {
      if (shuffledRequestDeck.length > 0) {
        initialBoardRequests.push(shuffledRequestDeck.pop());
      }
    }

    return {
      theme: themeName,
      toolDeck: shuffledToolDeck,
      toolDiscard: [],
      requestDeck: shuffledRequestDeck,
      requestDiscard: [],
      specialDeck: [],
      specialDiscard: [],
      boardRequests: initialBoardRequests
    };
  }
}

export const deckRepository = new DeckRepository();

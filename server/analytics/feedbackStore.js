import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Write-only append file (JSONL format) and JSON archive
const ARCHIVES_DIR = path.join(__dirname, '..', 'archives');
const FEEDBACK_JSONL_FILE = path.join(ARCHIVES_DIR, 'feedback.jsonl');
const FEEDBACK_JSON_FILE = path.join(ARCHIVES_DIR, 'feedback.json');

export class FeedbackStore {
  constructor() {
    this.ensureDir();
  }

  ensureDir() {
    if (!fs.existsSync(ARCHIVES_DIR)) {
      fs.mkdirSync(ARCHIVES_DIR, { recursive: true });
    }
    if (!fs.existsSync(FEEDBACK_JSON_FILE)) {
      fs.writeFileSync(FEEDBACK_JSON_FILE, JSON.stringify([]), 'utf8');
    }
  }

  /**
   * Appends feedback directly to the write-only server file.
   */
  addFeedback(feedback) {
    this.ensureDir();

    const timestamp = Date.now();
    const entry = {
      id: `fb_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
      rating: Number(feedback.rating) || 5,
      favoriteRequest: feedback.favoriteRequest ? String(feedback.favoriteRequest).trim() : '',
      confusingText: feedback.confusingText ? String(feedback.confusingText).trim() : '',
      gameId: feedback.gameId || null,
      playerId: feedback.playerId || 'anonymous',
      nickname: feedback.nickname ? String(feedback.nickname).trim() : 'Villager',
      submittedAt: new Date(timestamp).toISOString(),
      timestamp
    };

    // 1. Pure write-only append to JSONL log
    fs.appendFileSync(FEEDBACK_JSONL_FILE, JSON.stringify(entry) + '\n', 'utf8');

    // 2. Also keep structured JSON file synchronized
    try {
      const list = this.getAllFeedback();
      list.push(entry);
      fs.writeFileSync(FEEDBACK_JSON_FILE, JSON.stringify(list, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to sync feedback.json:', err);
    }

    return entry;
  }

  getAllFeedback() {
    this.ensureDir();
    // Prefer reading from JSONL append-only log if exists, else fallback to JSON
    if (fs.existsSync(FEEDBACK_JSONL_FILE)) {
      try {
        const raw = fs.readFileSync(FEEDBACK_JSONL_FILE, 'utf8');
        return raw
          .split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => JSON.parse(line));
      } catch (err) {
        console.error('Error reading feedback.jsonl, trying fallback:', err);
      }
    }

    try {
      const data = fs.readFileSync(FEEDBACK_JSON_FILE, 'utf8');
      return JSON.parse(data) || [];
    } catch {
      return [];
    }
  }

  getSummary() {
    const list = this.getAllFeedback();
    if (list.length === 0) {
      return { totalResponses: 0, averageRating: 5.0, recentComments: [] };
    }
    const totalRating = list.reduce((acc, f) => acc + (f.rating || 5), 0);
    const averageRating = (totalRating / list.length).toFixed(1);
    const recentComments = list
      .filter(f => f.confusingText || f.favoriteRequest)
      .slice(-10);

    return {
      totalResponses: list.length,
      averageRating: Number(averageRating),
      recentComments
    };
  }
}

export const feedbackStore = new FeedbackStore();

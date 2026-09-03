#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARCHIVES_DIR = path.join(__dirname, '..', 'archives');
const JSONL_FILE = path.join(ARCHIVES_DIR, 'feedback.jsonl');
const JSON_FILE = path.join(ARCHIVES_DIR, 'feedback.json');

function loadFeedback() {
  if (fs.existsSync(JSONL_FILE)) {
    const raw = fs.readFileSync(JSONL_FILE, 'utf8');
    return raw
      .split('\n')
      .filter(l => l.trim().length > 0)
      .map(l => {
        try { return JSON.parse(l); } catch { return null; }
      })
      .filter(Boolean);
  }

  if (fs.existsSync(JSON_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8')) || [];
    } catch {
      return [];
    }
  }

  return [];
}

const args = process.argv.slice(2);
const isCsv = args.includes('--csv');
const entries = loadFeedback();

if (isCsv) {
  // Export as CSV
  console.log('"ID","Timestamp","Villager","Rating","Favorite Request / Story","Confusion / Suggestions","Game ID"');
  for (const e of entries) {
    const sanitize = (str) => `"${(str || '').replace(/"/g, '""')}"`;
    console.log([
      sanitize(e.id),
      sanitize(e.submittedAt || new Date(e.timestamp).toISOString()),
      sanitize(e.nickname),
      e.rating || 5,
      sanitize(e.favoriteRequest),
      sanitize(e.confusingText),
      sanitize(e.gameId)
    ].join(','));
  }
  process.exit(0);
}

// Pretty Terminal Display
console.log('\n======================================================');
console.log('   🏡 FIXIT VILLAGE — 3-QUESTION FEEDBACK LOGS');
console.log('======================================================\n');
console.log(`📁 File Location: ${JSONL_FILE}\n`);

if (entries.length === 0) {
  console.log('No player feedback recorded yet.');
  console.log('Feedback submitted from the in-game prompt or top bar will appear here automatically.\n');
  process.exit(0);
}

// Calculate Summary Statistics
const total = entries.length;
const totalRating = entries.reduce((acc, e) => acc + (e.rating || 5), 0);
const avgRating = (totalRating / total).toFixed(2);
const ratingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
for (const e of entries) {
  const r = e.rating || 5;
  if (ratingsCount[r] !== undefined) ratingsCount[r]++;
}

console.log(`📊 Summary Metrics:`);
console.log(`   • Total Responses:  ${total}`);
console.log(`   • Average Rating:   ${avgRating} / 5.0 ⭐`);
console.log(`   • Star Breakdown:   5⭐ (${ratingsCount[5]}) | 4⭐ (${ratingsCount[4]}) | 3⭐ (${ratingsCount[3]}) | 2⭐ (${ratingsCount[2]}) | 1⭐ (${ratingsCount[1]})\n`);
console.log('------------------------------------------------------');
console.log('                  SUBMITTED RESPONSES                 ');
console.log('------------------------------------------------------\n');

entries.forEach((e, idx) => {
  const stars = '★'.repeat(e.rating || 5) + '☆'.repeat(5 - (e.rating || 5));
  const time = e.submittedAt || new Date(e.timestamp).toLocaleString();

  console.log(`[#${idx + 1}] Villager: \x1b[1m${e.nickname || 'Villager'}\x1b[0m  |  Rating: \x1b[33m${stars} (${e.rating}/5)\x1b[0m  |  Date: ${time}`);
  if (e.favoriteRequest) {
    console.log(`    💖 Favorite Request/Story: "${e.favoriteRequest}"`);
  }
  if (e.confusingText) {
    console.log(`    💡 Suggestions/Confusion:  "${e.confusingText}"`);
  }
  if (!e.favoriteRequest && !e.confusingText) {
    console.log(`    (No additional written comments)`);
  }
  console.log('');
});

console.log('======================================================');
console.log('💡 Tips:');
console.log('   • Export to CSV:  npm run feedback -- --csv > feedback.csv');
console.log(`   • Direct File:    ${JSONL_FILE}`);
console.log('======================================================\n');

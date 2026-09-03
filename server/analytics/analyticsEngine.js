import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { deckRepository } from '../engine/deckRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARCHIVES_DIR = path.join(__dirname, '..', 'archives', 'games');

export class AnalyticsEngine {
  constructor() {
    this.ensureDir();
  }

  ensureDir() {
    if (!fs.existsSync(ARCHIVES_DIR)) {
      fs.mkdirSync(ARCHIVES_DIR, { recursive: true });
    }
  }

  archiveGame(room) {
    this.ensureDir();
    const gameId = room.state.gameId || `game_${Date.now()}`;
    const archivePath = path.join(ARCHIVES_DIR, `game_${gameId}.json`);

    // Compute game statistics from events
    const stats = this.computeGameStats(room);

    const archiveData = {
      gameId,
      roomId: room.roomId,
      roomCode: room.code,
      theme: room.theme || 'village',
      targetScore: room.state.targetScore,
      startedAt: room.state.startedAt,
      endedAt: room.state.endedAt || Date.now(),
      durationSeconds: room.state.startedAt ? Math.round((Date.now() - room.state.startedAt) / 1000) : 0,
      players: room.state.players.map(p => ({ id: p.id, nickname: p.nickname, score: p.score })),
      winner: room.state.winner,
      statistics: stats,
      eventLog: room.events
    };

    fs.writeFileSync(archivePath, JSON.stringify(archiveData, null, 2), 'utf8');
    return archiveData;
  }

  computeGameStats(room) {
    let cardsPlayedCount = 0;
    let totalVotesCount = 0;
    let acceptVotesCount = 0;
    let rejectVotesCount = 0;
    let objectionsCount = 0;
    let storiesAccepted = 0;
    let storiesRejected = 0;
    const toolUsage = {}; // toolId -> count
    const requestFrequency = {}; // requestId -> count
    const requestObjections = {}; // requestId -> count

    let currentReqId = null;

    for (const ev of room.events) {
      if (ev.type === 'StoryStarted') {
        currentReqId = ev.payload.requestId;
        requestFrequency[currentReqId] = (requestFrequency[currentReqId] || 0) + 1;
        for (const tid of ev.payload.toolIds || []) {
          toolUsage[tid] = (toolUsage[tid] || 0) + 1;
          cardsPlayedCount++;
        }
      } else if (ev.type === 'ObjectionRaised') {
        objectionsCount++;
        if (currentReqId) {
          requestObjections[currentReqId] = (requestObjections[currentReqId] || 0) + 1;
        }
      } else if (ev.type === 'VoteRevealed') {
        acceptVotesCount += ev.payload.acceptCount || 0;
        rejectVotesCount += ev.payload.rejectCount || 0;
        totalVotesCount += (ev.payload.acceptCount || 0) + (ev.payload.rejectCount || 0);
        if (ev.payload.isSuccess) storiesAccepted++;
        else storiesRejected++;
      }
    }

    const totalStories = storiesAccepted + storiesRejected;
    const acceptanceRate = totalStories > 0 ? Math.round((storiesAccepted / totalStories) * 100) : 100;

    return {
      cardsPlayedCount,
      totalVotesCount,
      acceptVotesCount,
      rejectVotesCount,
      objectionsCount,
      storiesAccepted,
      storiesRejected,
      acceptanceRate,
      toolUsage,
      requestFrequency,
      requestObjections
    };
  }

  getOverallStatistics() {
    this.ensureDir();
    const files = fs.readdirSync(ARCHIVES_DIR).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
      // Return baseline stats if no games archived yet
      return {
        gamesPlayed: 0,
        averageTimeFormatted: '0m 00s',
        averageDurationSeconds: 0,
        averageScore: 0,
        mostPopularRequest: 'Hang the Lantern',
        leastUsedTool: 'Key',
        acceptanceRate: 100,
        mostObjectionsRequest: 'None yet',
        totalCardsPlayed: 0,
        totalStoriesAccepted: 0,
        recentGames: []
      };
    }

    let totalDurationSec = 0;
    let totalWinningScore = 0;
    let totalCardsPlayed = 0;
    let totalStoriesAccepted = 0;
    let totalStoriesRejected = 0;
    const overallToolUsage = {};
    const overallRequestUsage = {};
    const overallRequestObjections = {};
    const recentGames = [];

    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(ARCHIVES_DIR, file), 'utf8'));
        totalDurationSec += data.durationSeconds || 0;
        const topScore = data.players ? Math.max(...data.players.map(p => p.score)) : 0;
        totalWinningScore += topScore;

        const s = data.statistics || {};
        totalCardsPlayed += s.cardsPlayedCount || 0;
        totalStoriesAccepted += s.storiesAccepted || 0;
        totalStoriesRejected += s.storiesRejected || 0;

        for (const [tid, count] of Object.entries(s.toolUsage || {})) {
          overallToolUsage[tid] = (overallToolUsage[tid] || 0) + count;
        }
        for (const [rid, count] of Object.entries(s.requestFrequency || {})) {
          overallRequestUsage[rid] = (overallRequestUsage[rid] || 0) + count;
        }
        for (const [rid, count] of Object.entries(s.requestObjections || {})) {
          overallRequestObjections[rid] = (overallRequestObjections[rid] || 0) + count;
        }

        recentGames.push({
          gameId: data.gameId,
          endedAt: data.endedAt,
          playerCount: data.players ? data.players.length : 0,
          winnerNames: (data.winner || []).map(w => w.nickname).join(', '),
          durationSeconds: data.durationSeconds
        });
      } catch (err) {
        console.error('Error reading archive:', file, err);
      }
    }

    const count = files.length;
    const avgDuration = Math.round(totalDurationSec / count);
    const mins = Math.floor(avgDuration / 60);
    const secs = avgDuration % 60;
    const averageTimeFormatted = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    const avgScore = Math.round(totalWinningScore / count);

    const totalStories = totalStoriesAccepted + totalStoriesRejected;
    const acceptanceRate = totalStories > 0 ? Math.round((totalStoriesAccepted / totalStories) * 100) : 100;

    // Resolve most popular request title
    let topReqId = Object.entries(overallRequestUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || 'S01';
    const topReqCard = deckRepository.getCard(topReqId, 'village');
    const mostPopularRequest = topReqCard ? topReqCard.title : topReqId;

    // Resolve least used tool name
    const allTools = deckRepository.getTheme('village')?.tools || [];
    let minCount = Infinity;
    let leastToolName = 'Key';
    for (const tool of allTools) {
      const u = overallToolUsage[tool.id] || 0;
      if (u < minCount) {
        minCount = u;
        leastToolName = tool.name;
      }
    }

    // Resolve most objected request
    let topObjId = Object.entries(overallRequestObjections).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topObjCard = topObjId ? deckRepository.getCard(topObjId, 'village') : null;
    const mostObjectionsRequest = topObjCard ? topObjCard.title : 'None';

    return {
      gamesPlayed: count,
      averageTimeFormatted,
      averageDurationSeconds: avgDuration,
      averageScore: avgScore,
      mostPopularRequest,
      leastUsedTool: leastToolName,
      acceptanceRate,
      mostObjectionsRequest,
      totalCardsPlayed,
      totalStoriesAccepted,
      recentGames: recentGames.slice(-5).reverse()
    };
  }
}

export const analyticsEngine = new AnalyticsEngine();

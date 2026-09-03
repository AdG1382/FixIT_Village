import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { GameEngine } from './engine/GameEngine.js';
import { Events } from './engine/events.js';
import { analyticsEngine } from './analytics/analyticsEngine.js';
import { feedbackStore } from './analytics/feedbackStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const engine = new GameEngine();
const socketToPlayer = new Map(); // socketId -> { roomCode, playerId }

// Broadcast sanitized state to each player in the room individually
function broadcastRoomState(roomCode) {
  const room = engine.rooms.get(roomCode.toUpperCase());
  if (!room) return;

  // Check if game just transitioned to GAME_OVER and archive
  if (room.state.phase === 'GAME_OVER' && !room.archived) {
    room.archived = true;
    try {
      analyticsEngine.archiveGame(room);
    } catch (err) {
      console.error('Failed to archive game:', err);
    }
  }

  for (const player of room.state.players) {
    // Find socket for this player
    for (const [sId, mapping] of socketToPlayer.entries()) {
      if (mapping.roomCode === room.code && mapping.playerId === player.id) {
        const sanitized = engine.getSanitizedState(room.code, player.id);
        io.to(sId).emit('room_state', sanitized);
      }
    }
  }
}

// REST API Endpoints

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: engine.rooms.size, time: Date.now() });
});

app.get('/api/analytics', (req, res) => {
  const stats = analyticsEngine.getOverallStatistics();
  res.json(stats);
});

app.get('/api/changelog', (req, res) => {
  try {
    const changelogPath = path.join(__dirname, 'changelog.json');
    const data = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read changelog' });
  }
});

app.get('/api/feedback', (req, res) => {
  res.json(feedbackStore.getSummary());
});

app.post('/api/feedback', (req, res) => {
  try {
    const entry = feedbackStore.addFeedback(req.body);
    res.json({ success: true, feedback: entry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/rooms/:code', (req, res) => {
  const room = engine.rooms.get(req.params.code.toUpperCase());
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({
    code: room.code,
    phase: room.state.phase,
    playerCount: room.state.players.length,
    canJoin: room.state.phase === 'LOBBY'
  });
});

// Serve client production build if present (for single-port deployment)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Socket.IO Thin Transport Adapter
io.on('connection', (socket) => {
  console.log(`[Socket Connected] ${socket.id}`);

  socket.on('create_room', ({ hostId, nickname, targetScore, theme }, callback) => {
    try {
      const state = engine.createRoom(hostId, nickname, targetScore, theme);
      socketToPlayer.set(socket.id, { roomCode: state.code, playerId: hostId });
      socket.join(state.code);

      const sanitized = engine.getSanitizedState(state.code, hostId);
      if (typeof callback === 'function') callback({ success: true, room: sanitized });
      broadcastRoomState(state.code);
    } catch (err) {
      console.error('Error creating room:', err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('join_room', ({ roomCode, playerId, nickname }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      const state = engine.joinRoom(code, playerId, nickname);
      socketToPlayer.set(socket.id, { roomCode: code, playerId });
      socket.join(code);

      const sanitized = engine.getSanitizedState(code, playerId);
      if (typeof callback === 'function') callback({ success: true, room: sanitized });
      broadcastRoomState(code);
    } catch (err) {
      console.error('Error joining room:', err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('reconnect_session', ({ roomCode, playerId }, callback) => {
    try {
      const code = roomCode ? roomCode.toUpperCase().trim() : null;
      if (!code) return callback && callback({ success: false, error: 'No room code provided' });

      const room = engine.rooms.get(code);
      if (!room) {
        if (typeof callback === 'function') callback({ success: false, error: 'Room expired or not found' });
        return;
      }

      const existingPlayer = room.state.players.find(p => p.id === playerId);
      if (!existingPlayer) {
        if (typeof callback === 'function') callback({ success: false, error: 'Player not found in this room' });
        return;
      }

      // Mark player reconnected in engine state
      engine.emitEvent(room, Events.playerReconnected(room.roomId, playerId));

      socketToPlayer.set(socket.id, { roomCode: code, playerId });
      socket.join(code);

      const sanitized = engine.getSanitizedState(code, playerId);
      if (typeof callback === 'function') callback({ success: true, room: sanitized });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('start_game', ({ roomCode, hostId }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      engine.startGame(code, hostId);
      if (typeof callback === 'function') callback({ success: true });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('select_turn_action', ({ roomCode, playerId, requestId, toolCardIds }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      engine.selectTurnAction(code, playerId, { requestId, toolCardIds });
      if (typeof callback === 'function') callback({ success: true });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('play_special_card', ({ roomCode, playerId, cardId, params }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      engine.playSpecialCard(code, playerId, { cardId, params: params || {} });
      if (typeof callback === 'function') callback({ success: true });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('finish_storytelling', ({ roomCode, playerId }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      engine.finishStorytelling(code, playerId);
      if (typeof callback === 'function') callback({ success: true });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('toggle_objection', ({ roomCode, playerId, hasObjection }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      engine.toggleObjection(code, playerId, hasObjection);
      if (typeof callback === 'function') callback({ success: true });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('proceed_to_vote', ({ roomCode, hostId }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      engine.proceedToVote(code, hostId);
      if (typeof callback === 'function') callback({ success: true });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('cast_vote', ({ roomCode, playerId, vote }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      engine.castVote(code, playerId, vote);
      if (typeof callback === 'function') callback({ success: true });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('advance_turn', ({ roomCode }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      engine.advanceTurn(code);
      if (typeof callback === 'function') callback({ success: true });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('host_action', ({ roomCode, hostId, action, params }, callback) => {
    try {
      const code = roomCode.toUpperCase().trim();
      engine.hostAction(code, hostId, action, params);
      if (typeof callback === 'function') callback({ success: true });
      broadcastRoomState(code);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('leave_room', ({ roomCode, playerId }, callback) => {
    try {
      const code = roomCode ? roomCode.toUpperCase().trim() : null;
      if (code) {
        socketToPlayer.delete(socket.id);
        socket.leave(code);
        engine.disconnectPlayer(code, playerId);
        broadcastRoomState(code);
      }
      if (typeof callback === 'function') callback({ success: true });
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('disconnect', () => {
    const mapping = socketToPlayer.get(socket.id);
    if (mapping) {
      const { roomCode, playerId } = mapping;
      socketToPlayer.delete(socket.id);
      engine.disconnectPlayer(roomCode, playerId);
      broadcastRoomState(roomCode);
    }
    console.log(`[Socket Disconnected] ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`FixIT Pure Game Engine Server running on port ${PORT}`);
});

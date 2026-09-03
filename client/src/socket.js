import { io } from 'socket.io-client';

// Generate or retrieve persistent playerId for session continuity
export function getOrCreatePlayerId() {
  let playerId = localStorage.getItem('fixit_player_id');
  if (!playerId) {
    playerId = 'p_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem('fixit_player_id', playerId);
  }
  return playerId;
}

export function getSavedNickname() {
  return localStorage.getItem('fixit_nickname') || '';
}

export function saveNickname(name) {
  if (name) {
    localStorage.setItem('fixit_nickname', name.trim());
  }
}

// Connect socket to backend (same origin in dev via proxy or explicit URL)
const socketUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? `http://${window.location.hostname}:3001`
  : window.location.origin;

export const socket = io(socketUrl, {
  autoConnect: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

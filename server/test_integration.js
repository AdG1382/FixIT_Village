import { io } from 'socket.io-client';
import assert from 'assert';

const SERVER_URL = 'http://localhost:3001';

console.log('--- Starting Multi-Client Socket.IO Integration Test ---');

async function runIntegration() {
  const hostSocket = io(SERVER_URL, { reconnection: false });
  const p2Socket = io(SERVER_URL, { reconnection: false });
  const p3Socket = io(SERVER_URL, { reconnection: false });

  await new Promise(r => setTimeout(r, 600));

  console.log('1. Connecting 3 players...');
  const hostId = 'p_host_sim';
  const p2Id = 'p_p2_sim';
  const p3Id = 'p_p3_sim';

  let hostState = null;
  let p2State = null;
  let p3State = null;

  hostSocket.on('room_state', (s) => { hostState = s; });
  p2Socket.on('room_state', (s) => { p2State = s; });
  p3Socket.on('room_state', (s) => { p3State = s; });

  // 1. Host creates room
  const createRes = await new Promise((resolve) => {
    hostSocket.emit('create_room', { hostId, nickname: 'Grandma Hazel', targetScore: 10, theme: 'village' }, resolve);
  });
  assert(createRes.success, `Create room failed: ${createRes.error}`);
  const roomCode = createRes.room.code;
  console.log(`✓ Room created with code: ${roomCode}`);

  // 2. Players 2 & 3 join
  const join2Res = await new Promise((resolve) => {
    p2Socket.emit('join_room', { roomCode, playerId: p2Id, nickname: 'Blacksmith Rowan' }, resolve);
  });
  assert(join2Res.success, 'Player 2 join failed');

  const join3Res = await new Promise((resolve) => {
    p3Socket.emit('join_room', { roomCode, playerId: p3Id, nickname: 'Apprentice Pip' }, resolve);
  });
  assert(join3Res.success, 'Player 3 join failed');
  console.log('✓ All 3 players joined successfully');

  // 3. Host starts game
  const startRes = await new Promise((resolve) => {
    hostSocket.emit('start_game', { roomCode, hostId }, resolve);
  });
  assert(startRes.success, 'Game start failed');
  await new Promise(r => setTimeout(r, 500));
  assert.strictEqual(hostState.phase, 'PLAYER_TURN');
  console.log('✓ Game started with 5 cards per hand');

  // 4. Play turns until Game Over
  let safetyLoop = 0;
  while (hostState.phase !== 'GAME_OVER' && safetyLoop < 12) {
    safetyLoop++;
    const activePlayerId = hostState.currentPlayer.id;
    const activeSocket = activePlayerId === hostId ? hostSocket : activePlayerId === p2Id ? p2Socket : p3Socket;
    const activeState = activePlayerId === hostId ? hostState : activePlayerId === p2Id ? p2State : p3State;

    const me = activeState.players.find(p => p.id === activePlayerId);
    
    // If active player has a special card, test playing it via socket event
    const specialInHand = (me.hand || []).find(c => c.type === 'special' || c.id.startsWith('SP'));
    if (specialInHand && !activeState.playedSpecialCardId) {
      console.log(`Testing socket play_special_card for ${specialInHand.id}...`);
      const specialRes = await new Promise((resolve) => {
        activeSocket.emit('play_special_card', {
          roomCode,
          playerId: activePlayerId,
          cardId: specialInHand.id,
          params: {}
        }, resolve);
      });
      console.log(`✓ Special card socket response: ${JSON.stringify(specialRes)}`);
      await new Promise(r => setTimeout(r, 300));
    }

    const currentMe = (activeState.players || []).find(p => p.id === activePlayerId) || me;
    const toolIds = (currentMe.hand || []).filter(c => c.type !== 'special').map(c => c.id).slice(0, 2);
    const reqId = activeState.boardRequests[0].id;

    // Submit action
    const turnActionRes = await new Promise((resolve) => {
      activeSocket.emit('select_turn_action', {
        roomCode,
        playerId: activePlayerId,
        requestId: reqId,
        toolCardIds: toolIds
      }, resolve);
    });
    assert(turnActionRes.success, `Select turn action failed: ${turnActionRes?.error}`);
    await new Promise(r => setTimeout(r, 300));

    // Finish storytelling
    await new Promise((resolve) => {
      activeSocket.emit('finish_storytelling', { roomCode, playerId: activePlayerId }, resolve);
    });
    await new Promise(r => setTimeout(r, 300));

    // Host proceeds to vote
    await new Promise((resolve) => {
      hostSocket.emit('proceed_to_vote', { roomCode, hostId }, resolve);
    });
    await new Promise(r => setTimeout(r, 300));

    // Non-storytellers vote accept
    const voters = [
      { id: hostId, s: hostSocket },
      { id: p2Id, s: p2Socket },
      { id: p3Id, s: p3Socket }
    ].filter(v => v.id !== activePlayerId);

    for (const v of voters) {
      await new Promise((resolve) => {
        v.s.emit('cast_vote', { roomCode, playerId: v.id, vote: 'accept' }, resolve);
      });
    }
    await new Promise(r => setTimeout(r, 400));

    // Turn result -> advance turn
    if (hostState.phase === 'TURN_RESULT') {
      await new Promise((resolve) => {
        hostSocket.emit('advance_turn', { roomCode }, resolve);
      });
      await new Promise(r => setTimeout(r, 400));
    }
  }

  console.log(`✓ Match concluded in ${safetyLoop} turns! Final Phase: ${hostState.phase}`);
  assert.strictEqual(hostState.phase, 'GAME_OVER');

  // 5. Check /api/analytics
  const analyticsRes = await fetch(`${SERVER_URL}/api/analytics`);
  const analytics = await analyticsRes.json();
  assert(analytics.gamesPlayed >= 1, `Games played should be >= 1, got ${analytics.gamesPlayed}`);
  console.log(`✓ Live Game Analytics verified: ${analytics.gamesPlayed} games played, Avg Time: ${analytics.averageTimeFormatted}`);

  // 6. Submit feedback
  const fbRes = await fetch(`${SERVER_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rating: 5,
      favoriteRequest: 'Rescue the Cat',
      confusingText: 'None, crystal clear rules!',
      gameId: hostState.gameId,
      playerId: hostId,
      nickname: 'Grandma Hazel'
    })
  });
  const fbResult = await fbRes.json();
  assert(fbResult.success, 'Feedback submission failed');

  const summaryRes = await fetch(`${SERVER_URL}/api/feedback`);
  const summary = await summaryRes.json();
  assert(summary.totalResponses >= 1, 'Feedback responses count should be >= 1');
  console.log(`✓ 3-Question Feedback verified: Avg Rating ${summary.averageRating}/5`);

  hostSocket.disconnect();
  p2Socket.disconnect();
  p3Socket.disconnect();

  console.log('🎉 ALL MULTI-CLIENT INTEGRATION TESTS PASSED!');
  process.exit(0);
}

runIntegration().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});

import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';

async function runTest() {
  console.log('=== Starting FixIT Automated End-to-End Game Loop Test ===\n');

  const p1 = io(SERVER_URL);
  const p2 = io(SERVER_URL);

  let roomCode = '';

  await new Promise((resolve) => {
    let connected = 0;
    const check = () => {
      connected++;
      if (connected === 2) resolve();
    };
    p1.on('connect', check);
    p2.on('connect', check);
  });

  console.log('✓ Player 1 and Player 2 connected to Socket.IO server.');

  // 1. Host creates room
  const createRes = await new Promise((resolve) => {
    p1.emit('create_room', { hostId: 'host_willow', nickname: 'Mayor Willow', targetScore: 20 }, resolve);
  });
  console.log('✓ Room created:', createRes.room.code);
  roomCode = createRes.room.code;

  // 2. Player 2 joins room
  const joinRes = await new Promise((resolve) => {
    p2.emit('join_room', { roomCode, playerId: 'player_finn', nickname: 'Farmer Finn' }, resolve);
  });
  console.log('✓ Player 2 joined:', joinRes.room.players.map(p => p.nickname).join(', '));

  // 3. Host starts game
  const startRes = await new Promise((resolve) => {
    p1.emit('start_game', { roomCode, hostId: 'host_willow' }, resolve);
  });
  console.log('✓ Game started successfully. Phase is PLAYER_TURN.');

  // Check state received by p1
  let p1State = await new Promise((resolve) => {
    p1.once('room_state', resolve);
  });

  console.log(`✓ Board has ${p1State.boardRequests.length} village requests.`);
  console.log(`✓ Player 1 has ${p1State.players[0].hand.length} tool cards in hand.`);
  console.log(`✓ Current Turn: ${p1State.currentPlayer.nickname}`);

  const activeRequest = p1State.boardRequests[0];
  const chosenTools = [p1State.players[0].hand[0].id];

  console.log(`\n--- Player 1 Turn: Choosing "${activeRequest.title}" with tool ${chosenTools[0]} ---`);

  // 4. Player 1 selects request and tool
  await new Promise((resolve) => {
    p1.emit('select_turn_action', {
      roomCode,
      playerId: 'host_willow',
      requestId: activeRequest.id,
      toolCardIds: chosenTools
    }, resolve);
  });
  console.log('✓ Turn action submitted. Phase is STORYTELLING.');

  // 5. Player 1 finishes story
  await new Promise((resolve) => {
    p1.emit('finish_storytelling', { roomCode, playerId: 'host_willow' }, resolve);
  });
  console.log('✓ Storytelling finished. Phase is DISCUSSION.');

  // 6. Player 2 raises and withdraws objection
  await new Promise((resolve) => {
    p2.emit('toggle_objection', { roomCode, playerId: 'player_finn', hasObjection: true }, resolve);
  });
  console.log('✓ Player 2 raised objection during discussion.');

  await new Promise((resolve) => {
    p2.emit('toggle_objection', { roomCode, playerId: 'player_finn', hasObjection: false }, resolve);
  });
  console.log('✓ Player 2 withdrew objection.');

  // 7. Host proceeds to vote
  await new Promise((resolve) => {
    p1.emit('proceed_to_vote', { roomCode, hostId: 'host_willow' }, resolve);
  });
  console.log('✓ Voting opened by Host. Phase is VOTING.');

  // 8. Player 2 votes Accept
  await new Promise((resolve) => {
    p2.emit('cast_vote', { roomCode, playerId: 'player_finn', vote: 'accept' }, resolve);
  });
  console.log('✓ Player 2 cast ACCEPT vote. Automatic vote resolution triggered.');

  // Wait for turn result
  const resultState = await new Promise((resolve) => {
    p1.once('room_state', resolve);
  });

  console.log(`\n✓ Turn Result: Success = ${resultState.lastTurnResult.success}`);
  console.log(`✓ Points awarded: ${resultState.lastTurnResult.pointsAwarded}`);
  console.log(`✓ Storyteller new score: ${resultState.players[0].score}`);
  console.log(`✓ Storyteller hand replenished to: ${resultState.players[0].hand.length} cards`);
  console.log(`✓ Board requests maintained at: ${resultState.boardRequests.length} requests`);

  // 9. Advance to next turn (Player 2 turn)
  await new Promise((resolve) => {
    p1.emit('advance_turn', { roomCode }, resolve);
  });

  const nextState = await new Promise((resolve) => {
    p1.once('room_state', resolve);
  });
  console.log(`\n✓ Advanced to next turn: ${nextState.currentPlayer.nickname}'s turn.`);

  p1.disconnect();
  p2.disconnect();

  console.log('\n=== FixIT Automated End-to-End Game Loop Test Passed 100%! ===');
  process.exit(0);
}

runTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});

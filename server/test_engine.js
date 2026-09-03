import assert from 'assert';
import { GameEngine } from './engine/GameEngine.js';
import { deckRepository } from './engine/deckRepository.js';
import { pluginRegistry } from './engine/plugins/registry.js';
import { GamePhase, EventType } from './engine/types.js';

console.log('--- Starting FixIT Pure Engine & Special Cards Deterministic Tests ---');

// 1. Test DeckRepository
const villageTheme = deckRepository.getTheme('village');
assert(villageTheme, 'Village theme must be loaded');
assert.strictEqual(villageTheme.tools.length, 12, `Tools count should be 12, got ${villageTheme.tools.length}`);
assert.strictEqual(villageTheme.requests.length, 24, `Requests count should be 24, got ${villageTheme.requests.length}`);
assert.strictEqual(villageTheme.specials.length, 8, `Specials count should be 8, got ${villageTheme.specials.length}`);

// Verify versioning
for (const card of [...villageTheme.tools, ...villageTheme.requests, ...villageTheme.specials]) {
  assert(card.version === 1, `Card ${card.id} must have version: 1`);
}
console.log('✓ DeckRepository, 8 Special Cards & Card Versioning verified');

// 2. Test Plugins Registry
const expectedPlugins = ['SP01', 'SP02', 'SP03', 'SP04', 'SP05', 'SP06', 'SP07', 'SP08'];
for (const pid of expectedPlugins) {
  const plugin = pluginRegistry.getPlugin(pid);
  assert(plugin, `Plugin ${pid} must be registered`);
  assert(plugin.name, `Plugin ${pid} must have a name`);
  assert(plugin.timing, `Plugin ${pid} must have timing defined`);
}
console.log('✓ All 8 Special Card plugins registered with proper timings');

// 3. Test Pure GameEngine lifecycle & Special Cards Mechanics
const engine = new GameEngine();
const hostId = 'p_host_1';
const player2Id = 'p_player_2';
const player3Id = 'p_player_3';

const lobbyState = engine.createRoom(hostId, 'Grandma Hazel', 25, 'village');
assert.strictEqual(lobbyState.phase, GamePhase.LOBBY);
assert.strictEqual(lobbyState.players.length, 1);

engine.joinRoom(lobbyState.code, player2Id, 'Blacksmith Rowan');
engine.joinRoom(lobbyState.code, player3Id, 'Apprentice Pip');

// Start Game
const startedState = engine.startGame(lobbyState.code, hostId);
assert.strictEqual(startedState.phase, GamePhase.PLAYER_TURN);
assert.strictEqual(startedState.players[0].hand.length, 5);
assert.strictEqual(startedState.players[1].hand.length, 5);
assert.strictEqual(startedState.players[2].hand.length, 5);
const room = engine.rooms.get(lobbyState.code);
assert.strictEqual(room.decks.boardRequests.length, 4);
console.log('✓ Match start, 5-card dealing (tools + specials) verified');

// Test SP01 - Lucky Find in PLAYER_TURN
room.state.players[0].hand.push('SP01'); // give player SP01
engine.playSpecialCard(lobbyState.code, hostId, 'SP01', { keepCardId: room.decks.toolDeck[room.decks.toolDeck.length - 1] });
assert.strictEqual(room.state.playedSpecialCardId, 'SP01');
const p1Current = room.state.players.find(p => p.id === hostId);
assert(!p1Current.hand.includes('SP01'), 'SP01 should be removed from hand');
assert(room.decks.toolDiscard.includes('SP01'), 'SP01 should be in discard');
console.log('✓ SP01 Lucky Find execution & discard verified');

// Verify 1 Special Card Per Turn rule
assert.throws(() => {
  p1Current.hand.push('SP06');
  engine.playSpecialCard(lobbyState.code, hostId, 'SP06', {});
}, /at most one Special Card/);
console.log('✓ 1 Special Card per turn limit strictly enforced');

// Complete turn 1
const selectedReq1 = room.decks.boardRequests[0];
const selectedTools1 = [p1Current.hand[0]];
engine.selectTurnAction(lobbyState.code, hostId, {
  requestId: selectedReq1,
  toolCardIds: selectedTools1
});
engine.finishStorytelling(lobbyState.code, hostId);
engine.proceedToVote(lobbyState.code, hostId);
engine.castVote(lobbyState.code, player2Id, 'accept');
engine.castVote(lobbyState.code, player3Id, 'accept');
engine.advanceTurn(lobbyState.code);

// Turn 2: Verify reset of playedSpecialCardId
assert.strictEqual(room.state.playedSpecialCardId, null, 'playedSpecialCardId must be reset after turn advance');
console.log('✓ Special card state resets cleanly upon turn end');

// Test SP04 - Borrowed Tool & SP08 - Happy Accident in Turn 2
const p2Current = room.state.players.find(p => p.id === player2Id);
const p3Current = room.state.players.find(p => p.id === player3Id);
p2Current.hand.push('SP04');
const p3Tool = p3Current.hand[0];

// Player 2 plays SP04 Borrowed Tool from Player 3
engine.playSpecialCard(lobbyState.code, player2Id, 'SP04', { targetPlayerId: player3Id, borrowedCardId: p3Tool });
assert(room.state.borrowedTool, 'borrowedTool state must be active');
assert.strictEqual(room.state.borrowedTool.ownerId, player3Id);
assert.strictEqual(room.state.borrowedTool.cardId, p3Tool);
console.log('✓ SP04 Borrowed Tool successfully borrowed from target player');

// Player 2 selects turn action using borrowed tool
const selectedReq2 = room.decks.boardRequests[0];
engine.selectTurnAction(lobbyState.code, player2Id, {
  requestId: selectedReq2,
  toolCardIds: [p3Tool]
});
engine.finishStorytelling(lobbyState.code, player2Id);

// During Discussion, Player 2 plays SP08 Happy Accident (resetting limit for test simulation)
room.state.playedSpecialCardId = null;
const p2CurrentAfterStory = room.state.players.find(p => p.id === player2Id);
p2CurrentAfterStory.hand.push('SP08');
const smallReqId = room.decks.boardRequests.find(id => {
  const c = deckRepository.getCard(id, room.theme);
  return c && c.points === 5;
}) || 'S01';
if (!room.decks.boardRequests.includes(smallReqId)) {
  room.decks.boardRequests.push(smallReqId);
}
engine.playSpecialCard(lobbyState.code, player2Id, 'SP08', { extraRequestId: smallReqId });
assert.strictEqual(room.state.extraRequestId, smallReqId);
console.log('✓ SP08 Happy Accident successfully linked extra request');

// Vote and resolve
engine.proceedToVote(lobbyState.code, hostId);
const scoreBefore = room.state.players.find(p => p.id === player2Id).score;
engine.castVote(lobbyState.code, hostId, 'accept');
const res2 = engine.castVote(lobbyState.code, player3Id, 'accept');
assert.strictEqual(res2.phase, GamePhase.TURN_RESULT);
assert.strictEqual(res2.lastTurnResult.success, true);
assert.strictEqual(res2.lastTurnResult.extraRequestId, smallReqId);
// Should have received both req points and +5 extra points
const p2ScoreAfter = room.state.players.find(p => p.id === player2Id).score;
assert(p2ScoreAfter >= scoreBefore + 10, `Player 2 score should include extra request bonus, got score: ${p2ScoreAfter}`);
console.log('✓ SP08 Happy Accident bonus points successfully awarded on success');

// Advance turn
engine.advanceTurn(lobbyState.code);

// 4. Test Deterministic Replay Sourcing with Special Cards
const originalEvents = [...room.events];
assert(originalEvents.length > 8, 'Room should have recorded multiple events including SpecialCardPlayed');
const hasSpecialEvent = originalEvents.some(e => e.type === EventType.SPECIAL_CARD_PLAYED);
assert(hasSpecialEvent, 'Events stream must include SPECIAL_CARD_PLAYED events');

const replayedState = GameEngine.replay(originalEvents);
assert.strictEqual(replayedState.phase, room.state.phase);
assert.strictEqual(replayedState.currentTurnIndex, room.state.currentTurnIndex);
assert.deepStrictEqual(replayedState.players.map(p => p.score), room.state.players.map(p => p.score));
console.log('✓ GameEngine.replay() deterministic event reconstruction with Special Cards verified');

console.log('🎉 ALL 8 SPECIAL CARD ENGINE & INTEGRATION TESTS PASSED!');

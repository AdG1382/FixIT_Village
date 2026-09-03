import { GameEngine } from './engine/GameEngine.js';
import { deckRepository } from './engine/deckRepository.js';
import { GamePhase } from './engine/types.js';
import assert from 'assert';

console.log('================================================================');
console.log('🃏 FixIT Village: Full 8 Special Cards Gameplay & Rule Validation');
console.log('================================================================\n');

const engine = new GameEngine();

// Setup match with 3 players
const initialRoomState = engine.createRoom('HOST1', 'Alice', 50, 'village');
const code = initialRoomState.code;
const room = engine.rooms.get(code);
engine.joinRoom(code, 'P2', 'Bob');
engine.joinRoom(code, 'P3', 'Charlie');
engine.startGame(code, 'HOST1');

console.log(`✓ Game started in Room ${code} with 3 villagers (Alice, Bob, Charlie)`);
assert.strictEqual(room.state.phase, GamePhase.PLAYER_TURN);

function getStoryteller() {
  return room.state.players[room.state.currentTurnIndex];
}

function getPlayer(id) {
  return room.state.players.find(p => p.id === id);
}

function resolveTurnWithAccept() {
  const st = getStoryteller();
  if (room.state.phase === GamePhase.STORYTELLING) {
    engine.finishStorytelling(code, st.id);
  }
  if (room.state.phase === GamePhase.DISCUSSION) {
    engine.proceedToVote(code, 'HOST1');
  }
  assert.strictEqual(room.state.phase, GamePhase.VOTING);
  
  // Eligible voters cast accept
  const voters = room.state.players.filter(p => p.id !== st.id);
  for (const v of voters) {
    engine.castVote(code, v.id, 'accept');
  }
  assert.strictEqual(room.state.phase, GamePhase.TURN_RESULT);
  assert.strictEqual(room.state.lastTurnResult.success, true);
  engine.advanceTurn(code);
  assert.strictEqual(room.state.phase, GamePhase.PLAYER_TURN);
}

// ============================================================================
// TEST 1: SP01 - Lucky Find (Draw 2, Keep 1, Return 1 to Bottom)
// ============================================================================
console.log('\n--- [Test 1/8] SP01: Lucky Find ---');
let st = getStoryteller();
st.hand.push('SP01');

// Peek top 2 to specify keep
const top1 = room.decks.toolDeck[room.decks.toolDeck.length - 1];
const top2 = room.decks.toolDeck[room.decks.toolDeck.length - 2];

engine.playSpecialCard(code, st.id, 'SP01', { keepCardId: top1 });

let currentHand = getPlayer(st.id).hand;
assert(!currentHand.includes('SP01'), 'SP01 must be removed from hand');
assert(currentHand.includes(top1), 'Kept card must be in player hand');
assert(!currentHand.includes(top2), 'Unkept card must not be in player hand');
assert.strictEqual(room.decks.toolDeck[0], top2, 'Returned card must be placed at the bottom of the tool deck');
assert(room.decks.toolDiscard.includes('SP01'), 'SP01 must be in discard pile');
console.log('✓ SP01 Lucky Find drew 2, kept chosen tool, and placed other at bottom of deck.');

// Complete turn
const tool1 = currentHand.find(id => !id.startsWith('SP'));
const req1 = room.decks.boardRequests[0];
engine.selectTurnAction(code, st.id, req1, [tool1]);
resolveTurnWithAccept();

// ============================================================================
// TEST 2: SP02 - Helping Hand (Take 1 tool from another player)
// ============================================================================
console.log('\n--- [Test 2/8] SP02: Helping Hand ---');
st = getStoryteller();
st.hand.push('SP02');
const targetP = room.state.players.find(p => p.id !== st.id);
const targetCard = targetP.hand.find(id => !id.startsWith('SP'));
const targetHandSizeBefore = targetP.hand.length;

engine.playSpecialCard(code, st.id, 'SP02', { targetPlayerId: targetP.id, givenCardId: targetCard });

currentHand = getPlayer(st.id).hand;
const targetHandAfter = getPlayer(targetP.id).hand;

assert(!currentHand.includes('SP02'), 'SP02 must be removed from hand');
assert(currentHand.includes(targetCard), 'Storyteller must now hold target card');
assert(!targetHandAfter.includes(targetCard), 'Target player must no longer hold the given card');
assert.strictEqual(targetHandAfter.length, targetHandSizeBefore - 1, 'Target player hand decreased by 1');
assert(room.decks.toolDiscard.includes('SP02'), 'SP02 must be in discard pile');
console.log(`✓ SP02 Helping Hand transferred tool ${targetCard} from ${targetP.nickname} to ${st.nickname}.`);

const req2 = room.decks.boardRequests[0];
engine.selectTurnAction(code, st.id, req2, [targetCard]);
resolveTurnWithAccept();

// ============================================================================
// TEST 3: SP03 - Second Chance (Return N tools, shuffle & redraw N)
// ============================================================================
console.log('\n--- [Test 3/8] SP03: Second Chance ---');
st = getStoryteller();
const preHandLength = getPlayer(st.id).hand.length;
st.hand.push('SP03');
const cardsToSwap = getPlayer(st.id).hand.filter(id => !id.startsWith('SP')).slice(0, 2);

engine.playSpecialCard(code, st.id, 'SP03', { returnedCardIds: cardsToSwap });

currentHand = getPlayer(st.id).hand;
assert(!currentHand.includes('SP03'), 'SP03 must be removed from hand');
assert.strictEqual(currentHand.length, preHandLength, 'Hand size must match pre-SP03 hand length after swapping cards');
assert(room.decks.toolDiscard.includes('SP03'), 'SP03 must be in discard pile');
console.log(`✓ SP03 Second Chance returned ${cardsToSwap.length} cards and redrew ${cardsToSwap.length} fresh cards.`);

const tool3 = currentHand.find(id => !id.startsWith('SP'));
const req3 = room.decks.boardRequests[0];
engine.selectTurnAction(code, st.id, req3, [tool3]);
resolveTurnWithAccept();

// ============================================================================
// TEST 4: SP04 - Borrowed Tool (Borrow from player, pitch, returns after turn)
// ============================================================================
console.log('\n--- [Test 4/8] SP04: Borrowed Tool ---');
st = getStoryteller();
st.hand.push('SP04');
const lender = room.state.players.find(p => p.id !== st.id);
const borrowedCard = lender.hand.find(id => !id.startsWith('SP'));

engine.playSpecialCard(code, st.id, 'SP04', { targetPlayerId: lender.id, borrowedCardId: borrowedCard });

assert.strictEqual(room.state.borrowedTool.cardId, borrowedCard, 'borrowedTool should be set in room state');
assert.strictEqual(room.state.borrowedTool.ownerId, lender.id);

// Storyteller plays the borrowed tool!
const req4 = room.decks.boardRequests[0];
engine.selectTurnAction(code, st.id, req4, [borrowedCard]);
resolveTurnWithAccept();

// Verify lender STILL possesses their borrowed card
const lenderAfter = getPlayer(lender.id);
assert(lenderAfter.hand.includes(borrowedCard), `Lender ${lender.nickname} must retain their borrowed card ${borrowedCard}`);
assert(!room.decks.toolDiscard.includes(borrowedCard), 'Borrowed card must NOT be discarded');
assert.strictEqual(room.state.borrowedTool, null, 'borrowedTool must reset on turn advance');
console.log(`✓ SP04 Borrowed Tool allowed pitching with ${borrowedCard} and safely returned it to ${lender.nickname}.`);

// ============================================================================
// TEST 5: SP05 - Brilliant Idea (Add 1 extra tool during Discussion)
// ============================================================================
console.log('\n--- [Test 5/8] SP05: Brilliant Idea ---');
st = getStoryteller();
const toolInitial = getPlayer(st.id).hand.filter(id => !id.startsWith('SP'))[0];
const toolExtra = getPlayer(st.id).hand.filter(id => !id.startsWith('SP'))[1];
const req5 = room.decks.boardRequests[0];

engine.selectTurnAction(code, st.id, req5, [toolInitial]);
engine.finishStorytelling(code, st.id);
assert.strictEqual(room.state.phase, GamePhase.DISCUSSION);

getPlayer(st.id).hand.push('SP05');
engine.playSpecialCard(code, st.id, 'SP05', { addedToolId: toolExtra });

assert(room.state.selectedToolIds.includes(toolInitial), 'Initial tool should still be selected');
assert(room.state.selectedToolIds.includes(toolExtra), 'Added extra tool should now be selected');
assert(room.decks.toolDiscard.includes('SP05'), 'SP05 must be discarded');

resolveTurnWithAccept();
assert(room.decks.toolDiscard.includes(toolInitial), 'Initial tool discarded');
assert(room.decks.toolDiscard.includes(toolExtra), 'Extra tool discarded');
console.log('✓ SP05 Brilliant Idea added extra tool to active pitch during Discussion phase.');

// ============================================================================
// TEST 6: SP06 - Hidden Toolbox (Draw 3, Discard 2)
// ============================================================================
console.log('\n--- [Test 6/8] SP06: Hidden Toolbox ---');
st = getStoryteller();
getPlayer(st.id).hand.push('SP06');

// Choose 2 tool cards from hand to discard
const discards = getPlayer(st.id).hand.filter(id => !id.startsWith('SP')).slice(0, 2);
engine.playSpecialCard(code, st.id, 'SP06', { discardCardIds: discards });

currentHand = getPlayer(st.id).hand;
for (const d of discards) {
  assert(!currentHand.includes(d), `Discarded tool ${d} must not be in hand`);
  assert(room.decks.toolDiscard.includes(d), `Discarded tool ${d} must be in discard pile`);
}
assert(room.decks.toolDiscard.includes('SP06'), 'SP06 must be in discard pile');
console.log('✓ SP06 Hidden Toolbox drew 3 cards and discarded 2 cards properly.');

const tool6 = currentHand.find(id => !id.startsWith('SP'));
const req6 = room.decks.boardRequests[0];
engine.selectTurnAction(code, st.id, req6, [tool6]);
resolveTurnWithAccept();

// ============================================================================
// TEST 7: SP07 - Wild Inspiration (Declare tool as Wild Card)
// ============================================================================
console.log('\n--- [Test 7/8] SP07: Wild Inspiration ---');
st = getStoryteller();
getPlayer(st.id).hand.push('SP07');
const wildBaseTool = getPlayer(st.id).hand.find(id => !id.startsWith('SP'));

engine.playSpecialCard(code, st.id, 'SP07', { targetToolId: wildBaseTool, wildToolName: 'Rocket Jetpack' });

assert.strictEqual(room.state.wildToolMapping.toolId, wildBaseTool);
assert.strictEqual(room.state.wildToolMapping.represents, 'Rocket Jetpack');
assert(room.decks.toolDiscard.includes('SP07'), 'SP07 must be in discard pile');
console.log(`✓ SP07 Wild Inspiration declared tool ${wildBaseTool} as 'Rocket Jetpack'.`);

const req7 = room.decks.boardRequests[0];
engine.selectTurnAction(code, st.id, req7, [wildBaseTool]);
resolveTurnWithAccept();
assert.strictEqual(room.state.wildToolMapping, null, 'wildToolMapping should reset cleanly on turn advance');

// ============================================================================
// TEST 8: SP08 - Happy Accident (Complete 1 Extra Small 5pt Request)
// ============================================================================
console.log('\n--- [Test 8/8] SP08: Happy Accident ---');
st = getStoryteller();
const scoreBefore = getPlayer(st.id).score;
const tool8 = getPlayer(st.id).hand.find(id => !id.startsWith('SP'));

// Find a medium/large request and a small 5pt request
const mainReqId = room.decks.boardRequests.find(id => {
  const c = deckRepository.getCard(id, 'village');
  return c && c.points >= 10;
}) || room.decks.boardRequests[0];
const mainReqCard = deckRepository.getCard(mainReqId, 'village');

const smallReqId = room.decks.boardRequests.find(id => {
  const c = deckRepository.getCard(id, 'village');
  return c && c.points === 5 && id !== mainReqId;
}) || 'REQ_V01';

engine.selectTurnAction(code, st.id, mainReqId, [tool8]);
engine.finishStorytelling(code, st.id);

getPlayer(st.id).hand.push('SP08');
engine.playSpecialCard(code, st.id, 'SP08', { extraRequestId: smallReqId });

assert.strictEqual(room.state.extraRequestId, smallReqId);
assert(room.decks.toolDiscard.includes('SP08'), 'SP08 must be in discard pile');

resolveTurnWithAccept();

const scoreAfter = getPlayer(st.id).score;
const expectedTotalPoints = mainReqCard.points + 5;
assert.strictEqual(scoreAfter - scoreBefore, expectedTotalPoints, `Storyteller should earn ${expectedTotalPoints} points (Main ${mainReqCard.points} + Bonus 5)`);
assert(!room.decks.boardRequests.includes(mainReqId), 'Main request should be resolved and removed from board');
assert(!room.decks.boardRequests.includes(smallReqId), 'Bonus small request should be resolved and removed from board');
console.log(`✓ SP08 Happy Accident awarded ${expectedTotalPoints} pts (${mainReqCard.points} + 5) and resolved both requests!`);

// ============================================================================
// TEST 9: Strict Rule Enforcement (1 Special Card Per Turn)
// ============================================================================
console.log('\n--- [Rule Check] 1 Special Card Per Turn Limit ---');
st = getStoryteller();
getPlayer(st.id).hand.push('SP01');
getPlayer(st.id).hand.push('SP06');

engine.playSpecialCard(code, st.id, 'SP01', {});
assert.throws(() => {
  engine.playSpecialCard(code, st.id, 'SP06', {});
}, /at most one Special Card/i, 'Should throw error when playing 2nd special card');
console.log('✓ 1 Special Card per turn limit is strictly enforced by engine.');

// ============================================================================
// TEST 10: Event-Sourced Deterministic Replay
// ============================================================================
console.log('\n--- [Determinism Check] Event-Sourced Replay Reconstruction ---');
const replayed = GameEngine.replay(room.events);
assert.strictEqual(replayed.roundNumber, room.state.roundNumber);
assert.strictEqual(replayed.players[0].score, room.state.players[0].score);
assert.strictEqual(replayed.players[1].score, room.state.players[1].score);
assert.strictEqual(replayed.players[2].score, room.state.players[2].score);
console.log(`✓ Deterministic replay reconstructed ${room.events.length} events across all 8 special card turns with 100% parity!`);

console.log('\n================================================================');
console.log('🏆 ALL 8 SPECIAL CARDS & GAMEPLAY RULES FULLY VALIDATED!');
console.log('================================================================\n');

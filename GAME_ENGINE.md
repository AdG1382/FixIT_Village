# The FixIT Game Engine Constitution (`GAME_ENGINE.md`)

> **Version:** 1.0.0  
> **Status:** Authoritative  
> **Architecture:** Pure Event-Sourced State Machine

---

## 1. Core Philosophy

1. **Digital Tabletop, Not a Video Game**: The platform manages cards, game state, scoring, and turn progression while players converse over their external voice call.
2. **Deterministic State Evolution**: All state mutations are derived purely from an append-only log of immutable domain events:
   $$\text{State}_{t+1} = \text{Reducer}(\text{State}_t, \text{Event})$$
3. **Decoupled Engine**: The core engine has zero knowledge of WebSockets, HTTP, or transport layers.

---

## 2. Phase Lifecycle & State Machine

The match flows strictly through the following sequential phases:

```
[ LOBBY ]
   │  (Host starts game)
   ▼
[ PLAYER_TURN ] ◄────────────────────────────────────────┐
   │  (Storyteller selects Request + Tools)              │
   ▼                                                     │
[ STORYTELLING ]                                         │
   │  (Storyteller finishes speaking)                    │
   ▼                                                     │
[ DISCUSSION ]                                           │
   │  (Objections raised/cleared; Host opens vote)       │
   ▼                                                     │ (Advance Turn)
[ VOTING ]                                               │
   │  (Secret votes tallied automatically)               │
   ▼                                                     │
[ TURN_RESULT ] ─────────────────────────────────────────┤
   │                                                     │
   │  (Round complete AND Score >= Target)               │
   ▼                                                     │
[ GAME_OVER ]                                            │
```

---

## 3. Phase Ownership & Action Matrix

To eliminate race conditions and enforce fair play, actions are strictly permissioned by phase and role:

| Phase | Controller / Permitted Actor | Allowed Actions (✓) | Prohibited Actions (✗) | Emitted Events |
| :--- | :--- | :--- | :--- | :--- |
| **`LOBBY`** | **Host** | ✓ Change Target Score<br>✓ Start Game<br>✓ Reassign Host | ✗ Select Cards<br>✗ Vote<br>✗ Object | `PlayerJoined`<br>`GameStarted`<br>`CardsDealt` |
| **`PLAYER_TURN`** | **Active Storyteller** | ✓ Select 1 Board Request<br>✓ Select $\ge 1$ Hand Tools<br>✓ Begin Story | ✗ Vote<br>✗ Draw Cards<br>✗ End Match | `StoryStarted` |
| **`STORYTELLING`** | **Storyteller** (or Host fallback) | ✓ Conclude Story | ✗ Cast Votes<br>✗ Change Selected Cards | `StoryFinished` |
| **`DISCUSSION`** | **Non-Storytellers** & **Host** | ✓ Raise Objection<br>✓ Withdraw Objection<br>✓ Host: Open Voting | ✗ Cast Votes<br>✗ Draw Cards<br>✗ Storyteller Objecting | `ObjectionRaised`<br>`ObjectionCleared`<br>`VotingOpened` |
| **`VOTING`** | **Non-Storytellers** (Server Evaluator) | ✓ Submit Secret Vote (`accept` / `reject`) | ✗ Storyteller Voting<br>✗ View Other Player Votes | `VoteSubmitted`<br>`VoteRevealed`<br>`ScoreAwarded`<br>`CardsPlayed`<br>`CardsDrawn`<br>`BoardRefilled` |
| **`TURN_RESULT`** | **Server** (or Host fallback) | ✓ Advance Turn (`TurnEnded`) | ✗ Select New Cards<br>✗ Re-vote | `TurnEnded`<br>`GameEnded` |
| **`GAME_OVER`** | **Server** / **All Players** | ✓ View Podium<br>✓ Submit 3-Question Feedback<br>✓ Return to Lobby | ✗ Gameplay Actions | `GameEnded`<br>`GameFeedbackSubmitted` |

---

## 4. Domain Events Specification

Every state transition produces a typed event with a unique UUID (`crypto.randomUUID()`):

1. **`PlayerJoined`**: `{ roomId, playerId, nickname, isHost }`
2. **`PlayerLeft`**: `{ roomId, playerId, nickname }`
3. **`PlayerReconnected`**: `{ roomId, playerId }`
4. **`GameStarted`**: `{ roomId, gameId, targetScore, playerIds, theme }`
5. **`CardsDealt`**: `{ roomId, hands: { [playerId]: [cardId] } }`
6. **`BoardRefilled`**: `{ roomId, requestIds: [cardId] }`
7. **`StoryStarted`**: `{ roomId, turnId, storytellerId, requestId, toolIds }`
8. **`StoryFinished`**: `{ roomId, turnId, storytellerId }`
9. **`ObjectionRaised`**: `{ roomId, turnId, playerId, nickname }`
10. **`ObjectionCleared`**: `{ roomId, turnId, playerId, nickname }`
11. **`VotingOpened`**: `{ roomId, turnId }`
12. **`VoteSubmitted`**: `{ roomId, turnId, voteId, voterId, vote }`
13. **`VoteRevealed`**: `{ roomId, turnId, votes, isSuccess, acceptCount, rejectCount, totalVoters }`
14. **`ScoreAwarded`**: `{ roomId, turnId, playerId, points, newScore }`
15. **`CardsPlayed`**: `{ roomId, turnId, playerId, cardIds }`
16. **`CardsDrawn`**: `{ roomId, playerId, cardIds }`
17. **`TurnEnded`**: `{ roomId, turnId, roundNumber, nextPlayerId }`
18. **`GameEnded`**: `{ roomId, gameId, winners, finalScores, durationSeconds }`
19. **`HostActionExecuted`**: `{ roomId, hostId, action, params }`

---

## 5. Card Versioning & Storage Invariants

1. **Clean Card Identifiers**:
   - Player hands store only string Card IDs (e.g. `["T01", "T05", "T09"]`).
   - Board requests store only string Request IDs (e.g. `["S01", "M04", "L02"]`).
   - Full card metadata (title, story prompt, tags, image asset) is hydrated on demand via `DeckRepository`.
2. **Card Schema & Versioning**:
   ```json
   {
     "id": "S04",
     "version": 1,
     "difficulty": "Small",
     "title": "Rescue the Cat",
     "villager": "Grandma Hazel",
     "story": "My little cat, Mittens, climbed the tallest tree and refuses to come down.",
     "points": 5,
     "recommendedCount": 2,
     "image": "/cards/tasks/S04.png"
   }
   ```

---

## 6. Special Cards Plugin Architecture

Special card behaviors implement the `SpecialCardPlugin` interface without modifying the core state reducer:

```javascript
class SpecialCardPlugin {
  canPlay(context) {}
  play(context) {}
  beforeVote(context) {}
  afterVote(context) {}
  afterTurn(context) {}
}
```

---

## 7. Archiving & Analytics Invariants

- Every completed game is automatically archived to `server/archives/games/game_<gameId>.json`.
- Archives preserve the entire ordered event log for full deterministic replay.
- Live analytics aggregate:
  - Total Games Played
  - Average Match Duration
  - Average Winning Score
  - Story Acceptance Rate (%)
  - Most Popular Requests & Least Used Tools
  - Most Objected Village Requests

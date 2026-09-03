# 🏡 FixIT Village — Digital Tabletop Party Card Game

> **Where questionable DIY solutions save the town!**  
> A vibrant, fast-paced, digital tabletop party game designed for friends over Discord, Google Meet, or couch play.

---

## 📖 Table of Contents

1. [Game Overview](#-game-overview)
2. [Game Flow & Mechanics](#-game-flow--mechanics)
3. [Special Cards Expansion](#-special-cards-expansion)
4. [Architecture & Technology Stack](#-architecture--technology-stack)
5. [Key Features & UX Innovations](#-key-features--ux-innovations)
6. [Project Structure](#-project-structure)
7. [Local Development Setup](#-local-development-setup)
8. [Automated Test Suite](#-automated-test-suite)
9. [Push to Production & Server Deployment Guide](#-push-to-production--server-deployment-guide)
10. [Analytics & Feedback System](#-analytics--feedback-system)

---

## 🎯 Game Overview

**FixIT Village** is a lighthearted storytelling and social-deduction party game. The peaceful village is plagued by ridiculous daily emergencies — from leaking water towers to escaped chickens. 

As village fixers, players must pitch creative, funny, and absurd solutions using whatever random tool cards they have in their hands. The other villagers discuss, object, and secretly vote on whether the story passes or fails!

- **Players**: 2 to 10+ players
- **Pacing**: 10–25 minutes per match
- **Target Scores**: Customizable (20, 25, or 30 points)
- **Aesthetic**: Vibrant, bouncy, glassmorphic cartoon tabletop (warm pastures, sunny accents, 3D buttons)

---

## 🎲 Game Flow & Mechanics

Each round flows through deterministic event-driven phases:

```
[ LOBBY ] 
   │ (Host starts match, 5 tool cards dealt per player)
   ▼
[ PLAYER TURN ] ──────► Storyteller picks 1 Emergency Request + 1-3 Tool Cards
   │
   ▼
[ STORYTELLING ] ────► Storyteller pitches their absurd DIY solution out loud
   │
   ▼
[ DISCUSSION ] ──────► Other villagers debate and toggle "Objections"
   │
   ▼
[ VOTING ] ──────────► Secret voting (👍 Accept / 👎 Reject)
   │
   ▼
[ TURN RESULT ] ─────► Votes revealed, points awarded if passed, hands & board refilled
   │
   ▼ (Repeat rounds until target score reached)
[ GAME OVER ] ───────► Winners celebrated with podium & stats
```

### Turn Phases Breakdown

1. **Player Turn**: The active player selects an **Emergency Request** from the village board and pairs it with 1 or more **Tool Cards** from their private hand.
2. **Storytelling**: The player explains over voice call how their specific tools resolve the emergency.
3. **Village Discussion**: The remaining players evaluate the pitch. Players can raise or withdraw **Objections** in real time.
4. **Secret Voting**: Non-storytellers cast a secret ballot (`Accept` or `Reject`). Player choices are masked until everyone has voted.
5. **Turn Resolution & Scoring**:
   - If `Accept` votes strictly exceed `Reject` votes: **Success!** The storyteller gains the emergency request's points, and the card is removed and replenished on the board.
   - If not: **Rejected!** No points are awarded, and the emergency request stays on the board.
   - Used tool cards are discarded, and the storyteller draws back up to 5 cards.
7. **Round Progression**: Turns rotate clockwise until a player reaches or exceeds the target score.

---

## ✨ Special Cards Expansion

Special Cards represent lucky moments, clever ideas, and unexpected opportunities that make life in the village a little easier!

> [!NOTE]
> Unlike normal Tool cards, Special Cards are **not used directly to solve requests**. Instead, they provide powerful one-time tactical abilities that manipulate your hand, borrow tools, declare wild cards, or add bonus objectives.

### 🃏 Special Cards Rules & Setup
1. **Setup**: All 8 Special Cards are shuffled directly into the Tool deck before the match starts.
2. **Drawing**: Special Cards are drawn naturally like normal Tool cards and count toward your 5-card hand limit.
3. **Turn Limit**: You may play **at most one Special Card during your turn**.
4. **After Use**: Once resolved, the Special Card is placed immediately into the Tool discard pile. Discarded Special Cards are reshuffled if the deck runs out.

### 📦 The 8 Special Cards Roster

| Card | Name | Timing | Effect & Modal Interaction |
|---|---|---|---|
| **SP01** | **Lucky Find** | ⚡ Before Story | Draw 2 Tool cards from the deck, keep 1 in your hand, and place the other on the bottom of the deck. |
| **SP02** | **Helping Hand** | ⚡ Before Story | Choose another player. They give you 1 Tool card from their hand of their choice (or selected). |
| **SP03** | **Second Chance** | ⚡ Before Story | Choose any number of Tool cards in your hand to return to the deck, shuffle it, and draw that same number of cards. |
| **SP04** | **Borrowed Tool** | ⚡ Before Story | Choose 1 Tool card from another player’s hand to use during your turn. It returns to their hand after your turn ends. |
| **SP05** | **Brilliant Idea** | 💬 After Story | Play 1 additional Tool card from your hand into your solution before voting begins. |
| **SP06** | **Hidden Toolbox** | ⚡ Before Story | Draw 3 Tool cards from the deck, then choose 2 cards from your hand to discard into the discard pile. |
| **SP07** | **Wild Inspiration** | 🛠️ During Story | 1 Tool card in your story becomes a **Wild Card**, representing any item or tool you describe in your pitch. |
| **SP08** | **Happy Accident** | 💬 After Story | If your story succeeds, you also automatically complete **1 additional Small (5pt) Request** from the village board! |

---

## 🛠️ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│               Client (React 19 + Vite)                │
│  - Glassmorphic UI & 3D Tactile Theme                  │
│  - Automatic URL Code Detection (?room=CODE)           │
│  - Session Storage Draft Caching & Reconnect Manager   │
└───────────────────────────▲────────────────────────────┘
                            │ Socket.IO / WebSocket
┌───────────────────────────▼────────────────────────────┐
│          Backend Server (Node.js + Express)            │
│  - Single-Port Static SPA & REST Serving               │
│  - Socket.IO Real-Time Event Transport Adapter         │
│  - Local Write-Only Append-Only Storage (JSONL)        │
└───────────────────────────▲────────────────────────────┘
                            │ Pure State Events
┌───────────────────────────▼────────────────────────────┐
│      Pure Deterministic Game Engine (No I/O)           │
│  - State Reducer (state + event = nextState)           │
│  - Deck Repository & Special Card Plugin System        │
│  - Time-Travel / Full Event Replay Capability          │
└────────────────────────────────────────────────────────┘
```

- **Frontend**: React 19, Vite, Lucide React, Vanilla CSS Design System.
- **Real-Time Layer**: Socket.IO with thin transport abstraction and room-level state sanitization (hides opponent hands & unrevealed secret votes).
- **Game Engine**: 100% pure JavaScript state machine with zero DOM or network dependencies.
- **Process Management**: PM2 configuration (`ecosystem.config.cjs`) for single-instance, memory-capped execution.
- **Persistence**: File-based append-only JSONL and atomic JSON for analytics, game logs, and player feedback.

---

## 🌟 Key Features & UX Innovations

### 🔄 1. Complete Refresh & State Persistence
- **F5 / Tab Reload Proof**: Reopening or refreshing the page immediately re-attaches to the ongoing match with all player hand cards, scores, and active board state intact.
- **Draft Turn Caching**: Selections made during your turn (chosen request card and tool cards) are saved in `sessionStorage` and restored upon refresh.
- **Graceful "Leave Village" Button**: Dedicated exit buttons in both the Lobby and Scoreboard toolbar allow intentional exits without leaving lingering ghost sessions.

### 🔗 2. Deep-Link Room Code Autofill
- Hosts can click **"Copy Link"** in the Lobby to share a link like `https://yourdomain.com/?room=ABCXYZ`.
- When an invited player opens the link:
  - The app automatically switches to the **"Join Room"** tab.
  - The 6-character room code is pre-filled.
  - An invite banner is displayed, and focus lands directly on the **"Your Villager Nickname"** input field.

### 💬 3. Write-Only Player Feedback Engine
- A 3-question in-game feedback modal is accessible across all screens (Landing, Lobby, Scoreboard, and Game Over).
- **Security by Design**: Feedback is stored in an append-only `feedback.jsonl` file on the server. There is **no web-based admin view** or exposed query API, ensuring zero attack surface and no risk of unauthorized data leaks.

### 🛡️ 4. Host Moderation Tools
- The room host has access to moderation controls:
  - **Skip Player Turn**: Pass turn if a player is AFK.
  - **Force Next Phase**: Move match forward if discussion stalls.
  - **End Game**: Conclude match early and view current standings.

---

## 📁 Project Structure

```
FixIT Village/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Modular View & Modal Components
│   │   │   ├── ActivityLogModal.jsx
│   │   │   ├── CardModal.jsx
│   │   │   ├── ChangelogModal.jsx
│   │   │   ├── FeedbackModal.jsx
│   │   │   ├── GameOverModal.jsx
│   │   │   ├── HostControlsModal.jsx
│   │   │   ├── LandingView.jsx
│   │   │   ├── LobbyView.jsx
│   │   │   ├── PhaseBanner.jsx
│   │   │   ├── PlayerHand.jsx
│   │   │   ├── RulebookModal.jsx
│   │   │   ├── Scoreboard.jsx
│   │   │   ├── StatisticsModal.jsx
│   │   │   ├── VillageBoard.jsx
│   │   │   └── VotingPanel.jsx
│   │   ├── App.jsx             # Main State Orchestrator & Views
│   │   ├── socket.js           # Client Socket.IO Transport Layer
│   │   ├── index.css           # Vibrant Design System & Micro-animations
│   │   └── main.jsx            # Entry point
│   ├── dist/                   # Production Build Assets
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Application & Engine
│   ├── analytics/              # Analytics & Feedback Storage
│   │   ├── analyticsEngine.js  # Match statistics aggregator
│   │   └── feedbackStore.js    # Append-only JSONL write store
│   ├── archives/               # Persistent Data Storage (git-ignored)
│   │   ├── analytics.json      # Aggregated match metrics
│   │   ├── feedback.jsonl      # Append-only player feedback records
│   │   └── games/              # Serialized match replay event streams
│   ├── engine/                 # Pure Deterministic Game Logic
│   │   ├── plugins/            # Extensible Card Plugin System
│   │   │   └── LuckyHammerPlugin.js
│   │   ├── deckRepository.js   # Card catalog & themed deck loaders
│   │   ├── events.js           # Immutable event factories
│   │   ├── GameEngine.js       # Pure state engine & replay runner
│   │   ├── stateReducer.js     # Pure state transition reducer
│   │   └── types.js            # Enums (GamePhase, EventType, CardType)
│   ├── scripts/
│   │   └── read_feedback.js    # CLI tool to inspect feedback & export CSV
│   ├── index.js                # Express & Socket.IO server entry
│   ├── test_engine.js          # Deterministic engine unit tests
│   ├── test_integration.js     # 3-client Socket.IO integration test
│   └── package.json
│
├── Cards/                      # Raw Card Design Assets & Decks
├── ecosystem.config.cjs        # PM2 Production Process Configuration
├── package.json                # Root package scripts
└── README.md                   # Complete Platform Documentation
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### 1. Installation
Clone the repository and install dependencies for both server and client:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Running Locally

You can run both client and server concurrently:

```bash
# Terminal 1: Start Backend Server (runs on http://localhost:3001)
cd server
npm run dev

# Terminal 2: Start Frontend Vite Dev Server (runs on http://localhost:5173)
cd client
npm run dev
```

Open `http://localhost:5173` in your browser to play!

---

## 🧪 Automated Test Suite

FixIT Village comes with two test suites verifying engine correctness and real-time networking:

```bash
cd server

# 1. Pure Deterministic Game Engine Test (Tests state transitions & event replay)
node test_engine.js

# 2. Multi-Client Socket.IO Integration Test (Simulates 3 players, voting, scoring & game over)
node test_integration.js
```

Both tests should output:
```
✓ DeckRepository & Card Versioning verified
✓ Special Cards Plugin system verified
✓ Match concluded in 3 turns! Final Phase: GAME_OVER
✓ Live Game Analytics verified
✓ 3-Question Feedback verified
🎉 ALL PURE GAME ENGINE & MULTI-CLIENT INTEGRATION TESTS PASSED!
```

---

## 🚀 Push to Production & Server Deployment Guide

FixIT Village is specifically architected to be **100% safe to deploy on production servers that already host existing critical projects**. It uses a single-port combined SPA + WebSocket architecture, low memory footprint, and zero-dependency file-based persistence.

### 🛡️ Why It Won't Clash With Your Existing Server
1. **Single Internal Port**: Express serves both the REST API, Socket.IO WebSockets, and the compiled React frontend from one single port (e.g. `3001` or any custom port like `4050`).
2. **Low Memory & CPU Footprint**: Memory usage is capped with PM2 (`max_memory_restart: '300M'`), preventing memory leaks from affecting neighboring services.
3. **Write-Only Local File Storage**: Analytics and feedback append directly to local `.jsonl` files in `server/archives/` — requiring no database setup, Redis, or external daemon dependencies.
4. **Single-Instance In-Memory State**: PM2 runs exactly 1 instance, eliminating WebSocket cross-process cluster synchronization issues.

---

### 📦 Option A: Quick 1-Command Automated Deploy (`deploy.sh`)

If your server has Git, Node.js, and PM2 installed:

```bash
# 1. SSH into your server and navigate to your project directory
cd /path/to/fixit-village

# 2. Run the deployment script
./deploy.sh
```

This script will automatically:
- Pull latest changes (`git pull`)
- Install client and server dependencies
- Compile the optimized React production bundle (`npm run build`)
- Execute deterministic unit tests to guarantee engine integrity (`npm run test`)
- Gracefully reload the PM2 service with zero downtime (`pm2 reload ecosystem.config.cjs`)

---

### 🛠️ Option B: Step-by-Step Manual Production Deployment

#### Step 1: Pre-Flight Verification (Local or Server)
Before deploying, ensure all engine tests pass and the client builds without errors:
```bash
npm run test     # Verifies pure engine rules & all 8 special cards
npm run build    # Compiles React 19 client into client/dist/
```

#### Step 2: Push Code to Your Server
Push your commits to your Git remote (e.g. GitHub/GitLab):
```bash
git add .
git commit -m "feat: complete FixIT Village production build"
git push origin main
```
On your server:
```bash
cd /var/www/fixit-village   # or your server directory
git pull origin main
```

#### Step 3: Install Production Dependencies
```bash
cd client && npm ci --omit=dev
cd ../server && npm ci --omit=dev
cd ..
```

#### Step 4: Build the Frontend
```bash
npm run build
```
*(This builds the Vite assets into `client/dist`, which Express serves automatically in production mode.)*

#### Step 5: Configure Port & PM2 Process Manager
Edit `ecosystem.config.cjs` (or pass environment variables) to choose any free port on your machine:

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'fixit-village',
      script: './server/index.js',
      cwd: './',
      instances: 1, // In-memory authoritative game engine
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001 // Change to any free port: 4050, 5050, etc.
      }
    }
  ]
};
```

Start the application with PM2:
```bash
# Start the process
pm2 start ecosystem.config.cjs

# Save PM2 process list so it automatically starts upon server reboot
pm2 save

# Setup PM2 system startup hook (run once per server)
pm2 startup
```

---

### 🌐 Step 6: Configure Nginx Reverse Proxy & SSL (HTTPS / WSS)

Create an Nginx configuration file for your subdomain (e.g., `/etc/nginx/sites-available/games.adityagagare.in`):

```nginx
server {
    server_name games.adityagagare.in;

    # Frontend SPA & Socket.IO WebSocket Proxy
    location / {
        proxy_pass http://127.0.0.1:3001; # Match your PM2 PORT
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Keep WebSockets alive without timeout drops
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    listen 80;
}
```

Enable the site and obtain a free Let's Encrypt SSL certificate:
```bash
# Enable site config
sudo ln -s /etc/nginx/sites-available/village.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Issue SSL certificate
sudo certbot --nginx -d village.yourdomain.com
```

---

### 🔄 Updating & Redeploying in the Future
Whenever you push new updates, simply run:
```bash
cd /var/www/fixit-village
git pull
npm run build
pm2 reload fixit-village --update-env
```

---

### 🔍 Monitoring & Operations Commands

| Command | Purpose |
|---|---|
| `pm2 status` | Check if FixIT Village is online and view memory usage |
| `pm2 logs fixit-village` | View live server output and connection logs in real time |
| `pm2 restart fixit-village` | Hard restart the server process |
| `pm2 reload fixit-village` | Graceful zero-downtime process reload |
| `npm run feedback` | View all player feedback and ratings from CLI |
| `curl http://localhost:3001/api/analytics` | Check real-time analytics summary via HTTP |

---

## 📊 Analytics & Feedback System

### 1. Write-Only Feedback Engine
All player feedback submissions are written to:
```
server/archives/feedback.jsonl
```
Each entry is stored as a self-contained JSON record:
```json
{
  "feedbackId": "fb_1738810000000_abc123",
  "submittedAt": "2026-08-06T03:00:00.000Z",
  "gameId": "...",
  "playerId": "...",
  "nickname": "Grandma Hazel",
  "rating": 5,
  "funFactor": "Loved pitching the lucky hammer!",
  "suggestion": "Add more tool cards!"
}
```

### 2. Inspecting Feedback via CLI
To read feedback summaries directly on the server terminal without exposing an admin webpage:

```bash
# View summary & star ratings in terminal
npm run feedback

# Export all feedback to a clean CSV file
npm run feedback -- --csv
```

---

## 📜 License & Versioning

- **Current Version**: `v0.1.2`
- **Engine Version**: `1.0.0`
- Designed and built for fun, lively tabletop party gaming! 🏡🎉

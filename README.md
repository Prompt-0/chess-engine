# AetherChess ♟️

> **High-Performance Rust Chess Engine (UCI Protocol), Real-Time WebSocket Bridge, and Modern React Analysis Board**

![Rust](https://img.shields.io/badge/Rust-1.80%2B-orange.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF.svg)

AetherChess is a full-stack, monorepo chess ecosystem featuring a high-performance computation engine built from scratch in Rust, an asynchronous WebSocket bridge, and an interactive modern web UI with live evaluation bars, candidate principal variations, and move telemetry.

---

## 🏛️ Architecture

```
chess-engine/
├── engine/          # High-performance Rust UCI calculation backend
│   ├── Cargo.toml
│   └── src/
├── bridge/          # Node.js WebSocket bridge translating UCI stdio to WebSocket JSON
│   ├── package.json
│   └── src/server.js
└── ui/              # Interactive React 19 + TypeScript + Tailwind web analysis interface
    ├── package.json
    └── src/
```

### Engine Highlights (Rust)
- **Magic Bitboards & LERF Representation**: Precomputed 64-bit sliding attack lookups for rooks and bishops using magic hashing.
- **Search Techniques**:
  - Alpha-Beta pruning with Principal Variation Search (PVS).
  - Quiescence search at leaf nodes to eradicate the horizon effect.
  - Null-Move Pruning (NMP) and Late Move Reductions (LMR).
  - MVV-LVA (Most Valuable Victim - Least Valuable Attacker) & Killer move heuristics.
- **Evaluation**:
  - Tapered evaluation smoothly interpolating between Opening and Endgame phases.
  - PeSTO Piece-Square Tables (PSQT) combined with pawn structure heuristics.
- **Transposition Table**: Lockless Zobrist hash table caching depths, evaluation bounds, and best PV moves.
- **Standards Compliant**: Full UCI (Universal Chess Interface) protocol support via standard I/O.

### Bridge Highlights (Node.js)
- Manages dedicated native child processes per active browser session.
- Bridges raw UCI text streams into structured WebSocket JSON events.
- Telemetry rate-limiting to stream updates smoothly at 20 updates/second without dropping UI frames.

### UI Highlights (React 19)
- Interactive analysis board with legal move validation and premoves.
- Real-time centipawn advantage bar and win probability visualizer.
- Search depth, nodes-per-second (NPS), and Principal Variation (PV) inspection.

---

## 🚀 Getting Started

### Prerequisites
- [Rust & Cargo](https://rustup.rs/) (1.80+)
- [Node.js](https://nodejs.org/) (v18+)

### 1. Build and Test the Chess Engine
```bash
# Test engine logic & perft move generation
npm run test:engine

# Build release engine binary
npm run build:engine
```

### 2. Launch Bridge & Web UI
```bash
# In terminal 1: Start the UCI WebSocket bridge
npm run start:bridge

# In terminal 2: Start the frontend development server
npm run dev:ui
```

---

## 📜 License

MIT License.

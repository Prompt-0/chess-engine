---
id: T07-websocket-bridge-framing-and-ipc
title: WebSocket Bridge Framing and Engine Process Lifecycle
type: wayfinder:grilling
status: closed
blocked_by:
  - T06-uci-protocol-and-time-management
assignee: agy
---

## Question

How should the Node.js WebSocket bridge on port 5001 frame bidirectional IPC communication between the web frontend and the engine subprocess, handling process lifecycle, reconnections, and streaming real-time UCI telemetry (depth, score, nodes, nps, pv line) as JSON?

## Resolution

The WebSocket bridge architecture and IPC message framing decisions have been settled through grilling:

1. **Dedicated Child Process per Client Connection**:
   - Each WebSocket connection spawns an independent `./target/release/chess_engine` child process via `child_process.spawn`.
   - When a browser tab closes or disconnects, the bridge sends `quit` and kills the child process, preventing memory leaks and avoiding shared state collisions between tabs.
2. **Telemetry Streaming & UI Throttling**:
   - Engine `stdout` lines are parsed via regex into structured JSON objects (`depth`, `seldepth`, `score`, `nodes`, `nps`, `timeMs`, `pv`).
   - `info` telemetry events are throttled to a maximum rate of 20 updates per second (50 ms interval) to preserve fluid 60 FPS browser UI rendering.
   - `best_move` and `ready` events bypass throttling and are dispatched immediately (0 ms latency).
3. **Structured JSON WebSocket Protocol**:
   - Frontend $\to$ Bridge:
     - `{ "type": "init" }`
     - `{ "type": "new_game" }`
     - `{ "type": "set_position", "fen": string, "moves": string[] }`
     - `{ "type": "start_search", "depth"?: number, "movetime"?: number, "wtime"?: number, "btime"?: number, "winc"?: number, "binc"?: number }`
     - `{ "type": "stop_search" }`
     - `{ "type": "set_option", "name": string, "value": any }`
   - Bridge $\to$ Frontend:
     - `{ "type": "ready" }`
     - `{ "type": "telemetry", "depth": number, "score": number, "scoreType": "cp" | "mate", "nodes": number, "nps": number, "timeMs": number, "pv": string[] }`
     - `{ "type": "best_move", "move": string }`
     - `{ "type": "engine_error", "message": string }`
4. **Heartbeat & Resilient Auto-Recovery**:
   - 15-second WebSocket ping/pong heartbeat detects dropped client sockets and tears down dead engine processes.
   - Any unexpected engine process crash logs stderr to the bridge console, notifies the client UI, and lazily respawns a clean engine process on the next user action.

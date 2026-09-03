---
id: T07-websocket-bridge-framing-and-ipc
title: WebSocket Bridge Framing and Engine Process Lifecycle
type: wayfinder:grilling
status: open
blocked_by:
  - T06-uci-protocol-and-time-management
assignee: unassigned
---

## Question

How should the Node.js WebSocket bridge on port 5001 frame bidirectional IPC communication between the web frontend and the engine subprocess, handling process lifecycle, reconnections, and streaming real-time UCI telemetry (depth, score, nodes, nps, pv line) as JSON?

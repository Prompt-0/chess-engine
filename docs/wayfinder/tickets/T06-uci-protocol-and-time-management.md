---
id: T06-uci-protocol-and-time-management
title: UCI Protocol and Search Time Allocation
type: wayfinder:grilling
status: open
blocked_by:
  - T04-search-algorithm-and-pruning-heuristics
assignee: unassigned
---

## Question

How will the engine implement the UCI protocol loop, handle non-blocking asynchronous search cancellation (`stop`), and dynamically allocate search time per move based on `wtime`, `btime`, `winc`, `binc`, or fixed `movetime`?

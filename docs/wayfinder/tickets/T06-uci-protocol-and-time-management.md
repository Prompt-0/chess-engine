---
id: T06-uci-protocol-and-time-management
title: UCI Protocol and Search Time Allocation
type: wayfinder:grilling
status: closed
blocked_by:
  - T04-search-algorithm-and-pruning-heuristics
assignee: agy
---

## Question

How will the engine implement the UCI protocol loop, handle non-blocking asynchronous search cancellation (`stop`), and dynamically allocate search time per move based on `wtime`, `btime`, `winc`, `binc`, or fixed `movetime`?

## Resolution

The UCI protocol loop, asynchronous threading model, and time management equations have been settled through grilling:

1. **Dual-Thread Architecture & Atomic Interruption**:
   - **Main Thread**: Continuously reads lines from `std::io::stdin()`, parsing tokens (`uci`, `isready`, `ucinewgame`, `position`, `go`, `stop`, `quit`).
   - **Search Thread**: Background worker executing Negamax / Iterative Deepening.
   - **Asynchronous Stop Flag**: Search worker polls `Arc<AtomicBool>` `stop_flag.load(Ordering::Relaxed)` every 2,048 nodes ($< 1\text{ ns}$ overhead).
   - Receiving `stop` sets `stop_flag = true`, cleanly terminating search on the next check and emitting `bestmove <m>` within $< 1\text{ ms}$.
2. **Soft & Hard Time Budgeting Equations**:
   - **Target Time**: $T_{\text{target}} = \frac{T_{\text{remaining}}}{25} + 0.75 \times T_{\text{increment}}$.
   - **Hard Limit**: $T_{\text{hard}} = \min(T_{\text{target}} \times 2.5,\; T_{\text{remaining}} \times 0.6)$.
   - **Soft Cutoff**: At the completion of each iterative deepening depth, if elapsed time $> 0.6 \times T_{\text{target}}$, the engine stops and returns the best move of the completed depth.
   - Exact `movetime <ms>` and `depth <d>` overrides are strictly respected.
3. **Supported Commands & Options**:
   - Full UCI specification: `uci`, `isready`, `ucinewgame`, `position`, `go`, `stop`, `quit`.
   - Custom Options:
     - `Hash`: TT size in MB (default 64, min 1, max 2048).
     - `OwnBook`: Polyglot book toggle (default true).
     - `BookFile`: Path to `.bin` book (default `"gm2001.bin"`).
     - `SyzygyPath`: Path to 3-4-5 piece tablebases (default empty).
   - Real-time telemetry streaming: `info depth <d> seldepth <sd> score cp <s> nodes <n> nps <nps> time <ms> pv <moves...>`.
4. **Polyglot Opening Book Dispatch**:
   - Direct probe in `go`: If `OwnBook` is active, computes the 64-bit Polyglot key, performs binary search on memory-mapped `.bin` file, translates Polyglot castling encoding (`e1h1` $\to$ `e1g1`), and returns `bestmove` instantly (0 ms) without launching the search worker.

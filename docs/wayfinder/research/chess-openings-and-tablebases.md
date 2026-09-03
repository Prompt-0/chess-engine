# Ticket T09: Chess Opening Books & Endgame Tablebases Feasibility Report

## Executive Summary

Opening books and endgame tablebases solve the two extremes of chess computation:
1. **Opening Book (Polyglot `.bin`)**: Bypasses tree search entirely during initial moves (plies 1–20), playing master-level theoretical openings instantaneously (0 ms) with zero CPU utilization and negligible RAM footprint via memory-mapping (`mmap`).
2. **Endgame Tablebases (Syzygy WDL/DTZ)**: Provides game-theoretic omniscience (perfect play) when $\le 5$ (or $\le 6$) pieces remain on the board, eliminating endgame blunders, horizon effects, and unnecessary search tree exploration.

Both formats are highly standardized, but have vastly different implementation costs, disk footprints, and integration requirements for `/root/Projects/chess-engine`.

---

## 1. Polyglot `.bin` Opening Book Format

### 1.1 Binary Record Layout & Specifications
A Polyglot book file is an uncompressed, flat binary sequence of 16-byte records, strictly sorted in ascending numerical order by the 64-bit Zobrist key:

```
0                   7 8         9 10        11 12                  15 (Bytes)
+--------------------+-----------+-----------+-----------------------+
|  Zobrist Key (u64) | Move(u16) | Weight(u16)|     Learn (u32)       |
+--------------------+-----------+-----------+-----------------------+
|     64 bits        |  16 bits  |  16 bits  |       32 bits         |
```

* **Entry Size**: Exactly **16 bytes**. Total file entries = `file_size_bytes / 16`.
* **Endianness**: Strictly **Big-Endian** (`network order`). On x86_64 and aarch64, all fields must be decoded using `u64::from_be_bytes()`, `u16::from_be_bytes()`, etc.
* **Fields**:
  * `key: u64`: Polyglot Zobrist hash of the position.
  * `move: u16`: Packed move representation.
  * `weight: u16`: Frequency or quality weight assigned to this move (higher is better/more frequent).
  * `learn: u32`: Reserved for learning algorithms (e.g., win/loss statistics or engine adjustments; typically 0 in static books).

### 1.2 Move Bitfield Encoding & The Castling Quirk
The 16-bit move field is packed as:
* **Bits `0..5` (6 bits)**: Destination square `to` (0 = a1, 1 = b1, ..., 7 = h1, ..., 63 = h8).
* **Bits `6..11` (6 bits)**: Origin square `from` (0 = a1, ..., 63 = h8).
* **Bits `12..14` (3 bits)**: Promotion piece flag:
  * `0`: None (not a promotion)
  * `1`: Knight (`n`)
  * `2`: Bishop (`b`)
  * `3`: Rook (`r`)
  * `4`: Queen (`q`)
* **Bit `15` (1 bit)**: Reserved / unused (0).

**The Polyglot Castling Convention ("King takes Rook")**:
Polyglot encodes castling moves as the King moving to the square of its own Rook:
* White Kingside (e1-g1): `from = e1 (4)`, `to = h1 (7)`
* White Queenside (e1-c1): `from = e1 (4)`, `to = a1 (0)`
* Black Kingside (e8-g8): `from = e8 (60)`, `to = h8 (63)`
* Black Queenside (e8-c8): `from = e8 (60)`, `to = a8 (56)`

When translating a Polyglot move to UCI notation, the engine must detect if the moving piece is a King and the target square contains its own uncaptured Rook with active castling rights, remapping `e1h1` -> `e1g1`, etc.

### 1.3 Memory-Mapped Binary Search Lookups
Because Polyglot books are pre-sorted by `key`, lookups are $O(\log_2 N)$ binary searches:
* **Zero Allocation via `memmap2`**:
  Instead of reading the entire file into memory, use `memmap2`:
  ```rust
  let mmap = unsafe { memmap2::MmapOptions::new().map(&file)? };
  let num_entries = mmap.len() / 16;
  ```
  * OS kernel handles paging; lookups take microseconds.
  * Zero memory allocated in the engine heap.
  * Instant startup with zero loading latency.
* **Finding All Candidate Moves**:
  Positions often have multiple valid book moves (e.g. 1. e4 has e5, c5, e6, c6).
  * Standard binary search identifies *an* index matching `target_key`.
  * Scan backwards to the first entry matching `target_key`, then iterate forward collecting all entries in `[first, last)`.
* **Selection Strategy**:
  * **Tournament Mode**: Pick the move with `max(weight)`.
  * **Varied Mode**: Weighted random selection:
    $$\Pr(\text{move}_i) = \frac{\text{weight}_i}{\sum_j \text{weight}_j}$$

### 1.4 Polyglot Zobrist Hash vs Custom Engine Zobrist Hash
A chess engine cannot use its internal Zobrist hash key to look up moves in a Polyglot book:
1. **Different Random Constants**: Polyglot uses Fabien Letouzey's standardized constants.
2. **En Passant Semantics**: Polyglot XORs the en passant file **if and only if** an opposing pawn can legally capture en passant on the next ply.

**Architectural Recommendation**:
Implement a dedicated `compute_polyglot_key(&Board) -> u64` function called only once at root (ply 0). It takes $< 100\text{ ns}$ and keeps the internal search loop unburdened.

---

## 2. Syzygy Endgame Tablebases (3-4-5 Piece)

### 2.1 Format Architecture: WDL vs DTZ
Syzygy tablebases are partitioned into two distinct file types:
1. **`.rtbw` (WDL - Win / Draw / Loss)**:
   * Encodes game-theoretic outcome: Loss (`-2`), Blessed Loss (`-1`), Draw (`0`), Cursed Win (`+1`), Win (`+2`).
   * Fast; requires no move generation.
2. **`.rtbz` (DTZ - Distance to Zeroing)**:
   * Encodes plies until the next pawn move or capture.
   * Probing requires generating all legal moves to find the move maintaining the win while decrementing DTZ.

### 2.2 Search Probing vs Root Probing
| Location | Tablebase Used | Gating Conditions | Action Taken |
| :--- | :--- | :--- | :--- |
| **Search Tree (Alpha-Beta / QSearch)** | `.rtbw` (WDL only) | Piece count $\le 5$, `depth >= SyzygyProbeDepth`, not at root | Immediate cutoff: returns $\text{MATE\_SCORE} - \text{ply}$ for wins, $-\text{MATE\_SCORE} + \text{ply}$ for losses, or $0$ for draws. |
| **Root (Ply 0)** | `.rtbw` + `.rtbz` (WDL & DTZ) | Piece count $\le 5$ at root node | Probes DTZ for all legal moves to find the shortest winning path that avoids 50-move draws. Emits move in 0 ms. |

### 2.3 Rust Ecosystem: Fathom C Bindings vs Pure Rust Crates
1. **`fathom-sys` / `fathom` (C FFI Bindings)**:
   * Stockfish's reference C prober.
   * Standard-compliant, fast decompression routines, but requires C compiler build dependencies.
2. **`shakmaty-syzygy` (Pure Rust)**:
   * 100% safe Rust, uses `memmap2`, but requires adapting the board representation to `shakmaty::Chess`.
3. **Custom Tablebase Implementation**:
   * Not recommended (~3,000–5,000 lines of complex Huffman and LRZ block decompression).

### 2.4 Disk Space & Cache Footprint
* 3-piece: ~150 KB
* 4-piece: ~30 MB
* 5-piece: ~940 MB
* Combined 3-4-5 Piece: **~1.0 GB** (580 files)
* 6-piece: ~150 GB (prohibitive for local engine bundling).

---

## 3. Practical Recommendations for chess-engine

### 3.1 Polyglot Opening Book: High ROI, Immediate Value
* **Complexity**: Low (~200–250 LOC).
* **Dependencies**: `memmap2 = "0.9"`.
* **When to Integrate**: During **Ticket T06 (UCI Protocol & Time Management)**.
* **UCI options**:
  * `setoption name OwnBook type check default true`
  * `setoption name BookFile type string default "gm2001.bin"`
* Can bundle an optional lightweight tournament book (~2 MB to 5 MB).

### 3.2 Syzygy Tablebases: Phased, Opt-in Architecture
* **Complexity**: Medium to High.
* **Disk Footprint**: ~1 GB.
* **When to Integrate**: **Phase 2 / Post-MVP**.
* **Recommended Strategy**:
  1. Add standard UCI option `SyzygyPath` to allow users with local tablebases to point to them.
  2. For the Web UI / WebSocket bridge, optionally query the free public Lichess Tablebase API (`https://tablebase.lichess.ovh/standard?fen=...`) for instant endgame analysis without local 1 GB storage.

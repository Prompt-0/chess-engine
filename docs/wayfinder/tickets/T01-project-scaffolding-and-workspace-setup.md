---
id: T01-project-scaffolding-and-workspace-setup
title: Project Scaffolding and Workspace Setup
type: wayfinder:task
status: closed
blocked_by: []
assignee: agy
---

## Question

Initialize the multi-component workspace at `/root/Projects/chess-engine` with a Rust crate (`engine/`), a Node.js WebSocket bridge (`bridge/`), and a Vite React TypeScript Tailwind app (`ui/`), ensuring all dependencies, scripts, and build targets compile cleanly.

## Resolution

The monorepo structure has been scaffolded, configured, and verified across all components:

1. **`engine/` (Rust Crate `aether_chess`)**:
   - Initialized with `Cargo.toml` edition 2024.
   - Dependencies: `anyhow 1.0`, `thiserror 2.0`, `memmap2 0.9`.
   - Release profile optimized with `opt-level = 3`, `lto = "thin"`, `codegen-units = 1`, and `panic = "abort"`.
   - Verified: compiles cleanly with `cargo build --release`.
2. **`bridge/` (Node.js UCI WebSocket Bridge)**:
   - Initialized with `package.json` and `src/server.js`.
   - Dependencies: `express`, `ws`, `cors`.
   - Binds to `0.0.0.0:5001` with `/health` endpoint and bidirectional WebSocket client handling.
   - Verified: dependencies installed and server script verified.
3. **`ui/` (Vite + React 19 + TypeScript + Tailwind CSS v4)**:
   - Initialized with `@tailwindcss/vite` and `lucide-react`.
   - Binds to `0.0.0.0:3000` (strict port).
   - Verified: production build completes in 430ms (`npm run build`).
4. **Root Workspace Convenience Scripts**:
   - `npm run build:engine`: builds Rust binary in release mode.
   - `npm run test:engine`: runs engine test suite.
   - `npm run check:engine`: runs Clippy linter.
   - `npm run start:bridge`: starts bridge server on port 5001.
   - `npm run dev:ui`: starts Vite dev server on port 3000.
   - `npm run build:ui`: builds production web bundle.

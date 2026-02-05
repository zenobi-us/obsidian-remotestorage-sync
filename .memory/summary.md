# Project Summary

## Current Status
- **Current Epic**: P2P Obsidian Vault Collaboration (`epic-fc65689b`) – planning; scope confirmed (async-first, selected folders, mDNS+WebRTC STUN, E2E + peer approval, presence/conflict UI, manual sync)
- **Active Phases**: None (phase planning will follow MVP task breakdown)
- **Next Milestone**: Break down MVP stories into tasks and sequence phases

## Recent Updates
- 2026-02-05: Captured scope decisions, updated epic, completed scope-clarification task, and drafted MVP stories (`story-193cacc9`, `story-c7850ba4`, `story-3920916f`, `story-420b4311`)
- 2026-02-05: Started epic `epic-fc65689b` and created scope clarification task (`task-4bd7399a`)
- 2026-02-05: Cleanup - restored deleted research files
- 2026-02-04: Expanded codemap using CodeMapper output
- 2026-02-04: Initial memory store setup

## Available Research
- **P2P Browser Sync Libraries** (`research-a7b3c9d2`): Comprehensive comparison of Yjs, RxDB, Gun.js, Automerge, and Trystero for browser-based P2P sync with WebRTC and CRDTs. **Recommendation: Yjs + y-webrtc** for Obsidian plugin due to best performance, smallest bundle (20KB), built-in encryption, and zero-config public signaling.
- **Loro CRDT Library Deep Dive** (`research-f2e8b1a4`) [archived, Yjs chosen]: In-depth analysis of Loro - Rust/WASM CRDT with advanced features (rich text, movable trees, version control, shallow snapshots). **Bundle: 399KB** (20x larger than Yjs). Network-agnostic (no built-in P2P). Kept for reference only.

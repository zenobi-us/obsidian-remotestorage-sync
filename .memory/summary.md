# Project Summary

## Current Status
- **Current Epic**: P2P Obsidian Vault Collaboration (`epic-fc65689b`) – in progress (Phase 1 runtime wiring implemented; performance validation pending)
- **Active Phases**: Phase 1 (async selective sync) in progress; phases 2–3 not started
- **Next Milestone**: Complete async sync performance validation (`task-fea2a6e7`) before moving to discovery/security tasks
- **Future Epic (blocked)**: Settings UX Improvements (`epic-6f7d2c1a`) – ad hoc stories captured while completing the current epic

## Reality-Based Progress (code-verified)
- **Epic fc65689b**: in progress
- **Stories**: 0 completed / 1 in-progress / 2 todo / 1 proposed (stretch)
- **Tasks (epic-linked)**: 4 completed / 1 in-progress / 6 todo

### Phase Snapshot
- **Phase 1 (async selective sync)**: ~85% — scope settings and Yjs runtime wiring are implemented with tests; networked perf validation still pending.
- **Phase 2 (discovery + security)**: 0% — not yet implemented in `src/`.
- **Phase 3 (presence/conflict/manual UX)**: 0% — not yet implemented in `src/`.
- **Phase 4 (performance/resilience hardening)**: ~20% — deterministic benchmark harness added; real LAN/STUN multi-peer tuning not started.

### Verified Implemented in Code
- Include/exclude scope settings with persistence and normalization.
- Scope enforcement helper (`isPathInScope`) with tests.
- Yjs sync foundation (note/attachment doc model, adapter hooks, WebRTC + IndexedDB integration points) with unit tests.
- Runtime vault-event wiring (create/modify auto-enroll, scoped local update propagation, remote-write echo suppression) with lifecycle tests.
- Env-gated performance benchmark harness for 100 notes + 50MB dataset, with timing and error capture output.

### Verified Not Yet Implemented in Code
- mDNS peer discovery + STUN handshake flow.
- QR/passphrase key exchange and trust/session management.
- Peer approval gating before any sync.
- Presence indicators UI, manual sync control/progress UX, conflict diff UI.
- Real LAN/STUN multi-peer benchmark runs and tuning evidence for the <30s target.

## Recent Updates
- 2026-02-06: Started task `fea2a6e7` by adding sync performance benchmark harness + docs/script, and captured baseline result (100 notes + 50MB: total 148ms, 0 errors in deterministic local run)
- 2026-02-06: Completed task `aaa78b68` by wiring vault create/modify events to Yjs runtime (notes + attachments), added lifecycle tests, and fixed test harness mocks/setup
- 2026-02-06: Added reality-based progress dashboard with code-verified phase/task/story status
- 2026-02-06: Reviewed notes vs `src/` implementation; updated epic/story/task statuses to match actual code progress (phase 1 partial, task `aaa78b68` moved to in-progress)
- 2026-02-06: Linked Settings UX Improvement stories to epic (`epic-6f7d2c1a`)
- 2026-02-06: Added story for right-click add filepath to shared channel (`story-9e3a7f2b`)
- 2026-02-06: Added story for included paths multiselect selector (`story-4f2a9c71`)
- 2026-02-05: Implemented Yjs sync engine with scope enforcement and tests (`task-aaa78b68`)
- 2026-02-05: Captured future epic for settings UX improvements (blocked; `epic-6f7d2c1a`)
- 2026-02-05: Completed selective scope configuration settings/UI/tests (`task-86b9fc95`)
- 2026-02-05: Broke down MVP stories into tasks and linked them to stories (`task-86b9fc95`, `task-aaa78b68`, `task-fea2a6e7`, `task-6fb8a3af`, `task-0fec4274`, `task-ecbd5622`, `task-c280c8d8`, `task-fe1d6532`, `task-816c62f7`)
- 2026-02-05: Captured scope decisions, updated epic, completed scope-clarification task, and drafted MVP stories (`story-193cacc9`, `story-c7850ba4`, `story-3920916f`, `story-420b4311`)
- 2026-02-05: Started epic `epic-fc65689b` and created scope clarification task (`task-4bd7399a`)
- 2026-02-05: Cleanup - restored deleted research files
- 2026-02-04: Expanded codemap using CodeMapper output
- 2026-02-04: Initial memory store setup

## Available Research
- **P2P Browser Sync Libraries** (`research-a7b3c9d2`): Comprehensive comparison of Yjs, RxDB, Gun.js, Automerge, and Trystero for browser-based P2P sync with WebRTC and CRDTs. **Recommendation: Yjs + y-webrtc** for Obsidian plugin due to best performance, smallest bundle (20KB), built-in encryption, and zero-config public signaling.
- **Loro CRDT Library Deep Dive** (`research-f2e8b1a4`) [archived, Yjs chosen]: In-depth analysis of Loro - Rust/WASM CRDT with advanced features (rich text, movable trees, version control, shallow snapshots). **Bundle: 399KB** (20x larger than Yjs). Network-agnostic (no built-in P2P). Kept for reference only.

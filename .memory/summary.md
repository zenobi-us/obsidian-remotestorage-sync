# Project Summary

## Current Status
- **Current Epic**: P2P Obsidian Vault Collaboration (`epic-fc65689b`) – in progress (Phase 1 test honesty complete; perf validation deferred to Phase 4)
- **Active Phases**: Phase 1 (async selective sync) nearly gate-ready; phases 2–3 not started
- **Next Milestone**: Phase 1 test honesty (`story-c26be0e8`) ✅ complete. Remaining: close Phase 1 gate (perf validation `task-fea2a6e7` deferred to Phase 4). Then begin Phase 2 (discovery & security).
- **Future Epic (blocked)**: Settings UX Improvements (`epic-6f7d2c1a`) – ad hoc stories captured while completing the current epic

## Reality-Based Progress (code-verified)
- **Epic fc65689b**: in progress
- **Stories**: 1 completed (c26be0e8) / 1 in-progress / 2 todo / 1 proposed (stretch)
- **Tasks (epic-linked)**: 5 completed / 1 in-progress / 6 todo

### Phase Snapshot
- **Phase 1 (async selective sync)**: ~90% — scope settings, Yjs runtime wiring, and test honesty all complete; perf validation deferred to Phase 4.
- **Phase 2 (discovery + security)**: 0% — not yet implemented in `src/`.
- **Phase 3 (presence/conflict/manual UX)**: 0% — not yet implemented in `src/`.
- **Phase 4 (performance/resilience hardening)**: ~10% — fake benchmark deleted; real LAN/STUN multi-peer tuning not started.

### Verified Implemented in Code
- Include/exclude scope settings with persistence and normalization.
- Scope enforcement helper (`isPathInScope`) with tests.
- Yjs sync foundation (note/attachment doc model, adapter hooks, WebRTC + IndexedDB integration points) with unit tests.
- Runtime vault-event wiring (create/modify auto-enroll, scoped local update propagation, remote-write echo suppression) with lifecycle tests.
- IndexedDB persistence round-trip test (found & fixed ordering bug).
- Two-peer WebRTC sync test (Playwright-based, proves transport layer works).
- Runtime integration tests with real engine (4/4 passing).

### Verified Not Yet Implemented in Code
- mDNS peer discovery + STUN handshake flow.
- QR/passphrase key exchange and trust/session management.
- Peer approval gating before any sync.
- Presence indicators UI, manual sync control/progress UX, conflict diff UI.
- Real LAN/STUN multi-peer benchmark runs and tuning evidence for the <30s target.

### Phase 1 Test Honesty (story c26be0e8) — ✅ COMPLETE
All 4 tasks done:
1. `task-2a1e106e` — Two-peer WebRTC sync test ✅ (skipped in happy-dom; passes in Playwright)
2. `task-86eb4316` — IndexedDB persistence round-trip test ✅ (passing; bug fixed)
3. `task-4df28a4e` — Runtime integration test with real engine ✅ (4/4 passing)
4. `task-58dd34a0` — Fake benchmark deleted (Option B) ✅ — real perf validation deferred to Phase 4

## Recent Updates
- 2026-02-06: Completed task `58dd34a0` (Option B: deleted fake benchmark, removed `bench:sync` script, deleted `docs/performance-sync-benchmark.md`); marked story `c26be0e8` as completed — all Phase 1 test honesty tasks done
- 2026-02-06: Created story `c26be0e8` (Phase 1 test honesty) with 4 tasks after test audit revealed WebRTC, IndexedDB, and integration paths are untested; fake benchmark flagged as misleading
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
- 2026-02-05: Broke down MVP stories into tasks and linked them
- 2026-02-05: Captured scope decisions, updated epic, completed scope-clarification task, and drafted MVP stories
- 2026-02-05: Started epic `epic-fc65689b` and created scope clarification task (`task-4bd7399a`)
- 2026-02-04: Expanded codemap using CodeMapper output
- 2026-02-04: Initial memory store setup

## Available Research
- **P2P Browser Sync Libraries** (`research-a7b3c9d2`): Comprehensive comparison of Yjs, RxDB, Gun.js, Automerge, and Trystero for browser-based P2P sync with WebRTC and CRDTs. **Recommendation: Yjs + y-webrtc** for Obsidian plugin due to best performance, smallest bundle (20KB), built-in encryption, and zero-config public signaling.
- **Loro CRDT Library Deep Dive** (`research-f2e8b1a4`) [archived, Yjs chosen]: In-depth analysis of Loro - Rust/WASM CRDT with advanced features (rich text, movable trees, version control, shallow snapshots). **Bundle: 399KB** (20x larger than Yjs). Network-agnostic (no built-in P2P). Kept for reference only.

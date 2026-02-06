---
id: 58dd34a0
title: Rewrite or remove fake benchmark
created_at: 2026-02-06T08:30:00+10:30
updated_at: 2026-02-06T08:30:07+10:30
status: completed
epic_id: fc65689b
phase_id: none
story_id: c26be0e8
assigned_to: session-20260206-083007
---

# Rewrite or remove fake benchmark

## Objective
The current `sync-performance.benchmark.test.ts` benchmarks HashMap speed with `sleep()` for simulated latency. It is actively misleading — the 148ms result says nothing about real sync. Either rewrite it to test something meaningful or delete it.

## Related Story
- [Phase 1 test honesty](story-c26be0e8-phase1-test-honesty.md)

## Steps

### Decision: Option B (Delete and defer)

**Rationale:** Task `2a1e106e` (two-peer WebRTC test) confirmed that WebRTC requires a real `RTCPeerConnection` — unavailable in happy-dom/Node. A real in-process Vitest benchmark is therefore impossible. The Playwright approach works but is too heavyweight for a repeatable perf benchmark. Real performance validation belongs in Phase 4 (performance/resilience hardening) when actual LAN/STUN network conditions can be tested.

### Steps taken
1. Deleted `docs/performance-sync-benchmark.md`.
2. Removed the `bench:sync` script from `package.json` (project uses mise tasks, not npm scripts).
3. The benchmark test file (`src/__tests__/sync-performance.benchmark.test.ts`) was never committed — no deletion needed.
4. Updated `task-fea2a6e7` to note that real performance validation is deferred to Phase 4.
5. Updated story `193cacc9` acceptance criterion to clarify the <30s target will be validated in Phase 4.
6. Updated story `c26be0e8` to mark this task complete.

## Expected Outcome
The misleading benchmark is removed with a clear note about when real performance testing will happen.

## Actual Outcome
Option B executed. Fake benchmark artifacts deleted (`docs/performance-sync-benchmark.md`, `bench:sync` script). Real perf validation deferred to Phase 4. All related tasks/stories updated.

## Lessons Learned
- Don't ship benchmarks that test mock/simulated behavior — they create false confidence.
- WebRTC-dependent performance tests require a real browser environment (Playwright), not Node/happy-dom.
- Performance validation should be planned for phases where the network stack is actually available.

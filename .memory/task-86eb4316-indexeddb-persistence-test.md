---
id: 86eb4316
title: IndexedDB persistence round-trip test
created_at: 2026-02-06T08:30:00+10:30
updated_at: 2026-02-06T12:15:00+10:30
status: completed
epic_id: fc65689b
phase_id: none
story_id: c26be0e8
assigned_to: session-20260206-093100
---

# IndexedDB persistence round-trip test

## Objective
Write a test that proves YjsSyncEngine's IndexedDB persistence actually works — documents survive engine destroy and reload correctly when a new engine is created.

## Related Story
- [Phase 1 test honesty](story-c26be0e8-phase1-test-honesty.md)

## Steps
1. Add `fake-indexeddb` as a dev dependency (`pnpm add -D fake-indexeddb`).
2. In test setup, polyfill `globalThis.indexedDB` with fake-indexeddb before importing engine code.
3. Create `src/__tests__/indexeddb-persistence.integration.test.ts`.
4. Instantiate a `YjsSyncEngine` with `enableWebrtc: false`, `enablePersistence: true`.
5. Start a note sync with seeded content "Persistent note".
6. Apply a local change: "Persistent note — updated".
7. Destroy the engine.
8. Create a new `YjsSyncEngine` with the same `roomName` and `enablePersistence: true`.
9. Start note sync for the same path — but seed the file adapter with DIFFERENT content to distinguish IndexedDB vs adapter.
10. Assert content matches "Persistent note — updated" (from IndexedDB).
11. Repeat for an attachment (binary round-trip).
12. Clean up IndexedDB state between tests.

## Expected Outcome
A passing test that proves `y-indexeddb` persistence integration works end-to-end through the `YjsSyncEngine` API.

## Actual Outcome
Test created at `src/__tests__/indexeddb-persistence.integration.test.ts`. Both note and attachment round-trip tests **pass** (2/2).

**Bug found and fixed:** The original `startNoteSync` and `startAttachmentSync` methods populated the Yjs doc from the file adapter BEFORE loading IndexedDB persistence. This meant on reload, the stale file adapter content was inserted first, then persistence merged — causing CRDT concatenation instead of restoration. Fix: create an empty doc shell first, attach persistence, wait for sync, then only populate from file adapter if persistence didn't restore content.

## Lessons Learned
- `fake-indexeddb/auto` works seamlessly with `y-indexeddb` in happy-dom.
- Persistence must be loaded BEFORE populating a Yjs doc from any other source, otherwise CRDT merge semantics concatenate rather than replace.
- The "stale seed" pattern (seeding the adapter with different content on reload) is an effective way to distinguish whether data came from persistence or from the adapter.

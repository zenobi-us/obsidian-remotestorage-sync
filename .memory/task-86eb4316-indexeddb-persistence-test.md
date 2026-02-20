---
id: 86eb4316
title: IndexedDB persistence round-trip test
created_at: 2026-02-06T08:30:00+10:30
updated_at: 2026-02-06T08:30:00+10:30
status: todo
epic_id: fc65689b
phase_id: none
story_id: c26be0e8
assigned_to: unassigned
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
9. Start note sync for the same path.
10. Assert the content is "Persistent note — updated" (loaded from IndexedDB, not from the file adapter seed).
11. Repeat for an attachment (binary round-trip).
12. Clean up IndexedDB state between tests to avoid cross-contamination.

## Expected Outcome
A passing test that proves `y-indexeddb` persistence integration works end-to-end through the `YjsSyncEngine` API. This validates the `enablePersistence: true` code path which is currently untested.

## Actual Outcome
_Not yet started._

## Lessons Learned
_Not yet started._
---
id: 86eb4316
title: IndexedDB persistence round-trip test
created_at: 2026-02-06T08:30:00+10:30
updated_at: 2026-02-06T08:30:00+10:30
status: todo
epic_id: fc65689b
phase_id: none
story_id: c26be0e8
assigned_to: unassigned
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
9. Start note sync for the same path.
10. Assert the content is "Persistent note — updated" (loaded from IndexedDB, not from the file adapter seed).
11. Repeat for an attachment (binary round-trip).
12. Clean up IndexedDB state between tests to avoid cross-contamination.

## Expected Outcome
A passing test that proves `y-indexeddb` persistence integration works end-to-end through the `YjsSyncEngine` API. This validates the `enablePersistence: true` code path which is currently untested.

## Actual Outcome
_Not yet started._

## Lessons Learned
_Not yet started._

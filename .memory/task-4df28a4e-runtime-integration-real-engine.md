---
id: 4df28a4e
title: Runtime integration test with real engine
created_at: 2026-02-06T08:30:00+10:30
updated_at: 2026-02-06T12:15:00+10:30
status: completed
epic_id: fc65689b
phase_id: none
story_id: c26be0e8
assigned_to: session-20260206-093100
---

# Runtime integration test with real engine

## Objective
Replace or supplement the `EngineSpy`-based `YjsVaultRuntime` tests with tests that wire the runtime to a real `YjsSyncEngine` (WebRTC/persistence off), proving that vault events flow through to actual Yjs document content.

## Related Story
- [Phase 1 test honesty](story-c26be0e8-phase1-test-honesty.md)

## Steps
1. Create `src/__tests__/vault-runtime-integration.test.ts`.
2. Instantiate a real `YjsSyncEngine` with `enableWebrtc: false`, `enablePersistence: false` and a `MemoryFileAdapter`.
3. Instantiate `YjsVaultRuntime` with the real engine.
4. **Create flow**: verify engine has Yjs doc with seeded content after `onVaultCreate`.
5. **Modify flow**: update adapter content, call `onVaultModify`, verify Yjs doc updated.
6. **Attachment flow**: create+modify for binary, verify `getAttachmentData` returns correct data.
7. **Scope enforcement**: verify out-of-scope files don't create engine docs.
8. Keep existing spy-based tests untouched (they still test wiring order).

## Expected Outcome
Tests that prove the full `YjsVaultRuntime → YjsSyncEngine → Yjs Doc → FileAdapter` pipeline works correctly.

## Actual Outcome
Test created at `src/__tests__/vault-runtime-integration.test.ts`. All 4 tests pass:
1. Create flow — note content flows from adapter through runtime to engine Yjs doc ✅
2. Modify flow — updated content propagates correctly ✅
3. Attachment flow — binary data round-trips through the pipeline ✅
4. Scope enforcement — out-of-scope files are rejected, no docs created ✅

## Lessons Learned
- Using a real engine (even with WebRTC/persistence off) is only marginally more complex than using a spy, but catches real integration bugs.
- The existing spy-based tests remain useful for verifying call order (e.g., "first modify enrolls, second modify applies"), but they should not be the only tests.

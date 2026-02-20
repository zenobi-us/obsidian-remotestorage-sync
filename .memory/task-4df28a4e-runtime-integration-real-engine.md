---
id: 4df28a4e
title: Runtime integration test with real engine
created_at: 2026-02-06T08:30:00+10:30
updated_at: 2026-02-06T08:30:00+10:30
status: todo
epic_id: fc65689b
phase_id: none
story_id: c26be0e8
assigned_to: unassigned
---

# Runtime integration test with real engine

## Objective
Replace or supplement the `EngineSpy`-based `YjsVaultRuntime` tests with tests that wire the runtime to a real `YjsSyncEngine` (WebRTC/persistence off), proving that vault events flow through to actual Yjs document content — not just that methods were called in the right order.

## Related Story
- [Phase 1 test honesty](story-c26be0e8-phase1-test-honesty.md)

## Steps
1. Create `src/__tests__/vault-runtime-integration.test.ts`.
2. Instantiate a real `YjsSyncEngine` with `enableWebrtc: false`, `enablePersistence: false` and a `MemoryFileAdapter`.
3. Instantiate `YjsVaultRuntime` with the real engine.
4. **Create flow**: Call `runtime.onVaultCreate(file)` for a `.md` file. Assert the engine now has a Yjs doc for that path, and `getNoteContent()` returns the seeded content.
5. **Modify flow**: Seed new content in the adapter, call `runtime.onVaultModify(file)`. Assert the Yjs doc's content updated to match.
6. **Attachment flow**: Repeat create+modify for a `.png` file. Assert `getAttachmentData()` returns the correct binary.
7. **Scope enforcement**: Verify that out-of-scope files are not present in the engine after create/modify calls.
8. **Echo suppression with real docs**: Simulate a remote update (apply an external Y.Doc update to the engine's doc), verify `markRemoteNoteWrite` prevents the next `onVaultModify` from re-applying the content, and that the subsequent modify after that does apply.
9. Keep the existing spy-based tests as a separate "unit" file if desired, but the integration tests should be the gate for Phase 1 confidence.

## Expected Outcome
Tests that prove the full `YjsVaultRuntime → YjsSyncEngine → Yjs Doc → FileAdapter` pipeline works correctly, not just that the runtime calls the right method names.

## Actual Outcome
_Not yet started._

## Lessons Learned
_Not yet started._
---
id: 4df28a4e
title: Runtime integration test with real engine
created_at: 2026-02-06T08:30:00+10:30
updated_at: 2026-02-06T08:30:00+10:30
status: todo
epic_id: fc65689b
phase_id: none
story_id: c26be0e8
assigned_to: unassigned
---

# Runtime integration test with real engine

## Objective
Replace or supplement the `EngineSpy`-based `YjsVaultRuntime` tests with tests that wire the runtime to a real `YjsSyncEngine` (WebRTC/persistence off), proving that vault events flow through to actual Yjs document content — not just that methods were called in the right order.

## Related Story
- [Phase 1 test honesty](story-c26be0e8-phase1-test-honesty.md)

## Steps
1. Create `src/__tests__/vault-runtime-integration.test.ts`.
2. Instantiate a real `YjsSyncEngine` with `enableWebrtc: false`, `enablePersistence: false` and a `MemoryFileAdapter`.
3. Instantiate `YjsVaultRuntime` with the real engine.
4. **Create flow**: Call `runtime.onVaultCreate(file)` for a `.md` file. Assert the engine now has a Yjs doc for that path, and `getNoteContent()` returns the seeded content.
5. **Modify flow**: Seed new content in the adapter, call `runtime.onVaultModify(file)`. Assert the Yjs doc's content updated to match.
6. **Attachment flow**: Repeat create+modify for a `.png` file. Assert `getAttachmentData()` returns the correct binary.
7. **Scope enforcement**: Verify that out-of-scope files are not present in the engine after create/modify calls.
8. **Echo suppression with real docs**: Simulate a remote update (apply an external Y.Doc update to the engine's doc), verify `markRemoteNoteWrite` prevents the next `onVaultModify` from re-applying the content, and that the subsequent modify after that does apply.
9. Keep the existing spy-based tests as a separate "unit" file if desired, but the integration tests should be the gate for Phase 1 confidence.

## Expected Outcome
Tests that prove the full `YjsVaultRuntime → YjsSyncEngine → Yjs Doc → FileAdapter` pipeline works correctly, not just that the runtime calls the right method names.

## Actual Outcome
_Not yet started._

## Lessons Learned
_Not yet started._

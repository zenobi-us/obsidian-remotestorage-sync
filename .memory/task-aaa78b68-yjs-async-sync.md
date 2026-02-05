---
id: aaa78b68
title: Implement Yjs async sync for notes and attachments
created_at: 2026-02-05T21:15:00+10:30
updated_at: 2026-02-05T23:35:32+10:30
status: in-progress
epic_id: fc65689b
phase_id: none
story_id: 193cacc9
assigned_to: session-20260205-203435
---

# Implement Yjs async sync for notes and attachments

## Objective
Wire Yjs (with y-webrtc) to sync selected notes and attachments as separate CRDT objects, honoring scope filters.

## Related Story
- [Async selective sync for vault folders and attachments](story-193cacc9-async-selective-sync.md)

## Steps
1. Model file-to-CRDT mapping for notes and attachments (attachments via binary-friendly CRDT objects with metadata refs).
2. Integrate Yjs document lifecycle with Obsidian file read/write and IndexedDB persistence.
3. Ensure scope filter from settings is applied before publishing changes; excluded items are skipped.
4. Add tests for sync correctness (notes + attachments) including offline/reconnect merge behavior.

## Expected Outcome
Selected notes and attachments sync asynchronously via Yjs with conflict-free merges; excluded content is never transmitted.

## Actual Outcome
Pending.

## Lessons Learned
TBD.

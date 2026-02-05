---
id: 86b9fc95
title: Implement selective vault scope configuration
created_at: 2026-02-05T21:15:00+10:30
updated_at: 2026-02-05T23:07:49+10:30
status: in-progress
epic_id: fc65689b
phase_id: none
story_id: 193cacc9
assigned_to: session-20260205-203435
---

# Implement selective vault scope configuration

## Objective
Allow users to include/exclude specific folders/files for sync and persist the selection, ensuring excluded items never transmit.

## Related Story
- [Async selective sync for vault folders and attachments](story-193cacc9-async-selective-sync.md)

## Steps
1. Design data model for scoped selection (folders/files) and persistence in plugin settings.
2. Build UI control in Obsidian settings to pick included/excluded paths; persist across restarts.
3. Enforce scope filter in sync pipeline so only selected items are exposed to CRDT/doc mapping.
4. Add unit/integration tests covering inclusion/exclusion and persistence.

## Expected Outcome
Scoped selection is configurable, persisted, and enforced; excluded content never leaves the device.

## Actual Outcome
Pending.

## Lessons Learned
TBD.

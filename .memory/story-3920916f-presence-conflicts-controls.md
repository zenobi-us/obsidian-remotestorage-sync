---
id: 3920916f
title: Presence, conflict resolution UI, and manual sync controls
created_at: 2026-02-05T20:34:35+10:30
updated_at: 2026-02-05T20:34:35+10:30
status: todo
epic_id: fc65689b
phase_id: none
priority: high
story_points: 5
---

# Presence, conflict resolution UI, and manual sync controls

## User Story
As a collaborator, I want to see who is connected, resolve conflicts confidently, and trigger sync on demand so that collaboration is transparent and manageable on varying network conditions.

## Acceptance Criteria
- [ ] Presence indicators show connected peers (online/offline) and update when peers join/leave.
- [ ] Manual “Sync Now” control triggers a sync cycle and surfaces progress/errors, useful for large vaults or slow links.
- [ ] Conflict resolution UI presents git-diff-style comparisons for note conflicts and allows user resolution/merge confirmation.
- [ ] Clear error messaging when peers drop or sync fails, with guidance to retry; automatic retry backoff is visible.
- [ ] UI honors selected-folder scope (excluded items are not shown for conflict/presence).

## Context
Async-first workflow needs explicit controls and visibility to build trust, especially when connections are intermittent.

## Out of Scope
- Live cursor sharing/highlighting (stretch goal).
- Telemetry/analytics (future consideration).

## Tasks
- TBD (to be added via task breakdown).

## Notes
- Ensure conflict UI integrates with CRDT merge results and provides user-overridable resolutions when necessary.

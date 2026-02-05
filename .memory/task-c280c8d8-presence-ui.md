---
id: c280c8d8
title: Implement presence indicators UI
created_at: 2026-02-05T21:15:00+10:30
updated_at: 2026-02-05T21:15:00+10:30
status: todo
epic_id: fc65689b
phase_id: none
story_id: 3920916f
assigned_to: session-20260205-203435
---

# Implement presence indicators UI

## Objective
Display connected peers with online/offline state and updates when peers join/leave, respecting scope.

## Related Story
- [Presence, conflict resolution UI, and manual sync controls](story-3920916f-presence-conflicts-controls.md)

## Steps
1. Integrate awareness/state broadcast (via Yjs awareness or equivalent) tied to selected scope.
2. Render presence list in the plugin UI; show join/leave transitions and offline state.
3. Add tests for presence updates and scope filtering (excluded items not shown).

## Expected Outcome
Users can see current peers with accurate status, filtered to scoped content.

## Actual Outcome
Pending.

## Lessons Learned
TBD.

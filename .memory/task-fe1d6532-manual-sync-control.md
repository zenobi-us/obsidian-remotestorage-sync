---
id: fe1d6532
title: Implement manual sync control and progress/error UX
created_at: 2026-02-05T21:15:00+10:30
updated_at: 2026-02-05T21:15:00+10:30
status: todo
epic_id: fc65689b
phase_id: none
story_id: 3920916f
assigned_to: session-20260205-203435
---

# Implement manual sync control and progress/error UX

## Objective
Provide a "Sync Now" control with progress and error visibility, useful for large vaults or slow links.

## Related Story
- [Presence, conflict resolution UI, and manual sync controls](story-3920916f-presence-conflicts-controls.md)

## Steps
1. Add manual trigger that initiates a sync cycle and surfaces status/progress.
2. Surface errors with retry guidance; include automatic retry backoff visibility.
3. Log locally (per scope decision) and add tests for user-triggered sync flows.

## Expected Outcome
Users can trigger sync on demand and see progress/errors clearly.

## Actual Outcome
Pending.

## Lessons Learned
TBD.

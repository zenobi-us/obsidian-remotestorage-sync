---
id: 420b4311
title: Stretch – live co-editing with cursors/highlights
created_at: 2026-02-05T20:34:35+10:30
updated_at: 2026-02-05T20:34:35+10:30
status: proposed
epic_id: fc65689b
phase_id: none
priority: low
story_points: 8
---

# Stretch – live co-editing with cursors/highlights

## User Story
As a collaborator, I want to see others’ cursors/highlights and edit simultaneously so that collaboration feels real-time when networks permit.

## Acceptance Criteria
- [ ] Live cursor/highlight updates visible across peers during active editing.
- [ ] Latency targets defined and tested (TBD) for small team size (3–5 peers) on LAN/STUN.
- [ ] Degrades gracefully to async mode when bandwidth/latency is poor; no data loss or CRDT divergence.
- [ ] Feature can be disabled per vault/session without affecting async sync.

## Context
This is a stretch goal contingent on MVP stability; it should not compromise async robustness.

## Out of Scope
- Mobile support.
- Relay-backed low-latency optimizations.

## Tasks
- TBD (to be added via task breakdown).

## Notes
- Build atop existing CRDT foundations to minimize duplication.

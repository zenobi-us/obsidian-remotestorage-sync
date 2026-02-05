---
id: 193cacc9
title: Async selective sync for vault folders and attachments
created_at: 2026-02-05T20:34:35+10:30
updated_at: 2026-02-05T20:34:35+10:30
status: todo
epic_id: fc65689b
phase_id: none
priority: high
story_points: 8
---

# Async selective sync for vault folders and attachments

## User Story
As a vault owner, I want to choose which folders/files to sync asynchronously so that my team can collaborate on relevant content (including attachments) without exposing the whole vault.

## Acceptance Criteria
- [ ] User can select/include/exclude specific folders/files for sync; selection persists across restarts.
- [ ] Notes sync via CRDT with conflict-free merges when peers reconnect after offline edits.
- [ ] Attachments/binaries sync as separate CRDT objects with metadata references; attachment updates propagate correctly.
- [ ] Initial async sync of up to 100 notes / 50MB completes in under 30 seconds on LAN/STUN conditions.
- [ ] Excluded folders/files are never transmitted to peers and are clearly indicated in settings.

## Context
MVP is async-first (live editing is a stretch). Scope is limited to selected content to reduce complexity and performance risk.

## Out of Scope
- Live collaborative cursors/highlights (stretch goal in separate story).
- Remote relay/turn services (future phase if needed).

## Tasks
- TBD (to be added via task breakdown).

## Notes
- Uses Yjs as the primary CRDT (per research `research-a7b3c9d2`), with Loro as a fallback option if required.

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
- Live collaborative cursors/highlights (stretch goal in separate story `story-420b4311-live-editing-stretch.md`).
- Remote relay/turn services (future phase if needed).

## Tasks
- [Implement selective vault scope configuration](task-86b9fc95-selective-scope-config.md)
- [Implement Yjs async sync for notes and attachments](task-aaa78b68-yjs-async-sync.md)
- [Validate async sync performance targets](task-fea2a6e7-validate-sync-performance.md)

## Notes
- Uses Yjs as the primary CRDT (per research [P2P Browser Sync Libraries](research-a7b3c9d2-p2p-browser-sync-libraries.md)), with Loro as a fallback option if required ([Loro CRDT](research-f2e8b1a4-loro-crdt-library.md)).

## Links
- Epic: [P2P Obsidian Vault Collaboration](epic-fc65689b-p2p-obsidian-collab.md)
- Related research: [P2P Browser Sync Libraries](research-a7b3c9d2-p2p-browser-sync-libraries.md), [Loro CRDT Library](research-f2e8b1a4-loro-crdt-library.md)
- Stretch live editing story: [Live co-editing](story-420b4311-live-editing-stretch.md)

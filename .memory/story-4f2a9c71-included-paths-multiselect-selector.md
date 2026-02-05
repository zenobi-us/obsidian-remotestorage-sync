---
id: 4f2a9c71
title: Included paths use multiselect link/note selector
created_at: 2026-02-06T00:05:00+10:30
updated_at: 2026-02-06T00:05:00+10:30
status: proposed
epic_id: 6f7d2c1a
phase_id: none
priority: medium
story_points: 3
---

# Included paths use multiselect link/note selector

## User Story
As a user configuring selective sync, I want the included paths setting to use a multiselect link/note selector so that I can choose folders/files quickly without path typos.

## Acceptance Criteria
- [ ] Included paths input uses a multiselect selector that lists notes and folders (Obsidian link/note picker experience).
- [ ] Users can search and select multiple entries; selections display as removable chips/pills.
- [ ] Duplicate selections are prevented and invalid paths are rejected with clear feedback.
- [ ] Selected paths are persisted in settings as canonical vault paths and restored on reload.
- [ ] Keyboard-only interaction is supported (search, select, remove).

## Context
Current included-path configuration relies on manual entry, which is error-prone and slows onboarding. A link/note selector aligns with Obsidian’s native UX and improves accuracy.

## Out of Scope
- Changes to sync engine behavior or scope evaluation logic.
- Excluded paths UX (handled by a separate story if needed).
- Advanced tagging or metadata filtering.

## Tasks
- (pending)

## Notes
- Consider reuse of existing Obsidian `Suggest` components or path pickers to keep UI consistent.

## Links
- Epic: [Settings UX Improvements](epic-6f7d2c1a-settings-ux-improvements.md)

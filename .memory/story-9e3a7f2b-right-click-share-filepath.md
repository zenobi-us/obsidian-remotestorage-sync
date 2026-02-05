---
id: 9e3a7f2b
title: Right-click add filepath to shared channel
created_at: 2026-02-06T00:13:52+10:30
updated_at: 2026-02-06T00:13:52+10:30
status: proposed
epic_id: 6f7d2c1a
phase_id: none
priority: medium
story_points: 2
---

# Right-click add filepath to shared channel

## User Story
As a user sharing vault content over a shared channel, I want to right-click a file or folder and add its path to the shared channel so that I can include items quickly without digging through settings.

## Acceptance Criteria
- [ ] File explorer context menu includes an action labeled “Add filepath to shared channel” when selective sharing is enabled.
- [ ] The action works for files and folders and uses canonical vault-relative paths.
- [ ] When triggered, the path is appended to the shared channel include list and reflected immediately in settings UI.
- [ ] Duplicate entries are prevented and the user receives a clear confirmation toast or notice.
- [ ] If the shared channel is not configured, the action prompts the user to configure it (no silent failure).

## Context
Selecting items to share is currently a settings-only workflow, which slows down the flow when users are already browsing the file tree. Adding a right-click action aligns with Obsidian’s context menu UX and reduces friction.

## Out of Scope
- Changing the sync engine or how scope is enforced.
- Bulk multi-select sharing (future enhancement if needed).
- Sharing via command palette shortcuts (separate story).

## Tasks
- (pending)

## Notes
- Consider reusing existing context menu hooks for file explorer entries.
- Ensure permissions are respected when shared channel requires approval.

## Links
- Epic: [Settings UX Improvements](epic-6f7d2c1a-settings-ux-improvements.md)

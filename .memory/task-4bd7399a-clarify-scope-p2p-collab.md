---
id: 4bd7399a
title: Clarify scope for P2P Obsidian collaboration epic
created_at: 2026-02-05T20:34:35+10:30
updated_at: 2026-02-05T20:34:35+10:30
status: completed
epic_id: fc65689b
phase_id: none
story_id: null
assigned_to: session-20260205-203435
---

# Clarify scope for P2P Obsidian collaboration epic

## Objective
Capture user requirements and constraints to finalize the epic definition and plan subsequent phases/stories.

## Related Story
None yet (story definition pending user scope).

## Steps
1. Review existing research on P2P/CRDT options to inform questions.
2. Present scope questions to the user covering collaboration model, data scope, connectivity, security, UX, platform coverage, and performance targets.
3. Record answers in the epic and update success criteria/phases accordingly.
4. Update summary, todo, and team files to reflect the agreed scope and next steps.
5. Close this task once user responses are incorporated.

## Expected Outcome
A scoped epic with documented assumptions, success criteria, and initial phase plan based on user-confirmed requirements.

## Actual Outcome
User confirmed scope: async-first sync with CRDT merges, selected folders/files, attachments as separate CRDT objects, mDNS + WebRTC STUN connectivity, E2E encryption with QR/passphrase exchange and peer approval, presence + conflict diff UI, manual sync control, <30s initial sync for 100 notes/50MB, LAN/air-gapped compatibility.

## Lessons Learned
Front-loading scope questions clarified UX (manual sync, conflict diff), connectivity (mDNS + STUN), and performance targets before story writing.

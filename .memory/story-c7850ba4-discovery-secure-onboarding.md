---
id: c7850ba4
title: Peer discovery and secure onboarding
created_at: 2026-02-05T20:34:35+10:30
updated_at: 2026-02-05T20:34:35+10:30
status: todo
epic_id: fc65689b
phase_id: none
priority: high
story_points: 5
---

# Peer discovery and secure onboarding

## User Story
As a user, I want peers to find each other locally and connect securely with minimal setup so that collaboration works without central servers and remains end-to-end encrypted.

## Acceptance Criteria
- [ ] Local mDNS discovery finds peers on LAN without external services; works in offline/air-gapped networks.
- [ ] WebRTC connections use public STUN for NAT traversal when available, falling back to LAN/direct when offline; no mandatory relays.
- [ ] E2E encryption is enforced for all payloads; no data exchanged until keys are verified.
- [ ] Key exchange flow via QR/passphrase is implemented and tested; exchanging keys results in a trusted session.
- [ ] Peer approval workflow required before syncing any data; declined/unknown peers are blocked.
- [ ] Works on desktop platforms (Win/macOS/Linux/WSL) without extra ports or external services for baseline connectivity.

## Context
Discovery and trust are prerequisites for any data sync. This story ensures connection bootstrapping aligns with the no-central-server requirement.

## Out of Scope
- Relay/turn infrastructure (future phase if required).
- Mobile platform support.

## Tasks
- Pending breakdown task: [Break down MVP stories into tasks](task-95882e57-breakdown-mvp-stories.md).

## Notes
- Keep logging local-only for debugging per scope decisions.

## Links
- Epic: [P2P Obsidian Vault Collaboration](epic-fc65689b-p2p-obsidian-collab.md)
- Related stories: [Async selective sync](story-193cacc9-async-selective-sync.md), [Presence & conflict UI](story-3920916f-presence-conflicts-controls.md)

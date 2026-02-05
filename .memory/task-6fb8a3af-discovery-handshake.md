---
id: 6fb8a3af
title: Implement mDNS + STUN discovery and handshake
created_at: 2026-02-05T21:15:00+10:30
updated_at: 2026-02-05T21:15:00+10:30
status: todo
epic_id: fc65689b
phase_id: none
story_id: c7850ba4
assigned_to: session-20260205-203435
---

# Implement mDNS + STUN discovery and handshake

## Objective
Enable peers to discover each other on LAN via mDNS and connect over WebRTC using public STUN when available, with offline/LAN-only fallback.

## Related Story
- [Peer discovery and secure onboarding](story-c7850ba4-discovery-secure-onboarding.md)

## Steps
1. Implement mDNS-based peer advertisement/discovery service; cache peer endpoints.
2. Integrate WebRTC handshake using public STUN servers; prefer direct LAN when possible.
3. Add fallback path for offline/air-gapped LAN where STUN is unavailable.
4. Add tests to validate discovery/connection flows across LAN/WSL scenarios.

## Expected Outcome
Peers are discoverable on LAN and can establish WebRTC connections with or without internet, honoring offline constraints.

## Actual Outcome
Pending.

## Lessons Learned
TBD.

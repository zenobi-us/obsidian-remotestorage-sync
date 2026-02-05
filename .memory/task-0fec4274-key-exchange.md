---
id: 0fec4274
title: Implement QR/passphrase key exchange and session auth
created_at: 2026-02-05T21:15:00+10:30
updated_at: 2026-02-05T21:15:00+10:30
status: todo
epic_id: fc65689b
phase_id: none
story_id: c7850ba4
assigned_to: session-20260205-203435
---

# Implement QR/passphrase key exchange and session auth

## Objective
Provide user-friendly E2E key exchange via QR/passphrase, establishing trusted sessions before any data sync.

## Related Story
- [Peer discovery and secure onboarding](story-c7850ba4-discovery-secure-onboarding.md)

## Steps
1. Design QR/passphrase flow for exchanging shared secrets; include mobile-to-desktop scanning path.
2. Bind exchanged keys into WebRTC provider configuration and encrypt signaling/data channels.
3. Persist trusted peers/session keys securely; handle key rotation/revocation.
4. Add tests covering successful/failed exchanges and encrypted payload verification.

## Expected Outcome
Peers can establish encrypted sessions only after completing QR/passphrase exchange; data remains E2E encrypted.

## Actual Outcome
Pending.

## Lessons Learned
TBD.

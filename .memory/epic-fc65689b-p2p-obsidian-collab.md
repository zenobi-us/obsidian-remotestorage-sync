---
id: fc65689b
title: P2P Obsidian Vault Collaboration
created_at: 2026-02-05T20:34:35+10:30
updated_at: 2026-02-05T20:34:35+10:30
status: proposed
---

# P2P Obsidian Vault Collaboration

## Vision/Goal
- Deliver an Obsidian plugin that enables realtime and offline-friendly peer-to-peer collaboration on vaults with minimal setup, secure-by-default encryption, and resilient conflict-free editing (CRDT-based).

## Success Criteria
- Zero central server requirement; peers discover/connect via WebRTC or user-provided relay with fallbacks.
- End-to-end encryption of vault data in transit; key exchange workflow defined and testable.
- Conflict-free merges for notes and attachments; offline edits sync correctly on reconnection.
- Usable on desktop (Win/macOS/Linux) with clear error handling and acceptable bundle size for Obsidian.
- Setup path documented and testable in a small team scenario (≥3 peers) with measurable latency/throughput goals after scoping.

## Phases
- Phase 1: Scope confirmation & protocol decisions (pending user input)
- Phase 2: P2P sync core prototype (CRDT + signaling + storage integration)
- Phase 3: Obsidian integration & UX (vault selection, permissions, conflict surfacing)
- Phase 4: Hardening, security review, and alpha distribution
- Phase 5: Beta feedback & polish (analytics/logging boundaries TBD)

## Dependencies
- Candidate CRDT libraries: Yjs (recommended per research `research-a7b3c9d2`), Loro (`research-f2e8b1a4` as alternative).
- Obsidian API compatibility (v1.10.3+), Vite build chain, WebRTC signaling approach (public STUN/TURN?).
- Key management approach (local keys vs user-provided secrets), potential relay infrastructure.

## Open Questions (needs user input)
- Collaboration model: simultaneous live editing vs async sync; max peer count targeted for first release?
- Data scope: entire vault vs selected folders/files; handling of binaries/attachments and large vaults.
- Connectivity: allowed to rely on public STUN/TURN? Need offline LAN-only mode? Any constraints on using third-party relays?
- Security: required encryption level, key distribution UX, access control (who can join/approve peers), audit/logging needs.
- UX expectations: presence indicators, cursors/highlights, conflict UI, manual sync controls, hot reload behavior in vault.
- Platform coverage: desktop only or mobile too? Support for mixed OS peers?
- Performance/reliability targets: acceptable initial sync time for N notes / M MB? Fallback behavior when a peer goes offline.
- Compliance/hosting: any prohibitions on external services or ports? Need to support air-gapped/WSL scenarios?

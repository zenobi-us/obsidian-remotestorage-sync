---
id: fc65689b
title: P2P Obsidian Vault Collaboration
created_at: 2026-02-05T20:34:35+10:30
updated_at: 2026-02-05T20:34:35+10:30
status: planning
---

# P2P Obsidian Vault Collaboration

## Vision/Goal
- Deliver an Obsidian plugin that enables offline-friendly, peer-to-peer collaboration on selected vault content with secure-by-default encryption and resilient conflict-free editing (CRDT-based).

## Success Criteria
- Zero central server requirement; peers discover/connect via local mDNS and WebRTC (public STUN for NAT), with no mandatory external relay.
- End-to-end encryption with user-friendly key exchange (QR/passphrase) and peer approval before data sync.
- Conflict-free merges for notes and attachments; offline edits reconcile on reconnection with clear conflict UI.
- Initial async sync of up to 100 notes / 50MB completes in <30s on LAN/STUN; retries and error messages are clear when peers drop.
- Usable on desktop (Win/macOS/Linux; WSL-compatible) with acceptable bundle size and manual “Sync Now” control for large/slow cases.

## Phases
- Phase 1: Async sync foundations for selected folders/files (CRDT + attachments as separate CRDT objects).
- Phase 2: Discovery & security: mDNS + WebRTC STUN connectivity, E2E key exchange, peer approval gating.
- Phase 3: UX surfaces: presence indicators, conflict resolution diff UI, manual sync controls, error messaging.
- Phase 4: Performance & resilience hardening (retry/offline handling, telemetry boundaries, large vault behavior).
- Phase 5 (stretch): Live co-editing experience (cursors/highlights) if time allows.

## Dependencies
- Candidate CRDT libraries: Yjs (recommended per research `research-a7b3c9d2`), Loro (`research-f2e8b1a4` alternative).
- Obsidian API compatibility (v1.10.3+), Vite build chain, WebRTC signaling (public STUN; optional relay later).
- Key management approach (QR/passphrase exchange), potential relay infrastructure for future phases.

## Scope Decisions (2026-02-05)
- Collaboration: Async sync for MVP; live editing as stretch. Target small teams (3–5) initially.
- Data scope: Selected folders/files only; attachments synced as separate CRDT objects with metadata references.
- Connectivity: Local mDNS discovery + WebRTC with public STUN; relay optional later; LAN-only/offline should work.
- Security: E2E encryption; user-friendly key exchange (QR/passphrase); peer approval workflow; logging limited to local client for debugging.
- UX: Presence indicators; conflict resolution UI (git-diff style); manual “Sync Now” control; clear errors when peers drop.
- Platforms: Desktop focus; mixed OS/WSL supported; mobile not prioritized for MVP.
- Performance & reliability: Initial sync <30s for 100 notes/50MB; automatic retry on reconnection; clear error messages.
- Compliance/hosting: No required external services/ports for baseline; must function in air-gapped/WSL scenarios if WebRTC is available.

---
id: fea2a6e7
title: Validate async sync performance targets
created_at: 2026-02-05T21:15:00+10:30
updated_at: 2026-02-06T08:30:07+10:30
status: in-progress
epic_id: fc65689b
phase_id: none
story_id: 193cacc9
assigned_to: session-20260205-203435
---

# Validate async sync performance targets

## Objective
Measure and tune initial sync to meet <30s for 100 notes/50MB on LAN/STUN, with clear error handling and retries.

## Related Story
- [Async selective sync for vault folders and attachments](story-193cacc9-async-selective-sync.md)

## Steps
1. Create seeded test data (100 notes + 50MB attachments) and a repeatable benchmark harness.
2. Instrument sync pipeline for timing (discovery->connect->sync complete) and error capture.
3. Optimize bottlenecks (batching, chunk sizes, persistence) to hit target; document settings.
4. Document results and update acceptance criteria status in the story.

## Expected Outcome
Evidence that initial async sync meets the target SLA with documented measurements and tuning knobs.

## Actual Outcome
Original fake benchmark harness (sleep-based, no real sync) was deleted as part of task `58dd34a0`. Real performance validation is deferred to Phase 4 (performance/resilience hardening) when the discovery/network stack (Phase 2) is available and actual LAN/STUN multi-peer conditions can be measured. The <30s target for 100 notes/50MB remains the goal but cannot be validated until real WebRTC peers are connected.

## Lessons Learned
- A deterministic, env-gated benchmark in Vitest is useful for regression checks but misleading if it simulates latency with `sleep()`.
- Real performance validation requires the network stack (Phase 2) to be in place first.
- WebRTC benchmarks need a real browser (Playwright) — cannot run in happy-dom/Node.

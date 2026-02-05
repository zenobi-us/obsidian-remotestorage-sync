---
id: fea2a6e7
title: Validate async sync performance targets
created_at: 2026-02-05T21:15:00+10:30
updated_at: 2026-02-05T21:15:00+10:30
status: todo
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
Pending.

## Lessons Learned
TBD.

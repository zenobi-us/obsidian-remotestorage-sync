---
id: c0d3m4p1
title: Codebase Codemap
created_at: 2026-02-04T21:48:00+10:30
updated_at: 2026-02-04T21:48:30+10:30
status: in-progress
area: codebase-structure
tags:
  - architecture
  - state-machine
learned_from:
  - src/main.ts
  - README.md
  - AGENTS.md
  - ARTIFACT_MANAGEMENT.md
  - .github/copilot-instructions.md
---

# Codebase Codemap

## Overview
Expanded state machine showing how documentation guides the single plugin entrypoint and its runtime lifecycle.

## Details
```
[Project Docs]
   |
   v
[Developer Guidance]
   |
   v
[Plugin Entry (src/main.ts)]
   |
   v
[Obsidian Plugin Lifecycle]
   |
   v
[Runtime Ready]

[Memory Store (.memory/*)] ---> [Planning Context]
```

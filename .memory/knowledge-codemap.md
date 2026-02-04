---
id: c0d3m4p1
title: Codebase Codemap
created_at: 2026-02-04T21:48:00+10:30
updated_at: 2026-02-04T21:48:00+10:30
status: in-progress
area: codebase-structure
tags:
  - architecture
  - state-machine
learned_from:
  - src/main.ts
---

# Codebase Codemap

## Overview
High-level state machine of the Obsidian plugin lifecycle based on the current entrypoint.

## Details
```
[Start]
   |
   v
[Plugin Entry (main.ts)]
   |
   v
[Obsidian Plugin Lifecycle]
   |
   v
[Ready]
```

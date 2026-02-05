# Research Thinking & Methodology

- **Topic:** peer to peer npm libraries that allow syncing of data with conflict resolution
- **Storage prefix:** /mnt/Store/Projects/Mine/Github/obsidian-remotestorage-sync/memory/research-20b44480-peer-to-peer-npm-libraries-that-allow-syncing-of-data-with-conflict-resoluition-deep-research
- **Things to avoid:** stick to npm packages; avoid systems that require Docker

## Phase 1 — Topic Scoping
Sub-questions:
1. Which npm packages explicitly support peer-to-peer (P2P) data syncing (e.g., WebRTC, libp2p, or other decentralized transports)?
2. What conflict-resolution model is documented (CRDTs, strong eventual consistency, merge rules)?
3. What dependencies or transport layers are required per library (e.g., IPFS, WebRTC), and are any Docker requirements explicitly stated?

## Phase 2 — Source Collection Plan
Primary sources:
- Official project docs / websites
- GitHub READMEs for each package
- npm registry metadata (package descriptions)

Secondary sources:
- CRDT definition sources (Wikipedia, crdt.tech) for conflict-resolution characteristics

## Phase 3 — Information Collation Plan
Organize findings by library:
- Automerge (@automerge/automerge)
- Yjs + y-webrtc
- GUN
- OrbitDB

## Phase 4 — Verification Strategy
- Aim for 3+ sources per major claim where possible (docs + README + npm registry + independent CRDT definitions).
- If fewer sources are available, document limitations and reduce confidence.

## Phase 5 — Output Structure
Five files in this directory:
- thinking.md
- research.md
- verification.md
- insights.md
- summary.md

## Tool/Process Notes
- Subagent delegation and `skill_find` are not available in this environment; research executed in a single pass with direct source collection.
- Avoided non-npm systems and Docker-specific instructions per request; where dependencies are required (e.g., IPFS), noted explicitly.

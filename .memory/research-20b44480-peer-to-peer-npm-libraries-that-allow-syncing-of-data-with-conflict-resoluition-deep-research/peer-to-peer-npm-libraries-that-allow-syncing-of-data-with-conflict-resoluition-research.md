# Raw Research Findings

> Access date for all sources: **2026-02-04**

## Conflict Resolution Baseline (CRDTs)
- CRDTs automatically resolve inconsistencies in replicated data:
  - Quote: “An algorithm (itself part of the data type) automatically resolves any inconsistencies that might occur.”
  - Source: https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type (Wikipedia)
- CRDTs resolve conflicts automatically and can operate in decentralized/P2P settings:
  - Quote: “CRDTs ensure that… data can always be merged into a consistent state. This merge is performed automatically by the CRDT, without requiring any special conflict resolution code or user intervention… [and] they support decentralised operation… can be used in peer-to-peer networks.”
  - Source: http://crdt.tech/ (CRDT.tech)

## Automerge (@automerge/automerge)
- npm package metadata:
  - Description: “Javascript implementation of automerge, backed by @automerge/automerge-wasm.”
  - Source: https://registry.npmjs.org/@automerge/automerge (npm registry)
- Automatic merge of concurrent changes:
  - Quote: “If the state was changed concurrently on different devices, Automerge automatically merges the changes together cleanly…”
  - Source: http://automerge.org/docs/hello (Automerge docs)
- CRDT-based conflict resolution:
  - Quote: “Automerge is a Conflict-Free Replicated Data Type (CRDT), which allows concurrent changes on different devices to be merged automatically without requiring any central server.”
  - Source: http://automerge.org/docs/hello (Automerge docs)
- P2P transport compatibility (network-agnostic):
  - Quote: “It works with any connection-oriented network protocol, which could be client/server (e.g. WebSocket), peer-to-peer (e.g. WebRTC), or entirely local (e.g. Bluetooth).”
  - Source: http://automerge.org/docs/hello (Automerge docs)

## Yjs + y-webrtc
- npm package metadata:
  - Yjs description: “Shared Editing Library.”
  - Source: https://registry.npmjs.org/yjs (npm registry)
  - y-webrtc description: “WebRTC provider for Yjs.”
  - Source: https://registry.npmjs.org/y-webrtc (npm registry)
- Yjs CRDT and automatic merging:
  - Quote: “Yjs is a high-performance CRDT for building collaborative applications that sync automatically… [shared types] automatically merge without merge conflicts.”
  - Source: https://docs.yjs.dev/ (Yjs docs)
- Peer distribution and conflict-free merging:
  - Quote: “Changes are automatically distributed to other peers and merged without merge conflicts.”
  - Source: https://github.com/yjs/yjs (Yjs README)
- P2P transport (WebRTC provider):
  - Quote: “Propagates document updates peer-to-peer to all users using WebRTC.”
  - Source: https://github.com/yjs/y-webrtc (y-webrtc README)

## GUN (gun)
- npm package metadata:
  - Description: “A realtime, decentralized, offline-first, graph data synchronization engine.”
  - Source: https://registry.npmjs.org/gun (npm registry)
- Distributed P2P sync across peers:
  - Quote: “The universal GUN graph is distributed across all peers participating in the network… synced using WebRTC, Websockets, or other transports.”
  - Source: https://gun.eco/docs/Introduction (GUN docs)
- Conflict resolution guidance:
  - Quote: “When merge conflicts happen, every machine should independently choose the same value (Strong Eventual Consistency).”
  - Source: https://gun.eco/docs/Conflict-Resolution-with-Guns (GUN docs)

## OrbitDB (orbit-db)
- npm package metadata:
  - Description: “Distributed p2p database on IPFS.”
  - Source: https://registry.npmjs.org/orbit-db (npm registry)
- P2P + conflict-free merges (official site):
  - Quote: “OrbitDB is a serverless, distributed, peer-to-peer database. OrbitDB uses IPFS… to automatically sync databases with peers. It’s an eventually consistent database that uses CRDTs for conflict-free database merges…”
  - Source: http://orbitdb.org/ (OrbitDB site)
- P2P + Merkle-CRDTs (GitHub README):
  - Quote: “OrbitDB is a serverless, distributed, peer-to-peer database… uses IPFS… Libp2p Pubsub to automatically sync databases with peers… uses Merkle-CRDTs for conflict-free database writes and merges.”
  - Source: https://github.com/orbitdb/orbitdb (OrbitDB README)

## Docker Avoidance Notes (source-based)
- None of the sources above mention Docker requirements. OrbitDB explicitly requires IPFS/Libp2p for sync, which is a dependency to plan for (not a Docker requirement in the cited docs).

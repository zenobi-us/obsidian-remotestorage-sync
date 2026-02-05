# Insights & Patterns

1. **CRDT-based conflict resolution is the dominant pattern.** Automerge, Yjs, and OrbitDB explicitly describe CRDT-based automatic merging/conflict-free behavior, while GUN documents strong eventual consistency conflict handling. This suggests CRDTs (or equivalent consistency rules) are the primary mechanism for conflict resolution in P2P sync libraries.

2. **P2P sync transport varies by project scope:**
   - **Automerge** is network-agnostic and explicitly mentions P2P protocols such as WebRTC, but the transport is separate from the core data model.
   - **Yjs** uses a dedicated WebRTC provider (`y-webrtc`) for peer-to-peer propagation.
   - **GUN** describes syncing across peers with WebRTC/WebSockets.
   - **OrbitDB** relies on IPFS + libp2p pubsub to sync across peers.

3. **Library scope ranges from data structures to full databases.** Automerge and Yjs are CRDT data-structure libraries; GUN and OrbitDB present themselves as decentralized databases/graph engines with built-in sync. This affects how much infrastructure and storage you need to manage.

4. **Infrastructure dependencies are explicit in docs.** OrbitDB’s docs and README explicitly require IPFS/libp2p pubsub for synchronization, which is an operational dependency to plan for. Automerge and Yjs focus on the data layer and provide transport hooks/providers rather than requiring a specific backend.

5. **Docker avoidance appears feasible for all listed options.** None of the cited sources state a Docker requirement. The main non-Docker dependency called out explicitly is IPFS/libp2p for OrbitDB; the others are pure JS/npm libraries with transport adapters.

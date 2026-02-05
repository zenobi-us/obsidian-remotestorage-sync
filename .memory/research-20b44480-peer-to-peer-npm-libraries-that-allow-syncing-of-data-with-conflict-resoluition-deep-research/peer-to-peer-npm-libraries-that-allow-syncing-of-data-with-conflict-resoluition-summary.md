# Executive Summary

This research identifies npm packages that support peer-to-peer data sync with documented conflict resolution, prioritizing CRDT-based systems and avoiding Docker requirements.

## Shortlist (with confidence)
- **Yjs + y-webrtc (MEDIUM confidence):** Yjs is a CRDT that “automatically merge[s] without merge conflicts,” and `y-webrtc` is explicitly a WebRTC peer-to-peer provider. Strong fit for P2P collaboration in browser/Node contexts.
- **GUN (MEDIUM confidence):** Described as a decentralized, offline-first graph sync engine. Docs explicitly state it syncs across peers using WebRTC/WebSockets and provides conflict-resolution guidance for strong eventual consistency.
- **OrbitDB (MEDIUM confidence):** Official docs and README state it is a serverless P2P database that uses IPFS/libp2p pubsub for sync and CRDTs/Merkle-CRDTs for conflict-free merges. It does introduce IPFS/libp2p as operational dependencies.
- **Automerge (MEDIUM/LOW confidence for P2P transport):** Automerge is a CRDT that automatically merges concurrent changes and is explicitly network-agnostic (mentions P2P/WebRTC). The P2P transport layer is separate from the core library, so you must supply or integrate a transport.

## Key Takeaways
- **CRDTs are the main conflict-resolution strategy** for P2P sync in npm libraries.
- **Transport layer varies**: WebRTC (Yjs, GUN), IPFS/libp2p (OrbitDB), or user-supplied transport (Automerge).
- **No Docker requirements are stated** in the cited sources, though OrbitDB explicitly requires IPFS/libp2p for synchronization.

## Caveats
- Some claims (especially Automerge P2P transport) are supported by a single primary source; confidence is lower where independent confirmation is limited.

# TODO

- [x] [Implement selective vault scope configuration](task-86b9fc95-selective-scope-config.md) (story: 193cacc9)
- [x] [Implement Yjs async sync for notes and attachments](task-aaa78b68-yjs-async-sync.md) (story: 193cacc9)
- [ ] [Validate async sync performance targets](task-fea2a6e7-validate-sync-performance.md) (story: 193cacc9)

### Phase 1 Test Honesty (story: c26be0e8) — ✅ ALL COMPLETE
- [x] [Two-peer WebRTC sync test](task-2a1e106e-two-peer-webrtc-sync-test.md) — skipped in happy-dom (no RTCPeerConnection); test ready for browser runner
- [x] [IndexedDB persistence round-trip test](task-86eb4316-indexeddb-persistence-test.md) — ✅ passing; found & fixed persistence ordering bug in engine
- [x] [Runtime integration test with real engine](task-4df28a4e-runtime-integration-real-engine.md) — ✅ 4/4 passing
- [x] [Rewrite or remove fake benchmark](task-58dd34a0-rewrite-remove-fake-benchmark.md) — ✅ Option B: deleted fake benchmark; real perf validation deferred to Phase 4

### Phase 2: Discovery & Security
- [ ] [Implement mDNS + STUN discovery and handshake](task-6fb8a3af-discovery-handshake.md) (story: c7850ba4)
- [ ] [Implement QR/passphrase key exchange and session auth](task-0fec4274-key-exchange.md) (story: c7850ba4)
- [ ] [Implement peer approval workflow and gating](task-ecbd5622-peer-approval.md) (story: c7850ba4)
- [ ] [Implement presence indicators UI](task-c280c8d8-presence-ui.md) (story: 3920916f)
- [ ] [Implement manual sync control and progress/error UX](task-fe1d6532-manual-sync-control.md) (story: 3920916f)
- [ ] [Implement conflict resolution diff UI](task-816c62f7-conflict-diff-ui.md) (story: 3920916f)

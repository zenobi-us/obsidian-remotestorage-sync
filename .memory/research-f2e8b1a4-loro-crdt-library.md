---
id: f2e8b1a4
title: Loro CRDT Library Deep Dive
created_at: 2026-02-05T20:50:00+10:30
updated_at: 2026-02-05T21:04:00+10:30
status: archived
epic_id: null
phase_id: null
related_task_id: null
---

# Loro CRDT Library Deep Dive

## Research Questions

1. What is Loro and how does it compare to other CRDT libraries (Yjs, Automerge)?
2. What are Loro's key architectural features and innovations?
3. What data types and synchronization mechanisms does Loro provide?
4. What are Loro's performance characteristics?
5. Is Loro suitable for an Obsidian P2P sync plugin?

## Summary

> Archived: Yjs chosen for the plugin; Loro retained here for reference and comparison only.

**Loro** is a high-performance CRDT library implemented in **Rust with WebAssembly bindings** for JavaScript/TypeScript. It's designed for building local-first collaborative applications with advanced features like rich text editing, movable trees, time travel, and version control.

**Key Findings:**
- **Bundle size**: ~399KB gzipped (WASM) - significantly larger than Yjs (20KB)
- **Performance**: Competitive with Yjs, ~10-30% slower on some benchmarks but offers more features
- **Unique features**: Rich text CRDT, movable tree/list, version control, time travel, shallow snapshots
- **Network-agnostic**: No built-in P2P - requires separate networking layer
- **Best for**: Applications needing advanced CRDT features, version control, or complex data structures

**Confidence Level**: HIGH (Primary source: official Loro documentation llms-full.txt)

---

## Core Architecture

### Technology Stack
| Component | Details |
|-----------|---------|
| **Core Language** | Rust |
| **JS Bindings** | WebAssembly (WASM) |
| **Bundle Size** | ~1,052KB uncompressed, **~399KB gzipped** |
| **Encoding Format** | Stable since v1.0 (no breaking changes) |

### Container Types (CRDTs)

Loro provides 6 container types:

| Container | Description | CRDT Algorithm |
|-----------|-------------|----------------|
| **LoroText** | Rich text with marks/annotations | Fugue + Peritext-like |
| **LoroList** | Ordered sequences | Fugue |
| **LoroMovableList** | Lists with set/move operations | [Moving Elements in List CRDTs](https://martin.kleppmann.com/2020/04/27/papoc-list-move.html) |
| **LoroMap** | Key-value pairs | Last-Write-Wins (LWW) |
| **LoroTree** | Hierarchical tree structures | [Movable Tree CRDT](https://ieeexplore.ieee.org/document/9563274) |
| **LoroCounter** | Increment/decrement counters | G-Counter variant |

### Unique Innovations

#### 1. Event Graph Walker (Eg-Walker)
Loro is inspired by the revolutionary **Eg-Walker algorithm** which:
- Uses simple indices instead of complex CRDT metadata
- Replays relevant history when merging concurrent changes
- Enables safe garbage collection of old operations

```
Traditional CRDT:
  insert({ char: 'a', leftId: 'op-123', timestamp: 1234, siteId: 'user-1' })

With Eg-Walker-inspired approach:
  insert({ char: 'a', index: 5 })  // Simple index!
```

#### 2. Rich Text CRDT
Native support for rich text with:
- Configurable mark expansion behavior (`before`, `after`, `both`, `none`)
- Quill Delta format compatibility
- ProseMirror and CodeMirror bindings

#### 3. Movable Tree CRDT
Solves the challenging problem of concurrent tree moves:
- Prevents cycles in concurrent move operations
- Maintains tree integrity across peers

---

## API Overview

### Document Creation
```typescript
import { LoroDoc, LoroText, LoroMap, LoroList } from "loro-crdt";

const doc = new LoroDoc();
doc.setPeerId("1");  // Optional: set specific peer ID

// Get/create root containers
const text = doc.getText("content");
const map = doc.getMap("metadata");
const list = doc.getList("items");
```

### Data Types (LoroValue)
```typescript
type LoroValue =
  | null
  | boolean
  | number
  | string
  | Uint8Array       // Binary data
  | LoroValue[]      // Arrays (nested)
  | { [key: string]: LoroValue };
```

### Synchronization
```typescript
// Export methods
const snapshot = doc.export({ mode: "snapshot" });
const updates = doc.export({ mode: "update", from: versionVector });
const shallowSnapshot = doc.export({ 
  mode: "shallow-snapshot", 
  frontiers: doc.frontiers() 
});

// Import (any format)
doc.import(bytes);
doc.importBatch([update1, update2, snapshot]);
```

### Time Travel
```typescript
// Get version
const frontiers = doc.frontiers();

// Checkout to specific version
doc.checkout(frontiers);

// Return to latest
doc.attach();
```

---

## Performance Benchmarks

From [dmonad/crdt-benchmarks](https://github.com/dmonad/crdt-benchmarks) (N=6000):

| Benchmark | Yjs | Loro | Automerge |
|-----------|-----|------|-----------|
| **Bundle (gzipped)** | 20KB | 399KB | 604KB |
| **Append N chars** | 188ms | 120ms | 365ms |
| **Avg update size** | 27 bytes | 109 bytes | 121 bytes |
| **Encode time** | 1ms | 1ms | 7ms |
| **Doc size** | 6,031 bytes | 6,162 bytes | 3,992 bytes |
| **Parse time** | 32ms | 26ms | 80ms |

**Loro v1.6.0 Snapshot Performance (from changelog):**
| Mode | Time |
|------|------|
| Import | 201.934µs |
| Import+GetAllValues | 370.108µs |
| Import+GetAllValues+Edit | 386.497µs |
| Import+GetAllValues+Edit+Export | 2.362ms |

---

## Key Features for P2P Sync

### Network-Agnostic Design
Loro is **network-agnostic** - it doesn't include networking:
- Pure data structure library
- Synchronization via export/import APIs
- Works with WebSocket, WebRTC, HTTP, even email/USB

**Important**: Unlike Yjs (which has y-webrtc), Loro requires you to build or integrate your own networking layer.

### Ephemeral Store (Presence/Awareness)
```typescript
import { EphemeralStore } from "loro-crdt";

const store = new EphemeralStore();
store.set("cursor", { x: 100, y: 200, user: "Alice" });
store.set("selection", { start: 0, end: 5 });

// Encode for transmission
const encoded = store.encode("cursor");

// Subscribe to changes
store.subscribe((event) => {
  // Handle local, import, or timeout events
});
```

### Version Vectors and Frontiers
```typescript
// Version Vector - for sync diffs
const vv = doc.version();
const updates = otherDoc.export({ mode: "update", from: vv });

// Frontiers - compact version representation
const frontiers = doc.frontiers();
doc.checkout(frontiers);  // Time travel

// Convert between them
const frontiersFromVV = doc.vvToFrontiers(vv);
const vvFromFrontiers = doc.frontiersToVV(frontiers);
```

### Shallow Snapshots (History Trimming)
Remove old history for privacy/storage:
```typescript
const shallow = doc.export({
  mode: "shallow-snapshot",
  frontiers: doc.frontiers()
});
// History before frontiers is removed
```

---

## Comparison: Loro vs Yjs vs Automerge

| Feature | Loro | Yjs | Automerge |
|---------|------|-----|-----------|
| **Bundle Size** | 399KB | 20KB ⭐ | 604KB |
| **Implementation** | Rust/WASM | JavaScript | Rust/WASM |
| **Rich Text CRDT** | ✅ Native | ❌ External | ✅ Native |
| **Movable Tree** | ✅ | ❌ | ✅ Inventor |
| **Movable List** | ✅ | ❌ | ✅ Inventor |
| **Time Travel** | ✅ Full | ✅ Limited | ✅ Full |
| **Version Control** | ✅ | ❌ | ✅ |
| **Event Graph Walker** | ✅ Inspired | ❌ | ❌ |
| **Built-in P2P** | ❌ | ✅ (y-webrtc) | ❌ |
| **Public Signaling** | ❌ | ✅ | ❌ |
| **Shallow Snapshots** | ✅ | ❌ | ❌ |

---

## Editor Integrations

### ProseMirror (loro-prosemirror)
```typescript
import { LoroSyncPlugin, LoroUndoPlugin, LoroCursorPlugin } from "loro-prosemirror";

const plugins = [
  LoroSyncPlugin({ doc }),
  LoroUndoPlugin({ doc }),
  LoroCursorPlugin(awareness, {}),
];
```

### CodeMirror 6 (loro-codemirror)
```typescript
import { LoroExtensions } from "loro-codemirror";

const extensions = [
  LoroExtensions(doc, { awareness, user: { name: "Bob" } }, undoManager)
];
```

---

## Undo/Redo System

Loro provides a sophisticated UndoManager for collaborative editing:

```typescript
import { UndoManager, LoroDoc } from "loro-crdt";

const undoManager = new UndoManager(doc, {
  maxUndoSteps: 100,
  mergeInterval: 1000,  // ms to merge actions
  excludeOriginPrefixes: ["sys:"],  // Exclude system operations
  onPush: (isUndo, range, event) => {
    return { value: null, cursors: [] };
  },
  onPop: (isUndo, value, counterRange) => {
    // Restore cursors
  }
});

undoManager.undo();
undoManager.redo();
```

**Key feature**: Local undo/redo - only undoes YOUR operations, not collaborators'.

---

## Suitability for Obsidian P2P Plugin

### Pros
1. **Rich data types** - Good for complex vault structures
2. **Time travel** - Version control for notes
3. **Shallow snapshots** - Privacy via history trimming
4. **Stable format** - v1.0 encoding won't break
5. **TypeScript support** - Good type definitions

### Cons
1. **Large bundle** - 399KB is significant for an Obsidian plugin
2. **No built-in P2P** - Must integrate separate WebRTC library (like Trystero)
3. **No public signaling** - Unlike y-webrtc, no zero-config setup
4. **WASM complexity** - Potential loading/compatibility issues
5. **Less mature ecosystem** - Fewer integrations than Yjs

### Recommendation
**For this Obsidian plugin, Yjs + y-webrtc remains the better choice** because:
- 20x smaller bundle size
- Built-in WebRTC with public signaling servers
- Proven in production (Evernote, GitBook)
- Simpler setup for P2P scenarios

**Consider Loro when:**
- You need advanced version control features
- Rich text CRDT is essential
- Tree structures with moves are required
- Bundle size is not a constraint

---

## References

### Primary Source
| Source | URL | Type | Access Date |
|--------|-----|------|-------------|
| Loro LLM Documentation | https://loro.dev/llms-full.txt | Official | 2026-02-05 |

### Secondary Sources
| Source | URL | Type | Access Date |
|--------|-----|------|-------------|
| CRDT Benchmarks | https://github.com/dmonad/crdt-benchmarks | Academic | 2026-02-05 |
| CRDT.tech | https://crdt.tech/implementations | Academic | 2026-02-05 |
| Loro GitHub | https://github.com/loro-dev/loro | Official | 2026-02-05 |

### Academic Papers Referenced
1. [Eg-Walker: Collaborative Text Editing](https://arxiv.org/abs/2409.14252) - Joseph Gentle, Martin Kleppmann
2. [Moving Elements in List CRDTs](https://martin.kleppmann.com/2020/04/27/papoc-list-move.html) - Martin Kleppmann
3. [Fugue Algorithm](https://arxiv.org/abs/2305.00583) - Maximal non-interleaving
4. [Movable Tree CRDT](https://ieeexplore.ieee.org/document/9563274) - IEEE

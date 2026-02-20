import { describe, expect, it } from 'vitest';
import * as Y from 'yjs';
import {
  YjsSyncEngine,
  createAttachmentDoc,
  createNoteDoc,
  readAttachmentData,
  readNoteContent,
} from '../yjs-sync-engine';
import type { SyncFileAdapter } from '../vault-file-adapter';

class MemoryFileAdapter implements SyncFileAdapter {
  private readonly textFiles = new Map<string, string>();
  private readonly binaryFiles = new Map<string, Uint8Array>();

  public async readText(path: string): Promise<string | null> {
    return this.textFiles.get(path) ?? null;
  }

  public async writeText(path: string, content: string): Promise<void> {
    this.textFiles.set(path, content);
  }

  public async readBinary(path: string): Promise<Uint8Array | null> {
    return this.binaryFiles.get(path) ?? null;
  }

  public async writeBinary(path: string, data: Uint8Array): Promise<void> {
    this.binaryFiles.set(path, data);
  }

  public seedText(path: string, content: string): void {
    this.textFiles.set(path, content);
  }

  public seedBinary(path: string, data: Uint8Array): void {
    this.binaryFiles.set(path, data);
  }
}

describe('Yjs sync helpers', () => {
  it('merges note updates across docs', () => {
    const docA = createNoteDoc('Notes/alpha.md', 'Hello');
    const docB = createNoteDoc('Notes/alpha.md', '');

    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));
    docB.getText('content').insert(5, ' world');

    Y.applyUpdate(docA, Y.encodeStateAsUpdate(docB));

    expect(readNoteContent(docA)).toBe('Hello world');
  });

  it('replicates attachment data via updates', () => {
    const data = new Uint8Array([1, 2, 3]);
    const docA = createAttachmentDoc('Assets/icon.png', data, 'image/png');
    const docB = new Y.Doc();

    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));

    expect(readAttachmentData(docB)).toEqual(data);
  });
});

describe('YjsSyncEngine', () => {
  it('respects scope filters for local updates', () => {
    const adapter = new MemoryFileAdapter();
    const engine = new YjsSyncEngine({
      roomName: 'vault',
      isPathAllowed: (path) => path.startsWith('Notes/'),
      fileAdapter: adapter,
      enableWebrtc: false,
      enablePersistence: false,
    });

    expect(engine.applyLocalNoteChange('Notes/allowed.md', 'Hello')).toBe(true);
    expect(engine.applyLocalNoteChange('Secrets/hidden.md', 'Nope')).toBe(false);
    expect(engine.getNoteContent('Notes/allowed.md')).toBe('Hello');
    expect(engine.getNoteContent('Secrets/hidden.md')).toBeNull();

    engine.destroy();
  });

  it('writes back remote updates to adapter', async () => {
    const adapter = new MemoryFileAdapter();
    adapter.seedText('Notes/remote.md', 'Start');

    const engine = new YjsSyncEngine({
      roomName: 'vault',
      isPathAllowed: () => true,
      fileAdapter: adapter,
      enableWebrtc: false,
      enablePersistence: false,
    });

    await engine.startNoteSync('Notes/remote.md');
    const doc = engine.getDoc('Notes/remote.md');
    expect(doc).not.toBeNull();

    const remoteDoc = new Y.Doc();
    if (doc) {
      Y.applyUpdate(remoteDoc, Y.encodeStateAsUpdate(doc));
      const remoteText = remoteDoc.getText('content');
      remoteText.delete(0, remoteText.length);
      remoteText.insert(0, 'Remote');
      Y.applyUpdate(doc, Y.encodeStateAsUpdate(remoteDoc));
    }

    const content = await adapter.readText('Notes/remote.md');
    expect(content).toBe('Remote');

    engine.destroy();
  });
});

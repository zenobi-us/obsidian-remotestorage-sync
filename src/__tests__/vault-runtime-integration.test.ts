import { describe, expect, it } from 'vitest';
import { TFile } from 'obsidian';
import * as Y from 'yjs';
import type { SyncFileAdapter } from '../vault-file-adapter';
import { YjsSyncEngine } from '../yjs-sync-engine';
import { YjsVaultRuntime } from '../yjs-vault-runtime';

const createFile = (path: string): TFile => {
  const file = new TFile();
  const extension = path.includes('.') ? path.split('.').pop()?.toLowerCase() ?? '' : '';

  Object.defineProperty(file, 'path', {
    configurable: true,
    enumerable: true,
    value: path,
    writable: true,
  });

  Object.defineProperty(file, 'extension', {
    configurable: true,
    enumerable: true,
    value: extension,
    writable: true,
  });

  return file;
};

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

describe('YjsVaultRuntime + YjsSyncEngine integration', () => {
  it('runs create and modify flows for notes with the real sync engine', async () => {
    const adapter = new MemoryFileAdapter();
    const engine = new YjsSyncEngine({
      roomName: 'vault-runtime-integration',
      isPathAllowed: () => true,
      fileAdapter: adapter,
      enableWebrtc: false,
      enablePersistence: false,
    });

    const runtime = new YjsVaultRuntime({
      syncEngine: engine,
      fileAdapter: adapter,
      isPathAllowed: () => true,
    });

    const path = 'Notes/integration.md';
    adapter.seedText(path, 'Seeded note content');

    await runtime.onVaultCreate(createFile(path));
    expect(engine.getNoteContent(path)).toBe('Seeded note content');

    adapter.seedText(path, 'Modified note content');
    await runtime.onVaultModify(createFile(path));
    expect(engine.getNoteContent(path)).toBe('Modified note content');

    engine.destroy();
  });

  it('runs create and modify flows for attachments with the real sync engine', async () => {
    const adapter = new MemoryFileAdapter();
    const engine = new YjsSyncEngine({
      roomName: 'vault-runtime-integration',
      isPathAllowed: () => true,
      fileAdapter: adapter,
      enableWebrtc: false,
      enablePersistence: false,
    });

    const runtime = new YjsVaultRuntime({
      syncEngine: engine,
      fileAdapter: adapter,
      isPathAllowed: () => true,
    });

    const path = 'Assets/photo.png';
    const initial = new Uint8Array([1, 2, 3]);
    const updated = new Uint8Array([4, 5, 6]);

    adapter.seedBinary(path, initial);
    await runtime.onVaultCreate(createFile(path));
    expect(engine.getAttachmentData(path)).toEqual(initial);

    adapter.seedBinary(path, updated);
    await runtime.onVaultModify(createFile(path));
    expect(engine.getAttachmentData(path)).toEqual(updated);

    engine.destroy();
  });

  it('enforces scope filters and does not create docs for out-of-scope paths', async () => {
    const adapter = new MemoryFileAdapter();
    const engine = new YjsSyncEngine({
      roomName: 'vault-runtime-integration',
      isPathAllowed: (path) => path.startsWith('Shared/'),
      fileAdapter: adapter,
      enableWebrtc: false,
      enablePersistence: false,
    });

    const runtime = new YjsVaultRuntime({
      syncEngine: engine,
      fileAdapter: adapter,
      isPathAllowed: (path) => path.startsWith('Shared/'),
    });

    const blockedPath = 'Private/hidden.md';
    adapter.seedText(blockedPath, 'Should not sync');

    await runtime.onVaultCreate(createFile(blockedPath));
    await runtime.onVaultModify(createFile(blockedPath));

    expect(engine.getDoc(blockedPath)).toBeNull();

    engine.destroy();
  });

  it('suppresses a single echo cycle after remote note writes', async () => {
    const adapter = new MemoryFileAdapter();
    const engine = new YjsSyncEngine({
      roomName: 'vault-runtime-integration',
      isPathAllowed: () => true,
      fileAdapter: adapter,
      enableWebrtc: false,
      enablePersistence: false,
    });

    const runtime = new YjsVaultRuntime({
      syncEngine: engine,
      fileAdapter: adapter,
      isPathAllowed: () => true,
    });

    const path = 'Notes/echo.md';
    adapter.seedText(path, 'Initial');
    await runtime.onVaultCreate(createFile(path));

    const localDoc = engine.getDoc(path);
    expect(localDoc).not.toBeNull();

    const remoteDoc = new Y.Doc();
    if (localDoc) {
      Y.applyUpdate(remoteDoc, Y.encodeStateAsUpdate(localDoc));
      const remoteText = remoteDoc.getText('content');
      remoteText.delete(0, remoteText.length);
      remoteText.insert(0, 'Remote update');
      Y.applyUpdate(localDoc, Y.encodeStateAsUpdate(remoteDoc));
    }

    expect(engine.getNoteContent(path)).toBe('Remote update');

    adapter.seedText(path, 'Local unsynced change');
    runtime.markRemoteNoteWrite(path);
    await runtime.onVaultModify(createFile(path));

    expect(engine.getNoteContent(path)).toBe('Remote update');

    await runtime.onVaultModify(createFile(path));
    expect(engine.getNoteContent(path)).toBe('Local unsynced change');

    engine.destroy();
  });
});

import 'fake-indexeddb/auto';

import { afterEach, describe, expect, it } from 'vitest';
import { normalizeVaultPath } from '../scope';
import { YjsSyncEngine } from '../yjs-sync-engine';
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

const ROOT_ROOM_NAME = 'indexeddb-persistence-integration';
const trackedDbNames = new Set<string>();
const trackedEngines: YjsSyncEngine[] = [];

const toRoomName = (root: string, path: string): string => {
  const normalizedPath = normalizeVaultPath(path);
  return `${root}:${encodeURIComponent(normalizedPath)}`;
};

const trackDatabaseForPath = (path: string): void => {
  trackedDbNames.add(toRoomName(ROOT_ROOM_NAME, path));
};

const trackEngine = (engine: YjsSyncEngine): YjsSyncEngine => {
  trackedEngines.push(engine);
  return engine;
};

const deleteDatabase = async (databaseName: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(databaseName);
    request.onsuccess = () => resolve();
    request.onerror = () => {
      reject(request.error ?? new Error(`Failed to delete IndexedDB database: ${databaseName}`));
    };
    request.onblocked = () => resolve();
  });
};

afterEach(async () => {
  trackedEngines.forEach((engine) => {
    engine.destroy();
  });
  trackedEngines.length = 0;

  await Promise.all(Array.from(trackedDbNames).map((databaseName) => deleteDatabase(databaseName)));
  trackedDbNames.clear();
});

describe('YjsSyncEngine IndexedDB persistence', () => {
  it('restores note content from IndexedDB after engine recreation', async () => {
    const path = 'Notes/persistent-note.md';
    trackDatabaseForPath(path);

    const firstAdapter = new MemoryFileAdapter();
    firstAdapter.seedText(path, 'Persistent note');

    const firstEngine = trackEngine(
      new YjsSyncEngine({
        roomName: ROOT_ROOM_NAME,
        isPathAllowed: () => true,
        fileAdapter: firstAdapter,
        enableWebrtc: false,
        enablePersistence: true,
      }),
    );

    expect(await firstEngine.startNoteSync(path)).toBe(true);
    expect(firstEngine.applyLocalNoteChange(path, 'Persistent note — updated')).toBe(true);

    firstEngine.destroy();

    const secondAdapter = new MemoryFileAdapter();
    secondAdapter.seedText(path, 'Stale seed');

    const secondEngine = trackEngine(
      new YjsSyncEngine({
        roomName: ROOT_ROOM_NAME,
        isPathAllowed: () => true,
        fileAdapter: secondAdapter,
        enableWebrtc: false,
        enablePersistence: true,
      }),
    );

    expect(await secondEngine.startNoteSync(path)).toBe(true);
    expect(secondEngine.getNoteContent(path)).toBe('Persistent note — updated');
  });

  it('restores attachment data from IndexedDB after engine recreation', async () => {
    const path = 'Assets/persistent.bin';
    trackDatabaseForPath(path);

    const originalData = new Uint8Array([1, 2, 3, 4]);
    const updatedData = new Uint8Array([9, 8, 7, 6]);
    const staleData = new Uint8Array([0, 0, 0, 0]);

    const firstAdapter = new MemoryFileAdapter();
    firstAdapter.seedBinary(path, originalData);

    const firstEngine = trackEngine(
      new YjsSyncEngine({
        roomName: ROOT_ROOM_NAME,
        isPathAllowed: () => true,
        fileAdapter: firstAdapter,
        enableWebrtc: false,
        enablePersistence: true,
      }),
    );

    expect(await firstEngine.startAttachmentSync(path, 'application/octet-stream')).toBe(true);
    expect(
      firstEngine.applyLocalAttachmentChange(path, updatedData, 'application/octet-stream'),
    ).toBe(true);

    firstEngine.destroy();

    const secondAdapter = new MemoryFileAdapter();
    secondAdapter.seedBinary(path, staleData);

    const secondEngine = trackEngine(
      new YjsSyncEngine({
        roomName: ROOT_ROOM_NAME,
        isPathAllowed: () => true,
        fileAdapter: secondAdapter,
        enableWebrtc: false,
        enablePersistence: true,
      }),
    );

    expect(await secondEngine.startAttachmentSync(path, 'application/octet-stream')).toBe(true);
    expect(secondEngine.getAttachmentData(path)).toEqual(updatedData);
  });
});

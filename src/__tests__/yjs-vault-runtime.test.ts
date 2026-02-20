import { describe, expect, it } from 'vitest';
import { TFile } from 'obsidian';
import type { SyncFileAdapter } from '../vault-file-adapter';
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

class EngineSpy {
  public readonly startedNotes: string[] = [];
  public readonly startedAttachments: Array<{ path: string; mimeType?: string }> = [];
  public readonly localNotes: Array<{ path: string; content: string }> = [];
  public readonly localAttachments: Array<{ path: string; data: Uint8Array; mimeType?: string }> = [];
  private readonly docs = new Set<string>();

  public async startNoteSync(path: string): Promise<boolean> {
    this.startedNotes.push(path);
    this.docs.add(path);
    return true;
  }

  public async startAttachmentSync(path: string, mimeType?: string): Promise<boolean> {
    if (mimeType) {
      this.startedAttachments.push({ path, mimeType });
    } else {
      this.startedAttachments.push({ path });
    }

    this.docs.add(path);
    return true;
  }

  public applyLocalNoteChange(path: string, content: string): boolean {
    this.localNotes.push({ path, content });
    return true;
  }

  public applyLocalAttachmentChange(path: string, data: Uint8Array, mimeType?: string): boolean {
    if (mimeType) {
      this.localAttachments.push({ path, data, mimeType });
    } else {
      this.localAttachments.push({ path, data });
    }

    return true;
  }

  public getDoc(path: string): object | null {
    return this.docs.has(path) ? {} : null;
  }

  public seedDoc(path: string): void {
    this.docs.add(path);
  }
}

describe('YjsVaultRuntime', () => {
  it('auto-enrolls notes and attachments on create', async () => {
    const adapter = new MemoryFileAdapter();
    const engine = new EngineSpy();
    const runtime = new YjsVaultRuntime({
      syncEngine: engine,
      fileAdapter: adapter,
      isPathAllowed: () => true,
    });

    await runtime.onVaultCreate(createFile('Notes/new-note.md'));
    await runtime.onVaultCreate(createFile('Assets/image.png'));

    expect(engine.startedNotes).toEqual(['Notes/new-note.md']);
    expect(engine.startedAttachments).toEqual([{ path: 'Assets/image.png', mimeType: 'image/png' }]);
  });

  it('auto-enrolls on first modify and applies local updates afterward', async () => {
    const adapter = new MemoryFileAdapter();
    const engine = new EngineSpy();
    const runtime = new YjsVaultRuntime({
      syncEngine: engine,
      fileAdapter: adapter,
      isPathAllowed: () => true,
    });

    const noteFile = createFile('Notes/active.md');
    adapter.seedText('Notes/active.md', 'First');

    await runtime.onVaultModify(noteFile);
    expect(engine.startedNotes).toEqual(['Notes/active.md']);
    expect(engine.localNotes).toEqual([]);

    adapter.seedText('Notes/active.md', 'Second');
    await runtime.onVaultModify(noteFile);
    expect(engine.localNotes).toEqual([{ path: 'Notes/active.md', content: 'Second' }]);

    const binaryFile = createFile('Assets/icon.png');
    const firstBinary = new Uint8Array([1, 2]);
    const secondBinary = new Uint8Array([3, 4]);
    adapter.seedBinary('Assets/icon.png', firstBinary);

    await runtime.onVaultModify(binaryFile);
    expect(engine.startedAttachments).toEqual([{ path: 'Assets/icon.png', mimeType: 'image/png' }]);
    expect(engine.localAttachments).toEqual([]);

    adapter.seedBinary('Assets/icon.png', secondBinary);
    await runtime.onVaultModify(binaryFile);
    expect(engine.localAttachments).toEqual([
      { path: 'Assets/icon.png', data: secondBinary, mimeType: 'image/png' },
    ]);
  });

  it('honors scope filters and ignores out-of-scope files', async () => {
    const adapter = new MemoryFileAdapter();
    const engine = new EngineSpy();
    const runtime = new YjsVaultRuntime({
      syncEngine: engine,
      fileAdapter: adapter,
      isPathAllowed: (path) => path.startsWith('Shared/'),
    });

    adapter.seedText('Private/ignore.md', 'No');
    await runtime.onVaultCreate(createFile('Private/ignore.md'));
    await runtime.onVaultModify(createFile('Private/ignore.md'));

    expect(engine.startedNotes).toEqual([]);
    expect(engine.localNotes).toEqual([]);
  });

  it('suppresses echo updates after remote writes', async () => {
    const adapter = new MemoryFileAdapter();
    const engine = new EngineSpy();
    engine.seedDoc('Notes/remote.md');

    const runtime = new YjsVaultRuntime({
      syncEngine: engine,
      fileAdapter: adapter,
      isPathAllowed: () => true,
    });

    adapter.seedText('Notes/remote.md', 'Remote content');
    runtime.markRemoteNoteWrite('Notes/remote.md');

    await runtime.onVaultModify(createFile('Notes/remote.md'));
    expect(engine.localNotes).toEqual([]);

    await runtime.onVaultModify(createFile('Notes/remote.md'));
    expect(engine.localNotes).toEqual([{ path: 'Notes/remote.md', content: 'Remote content' }]);
  });
});

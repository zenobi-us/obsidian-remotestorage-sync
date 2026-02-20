import { TAbstractFile, TFile } from 'obsidian';
import { normalizeVaultPath } from './scope';
import type { SyncFileAdapter } from './vault-file-adapter';

const MARKDOWN_EXTENSION = 'md';

interface RuntimeSyncEngine {
  startNoteSync(path: string): Promise<boolean>;
  startAttachmentSync(path: string, mimeType?: string): Promise<boolean>;
  applyLocalNoteChange(path: string, content: string): boolean;
  applyLocalAttachmentChange(path: string, data: Uint8Array, mimeType?: string): boolean;
  getDoc(path: string): unknown | null;
}

interface YjsVaultRuntimeOptions {
  syncEngine: RuntimeSyncEngine;
  fileAdapter: SyncFileAdapter;
  isPathAllowed: (path: string) => boolean;
}

const ATTACHMENT_MIME_BY_EXTENSION: Record<string, string> = {
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

const normalizeRuntimePath = (path: string): string => normalizeVaultPath(path);

export class YjsVaultRuntime {
  private readonly syncEngine: RuntimeSyncEngine;
  private readonly fileAdapter: SyncFileAdapter;
  private readonly isPathAllowed: (path: string) => boolean;
  private readonly remoteNoteWrites = new Set<string>();
  private readonly remoteAttachmentWrites = new Set<string>();

  public constructor(options: YjsVaultRuntimeOptions) {
    this.syncEngine = options.syncEngine;
    this.fileAdapter = options.fileAdapter;
    this.isPathAllowed = options.isPathAllowed;
  }

  public markRemoteNoteWrite(path: string): void {
    this.remoteNoteWrites.add(normalizeRuntimePath(path));
  }

  public markRemoteAttachmentWrite(path: string): void {
    this.remoteAttachmentWrites.add(normalizeRuntimePath(path));
  }

  public async onVaultCreate(file: TAbstractFile): Promise<void> {
    const syncFile = this.toSyncFile(file);
    if (!syncFile) {
      return;
    }

    const path = normalizeRuntimePath(syncFile.path);
    if (!this.isPathAllowed(path)) {
      return;
    }

    if (this.isMarkdownNote(syncFile)) {
      await this.syncEngine.startNoteSync(path);
      return;
    }

    await this.syncEngine.startAttachmentSync(path, this.getAttachmentMimeType(syncFile));
  }

  public async onVaultModify(file: TAbstractFile): Promise<void> {
    const syncFile = this.toSyncFile(file);
    if (!syncFile) {
      return;
    }

    const path = normalizeRuntimePath(syncFile.path);
    if (!this.isPathAllowed(path)) {
      return;
    }

    if (this.isMarkdownNote(syncFile)) {
      if (this.consumeRemoteWrite(this.remoteNoteWrites, path)) {
        return;
      }

      const hasDoc = this.syncEngine.getDoc(path) !== null;
      if (!hasDoc) {
        await this.syncEngine.startNoteSync(path);
        return;
      }

      const content = await this.fileAdapter.readText(path);
      if (content === null) {
        return;
      }

      this.syncEngine.applyLocalNoteChange(path, content);
      return;
    }

    if (this.consumeRemoteWrite(this.remoteAttachmentWrites, path)) {
      return;
    }

    const hasDoc = this.syncEngine.getDoc(path) !== null;
    if (!hasDoc) {
      await this.syncEngine.startAttachmentSync(path, this.getAttachmentMimeType(syncFile));
      return;
    }

    const data = await this.fileAdapter.readBinary(path);
    if (!data) {
      return;
    }

    this.syncEngine.applyLocalAttachmentChange(path, data, this.getAttachmentMimeType(syncFile));
  }

  private toSyncFile(file: TAbstractFile): TFile | null {
    if (!(file instanceof TFile)) {
      return null;
    }

    return file;
  }

  private isMarkdownNote(file: TFile): boolean {
    return file.extension.toLowerCase() === MARKDOWN_EXTENSION;
  }

  private getAttachmentMimeType(file: TFile): string | undefined {
    return ATTACHMENT_MIME_BY_EXTENSION[file.extension.toLowerCase()];
  }

  private consumeRemoteWrite(paths: Set<string>, path: string): boolean {
    if (!paths.has(path)) {
      return false;
    }

    paths.delete(path);
    return true;
  }
}

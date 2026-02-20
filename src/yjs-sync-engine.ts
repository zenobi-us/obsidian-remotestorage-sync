import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import * as Y from 'yjs';
import { normalizeVaultPath } from './scope';
import type { SyncFileAdapter } from './vault-file-adapter';

const LOCAL_ORIGIN = Symbol('local-origin');
const NOTE_TEXT_KEY = 'content';
const META_KEY = 'meta';
const ATTACHMENT_KEY = 'attachment';

type SyncItemType = 'note' | 'attachment';

type AttachmentMapValue = Uint8Array | string;

type UpdateHandler = (path: string) => Promise<void>;

interface SyncEngineOptions {
  roomName: string;
  isPathAllowed: (path: string) => boolean;
  fileAdapter: SyncFileAdapter;
  enableWebrtc?: boolean;
  enablePersistence?: boolean;
  onNoteUpdate?: UpdateHandler;
  onAttachmentUpdate?: UpdateHandler;
}

interface DocEntry {
  doc: Y.Doc;
  provider?: WebrtcProvider;
  persistence?: IndexeddbPersistence;
}

export const createNoteDoc = (path: string, content: string): Y.Doc => {
  const doc = new Y.Doc();
  const text = doc.getText(NOTE_TEXT_KEY);
  if (content.length > 0) {
    text.insert(0, content);
  }

  const meta = doc.getMap<string>(META_KEY);
  meta.set('path', normalizeVaultPath(path));
  meta.set('type', 'note');

  return doc;
};

const createEmptyNoteDoc = (path: string): Y.Doc => {
  const doc = new Y.Doc();
  doc.getText(NOTE_TEXT_KEY);

  const meta = doc.getMap<string>(META_KEY);
  meta.set('path', normalizeVaultPath(path));
  meta.set('type', 'note');

  return doc;
};

const createEmptyAttachmentDoc = (path: string, mimeType?: string): Y.Doc => {
  const doc = new Y.Doc();
  const meta = doc.getMap<string>(META_KEY);
  meta.set('path', normalizeVaultPath(path));
  meta.set('type', 'attachment');

  const attachment = doc.getMap<AttachmentMapValue>(ATTACHMENT_KEY);
  if (mimeType) {
    attachment.set('mimeType', mimeType);
  }

  return doc;
};

export const createAttachmentDoc = (
  path: string,
  data: Uint8Array,
  mimeType?: string,
): Y.Doc => {
  const doc = new Y.Doc();
  const meta = doc.getMap<string>(META_KEY);
  meta.set('path', normalizeVaultPath(path));
  meta.set('type', 'attachment');

  const attachment = doc.getMap<AttachmentMapValue>(ATTACHMENT_KEY);
  attachment.set('data', data);
  if (mimeType) {
    attachment.set('mimeType', mimeType);
  }

  return doc;
};

export const readNoteContent = (doc: Y.Doc): string => {
  return doc.getText(NOTE_TEXT_KEY).toString();
};

export const readAttachmentData = (doc: Y.Doc): Uint8Array | null => {
  const attachment = doc.getMap<AttachmentMapValue>(ATTACHMENT_KEY);
  const data = attachment.get('data');
  if (data instanceof Uint8Array) {
    return data;
  }

  return null;
};

const getDocType = (doc: Y.Doc): SyncItemType | null => {
  const meta = doc.getMap<string>(META_KEY);
  const type = meta.get('type');
  if (type === 'note' || type === 'attachment') {
    return type;
  }

  return null;
};

const toRoomName = (root: string, path: string): string => {
  const normalized = normalizeVaultPath(path);
  return `${root}:${encodeURIComponent(normalized)}`;
};

const canUseIndexedDb = (): boolean => typeof indexedDB !== 'undefined';

export class YjsSyncEngine {
  private readonly options: SyncEngineOptions;
  private readonly docs = new Map<string, DocEntry>();

  public constructor(options: SyncEngineOptions) {
    this.options = options;
  }

  public async startNoteSync(path: string): Promise<boolean> {
    if (!this.options.isPathAllowed(path)) {
      return false;
    }

    const normalized = normalizeVaultPath(path);
    const existing = this.docs.get(normalized);
    if (existing) {
      return true;
    }

    const content = await this.options.fileAdapter.readText(path);
    if (content === null) {
      return false;
    }

    const doc = createEmptyNoteDoc(normalized);
    this.docs.set(normalized, { doc });
    this.attachDoc(normalized, doc);
    await this.attachPersistence(normalized, doc);

    // Only populate from file adapter if persistence didn't restore content
    if (readNoteContent(doc).length === 0 && content.length > 0) {
      doc.getText(NOTE_TEXT_KEY).insert(0, content);
    }

    this.attachProvider(normalized, doc);

    return true;
  }

  public async startAttachmentSync(path: string, mimeType?: string): Promise<boolean> {
    if (!this.options.isPathAllowed(path)) {
      return false;
    }

    const normalized = normalizeVaultPath(path);
    const existing = this.docs.get(normalized);
    if (existing) {
      return true;
    }

    const data = await this.options.fileAdapter.readBinary(path);
    if (!data) {
      return false;
    }

    const doc = createEmptyAttachmentDoc(normalized, mimeType);
    this.docs.set(normalized, { doc });
    this.attachDoc(normalized, doc);
    await this.attachPersistence(normalized, doc);

    // Only populate from file adapter if persistence didn't restore data
    if (readAttachmentData(doc) === null) {
      const attachment = doc.getMap<AttachmentMapValue>(ATTACHMENT_KEY);
      attachment.set('data', data);
    }

    this.attachProvider(normalized, doc);

    return true;
  }

  public applyLocalNoteChange(path: string, content: string): boolean {
    if (!this.options.isPathAllowed(path)) {
      return false;
    }

    const normalized = normalizeVaultPath(path);
    const entry = this.ensureDoc(normalized, () => createNoteDoc(normalized, ''));
    entry.doc.transact(() => {
      const text = entry.doc.getText(NOTE_TEXT_KEY);
      text.delete(0, text.length);
      if (content.length > 0) {
        text.insert(0, content);
      }
    }, LOCAL_ORIGIN);

    return true;
  }

  public applyLocalAttachmentChange(path: string, data: Uint8Array, mimeType?: string): boolean {
    if (!this.options.isPathAllowed(path)) {
      return false;
    }

    const normalized = normalizeVaultPath(path);
    const entry = this.ensureDoc(normalized, () => createAttachmentDoc(normalized, data, mimeType));
    entry.doc.transact(() => {
      const attachment = entry.doc.getMap<AttachmentMapValue>(ATTACHMENT_KEY);
      attachment.set('data', data);
      if (mimeType) {
        attachment.set('mimeType', mimeType);
      }
    }, LOCAL_ORIGIN);

    return true;
  }

  public getNoteContent(path: string): string | null {
    const normalized = normalizeVaultPath(path);
    const entry = this.docs.get(normalized);
    if (!entry) {
      return null;
    }

    if (getDocType(entry.doc) !== 'note') {
      return null;
    }

    return readNoteContent(entry.doc);
  }

  public getAttachmentData(path: string): Uint8Array | null {
    const normalized = normalizeVaultPath(path);
    const entry = this.docs.get(normalized);
    if (!entry) {
      return null;
    }

    if (getDocType(entry.doc) !== 'attachment') {
      return null;
    }

    return readAttachmentData(entry.doc);
  }

  public getDoc(path: string): Y.Doc | null {
    const normalized = normalizeVaultPath(path);
    return this.docs.get(normalized)?.doc ?? null;
  }

  public destroy(): void {
    this.docs.forEach((entry) => {
      entry.provider?.destroy();
      entry.persistence?.destroy();
      entry.doc.destroy();
    });
    this.docs.clear();
  }

  private ensureDoc(path: string, createDoc: () => Y.Doc): DocEntry {
    const existing = this.docs.get(path);
    if (existing) {
      return existing;
    }

    const doc = createDoc();
    const entry: DocEntry = { doc };
    this.docs.set(path, entry);
    this.attachDoc(path, doc);

    return entry;
  }

  private attachDoc(path: string, doc: Y.Doc): void {
    doc.on('update', async (_update: Uint8Array, origin: unknown) => {
      if (origin === LOCAL_ORIGIN) {
        return;
      }

      const docType = getDocType(doc);
      if (docType === 'note') {
        await this.options.fileAdapter.writeText(path, readNoteContent(doc));
        await this.options.onNoteUpdate?.(path);
      }

      if (docType === 'attachment') {
        const data = readAttachmentData(doc);
        if (data) {
          await this.options.fileAdapter.writeBinary(path, data);
          await this.options.onAttachmentUpdate?.(path);
        }
      }
    });
  }

  private async attachPersistence(path: string, doc: Y.Doc): Promise<void> {
    if (!this.options.enablePersistence || !canUseIndexedDb()) {
      return;
    }

    const roomName = toRoomName(this.options.roomName, path);
    const persistence = new IndexeddbPersistence(roomName, doc);
    await persistence.whenSynced;

    const entry = this.docs.get(path);
    if (entry) {
      entry.persistence = persistence;
    }
  }

  private attachProvider(path: string, doc: Y.Doc): void {
    if (!this.options.enableWebrtc) {
      return;
    }

    const roomName = toRoomName(this.options.roomName, path);
    const provider = new WebrtcProvider(roomName, doc);

    const entry = this.docs.get(path);
    if (entry) {
      entry.provider = provider;
    }
  }
}

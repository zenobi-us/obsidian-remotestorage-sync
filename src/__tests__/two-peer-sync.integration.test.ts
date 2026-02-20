import { describe, expect, it } from 'vitest';
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

const waitFor = async (
  predicate: () => boolean,
  timeoutMs = 15_000,
  pollMs = 50,
): Promise<void> => {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start >= timeoutMs) {
      throw new Error(`Timed out after ${timeoutMs}ms waiting for condition`);
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, pollMs);
    });
  }
};

const hasWebRtcRuntime = typeof globalThis.RTCPeerConnection !== 'undefined';

describe.skipIf(!hasWebRtcRuntime)(
  'two-peer y-webrtc integration',
  () => {
    it(
      'syncs notes and attachments between two YjsSyncEngine peers',
      async () => {
        const roomName = `two-peer-sync-${Date.now()}`;
        const notePath = 'Notes/two-peer.md';
        const attachmentPath = 'Assets/two-peer.bin';

        const adapterA = new MemoryFileAdapter();
        const adapterB = new MemoryFileAdapter();

        adapterA.seedText(notePath, 'Hello from peer A');
        adapterB.seedText(notePath, '');

        const initialAttachment = new Uint8Array([1, 2, 3, 4]);
        adapterA.seedBinary(attachmentPath, initialAttachment);
        adapterB.seedBinary(attachmentPath, new Uint8Array());

        const engineA = new YjsSyncEngine({
          roomName,
          isPathAllowed: () => true,
          fileAdapter: adapterA,
          enableWebrtc: true,
          enablePersistence: false,
        });

        const engineB = new YjsSyncEngine({
          roomName,
          isPathAllowed: () => true,
          fileAdapter: adapterB,
          enableWebrtc: true,
          enablePersistence: false,
        });

        try {
          expect(await engineA.startNoteSync(notePath)).toBe(true);
          expect(await engineB.startNoteSync(notePath)).toBe(true);

          await waitFor(() => engineB.getNoteContent(notePath) === 'Hello from peer A');
          expect(await adapterB.readText(notePath)).toBe('Hello from peer A');

          expect(engineB.applyLocalNoteChange(notePath, 'Peer B changed the note')).toBe(true);
          await waitFor(() => engineA.getNoteContent(notePath) === 'Peer B changed the note');
          expect(await adapterA.readText(notePath)).toBe('Peer B changed the note');

          expect(await engineA.startAttachmentSync(attachmentPath, 'application/octet-stream')).toBe(true);
          expect(await engineB.startAttachmentSync(attachmentPath, 'application/octet-stream')).toBe(true);

          await waitFor(() => {
            const data = engineB.getAttachmentData(attachmentPath);
            return data !== null && data.length === initialAttachment.length && data.every((value, index) => value === initialAttachment[index]);
          });
          expect(await adapterB.readBinary(attachmentPath)).toEqual(initialAttachment);

          const updatedAttachment = new Uint8Array([9, 8, 7]);
          expect(engineB.applyLocalAttachmentChange(attachmentPath, updatedAttachment, 'application/octet-stream')).toBe(true);

          await waitFor(() => {
            const data = engineA.getAttachmentData(attachmentPath);
            return data !== null && data.length === updatedAttachment.length && data.every((value, index) => value === updatedAttachment[index]);
          });
          expect(await adapterA.readBinary(attachmentPath)).toEqual(updatedAttachment);
        } finally {
          engineA.destroy();
          engineB.destroy();
        }
      },
      30_000,
    );
  },
);

describe.skipIf(hasWebRtcRuntime)('two-peer y-webrtc integration runtime note', () => {
  it('is skipped when WebRTC runtime is unavailable in happy-dom', () => {
    // y-webrtc requires a real WebRTC implementation (RTCPeerConnection + data channels).
    // In this test environment (happy-dom on Node), RTCPeerConnection is usually undefined,
    // so we intentionally skip the integration test above instead of mocking transport.
    expect(hasWebRtcRuntime).toBe(false);
  });
});

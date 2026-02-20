import { App, TFile } from 'obsidian';

export interface SyncFileAdapter {
  readText(path: string): Promise<string | null>;
  writeText(path: string, content: string): Promise<void>;
  readBinary(path: string): Promise<Uint8Array | null>;
  writeBinary(path: string, data: Uint8Array): Promise<void>;
}

export class VaultFileAdapter implements SyncFileAdapter {
  private readonly app: App;

  public constructor(app: App) {
    this.app = app;
  }

  public async readText(path: string): Promise<string | null> {
    const file = this.getFile(path);
    if (!file) {
      return null;
    }

    return this.app.vault.read(file);
  }

  public async writeText(path: string, content: string): Promise<void> {
    const file = this.getFile(path);
    if (!file) {
      return;
    }

    await this.app.vault.modify(file, content);
  }

  public async readBinary(path: string): Promise<Uint8Array | null> {
    const file = this.getFile(path);
    if (!file) {
      return null;
    }

    const content = await this.app.vault.readBinary(file);
    return new Uint8Array(content);
  }

  public async writeBinary(path: string, data: Uint8Array): Promise<void> {
    const file = this.getFile(path);
    if (!file) {
      return;
    }

    await this.app.vault.modifyBinary(file, data);
  }

  private getFile(path: string): TFile | null {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      return null;
    }

    return file;
  }
}

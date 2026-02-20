import { App, Plugin, PluginSettingTab, Setting, TAbstractFile } from 'obsidian';
import { DEFAULT_SETTINGS, type RemoteStorageSyncSettings } from './settings';
import { isPathInScope, normalizeVaultPath } from './scope';
import { VaultFileAdapter } from './vault-file-adapter';
import { YjsSyncEngine } from './yjs-sync-engine';
import { YjsVaultRuntime } from './yjs-vault-runtime';

class RemoteStorageSyncSettingTab extends PluginSettingTab {
  private readonly plugin: RemoteStorageSyncPlugin;

  public constructor(app: App, plugin: RemoteStorageSyncPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  public display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Remote Storage Sync - Scope' });

    new Setting(containerEl)
      .setName('Included paths')
      .setDesc('One path per line. If empty, all paths are included unless excluded.')
      .addTextArea((text) => {
        text.setPlaceholder('Projects/Work\nNotes/Shared');
        text.setValue(this.plugin.settings.includePaths.join('\n'));
        text.onChange(async (value) => {
          this.plugin.settings.includePaths = value
            .split('\n')
            .map((line) => normalizeVaultPath(line))
            .filter((line) => line.length > 0);
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Excluded paths')
      .setDesc('One path per line. Excluded paths always win over included paths.')
      .addTextArea((text) => {
        text.setPlaceholder('Trash\nTemplates');
        text.setValue(this.plugin.settings.excludePaths.join('\n'));
        text.onChange(async (value) => {
          this.plugin.settings.excludePaths = value
            .split('\n')
            .map((line) => normalizeVaultPath(line))
            .filter((line) => line.length > 0);
          await this.plugin.saveSettings();
        });
      });
  }
}

export default class RemoteStorageSyncPlugin extends Plugin {
  public settings: RemoteStorageSyncSettings = { ...DEFAULT_SETTINGS };
  private syncEngine: YjsSyncEngine | null = null;
  private syncRuntime: YjsVaultRuntime | null = null;

  public async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new RemoteStorageSyncSettingTab(this.app, this));

    const fileAdapter = new VaultFileAdapter(this.app);
    this.syncEngine = new YjsSyncEngine({
      roomName: this.app.vault.getName(),
      isPathAllowed: (path) => this.isPathAllowed(path),
      fileAdapter,
      enableWebrtc: true,
      enablePersistence: true,
      onNoteUpdate: (path) => {
        this.syncRuntime?.markRemoteNoteWrite(path);
        return Promise.resolve();
      },
      onAttachmentUpdate: (path) => {
        this.syncRuntime?.markRemoteAttachmentWrite(path);
        return Promise.resolve();
      },
    });

    this.syncRuntime = new YjsVaultRuntime({
      syncEngine: this.syncEngine,
      fileAdapter,
      isPathAllowed: (path) => this.isPathAllowed(path),
    });

    this.registerEvent(
      this.app.vault.on('create', (file: TAbstractFile) => {
        void this.syncRuntime?.onVaultCreate(file);
      }),
    );

    this.registerEvent(
      this.app.vault.on('modify', (file: TAbstractFile) => {
        void this.syncRuntime?.onVaultModify(file);
      }),
    );
  }

  public isPathAllowed(path: string): boolean {
    return isPathInScope(path, this.settings);
  }

  public async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as Partial<RemoteStorageSyncSettings> | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(data ?? {}),
    };
  }

  public async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  public onunload(): void {
    this.syncEngine?.destroy();
    this.syncEngine = null;
    this.syncRuntime = null;
  }
}

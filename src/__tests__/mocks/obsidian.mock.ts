type EventName = 'create' | 'modify';

type EventCallback = (file: TAbstractFile) => void;

export const normalizePath = (path: string): string => {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/');
};

export class TAbstractFile {
  public path: string;

  public constructor(path: string) {
    this.path = path;
  }
}

export class TFile extends TAbstractFile {
  public extension: string;

  public constructor(path = '') {
    super(path);
    const segments = path.split('/');
    const name = segments[segments.length - 1] ?? '';
    const parts = name.split('.');
    this.extension = parts.length > 1 ? (parts[parts.length - 1] ?? '').toLowerCase() : '';
  }
}

export interface EventRef {
  off: () => void;
}

export class Vault {
  private readonly callbacks = new Map<EventName, Set<EventCallback>>();

  public constructor() {
    this.callbacks.set('create', new Set<EventCallback>());
    this.callbacks.set('modify', new Set<EventCallback>());
  }

  public getName(): string {
    return 'TestVault';
  }

  public on(eventName: EventName, callback: EventCallback): EventRef {
    const callbacks = this.callbacks.get(eventName);
    callbacks?.add(callback);

    return {
      off: () => {
        callbacks?.delete(callback);
      },
    };
  }

  public emit(eventName: EventName, file: TAbstractFile): void {
    const callbacks = this.callbacks.get(eventName);
    callbacks?.forEach((callback) => {
      callback(file);
    });
  }

  public async read(_file: TFile): Promise<string> {
    return '';
  }

  public async modify(_file: TFile, _content: string): Promise<void> {
    return;
  }

  public async readBinary(_file: TFile): Promise<Uint8Array> {
    return new Uint8Array();
  }

  public async modifyBinary(_file: TFile, _data: Uint8Array): Promise<void> {
    return;
  }

  public getAbstractFileByPath(path: string): TAbstractFile | null {
    return new TFile(path);
  }
}

export class App {
  public vault: Vault;

  public constructor() {
    this.vault = new Vault();
  }
}

export class Plugin {
  protected readonly app: App;

  public constructor(app: App) {
    this.app = app;
  }

  public addSettingTab(_settingTab: PluginSettingTab): void {
    return;
  }

  public registerEvent(_eventRef: EventRef): void {
    return;
  }

  public async loadData(): Promise<unknown> {
    return null;
  }

  public async saveData(_data: unknown): Promise<void> {
    return;
  }
}

export class PluginSettingTab {
  public readonly containerEl: {
    empty: () => void;
    createEl: (_name: string, _options?: { text?: string }) => void;
  };

  public constructor(_app: App, _plugin: Plugin) {
    this.containerEl = {
      empty: () => {
        return;
      },
      createEl: () => {
        return;
      },
    };
  }
}

export class Setting {
  public constructor(_containerEl: unknown) {
    return;
  }

  public setName(_name: string): Setting {
    return this;
  }

  public setDesc(_desc: string): Setting {
    return this;
  }

  public addTextArea(callback: (text: {
    setPlaceholder: (_value: string) => void;
    setValue: (_value: string) => void;
    onChange: (_handler: (value: string) => void | Promise<void>) => void;
  }) => void): Setting {
    callback({
      setPlaceholder: () => {
        return;
      },
      setValue: () => {
        return;
      },
      onChange: () => {
        return;
      },
    });

    return this;
  }
}

export interface RemoteStorageSyncSettings {
  includePaths: string[];
  excludePaths: string[];
}

export const DEFAULT_SETTINGS: RemoteStorageSyncSettings = {
  includePaths: [],
  excludePaths: [],
};

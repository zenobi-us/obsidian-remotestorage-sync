# Remote Storage Sync

Sync your Obsidian vault with remote storage services like Nextcloud, S3, or other WebDAV-compatible providers.


## Features

- **Remote storage integration** - Seamlessly sync your vault with cloud storage providers
- **Selective sync** - Choose which folders to sync
- **Conflict resolution** - Intelligent handling of conflicting changes

## Installation

For now, use BRATS to install the plugin:

1. Go to **Settings** → **Community plugins** → **BRAT**
2. Find and click **Add beta plugin**
3. Paste the plugin repo URL: `https://github.com/Zenobius/obsidian-remotestorage-sync`
4. Click **Add plugin**

### Enable the Plugin

1. Go to **Settings** → **Community plugins** → **Installed plugins**
2. Search for **Remote Storage Sync** and enable it
3. Configuration occurs in the Base view


### Developer Installation

For development, use mise tasks which auto-builds and installs:

```bash
mise run dev
```

This will:

1. Install dependencies (cached with bkt)
2. Configure Obsidian vault path (if first time)
3. Symlink plugin to vault
4. Watch for source changes
5. Auto-rebuild on every change

Then reload Obsidian (Win + P > Reload app) to see changes.

## Usage

1. steps to use the plugin


## Contributing

For bug reports or feature requests:

1. Test with the current code
2. Note console errors
3. Document steps to reproduce
4. Describe expected vs actual behavior

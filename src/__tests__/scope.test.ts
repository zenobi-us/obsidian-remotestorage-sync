import { describe, expect, it } from 'vitest';
import { isPathInScope } from '../scope';
import type { RemoteStorageSyncSettings } from '../settings';

describe('isPathInScope', () => {
  it('includes all paths when include list is empty', () => {
    const settings: RemoteStorageSyncSettings = {
      includePaths: [],
      excludePaths: [],
    };

    expect(isPathInScope('Projects/Work/note.md', settings)).toBe(true);
  });

  it('limits paths when include list is provided', () => {
    const settings: RemoteStorageSyncSettings = {
      includePaths: ['Projects/Work'],
      excludePaths: [],
    };

    expect(isPathInScope('Projects/Work/note.md', settings)).toBe(true);
    expect(isPathInScope('Projects/Other/note.md', settings)).toBe(false);
  });

  it('excludes paths when exclude list matches', () => {
    const settings: RemoteStorageSyncSettings = {
      includePaths: ['Projects'],
      excludePaths: ['Projects/Secret'],
    };

    expect(isPathInScope('Projects/Secret/note.md', settings)).toBe(false);
    expect(isPathInScope('Projects/Public/note.md', settings)).toBe(true);
  });

  it('treats exact path matches as scoped', () => {
    const settings: RemoteStorageSyncSettings = {
      includePaths: ['Templates'],
      excludePaths: [],
    };

    expect(isPathInScope('Templates', settings)).toBe(true);
  });
});

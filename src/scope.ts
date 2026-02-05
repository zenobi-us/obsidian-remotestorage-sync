import { normalizePath } from 'obsidian';
import type { RemoteStorageSyncSettings } from './settings';

const matchesPrefix = (target: string, prefix: string): boolean => {
  if (target === prefix) {
    return true;
  }

  return target.startsWith(`${prefix}/`);
};

export const normalizeVaultPath = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return '';
  }

  const normalized = normalizePath(trimmed);
  return normalized.replace(/^\/+/, '').replace(/\/+$/, '');
};

const normalizePathList = (paths: string[]): string[] =>
  paths
    .map((path) => normalizeVaultPath(path))
    .filter((path) => path.length > 0);

export const isPathInScope = (
  path: string,
  settings: RemoteStorageSyncSettings,
): boolean => {
  const target = normalizeVaultPath(path);
  const includePaths = normalizePathList(settings.includePaths);
  const excludePaths = normalizePathList(settings.excludePaths);

  const isIncluded =
    includePaths.length === 0 || includePaths.some((prefix) => matchesPrefix(target, prefix));
  const isExcluded = excludePaths.some((prefix) => matchesPrefix(target, prefix));

  return isIncluded && !isExcluded;
};

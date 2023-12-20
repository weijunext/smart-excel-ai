import fs, { Dirent } from 'fs';
import { MetadataRoute } from 'next';
import path from 'path';

export function getFoldersRecursive(filePath: string): string[] {
  const folders: string[] = [];

  function shouldIgnoreFolder(folderName: string): boolean {
    const ignoredPrefixes = ['[', '(', '_', '-', 'api'];
    return ignoredPrefixes.some((prefix) => folderName.startsWith(prefix));
  }

  function traverse(currentPath: string): void {
    const files = fs.readdirSync(currentPath, { withFileTypes: true });

    files.forEach((file: Dirent) => {
      if (file.isDirectory()) {
        const folderName = file.name;
        if (!shouldIgnoreFolder(folderName)) {
          folders.push(folderName);
          traverse(path.join(currentPath, folderName));
        }
      }
    });
  }

  traverse(filePath);
  return folders;
}

// Usage example
const targetPath = '/app';
const folderNames = getFoldersRecursive(targetPath);


export default function sitemap(): MetadataRoute.Sitemap {
  return folderNames as unknown as MetadataRoute.Sitemap;
}
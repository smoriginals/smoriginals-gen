import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export function makeFixture(structureName = 'folderplus-') {
  return mkdtempSync(join(tmpdir(), structureName));
}

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function write(path, content = '') {
  writeFileSync(path, content, 'utf8');
}

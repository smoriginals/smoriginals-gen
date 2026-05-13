import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

test('dist version() should match package.json version', async () => {
  const mod = await import(join(root, 'dist', 'index.mjs'));
  assert.equal(mod.version(), `v${pkg.version}`);
});

test('source version() should not be hardcoded to a semver literal', () => {
  const source = readFileSync(join(root, 'src', 'index.ts'), 'utf8');
  assert.equal(/v\d+\.\d+\.\d+/.test(source), false);
});

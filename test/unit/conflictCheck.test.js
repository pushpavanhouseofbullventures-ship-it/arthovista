import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function findConflictMarkers(dir, extFilter = ['.js', '.jsx', '.json', '.html', '.css', '.mjs']) {
  const violations = [];
  const startMarker = '<'.repeat(7);
  const endMarker = '>'.repeat(7);

  function scan(currentDir) {
    const entries = readdirSync(currentDir);
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry === 'test') continue;
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (extFilter.some(ext => entry.endsWith(ext))) {
        const content = readFileSync(fullPath, 'utf-8');
        if (content.includes(startMarker) || content.includes(endMarker)) {
          violations.push(fullPath);
        }
      }
    }
  }

  scan(dir);
  return violations;
}

describe('Git Conflict Marker Regression Test', () => {
  test('no merge conflict markers exist in codebase', () => {
    const violations = findConflictMarkers(process.cwd());
    assert.deepEqual(violations, [], `Found merge conflict markers in files: ${violations.join(', ')}`);
  });
});

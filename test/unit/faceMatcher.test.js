import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { calculateEuclideanDistance, verifyFace } = require('../../server/utils/faceMatcher.js');

describe('Face Matcher Unit Tests', () => {
  test('calculateEuclideanDistance returns 0 for identical vectors', () => {
    const vecA = [0.1, 0.5, 0.9, -0.3];
    const vecB = [0.1, 0.5, 0.9, -0.3];
    const dist = calculateEuclideanDistance(vecA, vecB);
    assert.equal(dist, 0);
  });

  test('calculateEuclideanDistance throws if vectors have different dimensions', () => {
    const vecA = [0.1, 0.5];
    const vecB = [0.1, 0.5, 0.9];
    assert.throws(() => calculateEuclideanDistance(vecA, vecB), /Vectors must be of the same length/);
  });

  test('verifyFace returns false when no registered embeddings exist', () => {
    const live = [0.1, 0.2, 0.3];
    const res = verifyFace(live, []);
    assert.equal(res.verified, false);
    assert.equal(res.message, 'No registered biometrics');
  });

  test('verifyFace correctly matches similar face embeddings', () => {
    const registered = [
      [0.1, 0.2, 0.3, 0.4],
      [0.11, 0.21, 0.31, 0.41],
    ];
    const live = [0.105, 0.205, 0.305, 0.405];
    const res = verifyFace(live, registered, 0.45);
    assert.equal(res.verified, true);
    assert.ok(res.minDistance < 0.45);
  });
});


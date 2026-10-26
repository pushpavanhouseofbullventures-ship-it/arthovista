import { describe, it, expect } from 'vitest';
import faceMatcher from './faceMatcher.js';

const {
  normalizeVector,
  calculateEuclideanDistance,
  calculateCosineSimilarity,
  verifyFace
} = faceMatcher;

describe('Face Matcher Biometric Utility', () => {
  it('normalizes vector to unit L2 norm', () => {
    const rawVector = [3, 4, 0, 0]; // Length is 5
    const normalized = normalizeVector(rawVector);

    const sumSq = normalized.reduce((acc, v) => acc + v * v, 0);
    expect(Math.abs(sumSq - 1.0)).toBeLessThan(0.0001);
  });

  it('handles empty or invalid vectors gracefully in normalizeVector', () => {
    expect(normalizeVector(null)).toEqual([]);
    expect(normalizeVector([])).toEqual([]);
    expect(normalizeVector('invalid')).toEqual([]);
  });

  it('calculates Euclidean distance: 0 for identical vectors', () => {
    const vec1 = [0.5, 0.5, 0.5, 0.5];
    const vec2 = [0.5, 0.5, 0.5, 0.5];

    expect(calculateEuclideanDistance(vec1, vec2)).toBe(0);
  });

  it('calculates Cosine similarity: 1 for identical vectors, 0 for orthogonal vectors', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const vecC = [0, 1, 0];

    expect(calculateCosineSimilarity(vecA, vecB)).toBe(1);
    expect(calculateCosineSimilarity(vecA, vecC)).toBe(0);
  });

  it('verifies face descriptors matching within threshold', () => {
    const enrolled = [new Array(128).fill(0.1)];
    // Slight variation (same person)
    const live = new Array(128).fill(0.1001);

    const match = verifyFace(live, enrolled);
    expect(match.verified).toBe(true);
    expect(match.minDistance).toBeLessThan(0.35);
  });

  it('rejects face descriptors exceeding threshold (different person)', () => {
    // Two opposite feature profiles
    const registered = [new Array(128).fill(0).map((_, i) => (i < 64 ? 0.2 : 0))];
    const differentPerson = new Array(128).fill(0).map((_, i) => (i >= 64 ? 0.2 : 0));

    const result = verifyFace(differentPerson, registered);
    expect(result.verified).toBe(false);
    expect(result.minDistance).toBeGreaterThan(0.35);
  });

  it('returns failure when registered embeddings are empty', () => {
    const live = new Array(128).fill(0.1);
    const result = verifyFace(live, []);
    expect(result.verified).toBe(false);
    expect(result.message).toContain('No registered biometrics');
  });
});

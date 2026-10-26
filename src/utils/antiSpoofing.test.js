import { describe, it, expect } from 'vitest';
import { AntiSpoofDetector } from './antiSpoofing.js';

describe('AntiSpoofDetector Liveness Engine', () => {
  it('initializes with default state', () => {
    const detector = new AntiSpoofDetector();

    expect(detector.frameCount).toBe(0);
    expect(detector.isCalibrated).toBe(false);
    expect(detector.livenessPassed).toBe(false);
    expect(detector.isStaticSpoof).toBe(false);
    expect(detector.liveActionDetected).toBeNull();
  });

  it('resets internal state when reset() is called', () => {
    const detector = new AntiSpoofDetector();
    detector.frameCount = 25;
    detector.isCalibrated = true;
    detector.livenessPassed = true;

    detector.reset();

    expect(detector.frameCount).toBe(0);
    expect(detector.isCalibrated).toBe(false);
    expect(detector.livenessPassed).toBe(false);
  });

  it('tracks missing frames and resets after exceeding threshold', () => {
    const detector = new AntiSpoofDetector();
    detector.frameCount = 10;

    // Up to 12 missing frames should maintain state
    for (let i = 0; i < 12; i++) {
      expect(detector.handleMissingFrame()).toBe(true);
    }
    expect(detector.consecutiveMissingFrames).toBe(12);

    // 13th missing frame triggers reset
    const result = detector.handleMissingFrame();
    expect(result).toBe(false);
    expect(detector.frameCount).toBe(0);
    expect(detector.consecutiveMissingFrames).toBe(0);
  });

  it('returns instructions when no face landmarks are detected', () => {
    const detector = new AntiSpoofDetector();
    const result = detector.processFrame(null, null);

    expect(result.passed).toBe(false);
    expect(result.isSpoof).toBe(false);
    expect(result.actionNeeded).toContain('Center face');
    expect(result.phase).toBe('CALIBRATING');
  });
});

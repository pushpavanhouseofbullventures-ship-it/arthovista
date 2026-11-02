import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { calculateHaversineDistance, checkGeofence } = require('../../server/utils/haversine.js');

describe('Haversine Unit Tests', () => {
  test('calculateHaversineDistance returns 0 for identical points', () => {
    const lat = 28.6139;
    const lng = 77.2090;
    const dist = calculateHaversineDistance(lat, lng, lat, lng);
    assert.equal(Math.round(dist), 0);
  });

  test('calculateHaversineDistance calculates known distance accurately', () => {
    // Delhi to Mumbai is roughly 1150-1200 km (approx 1,160,000 meters)
    const delhi = { lat: 28.6139, lng: 77.2090 };
    const mumbai = { lat: 19.0760, lng: 72.8777 };
    const dist = calculateHaversineDistance(delhi.lat, delhi.lng, mumbai.lat, mumbai.lng);
    assert.ok(dist > 1100000 && dist < 1250000, `Expected distance ~1,160km, got ${dist}`);
  });

  test('checkGeofence correctly identifies within and outside radius', () => {
    const office = { lat: 28.6139, lng: 77.2090 };
    // Point ~50 meters away
    const nearby = { lat: 28.6143, lng: 77.2090 };
    // Point ~500 meters away
    const far = { lat: 28.6184, lng: 77.2090 };

    const insideResult = checkGeofence(nearby.lat, nearby.lng, office.lat, office.lng, 100);
    assert.equal(insideResult.inRange, true);
    assert.ok(insideResult.distanceMeters <= 100);

    const outsideResult = checkGeofence(far.lat, far.lng, office.lat, office.lng, 100);
    assert.equal(outsideResult.inRange, false);
    assert.ok(outsideResult.distanceMeters > 100);
  });
});

import { describe, it, expect } from 'vitest';
import haversine from './haversine.js';

const { calculateHaversineDistance, checkGeofence } = haversine;

describe('Haversine Geofencing Utility', () => {
  it('returns 0 distance for identical coordinates', () => {
    const lat = 28.61265;
    const lon = 77.36605;
    const distance = calculateHaversineDistance(lat, lon, lat, lon);
    expect(distance).toBe(0);
  });

  it('calculates accurate distance between two known GPS points', () => {
    // Connaught Place to India Gate in New Delhi (~2.2 km)
    const cp = { lat: 28.6328, lon: 77.2197 };
    const indiaGate = { lat: 28.6129, lon: 77.2295 };

    const distanceMeters = calculateHaversineDistance(cp.lat, cp.lon, indiaGate.lat, indiaGate.lon);

    // Should be approximately 2400m (+/- 200m)
    expect(distanceMeters).toBeGreaterThan(2000);
    expect(distanceMeters).toBeLessThan(2600);
  });

  it('correctly validates user inside geofence radius', () => {
    const office = { lat: 28.6126546, lng: 77.3660593 };
    // Point ~20 meters away
    const user = { lat: 28.6127000, lng: 77.3661500 };

    const result = checkGeofence(user.lat, user.lng, office.lat, office.lng, 60);

    expect(result.inRange).toBe(true);
    expect(result.distanceMeters).toBeLessThanOrEqual(60);
    expect(result.radiusMeters).toBe(60);
  });

  it('correctly rejects user outside geofence radius', () => {
    const office = { lat: 28.6126546, lng: 77.3660593 };
    // Point ~10 km away
    const remoteUser = { lat: 28.5355, lng: 77.3910 };

    const result = checkGeofence(remoteUser.lat, remoteUser.lng, office.lat, office.lng, 100);

    expect(result.inRange).toBe(false);
    expect(result.distanceMeters).toBeGreaterThan(100);
  });
});

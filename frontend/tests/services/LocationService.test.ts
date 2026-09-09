import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/config', () => ({
  MAP_CONFIG: { accessToken: 'test-token' },
}));

import { LocationService } from '../../src/services/LocationService';

const coordinates = { longitude: 30.5234, latitude: 50.4501 };

describe('LocationService', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests browser coordinates without high accuracy', async () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) => {
      success({ coords: coordinates } as GeolocationPosition);
    });
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } });

    await expect(LocationService.requestCoordinates()).resolves.toEqual(
      coordinates,
    );
    expect(getCurrentPosition).toHaveBeenCalledOnce();
  });

  it('returns the preferred city name', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        features: [
          { properties: { name: 'Kyiv', name_preferred: 'Київ' } },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(LocationService.findCity(coordinates)).resolves.toBe('Київ');

    const url = fetchMock.mock.calls[0][0] as URL;
    expect(url.searchParams.get('longitude')).toBe('30.5234');
    expect(url.searchParams.get('latitude')).toBe('50.4501');
    expect(url.searchParams.get('types')).toBe('place');
  });

  it('uses a neutral label when no city is returned', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ features: [] })),
    );

    await expect(LocationService.findCity(coordinates)).resolves.toBe(
      'Current location',
    );
  });

  it('rejects failed geocoding requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    await expect(LocationService.findCity(coordinates)).rejects.toThrow(
      'City lookup failed.',
    );
  });
});

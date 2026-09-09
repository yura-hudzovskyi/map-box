import { afterEach, describe, expect, it, vi } from 'vitest';

import type { MapMarker, NewMarker } from '../../src/domain/marker';
import { MarkerApi } from '../../src/services/MarkerApi';

const newMarker: NewMarker = {
  longitude: 30.5234,
  latitude: 50.4501,
  score: 5,
};

describe('MarkerApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('creates a marker through the backend endpoint', async () => {
    const createdMarker: MapMarker = { id: 'marker-1', ...newMarker };
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json(createdMarker, { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(MarkerApi.create(newMarker)).resolves.toEqual(createdMarker);
    expect(fetchMock).toHaveBeenCalledWith('/api/markers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMarker),
    });
  });

  it('surfaces the backend rejection message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json(
          { detail: 'Marker could not be saved. Please try again.' },
          { status: 503 },
        ),
      ),
    );

    await expect(MarkerApi.create(newMarker)).rejects.toThrow(
      'Marker could not be saved. Please try again.',
    );
  });
});

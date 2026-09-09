import { describe, expect, it } from 'vitest';

import type { MapMarker } from '../../src/domain/marker';
import { MarkerFileService } from '../../src/services/MarkerFileService';

const marker: MapMarker = {
  id: 'marker-1',
  longitude: 30.5234,
  latitude: 50.4501,
  score: 5,
};

function markerFile(markers: unknown[]): File {
  return new File(
    [JSON.stringify({ version: 1, markers })],
    'markers.json',
    { type: 'application/json' },
  );
}

describe('MarkerFileService', () => {
  it('reads a valid marker file', async () => {
    await expect(MarkerFileService.read(markerFile([marker]))).resolves.toEqual([
      marker,
    ]);
  });

  it('rejects duplicate marker IDs', async () => {
    await expect(
      MarkerFileService.read(markerFile([marker, marker])),
    ).rejects.toThrow('Marker IDs must be unique.');
  });

  it('rejects marker values outside their bounds', async () => {
    await expect(
      MarkerFileService.read(markerFile([{ ...marker, latitude: 91 }])),
    ).rejects.toThrow('The file does not contain valid markers.');
  });

  it('reports malformed JSON as an invalid marker file', async () => {
    const file = new File(['not json'], 'markers.json');

    await expect(MarkerFileService.read(file)).rejects.toThrow(
      'The file does not contain valid markers.',
    );
  });
});

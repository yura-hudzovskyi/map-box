import { Scores, type MapMarker } from '../domain/marker';

interface MarkerFile {
  version: 1;
  markers: MapMarker[];
}

export class MarkerFileService {
  private constructor() {}

  static download(markers: MapMarker[]): void {
    const file: MarkerFile = { version: 1, markers };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }),
    );
    const link = document.createElement('a');

    link.href = url;
    link.download = 'markers.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  static async read(file: File): Promise<MapMarker[]> {
    const content = JSON.parse(await file.text()) as unknown;

    if (!MarkerFileService.isMarkerFile(content)) {
      throw new Error('The file does not contain valid markers.');
    }

    const uniqueIds = new Set(content.markers.map(({ id }) => id));
    if (uniqueIds.size !== content.markers.length) {
      throw new Error('Marker IDs must be unique.');
    }

    return content.markers;
  }

  private static isMarkerFile(value: unknown): value is MarkerFile {
    if (value === null || typeof value !== 'object') return false;

    const file = value as Partial<MarkerFile>;
    return (
      file.version === 1 &&
      Array.isArray(file.markers) &&
      file.markers.every(MarkerFileService.isMarker)
    );
  }

  private static isMarker(value: unknown): value is MapMarker {
    if (value === null || typeof value !== 'object') return false;

    const marker = value as Record<string, unknown>;
    return (
      typeof marker.id === 'string' &&
      marker.id.length > 0 &&
      typeof marker.longitude === 'number' &&
      marker.longitude >= -180 &&
      marker.longitude <= 180 &&
      typeof marker.latitude === 'number' &&
      marker.latitude >= -90 &&
      marker.latitude <= 90 &&
      Scores.is(marker.score)
    );
  }
}


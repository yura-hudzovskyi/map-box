import type { MapMarker, NewMarker } from '../domain/marker';

interface ApiError {
  detail: string;
}

export class MarkerApi {
  private static readonly endpoint = '/api/markers';

  private constructor() {}

  static async create(marker: NewMarker): Promise<MapMarker> {
    const response = await fetch(MarkerApi.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(marker),
    });
    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      throw new Error(error.detail);
    }

    return response.json() as Promise<MapMarker>;
  }
}

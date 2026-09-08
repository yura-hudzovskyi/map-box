import { MAP_CONFIG } from '../config';

export interface MapCoordinates {
  longitude: number;
  latitude: number;
}

interface GeocodingResponse {
  features: Array<{
    properties: {
      name: string;
      name_preferred?: string;
    };
  }>;
}

export class LocationService {
  private static readonly GEOCODING_URL =
    'https://api.mapbox.com/search/geocode/v6/reverse';

  private constructor() {}

  static requestCoordinates(): Promise<MapCoordinates> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve({
            longitude: coords.longitude,
            latitude: coords.latitude,
          });
        },
        reject,
        {
          enableHighAccuracy: false,
          maximumAge: 300_000,
          timeout: 10_000,
        },
      );
    });
  }

  static async findCity({
    longitude,
    latitude,
  }: MapCoordinates): Promise<string> {
    const url = new URL(LocationService.GEOCODING_URL);
    url.search = new URLSearchParams({
      access_token: MAP_CONFIG.accessToken,
      latitude: String(latitude),
      longitude: String(longitude),
      types: 'place',
    }).toString();

    const response = await fetch(url);
    if (!response.ok) throw new Error('City lookup failed.');

    const data = (await response.json()) as GeocodingResponse;
    const city = data.features.at(0)?.properties;

    return city?.name_preferred ?? city?.name ?? 'Current location';
  }
}

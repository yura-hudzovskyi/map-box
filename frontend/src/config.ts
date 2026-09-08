const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

if (!accessToken) {
  throw new Error('VITE_MAPBOX_TOKEN is not configured.');
}

export const MAP_CONFIG = {
  accessToken,
  center: [30.5234, 50.4501] as [number, number],
  style: 'mapbox://styles/mapbox/light-v11',
  zoom: 10,
} as const;

import { useCallback, useEffect, useState } from 'react';

import type { MapMarker, Score } from '../domain/marker';
import { MarkerApi } from '../services/MarkerApi';
import { MarkerFileService } from '../services/MarkerFileService';

export interface Notice {
  type: 'success' | 'error';
  message: string;
}

export function useMarkers() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [createScore, setCreateScore] = useState<Score>(5);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const selectedMarker = markers.find(({ id }) => id === selectedId);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const addMarker = useCallback(
    async (longitude: number, latitude: number, score: Score) => {
      setIsCreating(true);

      try {
        const marker = await MarkerApi.create({ longitude, latitude, score });
        setMarkers((current) => [...current, marker]);
        setSelectedId(marker.id);
        setNotice({ type: 'success', message: 'Marker added.' });
      } catch (error) {
        setNotice({ type: 'error', message: (error as Error).message });
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  const moveMarker = useCallback(
    (id: string, longitude: number, latitude: number) => {
      setMarkers((current) =>
        current.map((marker) =>
          marker.id === id ? { ...marker, longitude, latitude } : marker,
        ),
      );
    },
    [],
  );

  const updateMarkerScore = useCallback((id: string, score: Score) => {
    setMarkers((current) =>
      current.map((marker) => (marker.id === id ? { ...marker, score } : marker)),
    );
  }, []);

  const deleteMarker = useCallback((id: string) => {
    setMarkers((current) => current.filter((marker) => marker.id !== id));
    setSelectedId(null);
    setNotice({ type: 'success', message: 'Marker removed.' });
  }, []);

  const importMarkers = useCallback(async (file: File) => {
    try {
      const imported = await MarkerFileService.read(file);
      setMarkers(imported);
      setSelectedId(null);
      setNotice({
        type: 'success',
        message: `${imported.length} markers imported.`,
      });
    } catch (error) {
      setNotice({ type: 'error', message: (error as Error).message });
    }
  }, []);

  const exportMarkers = useCallback(() => {
    MarkerFileService.download(markers);
  }, [markers]);

  return {
    markers,
    createScore,
    selectedId,
    selectedMarker,
    isCreating,
    notice,
    setCreateScore,
    selectMarker: setSelectedId,
    addMarker,
    moveMarker,
    updateMarkerScore,
    deleteMarker,
    importMarkers,
    exportMarkers,
  };
}


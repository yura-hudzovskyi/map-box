import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MAP_CONFIG } from '../config';
import type { MapMarker, Score } from '../domain/marker';
import { MapMarkerFactory } from '../map/MapMarkerFactory';
import { MarkerZoom } from '../map/MarkerZoom';

interface MapViewProps {
  markers: MapMarker[];
  createScore: Score;
  isCreating: boolean;
  selectedId: string | null;
  onCreate: (longitude: number, latitude: number, score: Score) => void;
  onMove: (id: string, longitude: number, latitude: number) => void;
  onSelect: (id: string | null) => void;
}

export function MapView({
  markers,
  createScore,
  isCreating,
  selectedId,
  onCreate,
  onMove,
  onSelect,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mapboxgl.accessToken = MAP_CONFIG.accessToken;
    const map = new mapboxgl.Map({
      container,
      style: MAP_CONFIG.style,
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.zoom,
    });

    const updateMarkerZoom = () => MarkerZoom.apply(container, map.getZoom());

    updateMarkerZoom();
    map.on('zoom', updateMarkerZoom);
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    mapRef.current = map;

    return () => {
      map.off('zoom', updateMarkerZoom);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = ({ lngLat }: mapboxgl.MapMouseEvent) => {
      if (isCreating) return;

      onSelect(null);
      onCreate(lngLat.lng, lngLat.lat, createScore);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [createScore, isCreating, onCreate, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const renderedMarkers = markers.map((marker) =>
      MapMarkerFactory.create(map, marker, marker.id === selectedId, {
        onMove,
        onSelect,
      }),
    );

    return () => {
      renderedMarkers.forEach((marker) => marker.remove());
    };
  }, [markers, onMove, onSelect, selectedId]);

  return (
    <div
      aria-label={`Interactive map. New markers use score ${createScore}.`}
      className={isCreating ? 'map is-creating' : 'map'}
      ref={containerRef}
    />
  );
}

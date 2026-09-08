import mapboxgl from 'mapbox-gl';

import { Scores, type MapMarker } from '../domain/marker';

interface MarkerEvents {
  onMove: (id: string, longitude: number, latitude: number) => void;
  onSelect: (id: string) => void;
}

export class MapMarkerFactory {
  private constructor() {}

  static create(
    map: mapboxgl.Map,
    data: MapMarker,
    selected: boolean,
    events: MarkerEvents,
  ): mapboxgl.Marker {
    const element = MapMarkerFactory.createElement(data, selected, events.onSelect);
    const marker = new mapboxgl.Marker({ element, draggable: true })
      .setLngLat([data.longitude, data.latitude])
      .addTo(map);

    marker.on('dragend', () => {
      const { lng, lat } = marker.getLngLat();
      events.onMove(data.id, lng, lat);
    });

    return marker;
  }

  private static createElement(
    marker: MapMarker,
    selected: boolean,
    onSelect: (id: string) => void,
  ): HTMLButtonElement {
    const element = document.createElement('button');

    element.className = selected ? 'map-marker is-selected' : 'map-marker';
    element.type = 'button';
    element.textContent = String(marker.score);
    element.title = `Score ${marker.score}. Drag to move.`;
    element.style.setProperty('--marker-color', Scores.color(marker.score));
    element.style.setProperty('--marker-foreground', Scores.foreground(marker.score));
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      onSelect(marker.id);
    });

    return element;
  }
}

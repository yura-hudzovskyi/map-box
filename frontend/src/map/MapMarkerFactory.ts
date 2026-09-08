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
    const marker = new mapboxgl.Marker({
      element,
      draggable: true,
      anchor: 'center',
      offset: [0, 0],
    })
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
  ): HTMLDivElement {
    const element = document.createElement('div');
    const button = document.createElement('button');

    element.className = 'map-marker-anchor';
    button.className = selected ? 'map-marker is-selected' : 'map-marker';
    button.type = 'button';
    button.textContent = String(marker.score);
    button.title = `Score ${marker.score}. Drag to move.`;
    button.style.setProperty('--marker-color', Scores.color(marker.score));
    button.style.setProperty(
      '--marker-foreground',
      Scores.foreground(marker.score),
    );
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      onSelect(marker.id);
    });
    element.append(button);

    return element;
  }
}

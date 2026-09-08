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
  ): HTMLButtonElement {
    const element = document.createElement('button');
    const visual = document.createElement('span');
    const score = document.createElement('span');

    element.className = selected
      ? 'map-marker-anchor is-selected'
      : 'map-marker-anchor';
    element.type = 'button';
    element.title = `Score ${marker.score}. Drag to move.`;
    element.ariaLabel = `Marker with score ${marker.score}`;
    visual.className = 'map-marker-visual';
    visual.style.setProperty('--marker-color', Scores.color(marker.score));
    visual.style.setProperty(
      '--marker-foreground',
      Scores.foreground(marker.score),
    );
    score.className = 'map-marker-score';
    score.textContent = String(marker.score);
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      onSelect(marker.id);
    });
    visual.append(score);
    element.append(visual);

    return element;
  }
}

import { describe, expect, it } from 'vitest';

import { MarkerZoom } from '../../src/map/MarkerZoom';

function markerStylesAt(zoom: number): Map<string, string> {
  const values = new Map<string, string>();
  const element = {
    style: {
      setProperty: (name: string, value: string) => values.set(name, value),
    },
  } as unknown as HTMLElement;

  MarkerZoom.apply(element, zoom);

  return values;
}

describe('MarkerZoom', () => {
  it('keeps distant markers compact and uncluttered', () => {
    const styles = markerStylesAt(2);

    expect(styles.get('--marker-scale')).toBe('0.5');
    expect(styles.get('--marker-score-opacity')).toBe('0');
    expect(styles.get('--marker-crosshair-opacity')).toBe('0');
  });

  it('reveals detail progressively while zooming in', () => {
    const styles = markerStylesAt(9);

    expect(Number(styles.get('--marker-scale'))).toBeCloseTo(0.92);
    expect(styles.get('--marker-score-opacity')).toBe('1');
    expect(styles.get('--marker-crosshair-opacity')).toBe('0.5');
  });

  it('caps marker size at close zoom levels', () => {
    expect(markerStylesAt(20).get('--marker-scale')).toBe('1.1');
  });
});

interface ZoomRange {
  from: number;
  to: number;
}

export class MarkerZoom {
  private static readonly SIZE_ZOOM: ZoomRange = { from: 2, to: 12 };
  private static readonly SCORE_ZOOM: ZoomRange = { from: 5, to: 7 };
  private static readonly CROSSHAIR_ZOOM: ZoomRange = { from: 8, to: 10 };

  private constructor() {}

  static apply(element: HTMLElement, zoom: number): void {
    const scale = MarkerZoom.interpolate(zoom, MarkerZoom.SIZE_ZOOM, 0.5, 1.1);
    const scoreOpacity = MarkerZoom.progress(zoom, MarkerZoom.SCORE_ZOOM);
    const crosshairOpacity = MarkerZoom.progress(
      zoom,
      MarkerZoom.CROSSHAIR_ZOOM,
    );

    element.style.setProperty('--marker-scale', String(scale));
    element.style.setProperty('--marker-score-opacity', String(scoreOpacity));
    element.style.setProperty(
      '--marker-crosshair-opacity',
      String(crosshairOpacity),
    );
  }

  private static interpolate(
    value: number,
    range: ZoomRange,
    from: number,
    to: number,
  ): number {
    return from + (to - from) * MarkerZoom.progress(value, range);
  }

  private static progress(value: number, range: ZoomRange): number {
    return Math.min(1, Math.max(0, (value - range.from) / (range.to - range.from)));
  }
}

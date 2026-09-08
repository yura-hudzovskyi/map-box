import { Scores, type MapMarker } from '../domain/marker';

export function StatsPanel({ markers }: { markers: MapMarker[] }) {
  const counts = markers.reduce<number[]>((result, marker) => {
    result[marker.score] += 1;
    return result;
  }, [0, 0, 0, 0, 0, 0]);

  return (
    <aside aria-labelledby="marker-count-title" className="panel stats-panel">
      <h2 className="panel-title" id="marker-count-title">Marker count</h2>
      <dl className="stats-list">
        <div className="stats-row stats-total">
          <dt>Total</dt>
          <dd>{markers.length}</dd>
        </div>
        {Scores.descending.map(({ score, label, color }) => (
          <div className="stats-row" key={score}>
            <dt>
              <span className="stats-dot" style={{ backgroundColor: color }} />
              {label}
            </dt>
            <dd>{counts[score]}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

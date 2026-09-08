import type { MapMarker, Score } from '../domain/marker';
import { ScorePicker } from './ScorePicker';

interface MarkerEditorProps {
  marker: MapMarker;
  onClose: () => void;
  onDelete: (id: string) => void;
  onScoreChange: (id: string, score: Score) => void;
}

export function MarkerEditor({
  marker,
  onClose,
  onDelete,
  onScoreChange,
}: MarkerEditorProps) {
  return (
    <section className="panel edit-panel">
      <div className="panel-heading">
        <div>
          <h2>Selected point</h2>
          <p className="coordinates">
            {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
          </p>
        </div>
        <button
          aria-label="Close marker editor"
          className="icon-button"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
      </div>
      <ScorePicker onChange={(score) => onScoreChange(marker.id, score)} value={marker.score} />
      <div className="edit-footer">
        <span>Drag on the map to move.</span>
        <button
          className="button danger"
          onClick={() => onDelete(marker.id)}
          type="button"
        >
          Delete point
        </button>
      </div>
    </section>
  );
}

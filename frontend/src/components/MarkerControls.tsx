import { useRef, type ChangeEvent } from 'react';

import type { Score } from '../domain/marker';
import { ScorePicker } from './ScorePicker';

interface MarkerControlsProps {
  score: Score;
  hasMarkers: boolean;
  onScoreChange: (score: Score) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export function MarkerControls({
  score,
  hasMarkers,
  onScoreChange,
  onExport,
  onImport,
}: MarkerControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    event.target.value = '';

    if (file) onImport(file);
  };

  return (
    <section aria-label="Marker controls" className="panel create-panel">
      <header className="product-header">
        <span aria-hidden="true" className="product-mark" />
        <div>
          <h1>Map marks</h1>
          <p>Location scoring</p>
        </div>
      </header>

      <div className="control-section">
        <h2>Place a point</h2>
        <p className="hint">Choose a score, then click the map.</p>
        <ScorePicker onChange={onScoreChange} value={score} />
      </div>

      <div aria-label="Marker files" className="file-actions" role="group">
        <button
          className="button"
          disabled={!hasMarkers}
          onClick={onExport}
          type="button"
        >
          Export JSON
        </button>
        <button
          className="button"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          Import JSON
        </button>
        <input
          accept="application/json,.json"
          className="visually-hidden"
          onChange={handleImport}
          ref={fileInputRef}
          type="file"
        />
      </div>

      <p className="panel-note">Click a point to edit it. Drag it to move.</p>
    </section>
  );
}

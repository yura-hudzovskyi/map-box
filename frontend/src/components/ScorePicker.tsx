import type { CSSProperties } from 'react';

import { Scores, type Score } from '../domain/marker';

interface ScorePickerProps {
  value: Score;
  onChange: (score: Score) => void;
}

export function ScorePicker({ value, onChange }: ScorePickerProps) {
  return (
    <fieldset className="score-picker">
      <legend>Score</legend>
      <div className="score-options">
        {Scores.all.map(({ score, label, color, foreground }) => (
          <button
            aria-label={`Score ${score}`}
            aria-pressed={value === score}
            className="score-option"
            key={score}
            onClick={() => onChange(score)}
            style={
              {
                '--score-color': color,
                '--score-foreground': foreground,
              } as CSSProperties
            }
            type="button"
          >
            <span className="score-number">{score}</span>
            <span className="score-name">{label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

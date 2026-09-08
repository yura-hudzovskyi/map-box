export type Score = 0 | 1 | 2 | 3 | 4 | 5;

export interface MapMarker {
  id: string;
  longitude: number;
  latitude: number;
  score: Score;
}

export type NewMarker = Omit<MapMarker, 'id'>;

interface ScoreDetails {
  score: Score;
  label: string;
  color: string;
  foreground: string;
}

export class Scores {
  private constructor() {}

  static readonly all: ReadonlyArray<ScoreDetails> = [
    { score: 0, label: 'Zero', color: '#111111', foreground: '#ffffff' },
    { score: 1, label: 'One', color: '#737373', foreground: '#ffffff' },
    { score: 2, label: 'Two', color: '#dc2626', foreground: '#ffffff' },
    { score: 3, label: 'Three', color: '#f97316', foreground: '#14232b' },
    { score: 4, label: 'Four', color: '#84cc16', foreground: '#14232b' },
    { score: 5, label: 'Five', color: '#15803d', foreground: '#ffffff' },
  ];

  static readonly descending: ReadonlyArray<ScoreDetails> = [
    ...Scores.all,
  ].reverse();

  static color(score: Score): string {
    return Scores.all[score].color;
  }

  static foreground(score: Score): string {
    return Scores.all[score].foreground;
  }

  static is(value: unknown): value is Score {
    return (
      typeof value === 'number' &&
      Number.isInteger(value) &&
      value >= 0 &&
      value <= 5
    );
  }
}

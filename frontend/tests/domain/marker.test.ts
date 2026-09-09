import { describe, expect, it } from 'vitest';

import { Scores } from '../../src/domain/marker';

describe('Scores', () => {
  it.each([0, 1, 2, 3, 4, 5])('accepts score %s', (score) => {
    expect(Scores.is(score)).toBe(true);
  });

  it.each([-1, 6, 2.5, '2', null])('rejects invalid score %s', (score) => {
    expect(Scores.is(score)).toBe(false);
  });
});

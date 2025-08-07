// To run: npx jest fretboardEngine/tests/pedal.test.tsx
import { E9_PEDAL_CHANGES, Pedal } from '../pedal';

describe('Pedal', () => {
  test('get_all_pedal_combinations returns expected combinations', () => {
    const allCombinations: string[][] = Pedal.getAllPedalCombinations(Object.keys(E9_PEDAL_CHANGES));

    const contains = (combo: string[]) =>
      allCombinations.some((c) => arraysEqual(c, combo));

    expect(contains([])).toBe(true); // no pedal is a combination
    expect(contains(['A'])).toBe(true);
    expect(contains(['B'])).toBe(true);
    expect(contains(['A', 'B'])).toBe(true);
    expect(contains(['B', 'C'])).toBe(true);
    expect(contains(['E'])).toBe(true);
    expect(contains(['F'])).toBe(true);
    expect(contains(['A', 'F'])).toBe(true);
    expect(contains(['A', 'B', 'C'])).toBe(false);
    expect(contains(['D', 'G'])).toBe(false);
    expect(contains(['E', 'F'])).toBe(false);
    expect(contains(['A/2', 'A'])).toBe(false);
    expect(contains(['D/2', 'D'])).toBe(false);
  });
});

/**
 * Helper to compare two arrays of strings (order matters)
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

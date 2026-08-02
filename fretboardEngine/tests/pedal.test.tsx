// To run: npx jest fretboardEngine/tests/pedal.test.tsx
import { DEFAULT_E9_PEDAL_CHANGES, Pedal } from "../pedal";

describe("Pedal", () => {
  test("get_all_pedal_combinations returns expected combinations with physical pedal validation", () => {
    // Create Pedal objects with physical names matching the new system
    // Map old pedal names to physical pedals, matching my personal setup
    const physicalPedalMap: Record<string, string> = {
      A: "A",
      "A/2": "A",
      B: "B",
      C: "C",
      E: "RKL",
      F: "RKR",
      G: "LKR",
      D: "LKL",
      "D/2": "LKL",
    };

    const pedals = Object.keys(DEFAULT_E9_PEDAL_CHANGES).map((name) => {
      const p = new Pedal();
      p.name = name;
      p.physicalName = physicalPedalMap[name] as any;
      p.changes = DEFAULT_E9_PEDAL_CHANGES[name];
      return p;
    });

    const allCombinations: string[][] = Pedal.getAllPedalCombinations(pedals);

    const contains = (combo: string[]) => allCombinations.some((c) => arraysEqual(c, combo));

    expect(contains([])).toBe(true); // no pedal is a combination
    expect(contains(["A"])).toBe(true);
    expect(contains(["B"])).toBe(true);
    expect(contains(["C"])).toBe(true);
    expect(contains(["A", "B"])).toBe(true);
    expect(contains(["B", "C"])).toBe(true);
    expect(contains(["LKL"])).toBe(true);
    expect(contains(["LKR"])).toBe(true);

    // expect(contains(["A", "LKR"])).toBe(true);
    // expect(contains(["A", "LKL"])).toBe(true);
    // expect(contains(["B", "LKL"])).toBe(true);
    // expect(contains(["B", "LKL"])).toBe(true);

    expect(contains(["LKR", "RKL"])).toBe(false);

    expect(contains(["A", "B", "C"])).toBe(false);

    expect(contains(["A", "A"])).toBe(false);
    expect(contains(["RKR", "RKR"])).toBe(false);

    expect(contains(["LKL", "LKR"])).toBe(false);
    expect(contains(["RKL", "RKR"])).toBe(false);
  });
});

/**
 * Helper to compare two arrays of strings (order matters)
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

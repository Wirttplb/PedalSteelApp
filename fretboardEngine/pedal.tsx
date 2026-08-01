type PedalChange = [number, number];

// Physical pedal/lever names for E9 - these are the actual hardware controls
export const PHYSICAL_PEDALS = ["A", "B", "C", "LKL", "LKR", "RKL", "RKR"] as const;

export type PhysicalPedal = (typeof PHYSICAL_PEDALS)[number];

export const STANDARD_E9_PEDAL_CHANGES: Record<string, PedalChange[]> = {
  A: [
    [0, 2],
    [5, 2],
  ],
  "A/2": [
    [0, 1],
    [5, 1],
  ],
  B: [
    [4, 1],
    [7, 1],
  ],
  C: [
    [5, 2],
    [6, 2],
  ],
  E: [
    [2, -1],
    [6, -1],
  ],
  F: [
    [2, 1],
    [6, 1],
  ],
  G: [
    [3, 1],
    [9, 1],
  ],
  D: [
    [1, -1],
    [8, -2],
  ],
  "D/2": [[8, -1]],
};

// Alias for backward compatibility
export const E9_PEDAL_CHANGES = STANDARD_E9_PEDAL_CHANGES;

// PEDAL_COMBINATIONS: [["A"], ["B"], ["C"], ["A", "B"], ["B", "C"], ["E"], ["F"], ["A", "E"], ["A", "F"], ["B", "F"], ["B", "F"], ["G"], ""]

export class Pedal {
  name: string = ""; // User-defined label (e.g., "eh", "My Pedal")
  physicalName: PhysicalPedal = "A"; // Actual physical pedal/lever
  changes: PedalChange[] = [];

  static initFromName(name: string): Pedal {
    const pedal = new Pedal();
    pedal.name = name;
    // Map old pedal names to physical pedal names
    const physicalPedalMap: Record<string, PhysicalPedal> = {
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
    pedal.physicalName = physicalPedalMap[name] || "A";
    pedal.changes = STANDARD_E9_PEDAL_CHANGES[name];
    return pedal;
  }

  static getAllPedalCombinations(pedals: (Pedal | string)[], maxPedals: number = 7): string[][] {
    // Convert strings to Pedal objects if needed
    const pedalObjects: Pedal[] = pedals.map((p) => {
      if (typeof p === "string") {
        return Pedal.initFromName(p);
      }
      return p;
    });

    // Return combinations of user-defined pedal names (which are unique identifiers)
    // but validate based on physical names
    const pedalNames = pedalObjects.map((p) => p.name);
    const physicalNames = pedalObjects.map((p) => p.physicalName);
    let list: string[][] = [[]]; // start with empty combination

    for (let i = 1; i <= 3; i++) {
      list = list.concat(uniqueCombinations(pedalNames, i));
    }

    // Remove invalid combinations based on physical names
    const toDelete: number[] = [];
    list.forEach((combo, i) => {
      // Map user-defined names to physical names for validation
      const comboPhysicalNames = combo
        .map((name) => {
          const pedal = pedalObjects.find((p) => p.name === name);
          return pedal ? pedal.physicalName : null;
        })
        .filter((p): p is PhysicalPedal => p !== null);

      // Check for duplicate physical pedals (can't use same physical pedal twice)
      const uniquePhysical = new Set(comboPhysicalNames);
      if (uniquePhysical.size !== comboPhysicalNames.length) {
        toDelete.push(i);
        return;
      }

      // Check for mutually exclusive physical pedals
      // Left knee levers: LKL and LKR are mutually exclusive
      const hasLKL = comboPhysicalNames.includes("LKL");
      const hasLKR = comboPhysicalNames.includes("LKR");
      if (hasLKL && hasLKR) {
        toDelete.push(i);
        return;
      }

      // Right knee levers: RKL and RKR are mutually exclusive
      const hasRKL = comboPhysicalNames.includes("RKL");
      const hasRKR = comboPhysicalNames.includes("RKR");
      if (hasRKL && hasRKR) {
        toDelete.push(i);
        return;
      }

      // Can't press all 3 main pedals (A, B, C) at once with one foot
      const hasA = comboPhysicalNames.includes("A");
      const hasB = comboPhysicalNames.includes("B");
      const hasC = comboPhysicalNames.includes("C");
      if (hasA && hasB && hasC) {
        toDelete.push(i);
        return;
      }

      // Check max pedals
      if (combo.length > maxPedals) {
        toDelete.push(i);
      }
    });

    // Remove in reverse to keep indices valid
    for (let i = toDelete.length - 1; i >= 0; i--) {
      list.splice(toDelete[i], 1);
    }

    return list;
  }
}

function uniqueCombinations<T>(arr: T[], r: number): T[][] {
  const result: T[][] = [];

  function combine(start: number, path: T[]) {
    if (path.length === r) {
      result.push([...path]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      combine(i + 1, path);
      path.pop();
    }
  }

  combine(0, []);
  return result;
}

export function getPedalsFromString(string: number, pedals: Pedal[]): Pedal[] {
  // returns Pedals[] corresponding to string index
  const result: Pedal[] = [];

  pedals.forEach((pedal, pedalIndex) => {
    // loop on Pedals
    pedal.changes.forEach((change, changeIndex) => {
      // loop on changes
      if (change[0] == string) {
        result.push(pedal);
      }
    });
  });

  return result;
}

type PedalChange = [number, number];

export const E9_PEDAL_CHANGES: Record<string, PedalChange[]> = {
  "A": [[0, 2], [5, 2]],
  "A/2": [[0, 1], [5, 1]],
  "B": [[4, 1], [7, 1]],
  "C": [[5, 2], [6, 2]],
  "E": [[2, -1], [6, -1]],
  "F": [[2, 1], [6, 1]],
  "G": [[3, 1], [9, 1]],
  "D": [[1, -1], [8, -2]],
  "D/2": [[8, -1]],
};

// PEDAL_COMBINATIONS: [["A"], ["B"], ["C"], ["A", "B"], ["B", "C"], ["E"], ["F"], ["A", "E"], ["A", "F"], ["B", "F"], ["B", "F"], ["G"], ""]

export class Pedal {
  name: string = ""; // e.g., "A", "B", "C", etc.
  changes: PedalChange[] = [];

  static initFromName(name: string): Pedal {
    const pedal = new Pedal();
    pedal.name = name;
    pedal.changes = E9_PEDAL_CHANGES[name];
    return pedal;
  }

  static getAllPedalCombinations(pedals: string[], maxPedals: number = 7): string[][] {
    let list: string[][] = [[]]; // start with empty combination

    for (let i = 1; i <= 3; i++) {
      list = list.concat(uniqueCombinations(pedals, i));
    }

    // Remove invalid combinations
    const toDelete: number[] = [];
    list.forEach((combo, i) => {
      const has = (x: string) => combo.includes(x);

      if (
        combo.length > maxPedals ||
        // these combinations are impossible with my setup
        (has("A") && has("A/2")) ||
        (has("D") && has("D/2")) ||
        ((has("A") || has("A/2")) && has("C")) ||
        (has("E") && has("F")) ||
        ((has("D") || has("D/2")) && has("G"))
      ) {
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

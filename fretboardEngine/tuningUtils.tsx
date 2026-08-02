import { convertStrNotesToInt } from "./notesUtils";

enum TuningName {
  E9 = "E9",
  C6_10 = "C6 10 strings",
  C6_6 = "C6 6 strings",
  OpenE = "Open E",
  Standard = "Standard",
}

export interface Tuning {
  name: TuningName;
  strings: string[];
}

// E9 Tuning (10 strings) - Standard Nashville E9 pedal steel tuning
// Strings 10 to 1 (lowest to highest): B, D, E, F#, G#, B, E, G#, D#, F#
export const E9_TUNING: Tuning = {
  name: TuningName.E9,
  strings: ["B", "D", "E", "F#", "G#", "B", "E", "G#", "D#", "F#"],
};

// C6 Tuning (10 strings) - Standard C6 pedal steel tuning
// Strings 10 to 1 (lowest to highest): F, A, C, E, G, A, C, E, G, A
export const C6_TUNING_10: Tuning = {
  name: TuningName.C6_10,
  strings: ["F", "A", "C", "E", "G", "A", "C", "E", "G", "A"],
};

// C6 Tuning (6 strings) - Open C6 for lap steel / 6-string pedal steel
// Strings 6 to 1 (lowest to highest): F, A, C, E, G, A
export const C6_TUNING_6: Tuning = {
  name: TuningName.C6_6,
  strings: ["F", "A", "C", "E", "G", "A"],
};

// Open E Tuning (6 strings) - Guitar Open E
// Strings 6 to 1 (lowest to highest): E, B, G#, E, B, E
export const OPEN_E_TUNING: Tuning = {
  name: TuningName.OpenE,
  strings: ["E", "B", "G#", "E", "B", "E"],
};

// Standard Guitar Tuning (6 strings) - E Standard
// Strings 6 to 1 (lowest to highest): E, A, D, G, B, E
export const STANDARD_TUNING: Tuning = {
  name: TuningName.Standard,
  strings: ["E", "A", "D", "G", "B", "E"],
};

// All available tunings
export const ALL_TUNINGS: Tuning[] = [E9_TUNING, C6_TUNING_10, C6_TUNING_6, OPEN_E_TUNING, STANDARD_TUNING];

/**
 * Get a tuning definition by name
 */
export function getTuningByName(name: string): Tuning | undefined {
  const TUNING_MAP: Record<string, Tuning> = {
    E9: E9_TUNING,
    "C6 10 strings": C6_TUNING_10,
    "C6 6 strings": C6_TUNING_6,
    "Open E": OPEN_E_TUNING,
    Standard: STANDARD_TUNING,
  };

  return TUNING_MAP[name];
}

/**
 * Get string names for a tuning (from lowest to highest string)
 */
export function getStringNames(tuningName: string): string[] {
  const tuning = getTuningByName(tuningName);
  return tuning ? tuning.strings : [];
}

/**
 * Convert tuning to integer array for Fretboard initialization
 * Returns array from lowest to highest string
 */
export function getTuningAsIntArray(tuningName: string): number[] {
  const tuning = getTuningByName(tuningName);
  if (!tuning) return [];
  return convertStrNotesToInt(tuning.strings);
}

/**
 * Get all tuning names
 */
export function getAllTuningNames(): string[] {
  return ALL_TUNINGS.map((t) => t.name);
}

/**
 * Get all tuning display names
 */
export function getAllTuningDisplayNames(): string[] {
  return ALL_TUNINGS.map((t) => t.name);
}

/**
 * Check if a tuning supports pedals (currently only E9)
 */
export function tuningSupportsPedals(tuningName: string): boolean {
  return tuningName === "E9";
}

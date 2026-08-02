import { ChordsFile, importE9ChordsFromJson } from "./chord_importer";
import { Voicing } from "./chords";
import {
    convertIntIntervalToStr,
    convertIntNotesToStr,
    convertStrNoteToInt,
    convertStrNotesToInt,
    getScaleAsIntegers,
} from "./notes_utils";
import { Pedal, STANDARD_E9_PEDAL_CHANGES } from "./pedal";
import chordsData from "./tests/data/e9_chords_shortlist.json";

export class Fretboard {
  tuning: number[] = [];
  pedals: Pedal[] = [];

  constructor(tuning: number[]) {
    this.tuning = tuning;
  }

  static initFromTuning(tuning: string[]): Fretboard {
    return new Fretboard(convertStrNotesToInt(tuning));
  }

  static initAsGuitarStandard(): Fretboard {
    return Fretboard.initFromTuning(["E", "A", "D", "G", "G", "E"]);
  }

  static initAsGuitarOpenE(): Fretboard {
    return Fretboard.initFromTuning(["E", "B", "E", "G#", "B", "E"]);
  }

  static initAsPedalSteelE9(): Fretboard {
    const fretboard = Fretboard.initFromTuning(["B", "D", "E", "F#", "G#", "B", "E", "G#", "D#", "F#"]);
    for (const pedalName of Object.keys(STANDARD_E9_PEDAL_CHANGES)) {
      fretboard.pedals.push(Pedal.initFromName(pedalName));
    }
    return fretboard;
  }

  getTuningAsStr(asSharps = true): string[] {
    return convertIntNotesToStr(this.tuning, asSharps);
  }

  getPedalsAsStr(): string[] {
    return this.pedals.map((pedal) => pedal.name);
  }

  generateFretboard(startFret: number, endFret: number): number[][] {
    return this.tuning.map(
      (openNote) => Array.from({ length: endFret - startFret + 1 }, (_, fret) => (openNote + fret + 12) % 12), // mistake from gpt?
    );
  }

  generateScaleAsIntegers(
    key: string,
    intervals: number[],
    startFret: number,
    endFret: number,
    activePedals: number[] = [],
  ): (number | null)[][] {
    const keyInt = convertStrNoteToInt(key);
    const fretboard = this.generateFretboard(startFret, endFret);

    return fretboard.map((stringNotes, stringIndex) =>
      stringNotes.map((note, fretIndex) => {
        let actualNote = note;
        for (const pedalIdx of activePedals) {
          const pedal = this.pedals[pedalIdx];
          if (pedal) {
            const change = pedal.changes.find((c) => c[0] === stringIndex);
            if (change) {
              actualNote += change[1];
            }
          }
        }
        // Loop the scale pattern after 12th fret (octave)
        const effectiveFret = fretIndex + startFret;
        const loopedFret = effectiveFret % 12;
        const loopedNote = (this.tuning[stringIndex] + loopedFret + 12) % 12;
        let loopedActualNote = loopedNote;
        for (const pedalIdx of activePedals) {
          const pedal = this.pedals[pedalIdx];
          if (pedal) {
            const change = pedal.changes.find((c) => c[0] === stringIndex);
            if (change) {
              loopedActualNote += change[1];
            }
          }
        }
        return intervals.includes((loopedActualNote - keyInt + 12) % 12) ? note : null;
      }),
    );
  }

  generateChordFormulaAsIntegers(
    key: string,
    intervals: number[],
    startFret: number,
    endFret: number,
    activePedals: number[] = [],
  ): (string | null)[][] {
    const keyInt = convertStrNoteToInt(key);
    const fretboard = this.generateFretboard(startFret, endFret);

    return fretboard.map((stringNotes, stringIndex) =>
      stringNotes.map((note, fretIndex) => {
        let actualNote = note;
        for (const pedalIdx of activePedals) {
          const pedal = this.pedals[pedalIdx];
          if (pedal) {
            const change = pedal.changes.find((c) => c[0] === stringIndex);
            if (change) {
              actualNote += change[1];
            }
          }
        }
        // For chord formula, don't loop octaves - only show at actual fret position
        const intervalNum = (actualNote - keyInt + 12) % 12;
        return intervals.includes(intervalNum) ? convertIntIntervalToStr(intervalNum) : null;
      }),
    );
  }

  generateScaleAsIntervals(
    key: string,
    scale: string | number[],
    startFret: number,
    endFret: number,
    activePedals: number[] = [],
  ): (string | null)[][] {
    const scaleAsInts = Array.isArray(scale) ? scale : getScaleAsIntegers(scale);
    const scaleInts = this.generateScaleAsIntegers(key, scaleAsInts, startFret, endFret, activePedals);

    const pedalsToApply = activePedals.map((idx) => this.pedals[idx]).filter((p): p is Pedal => !!p);

    return Fretboard.convertFretboardScaleToIntervals(key, scaleInts, pedalsToApply);
  }

  generateVoicing(voicing: Voicing, key: string = "E", maxFret: number = 24): (number | null)[][] {
    const fretboard = this.generateFretboard(0, maxFret);

    if (fretboard.length !== voicing.notes.length) {
      throw new Error("Voicing and tuning do not match!");
    }

    // Check if the voicing was generated for a different key than the current one
    // Static chords from JSON are in key "E", dynamic chords are generated for the selected key
    const voicingKey = voicing.generatedForKey || "E";
    const keyOffset = convertStrNoteToInt(key) - convertStrNoteToInt(voicingKey);

    return fretboard.map((stringNotes, stringIndex) => {
      const fret = voicing.notes[stringIndex];
      return stringNotes.map((note, fretIndex) => {
        if (fret === null || fret === undefined) return null;
        // If the voicing was generated for a different key, transpose the fret position
        if (keyOffset !== 0) {
          const transposedFret = (fret + keyOffset + 12) % 12;
          const voicingNote = (transposedFret + this.tuning[stringIndex] + 12) % 12;
          return voicingNote === note ? (voicingNote + 12) % 12 : null;
        }
        // Voicing was generated for the same key - show note at the correct fret position
        // Also show at octave positions (fret + 12, fret + 24, etc.)
        const isAtFret =
          fretIndex === fret ||
          (fret !== null && fretIndex === fret + 12) ||
          (fret !== null && fretIndex === fret + 24);
        return isAtFret ? note : null;
      });
    });
  }

  getAllPedalCombinations(maxPedals: number = 7): string[][] {
    return Pedal.getAllPedalCombinations(this.pedals, maxPedals);
  }

  getIntervalsAtFret(fret: number, pedals: Pedal[], key = "E"): number[] {
    const keyInt = convertStrNoteToInt(key);
    const intervals = this.tuning.map((note) => (note + fret - keyInt + 12) % 12);

    const physicalNames = this.pedals.map((p) => p.physicalName);
    for (const pedal of pedals) {
      // Validate using physical names
      if (!physicalNames.includes(pedal.physicalName)) {
        continue; // Skip unknown physical pedals
      }

      for (const [stringIndex, shift] of pedal.changes) {
        intervals[stringIndex] = (intervals[stringIndex] + shift + 12) % 12;
      }
    }

    return intervals;
  }

  static convertFretboardScaleToIntervals(
    key: string,
    scale: (number | null)[][],
    pedalsToApply?: Pedal[],
  ): (string | null)[][] {
    const keyInt = convertStrNoteToInt(key);
    const result = scale.map((stringScale, stringIndex) =>
      stringScale.map((note, fretIndex) => {
        if (note === null) return null;

        let actualNote = note;
        if (pedalsToApply) {
          for (const pedal of pedalsToApply) {
            for (const [changeStringIndex, shift] of pedal.changes) {
              if (changeStringIndex === stringIndex) {
                actualNote += shift;
              }
            }
          }
        }

        const interval = (((actualNote - keyInt) % 12) + 12) % 12;
        return convertIntIntervalToStr(interval);
      }),
    );

    return result;
  }

  voicingToFretboardData(
    selectedKey: string,
    chordType: string,
    voicingIdx: number,
  ): { fretboardData: (string | null)[][]; pedals: Pedal[] } {
    // load chords data (everything in E in the file)
    let data = chordsData as ChordsFile;
    const chords = importE9ChordsFromJson(data, this.pedals);

    const chord = chords.find((chord) => chord.name === chordType);

    if (chord) {
      if (voicingIdx >= chord.voicings.length)
        // avoid crash when out of bounds
        return { fretboardData: [], pedals: [] };

      const voicing = chord.voicings[voicingIdx];
      const fretboardDataAsInts = this.generateVoicing(voicing, selectedKey);
      const pedals = voicing.pedalObjects; // Use Pedal objects
      const fretboardData = Fretboard.convertFretboardScaleToIntervals(selectedKey, fretboardDataAsInts, pedals);
      return { fretboardData, pedals };
    } else {
      console.error("Chord not found in imported chords.");
      return { fretboardData: [], pedals: [] };
    }
  }
}

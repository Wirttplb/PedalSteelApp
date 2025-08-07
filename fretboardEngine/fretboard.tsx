import { Voicing } from './chords';
import {
    convertIntIntervalToStr,
    convertIntNotesToStr,
    convertStrNoteToInt,
    convertStrNotesToInt,
} from './notes_utils';
import { E9_PEDAL_CHANGES, Pedal } from './pedal';

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
    return Fretboard.initFromTuning(['E', 'A', 'D', 'G', 'G', 'E']);
  }

  static initAsGuitarOpenE(): Fretboard {
    return Fretboard.initFromTuning(['E', 'B', 'E', 'G#', 'B', 'E']);
  }

  static initAsPedalSteelE9(): Fretboard {
    const fretboard = Fretboard.initFromTuning(['B', 'D', 'E', 'F#', 'G#', 'B', 'E', 'G#', 'D#', 'F#']);
    for (const pedalName of Object.keys(E9_PEDAL_CHANGES)) {
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
    return this.tuning.map((openNote) =>
      Array.from({ length: endFret - startFret + 1 }, (_, fret) => (openNote + startFret + fret) % 12)
    );
  }

  generateScaleAsIntegers(key: string, intervals: number[], startFret: number, endFret: number): (number | null)[][] {
    const keyInt = convertStrNoteToInt(key);
    const fretboard = this.generateFretboard(startFret, endFret);

    return fretboard.map((stringNotes) =>
      stringNotes.map((note) => (intervals.includes((note - keyInt + 12) % 12) ? note : null))
    );
  }

  generateMajorPentatonicScaleAsIntegers(key: string, startFret: number, endFret: number): (number | null)[][] {
    return this.generateScaleAsIntegers(key, [0, 2, 4, 7, 9], startFret, endFret);
  }

  generateMajorScaleAsIntegers(key: string, startFret: number, endFret: number): (number | null)[][] {
    return this.generateScaleAsIntegers(key, [0, 2, 4, 5, 7, 9, 11], startFret, endFret);
  }

  generateMajorScaleAsIntervals(key: string, startFret: number, endFret: number): (string | null)[][] {
    const scaleInts = this.generateMajorScaleAsIntegers(key, startFret, endFret);
    return Fretboard.convertFretboardScaleToIntervals(key, scaleInts);
  }

  generateVoicing(voicing: Voicing): (number | null)[][] {
    const baseKeyInt = convertStrNoteToInt('C');
    const fretboard = this.generateFretboard(0, 12);

    if (fretboard.length !== voicing.notes.length) {
      throw new Error('Voicing and tuning do not match!');
    }

    return fretboard.map((stringNotes, stringIndex) => {
      const fret = voicing.notes[stringIndex];
      return stringNotes.map((note) => {
        if (fret === null || fret === undefined) return null;
        const voicingNote = (fret + this.tuning[stringIndex]) % 12;
        return voicingNote === note ? (voicingNote - baseKeyInt + 12) % 12 : null;
      });
    });
  }

  getAllPedalCombinations(): string[][] {
    return Pedal.getAllPedalCombinations(this.getPedalsAsStr());
  }

  getIntervalsAtFret(fret: number, pedals: Pedal[], key = 'E'): number[] {
    const keyInt = convertStrNoteToInt(key);
    const intervals = this.tuning.map((note) => (note + fret - keyInt + 12) % 12);

    const pedalNames = this.getPedalsAsStr();
    for (const pedal of pedals) {
      if (!pedalNames.includes(pedal.name)) {
        throw new Error('Invalid pedal');
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
    pedalsToApply?: Pedal[]
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

        const interval = (actualNote - keyInt + 12) % 12;
        return convertIntIntervalToStr(interval);
      })
    );

    return result;
  }
}

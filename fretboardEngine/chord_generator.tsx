// Converted from Python to TypeScript

import { Chord, Voicing } from './chords';
import { Fretboard } from './fretboard';
import { convertStrIntervalToInt } from './notes_utils';
import { Pedal } from './pedal';

const CHORD_FORMULAS: Record<string, string[]> = {
  M: ['1', '3', '5'],
  m: ['1', 'b3', '5'],
  m7: ['1', 'b3', '5', 'b7'],
  M7: ['1', '3', '5', '7'],
  sus2: ['1', '2', '5'],
  sus4: ['1', '4', '5'],
  add9: ['1', '2', '3', '5'],
  madd9: ['1', '2', 'b3', '5'],
  '7': ['1', '3', '5', 'b7'],
  M6: ['1', '3', '5', '6'],
  aug: ['1', '3', '#5'],
  dim: ['1', 'b3', 'b5'],
  Mb5: ['1', '3', 'b5'],
  m7b5: ['1', 'b3', 'b5', 'b7'],
  mb5bb7: ['1', 'b3', 'b5', 'bb7'],
  M6add9: ['1', '2', '3', '5', '6'],
  'M7/6': ['1', '3', '5', '7', '6'],
  mm6: ['1', 'b3', '5', 'b6'],
  mM6: ['1', 'b3', '5', '6'],
  M9: ['1', '3', '5', '7', '2'],
  m9: ['1', 'b3', '5', 'b7', 'b2'],
  '9': ['1', '3', '5', 'b7', '9'],
  mM9: ['1', 'b3', '5', 'b7', '2'],
  '7b9': ['1', '3', '5', 'b7', 'b2'],
  '7#9': ['1', '3', '5', 'b7', 'b3'],
  b5b13: ['1', '3', 'b5', 'b6'],
  '11': ['1', '3', '5', '7', '2', '4'],
  '13': ['1', '3', '5', '7', '2', '4', '6'],
};

export class ChordGenerator {
  fretboard: Fretboard;

  constructor(fretboard: Fretboard) {
    this.fretboard = fretboard;
  }

  generateVoicings(formula: string[], key: string): Voicing[] {
    const formulaAsInt = formula.map(convertStrIntervalToInt);
    const pedalCombinations = this.fretboard.getAllPedalCombinations();
    const voicings: Voicing[] = [];

    for (let fret = 0; fret < 12; fret++) {
      for (const pedalCombination of pedalCombinations) {
        const pedalsToApply: Pedal[] = pedalCombination.map(Pedal.initFromName);
        const intervalsAtFret = this.fretboard.getIntervalsAtFret(fret, pedalsToApply, key);

        const chordNotComplete = formulaAsInt.some(interval => !intervalsAtFret.includes(interval));
        if (chordNotComplete) continue;

        const voicing = new Voicing();
        voicing.pedals = pedalCombination;
        voicing.notes = [...intervalsAtFret];

        for (let i = 0; i < voicing.notes.length; i++) {
          const note = voicing.notes[i]; // weird bu needed to avoid TS error
          if (note !== null && formulaAsInt.includes(note)) {
            voicing.notes[i] = fret;
          } else {
            voicing.notes[i] = null;
          }
        }

        let pedalNotNecessary = false;
        for (const pedal of pedalsToApply) {
          let hasNecessaryChange = false;
          for (const [stringIdx] of pedal.changes) {
            if (voicing.notes[stringIdx] !== null) {
              hasNecessaryChange = true;
              break;
            }
          }
          if (!hasNecessaryChange) {
            pedalNotNecessary = true;
            break;
          }
        }

        if (pedalNotNecessary) continue;

        voicings.push(voicing);
      }
    }

    return voicings;
  }

  static generateE9Chords(keyAsStr: string, minNbNotes = 0): Record<string, Chord> {
    const chordGenerator = new ChordGenerator(Fretboard.initAsPedalSteelE9());
    const chords: Record<string, Chord> = {};

    for (const [key, value] of Object.entries(CHORD_FORMULAS)) {
      const chord = new Chord(keyAsStr, key);
      chord.voicings = chordGenerator.generateVoicings(value, keyAsStr);

      const filteredVoicings = chord.voicings.filter(
        v => v.getNumberOfNotes() >= minNbNotes && !v.isPartOfOtherVoicings(chord.voicings)
      );

      chord.voicings = filteredVoicings;
      chords[key] = chord;
    }

    return chords;
  }

  static generateOpenEChords(keyAsStr: string): Record<string, Chord> {
    const chordGenerator = new ChordGenerator(Fretboard.initAsGuitarOpenE());
    const chords: Record<string, Chord> = {};

    for (const [key, value] of Object.entries(CHORD_FORMULAS)) {
      const chord = new Chord(keyAsStr, key);
      chord.voicings = chordGenerator.generateVoicings(value, keyAsStr);
      chords[key] = chord;
    }

    return chords;
  }
}

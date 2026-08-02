// Converted from Python to TypeScript

import { Chord, Voicing } from "./chords";
import { CHORD_FORMULAS } from "./chordUtils";
import { Fretboard } from "./fretboard";
import { convertStrIntervalToInt } from "./notesUtils";
import { Pedal } from "./pedal";
export class ChordGenerator {
  fretboard: Fretboard;

  constructor(fretboard: Fretboard) {
    this.fretboard = fretboard;
  }

  generateVoicings(formula: string[], key: string, maxPedals = 7, allowTwoLeversPlusPedals = false): Voicing[] {
    const formulaAsInt = formula.map(convertStrIntervalToInt);
    const pedalCombinations = Pedal.getAllPedalCombinations(this.fretboard.pedals, maxPedals, allowTwoLeversPlusPedals);
    const voicings: Voicing[] = [];

    for (let fret = 0; fret < 12; fret++) {
      for (const pedalCombination of pedalCombinations) {
        // pedalCombination is an array of user-defined names, look up Pedal objects
        const pedalsToApply: Pedal[] = pedalCombination
          .map((name) => this.fretboard.pedals.find((p) => p.name === name))
          .filter((p): p is Pedal => p !== undefined);
        const intervalsAtFret = this.fretboard.getIntervalsAtFret(fret, pedalsToApply, key);

        const chordNotComplete = formulaAsInt.some((interval) => !intervalsAtFret.includes(interval));
        if (chordNotComplete) continue;

        const voicing = new Voicing();
        // Store user-defined names for backward compatibility
        voicing.pedals = pedalCombination;
        voicing.pedalObjects = pedalsToApply;
        voicing.notes = [...intervalsAtFret];
        voicing.generatedForKey = key;

        for (let i = 0; i < voicing.notes.length; i++) {
          const note = voicing.notes[i]; // weird but needed to avoid TS error
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

  static generateE9Chords(
    keyAsStr: string,
    minNbNotes = 0,
    ignoreSubsets = false,
    maxPedals = 7,
  ): Record<string, Chord> {
    const chordGenerator = new ChordGenerator(Fretboard.initAsPedalSteelE9());
    const chords: Record<string, Chord> = {};

    for (const [key, value] of Object.entries(CHORD_FORMULAS)) {
      const chord = new Chord(keyAsStr, key);
      chord.voicings = chordGenerator.generateVoicings(value, keyAsStr, maxPedals);

      const filteredVoicings = chord.voicings.filter(
        (v) => v.getNumberOfNotes() >= minNbNotes && (!ignoreSubsets || !v.isPartOfOtherVoicings(chord.voicings)),
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


// To run: npx jest fretboardEngine/tests/chord_generator.test.tsx
import fs from 'fs';
import path from 'path';

import { ChordGenerator } from '../chord_generator';
import { Chord } from '../chords';
import { Fretboard } from '../fretboard';

describe('ChordGenerator', () => {
  test('generate and write open E chords', () => {
    const chords = ChordGenerator.generateOpenEChords('E');
    const fretboard = Fretboard.initAsGuitarOpenE();
    const jsonDict = Chord.listToJson(chords, fretboard.tuning);

    const outputPath = path.join(__dirname, './data/open_e_generated_chords.json');
    fs.writeFileSync(outputPath, JSON.stringify(jsonDict, null, 2));
  });

  test('generate E9 chords and check structure', () => {
    const chords = ChordGenerator.generateE9Chords('E');

    expect(chords['M'].voicings[0].pedals).toEqual([]);
    expect('m' in chords).toBeTruthy();
    expect('m7' in chords).toBeTruthy();
    expect('M7' in chords).toBeTruthy();
    expect('sus2' in chords).toBeTruthy();
    expect('sus4' in chords).toBeTruthy();
    expect('add9' in chords).toBeTruthy();
    expect('madd9' in chords).toBeTruthy();
    expect('7' in chords).toBeTruthy();
    expect('M6' in chords).toBeTruthy();
    expect('aug' in chords).toBeTruthy();
    expect('dim' in chords).toBeTruthy();
    expect('Mb5' in chords).toBeTruthy();
    expect('m7b5' in chords).toBeTruthy();
    expect('mb5bb7' in chords).toBeTruthy();
    expect('M6add9' in chords).toBeTruthy();
    expect('M7/6' in chords).toBeTruthy();
    expect('mm6' in chords).toBeTruthy();
    expect('mM6' in chords).toBeTruthy();
    expect('M9' in chords).toBeTruthy();
    expect('9' in chords).toBeTruthy();
    expect('7b9' in chords).toBeTruthy();
    expect('7#9' in chords).toBeTruthy();
    expect('m9' in chords).toBeTruthy();
    expect('mM9' in chords).toBeTruthy();
    expect('b5b13' in chords).toBeTruthy();
    expect('11' in chords).toBeTruthy();
    expect('13' in chords).toBeTruthy();

    const fretboard = Fretboard.initAsPedalSteelE9();
    const jsonDict = Chord.listToJson(chords, fretboard.tuning);

    const outputPath = path.join(__dirname, './data/e9_all_generated_chords.json');
    fs.writeFileSync(outputPath, JSON.stringify(jsonDict, null, 2));

    // Load JSON and validate specific voicings
    const fileContents = fs.readFileSync(outputPath, 'utf-8');
    const data = JSON.parse(fileContents);

    const chordNames = data.chords.map((chord: any) => chord.name);
    expect(chordNames).toContain('7#9');
    expect(chordNames).toContain('mb5bb7');

    const mChord = data.chords.find((chord: any) => chord.name === 'M');
    expect(mChord).toBeDefined();

    const expectedVoicing = mChord.voicings.find((voicing: any) => (
      JSON.stringify(voicing.notes) === JSON.stringify([3, 3, 3, 'x', 3, 3, 3, 3, 3, 'x']) &&
      JSON.stringify(voicing.intervals) === JSON.stringify(['1', '1', '3', 'x', '5', '1', '3', '5', '1', 'x']) &&
      JSON.stringify(voicing.pedals) === JSON.stringify(['A', 'F', 'D'])
    ));
    expect(expectedVoicing).toBeDefined();
  });

  test('write E9 chords with min_nb_notes to json', () => {
    const chords = ChordGenerator.generateE9Chords('E', 6);
    const fretboard = Fretboard.initAsPedalSteelE9();
    const jsonDict = Chord.listToJson(chords, fretboard.tuning);

    const outputPath = path.join(__dirname, './data/e9_generated_chords.json');
    fs.writeFileSync(outputPath, JSON.stringify(jsonDict, null, 2));
  });
});

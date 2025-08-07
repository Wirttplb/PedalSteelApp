import { readFileSync } from 'fs';
import { Chord, Voicing } from './chords';

interface VoicingJson {
  // Define the expected structure of a voicing
    pedals: string[];
    notes: string[];
}

interface ChordJson {
  type: string;
  voicings: VoicingJson[];
}

interface ChordsFile {
  chords: ChordJson[];
}

export function importE9ChordsFromJson(filepath: string): Chord[] {
  const fileContent = readFileSync(filepath, 'utf-8');
  const data: ChordsFile = JSON.parse(fileContent);

  const chords: Chord[] = [];

  for (const chordJson of data.chords) {
    const chord = new Chord('E', chordJson.type);

    for (const voicingJson of chordJson.voicings) {
      const voicing = Voicing.fromE9Json(voicingJson);
      chord.voicings.push(voicing);
    }

    chords.push(chord);
  }

  return chords;
}
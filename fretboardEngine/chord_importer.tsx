import { readFileSync } from 'fs';
import { Chord, Voicing } from './chords';
import shortListData from './tests/data/e9_generated_simple_chords.json';

interface VoicingJson {
  // Define the expected structure of a voicing
    pedals: string[];
    notes: string[];
    intervals: string[];
}

interface ChordJson {
  name: string;
  voicings: VoicingJson[];
}

interface ChordsFile {
  chords: ChordJson[];
}

export function importE9ChordsFromJson(filepath: string, readFromShortlist = false): Chord[] {
    
    let data: ChordsFile;
    if (readFromShortlist)
    {
        data = shortListData as ChordsFile;
    }
    else
    {
        const fileContent = readFileSync(filepath, 'utf-8');
        data = JSON.parse(fileContent);
    }

  const chords: Chord[] = [];

  for (const chordJson of data.chords) {
    const chord = new Chord('E', chordJson.name);

    for (const voicingJson of chordJson.voicings) {
      const voicing = Voicing.fromE9Json(voicingJson);
      chord.voicings.push(voicing);
    }

    chords.push(chord);
  }

  return chords;
}
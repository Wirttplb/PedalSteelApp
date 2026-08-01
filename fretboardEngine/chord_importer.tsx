import { Chord, Voicing } from './chords';
import { Pedal } from './pedal';

interface VoicingJson {
  // Define the expected structure of a voicing
  pedals: string[];
  pedalPhysicalNames?: string[];
  notes: string[];
  intervals: string[];
}

interface ChordJson {
  name: string;
  voicings: VoicingJson[];
}

export interface ChordsFile {
  chords: ChordJson[];
}

export function importE9ChordsFromJson(data: ChordsFile, allPedals: Pedal[] = []): Chord[] {
  const chords: Chord[] = [];

  for (const chordJson of data.chords) {
    const chord = new Chord('E', chordJson.name);

    for (const voicingJson of chordJson.voicings) {
      const voicing = Voicing.fromE9Json(voicingJson, allPedals);
      chord.voicings.push(voicing);
    }

    chords.push(chord);
  }

  return chords;
}

import { convertIntIntervalToStr, convertStrNoteToInt, MUTED_STRING_CHAR } from './notes_utils';
import { Pedal } from './pedal';

export class Voicing {
  pedals: string[] = [];
  notes: (number | null)[] = [];

  constructor() {
    this.pedals = [];
    this.notes = [];
  }

  static fromE9Json(voicingJson: { pedals: string[]; notes: string[] }): Voicing {
    const voicing = new Voicing();
    voicing.pedals = voicingJson.pedals;
    voicing.notes = voicingJson.notes.map(jsonNote =>
      jsonNote !== MUTED_STRING_CHAR ? parseInt(jsonNote, 10) : null
    );
    return voicing;
  }

//   getNumberOfNotes(): number {
//     return this.notes.reduce((count, note) => note !== null ? count + 1 : count, 0);
//   }

  isPartOfOtherVoicing(other: Voicing): boolean {
    for (const pedal of this.pedals) {
      if (!other.pedals.includes(pedal)) {
        return false;
      }
    }

    for (let i = 0; i < this.notes.length; i++) {
      const note = this.notes[i];
      const otherNote = other.notes[i];

      if (note !== null && otherNote === null) return false;
      if (note !== null && otherNote !== null && note !== otherNote) return false;
    }

    return true;
  }

  isPartOfOtherVoicings(others: Voicing[]): boolean {
    return others.some(other => other !== this && this.isPartOfOtherVoicing(other));
  }
}

export class Chord {
  key: string;
  type: string;
  voicings: Voicing[] = [];

  constructor(key: string, type: string) {
    this.key = key;
    this.type = type;
    this.voicings = [];
  }

  toJson(tuning: number[]): any {
    const jsonDict: any = {
      name: this.type,
      voicings: []
    };

    const keyAsInt = convertStrNoteToInt(this.key);

    for (const voicing of this.voicings) {
      const voicingDict: any = {
        pedals: voicing.pedals,
        notes: voicing.notes.map(note => note !== null ? note : MUTED_STRING_CHAR),
        intervals: voicing.notes.map((note, i) => 
          note !== null ? (note + tuning[i] - keyAsInt + 12) % 12 : null
        )
      };

      for (const pedal of voicing.pedals) {
        const pedalObj = Pedal.initFromName(pedal);

        for (let i = 0; i < voicingDict.intervals.length; i++) {
          for (const change of pedalObj.changes) {
            if (change[0] === i && voicingDict.intervals[i] !== null) {
              voicingDict.intervals[i] = (voicingDict.intervals[i] + change[1]) % 12;
            }
          }
        }
      }

      voicingDict.intervals = voicingDict.intervals.map((interval: number | null) =>
        interval !== null ? convertIntIntervalToStr(interval) : MUTED_STRING_CHAR
      );

      jsonDict.voicings.push(voicingDict);
    }

    return jsonDict;
  }

  static listToJson(chords: Record<string, Chord>, tuning: number[]): any {
    return {
      chords: Object.values(chords).map(chord => chord.toJson(tuning))
    };
  }
}

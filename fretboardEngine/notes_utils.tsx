export const MUTED_STRING_CHAR: string = "x";

export function convertStrNotesToInt(notes: string[]): number[] {
    return notes.map(note => convertStrNoteToInt(note));
}

export function convertIntNotesToStr(notes: number[], asSharps: boolean = false): string[] {
    return notes.map(note => convertIntNoteToStr(note, asSharps));
}

export function convertStrNoteToInt(note: string): number {
    switch (note) {
        case "C": return 0;
        case "C#":
        case "Db": return 1;
        case "D": return 2;
        case "D#":
        case "Eb": return 3;
        case "E": return 4;
        case "F": return 5;
        case "F#":
        case "Gb": return 6;
        case "G": return 7;
        case "G#":
        case "Ab": return 8;
        case "A": return 9;
        case "A#":
        case "Bb": return 10;
        case "B": return 11;
        default: throw new Error("Invalid note!");
    }
}

export function convertIntNoteToStr(note: number, asSharps: boolean = false): string {
    switch (note) {
        case 0: return "C";
        case 1: return asSharps ? "C#" : "Db";
        case 2: return "D";
        case 3: return asSharps ? "D#" : "Eb";
        case 4: return "E";
        case 5: return "F";
        case 6: return asSharps ? "F#" : "Gb";
        case 7: return "G";
        case 8: return asSharps ? "G#" : "Ab";
        case 9: return "A";
        case 10: return asSharps ? "A#" : "Bb";
        case 11: return "B";
        default: throw new Error("Invalid note!");
    }
}

export function convertIntIntervalToStr(note: number): string {
    const reversedIntervalMap: { [key: number]: string } = {
        0: "1", 1: "b2", 2: "2", 3: "b3", 4: "3", 5: "4", 6: "b5", 7: "5", 8: "b6", 9: "6", 10: "b7", 11: "7"
    };

    if (note in reversedIntervalMap) {
        return reversedIntervalMap[note];
    } else {
        throw new Error("Invalid interval value!");
    }
}

export function convertStrIntervalToInt(interval: string): number {
    const intervalMap: { [key: string]: number } = {
        "1": 0, "b2": 1, "2": 2, "b3": 3, "3": 4, "4": 5, "b5": 6, "5": 7, "#5": 8, "b6": 8, "6": 9, "bb7": 9, "b7": 10, "7": 11, "9": 2, "11": 5, "13": 9
    };

    if (interval in intervalMap) {
        return intervalMap[interval];
    } else {
        throw new Error("Invalid interval name!");
    }
}

  export function getScaleAsIntegers(scale: string): number[] {
    switch (scale) {
      case 'Ionian':
      case 'Major':
        return [0, 2, 4, 5, 7, 9, 11];
      case 'Dorian':
        return [0, 2, 3, 5, 7, 9, 10];
      case 'Phrygian':
        return [0, 1, 3, 5, 7, 8, 10];
      case 'Lydian':
        return [0, 2, 4, 6, 7, 9, 11];
      case 'Mixolydian':
        return [0, 2, 4, 5, 7, 9, 10];
      case 'Aeolian':
      case 'Minor':
        return [0, 2, 3, 5, 7, 8, 10];
      case 'Locrian':
        return [0, 1, 3, 5, 6, 8, 10];
      case 'Major Pentatonic':
        return [0, 2, 4, 7, 9];
      case 'Minor Pentatonic':
        return [0, 3, 5, 7, 10];
      case 'Diminished Seventh':
        return [0, 3, 6, 9];
      case 'Whole-tone':
        return [0, 2, 4, 6, 8, 10];
      default:
        throw new Error(`Invalid scale: ${scale}`);
    }
  }
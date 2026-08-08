import { useKey } from "../appContext/keyContext";
import BaseSelector from "./BaseSelector";

export default function ChordSelector() {
  const { chordType, setChordType } = useKey();

  const chordItems = [
    // triads
    { label: "M", value: "M" },
    { label: "m", value: "m" },
    { label: "aug", value: "aug" },
    { label: "dim", value: "dim" },
    // 7ths
    { label: "7", value: "7" },
    { label: "M7", value: "M7" },
    { label: "m7", value: "m7" },
    { label: "m7b5", value: "m7b5" },
    { label: "mb5bb7 (dim7)", value: "mb5bb7" },
    // sixths
    { label: "M6", value: "M6" },
    { label: "m6", value: "m6" }, // (mm6)
    //{ label: "mM6", value: "mM6" },
    //{ label: "M7/6", value: "M7/6" },
    { label: "M6/9", value: "M6/9" },
    // suspended
    { label: "sus2", value: "sus2" },
    { label: "sus4", value: "sus4" },
    // add chords
    { label: "add9", value: "add9" },
    { label: "madd9", value: "madd9" },
    // extended / dominant colors
    { label: "M9", value: "M9" },
    { label: "m9", value: "m9" },
    //{ label: "mM9", value: "mM9" },
    { label: "9", value: "9" },
    { label: "7b9", value: "7b9" },
    { label: "7#9", value: "7#9" },
    { label: "7sus4", value: "7sus4" },
    { label: "11", value: "11" },
    { label: "13", value: "13" },
    // altered / special-function chords
    { label: "7b5", value: "7b5" },
    { label: "7#5", value: "7#5" },
    { label: "7#11", value: "7#11" },
    //{ label: "Mb5", value: "Mb5" },
    //{ label: "b5b13", value: "b5b13" },
  ];

  return <BaseSelector value={chordType} onValueChange={setChordType} items={chordItems} />;
}

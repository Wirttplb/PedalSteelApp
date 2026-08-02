import React from "react";
import { useKey } from "../app/keyContext";
import BaseSelector from "./BaseSelector";

export default function ChordSelector() {
  const { chordType, setChordType } = useKey();

  const chordItems = [
    { label: "M", value: "M" },
    { label: "m", value: "m" },
    { label: "M7", value: "M7" },
    { label: "m7", value: "m7" },
    { label: "7", value: "7" },
    { label: "aug", value: "aug" },
    { label: "dim", value: "dim" },
    { label: "sus2", value: "sus2" },
    { label: "sus4", value: "sus4" },
    { label: "M6", value: "M6" },
    { label: "mm6", value: "mm6" },
    { label: "mM6", value: "mM6" },
    { label: "M7/6", value: "M7/6" },
    { label: "M6add9", value: "M6add9" },
    { label: "add9", value: "add9" },
    { label: "madd9", value: "madd9" },
    { label: "M9", value: "M9" },
    { label: "m9", value: "m9" },
    { label: "mM9", value: "mM9" },
    { label: "9", value: "9" },
    { label: "7b9", value: "7b9" },
    { label: "7#9", value: "7#9" },
    { label: "11", value: "11" },
    { label: "13", value: "13" },
    { label: "Mb5", value: "Mb5" },
    { label: "m7b5", value: "m7b5" },
    { label: "mb5bb7", value: "mb5bb7" },
    { label: "b5b13", value: "b5b13" },
  ];

  return <BaseSelector value={chordType} onValueChange={setChordType} items={chordItems} />;
}

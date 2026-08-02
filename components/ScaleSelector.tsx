import React from "react";
import { useKey } from "../appContext/keyContext";
import BaseSelector from "./BaseSelector";

export default function ScaleSelector() {
  const { selectedMode, setSelectedMode } = useKey();

  const scaleItems = [
    { label: "Major", value: "Major" },
    { label: "Minor", value: "Minor" },
    { label: "Major Pentatonic", value: "Major Pentatonic" },
    { label: "Minor Pentatonic", value: "Minor Pentatonic" },
    { label: "Dorian", value: "Dorian" },
    { label: "Phrygian", value: "Phrygian" },
    { label: "Lydian", value: "Lydian" },
    { label: "Mixolydian", value: "Mixolydian" },
    { label: "Aeolian", value: "Aeolian" },
    { label: "Locrian", value: "Locrian" },
    { label: "Diminished Seventh", value: "Diminished Seventh" },
    { label: "Augmented", value: "Augmented" },
    { label: "Whole-tone", value: "Whole-tone" },
    { label: "Chromatic", value: "Chromatic" },
  ];

  return <BaseSelector value={selectedMode} onValueChange={setSelectedMode} items={scaleItems} />;
}

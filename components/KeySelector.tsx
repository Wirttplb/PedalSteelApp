import React from "react";
import { useKey } from "../appContext/keyContext";
import BaseSelector from "./BaseSelector";

export default function KeySelector() {
  const { selectedKey, setSelectedKey } = useKey();

  const keyItems = [
    { label: "C", value: "C" },
    { label: "C#", value: "C#" },
    { label: "D", value: "D" },
    { label: "D#", value: "D#" },
    { label: "E", value: "E" },
    { label: "F", value: "F" },
    { label: "F#", value: "F#" },
    { label: "G", value: "G" },
    { label: "G#", value: "G#" },
    { label: "A", value: "A" },
    { label: "A#", value: "A#" },
    { label: "B", value: "B" },
  ];

  return <BaseSelector value={selectedKey} onValueChange={setSelectedKey} items={keyItems} />;
}

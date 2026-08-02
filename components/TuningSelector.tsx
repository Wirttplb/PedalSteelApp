import React from "react";
import { useKey } from "../app/keyContext";
import BaseSelector from "./BaseSelector";

export default function TuningSelector() {
  const { tuning, setTuning, setChordMode } = useKey();

  const tuningItems = [
    { label: "E9", value: "E9" },
    { label: "Open E", value: "Open E" },
    { label: "Standard", value: "Standard" },
  ];

  return (
    <BaseSelector
      value={tuning}
      onValueChange={(itemValue) => {
        setTuning(itemValue);
        setChordMode("Scale");
      }}
      items={tuningItems}
    />
  );
}

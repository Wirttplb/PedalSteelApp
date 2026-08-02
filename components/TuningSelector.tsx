import React from "react";
import { useKey } from "../appContext/keyContext";
import { getAllTuningDisplayNames } from "../fretboardEngine/tuningUtils";
import BaseSelector from "./BaseSelector";

export default function TuningSelector() {
  const { tuning, setTuning } = useKey();

  const tuningItems = getAllTuningDisplayNames().map((displayName) => {
    return { label: displayName, value: displayName };
  });

  return <BaseSelector value={tuning} onValueChange={setTuning} items={tuningItems} />;
}

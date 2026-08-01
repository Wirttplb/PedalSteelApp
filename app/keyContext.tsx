import React, { createContext, useContext, useState } from "react";
import { E9_PEDAL_CHANGES, Pedal } from "../fretboardEngine/pedal";

type KeyContextType = {
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  chordMode: string;
  setChordMode: (chordMode: string) => void;
  chordType: string;
  setChordType: (chordType: string) => void;
  tuning: string;
  setTuning: (tuning: string) => void;
  pedals: Pedal[];
  setPedals: (pedals: Pedal[]) => void;
  activePedals: number[];
  setActivePedals: (pedals: number[]) => void;
  intervalsColorCode: boolean;
  setIntervalsColorCode: (v: boolean) => void;
};

const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const KeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedKey, setSelectedKey] = useState("E");
  const [selectedMode, setSelectedMode] = useState("Major");
  const [chordMode, setChordMode] = useState("Scale");
  const [chordType, setChordType] = useState("M");
  const [tuning, setTuning] = useState("E9");

  const initialPedals = Object.keys(E9_PEDAL_CHANGES).map((name) => {
    const p = new Pedal();
    p.name = name;
    p.changes = E9_PEDAL_CHANGES[name];
    return p;
  });

  const [pedals, setPedals] = useState<Pedal[]>(initialPedals);
  const [activePedals, setActivePedals] = useState<number[]>([]);
  const [intervalsColorCode, setIntervalsColorCode] = useState(false);

  return (
    <KeyContext.Provider
      value={{
        selectedKey,
        setSelectedKey,
        selectedMode,
        setSelectedMode,
        chordMode,
        setChordMode,
        chordType,
        setChordType,
        tuning,
        setTuning,
        pedals,
        setPedals,
        activePedals,
        setActivePedals,
        intervalsColorCode,
        setIntervalsColorCode,
      }}
    >
      {children}
    </KeyContext.Provider>
  );
};

export const useKey = () => {
  const context = useContext(KeyContext);
  if (!context) throw new Error("useKey must be used within a KeyProvider");
  return context;
};

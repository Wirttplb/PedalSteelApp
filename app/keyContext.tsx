import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Pedal, PhysicalPedal, STANDARD_E9_PEDAL_CHANGES } from "../fretboardEngine/pedal";

const STORAGE_KEY = "pedalsteel_settings";

export function buildInitialPedals(): Pedal[] {
  // map default pedal names to my physical pedal setup
  const physicalPedalMap: Record<string, PhysicalPedal> = {
    A: "A",
    "A/2": "A",
    B: "B",
    C: "C",
    E: "RKL",
    F: "RKR",
    G: "LKR",
    D: "LKL",
    "D/2": "LKL",
  };

  return Object.keys(STANDARD_E9_PEDAL_CHANGES).map((name) => {
    const p = new Pedal();
    p.name = name;
    p.physicalName = physicalPedalMap[name] || "A";
    p.changes = STANDARD_E9_PEDAL_CHANGES[name];
    return p;
  });
}

function pedalsFromJSON(raw: unknown): Pedal[] {
  if (!Array.isArray(raw)) return buildInitialPedals();
  return raw.map((item: { name: string; physicalName: PhysicalPedal; changes: [number, number][] }) => {
    const p = new Pedal();
    p.name = item.name;
    p.physicalName = item.physicalName;
    p.changes = item.changes;
    return p;
  });
}

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
  disabledPedals: number[];
  setDisabledPedals: (pedals: number[]) => void;
  intervalsColorCode: boolean;
  setIntervalsColorCode: (v: boolean) => void;
  chordsGeneratedDynamically: boolean;
  setChordsGeneratedDynamically: (v: boolean) => void;
  showPedalChangeLabels: boolean;
  setShowPedalChangeLabels: (v: boolean) => void;
  showPedalNameLabels: boolean;
  setShowPedalNameLabels: (v: boolean) => void;
};

const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const KeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedKey, setSelectedKey] = useState("E");
  const [selectedMode, setSelectedMode] = useState("Major");
  const [chordMode, setChordMode] = useState("Scale");
  const [chordType, setChordType] = useState("M");
  const [tuning, setTuning] = useState("E9");
  const [pedals, setPedals] = useState<Pedal[]>(buildInitialPedals());
  const [activePedals, setActivePedals] = useState<number[]>([]);
  const [disabledPedals, setDisabledPedals] = useState<number[]>([]);
  const [intervalsColorCode, setIntervalsColorCode] = useState(false);
  const [chordsGeneratedDynamically, setChordsGeneratedDynamically] = useState(false);
  const [showPedalChangeLabels, setShowPedalChangeLabels] = useState(true);
  const [showPedalNameLabels, setShowPedalNameLabels] = useState(true);

  // Load persisted settings once on mount
  const loaded = useRef(false);
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) {
        try {
          const s = JSON.parse(json);
          if (s.selectedKey) setSelectedKey(s.selectedKey);
          if (s.selectedMode) setSelectedMode(s.selectedMode);
          if (s.chordMode) setChordMode(s.chordMode);
          if (s.chordType) setChordType(s.chordType);
          if (s.tuning) setTuning(s.tuning);
          if (s.pedals) setPedals(pedalsFromJSON(s.pedals));
          if (s.disabledPedals) setDisabledPedals(s.disabledPedals);
          if (typeof s.intervalsColorCode === "boolean") setIntervalsColorCode(s.intervalsColorCode);
          if (typeof s.chordsGeneratedDynamically === "boolean")
            setChordsGeneratedDynamically(s.chordsGeneratedDynamically);
          if (typeof s.showPedalChangeLabels === "boolean") setShowPedalChangeLabels(s.showPedalChangeLabels);
          if (typeof s.showPedalNameLabels === "boolean") setShowPedalNameLabels(s.showPedalNameLabels);
        } catch {}
      }
      loaded.current = true;
    });
  }, []);

  // Persist whenever settings change (skip before first load completes)
  useEffect(() => {
    if (!loaded.current) return;
    const data = {
      selectedKey,
      selectedMode,
      chordMode,
      chordType,
      tuning,
      pedals: pedals.map((p) => ({ name: p.name, physicalName: p.physicalName, changes: p.changes })),
      disabledPedals,
      intervalsColorCode,
      chordsGeneratedDynamically,
      showPedalChangeLabels,
      showPedalNameLabels,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    selectedKey,
    selectedMode,
    chordMode,
    chordType,
    tuning,
    pedals,
    intervalsColorCode,
    chordsGeneratedDynamically,
    showPedalChangeLabels,
    showPedalNameLabels,
  ]);

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
        disabledPedals,
        setDisabledPedals,
        intervalsColorCode,
        setIntervalsColorCode,
        chordsGeneratedDynamically,
        setChordsGeneratedDynamically,
        showPedalChangeLabels,
        setShowPedalChangeLabels,
        showPedalNameLabels,
        setShowPedalNameLabels,
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

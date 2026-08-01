import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { E9_PEDAL_CHANGES, Pedal } from "../fretboardEngine/pedal";

const STORAGE_KEY = "pedalsteel_settings";

function buildInitialPedals(): Pedal[] {
  return Object.keys(E9_PEDAL_CHANGES).map((name) => {
    const p = new Pedal();
    p.name = name;
    p.changes = E9_PEDAL_CHANGES[name];
    return p;
  });
}

function pedalsFromJSON(raw: unknown): Pedal[] {
  if (!Array.isArray(raw)) return buildInitialPedals();
  return raw.map((item: { name: string; changes: [number, number][] }) => {
    const p = new Pedal();
    p.name = item.name;
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
  const [pedals, setPedals] = useState<Pedal[]>(buildInitialPedals());
  const [activePedals, setActivePedals] = useState<number[]>([]);
  const [intervalsColorCode, setIntervalsColorCode] = useState(false);

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
          if (typeof s.intervalsColorCode === "boolean") setIntervalsColorCode(s.intervalsColorCode);
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
      pedals: pedals.map((p) => ({ name: p.name, changes: p.changes })),
      intervalsColorCode,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [selectedKey, selectedMode, chordMode, chordType, tuning, pedals, intervalsColorCode]);

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

import React, { createContext, useContext, useState } from 'react';

type KeyContextType = {
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  chordMode: string;
  setChordMode: (chordMode: string) => void;
  chordType: string;
  setChordType: (chordType: string) => void;
  voicingIdx: number;
  setVoicingIdx: (voicingIdx: number) => void;
  tuning: string;
  setTuning: (tuning: string) => void;
};

const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const KeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedKey, setSelectedKey] = useState('E');
  const [selectedMode, setSelectedMode] = useState('Major');
  const [chordMode, setChordMode] = useState('Scale');
  const [chordType, setChordType] = useState('M');
  const [voicingIdx, setVoicingIdx] = useState(0);
  const [tuning, setTuning] = useState('E9');
  
  return (
    <KeyContext.Provider value={{
        selectedKey, setSelectedKey,
        selectedMode, setSelectedMode,
        chordMode, setChordMode,
        chordType, setChordType,
        voicingIdx, setVoicingIdx,
        tuning, setTuning,
        }}>
      {children}
    </KeyContext.Provider>
  );
};

export const useKey = () => {
  const context = useContext(KeyContext);
  if (!context) throw new Error('useKey must be used within a KeyProvider');
  return context;
};
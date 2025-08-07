import React, { createContext, useContext, useState } from 'react';

type KeyContextType = {
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
};

const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const KeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedKey, setSelectedKey] = useState('E');
  const [selectedMode, setSelectedMode] = useState('Major');
  return (
    <KeyContext.Provider value={{ selectedKey, setSelectedKey, selectedMode, setSelectedMode }}>
      {children}
    </KeyContext.Provider>
  );
};

export const useKey = () => {
  const context = useContext(KeyContext);
  if (!context) throw new Error('useKey must be used within a KeyProvider');
  return context;
};
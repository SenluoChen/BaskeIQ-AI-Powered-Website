// src/contexts/MatchContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

export type MatchType = {
  id: number;
  name: string;
  date: string;
};

type MatchContextType = {
  matches: MatchType[];
  setMatches: React.Dispatch<React.SetStateAction<MatchType[]>>;
};

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<MatchType[]>([]);

  // 初始化 localStorage
  useEffect(() => {
    const saved = localStorage.getItem('matches');
    if (saved) {
      setMatches(JSON.parse(saved));
    }
  }, []);

  // 每次變更都更新 localStorage
  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
  }, [matches]);

  return (
    <MatchContext.Provider value={{ matches, setMatches }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatchContext = (): MatchContextType => {
  const context = useContext(MatchContext);
  if (!context) throw new Error('useMatchContext must be used within a MatchProvider');
  return context;
};

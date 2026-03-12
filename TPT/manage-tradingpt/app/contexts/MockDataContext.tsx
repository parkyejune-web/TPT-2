'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface MockDataContextType {
  isMockMode: boolean;
  toggleMockMode: () => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [isMockMode, setIsMockMode] = useState(false);

  // localStorage에서 초기값 로드
  useEffect(() => {
    const savedMode = localStorage.getItem('mockDataMode');
    if (savedMode === 'true') {
      setIsMockMode(true);
    }
  }, []);

  const toggleMockMode = () => {
    setIsMockMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('mockDataMode', String(newMode));
      return newMode;
    });
  };

  return (
    <MockDataContext.Provider value={{ isMockMode, toggleMockMode }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}

// Hook 없이도 사용할 수 있도록 함수 export
export function getIsMockMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('mockDataMode') === 'true';
}

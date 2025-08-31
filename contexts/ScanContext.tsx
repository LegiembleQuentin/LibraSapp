import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ScanContextType {
  registerScanCallback: (callback: () => void) => void;
  unregisterScanCallback: () => void;
  triggerScan: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const useScanContext = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }
  return context;
};

interface ScanProviderProps {
  children: ReactNode;
}

export const ScanProvider: React.FC<ScanProviderProps> = ({ children }) => {
  const [scanCallback, setScanCallback] = useState<(() => void) | null>(null);

  const registerScanCallback = useCallback((callback: () => void) => {
    setScanCallback(() => callback);
  }, []);

  const unregisterScanCallback = useCallback(() => {
    setScanCallback(null);
  }, []);

  const triggerScan = useCallback(() => {
    if (scanCallback) {
      scanCallback();
    }
  }, [scanCallback]);

  const value: ScanContextType = {
    registerScanCallback,
    unregisterScanCallback,
    triggerScan,
  };

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  );
};

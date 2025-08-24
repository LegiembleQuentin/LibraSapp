import React, { createContext, useContext, useMemo, useState, PropsWithChildren } from 'react';

export type ThemeMode = 'dark' | 'light';

export type ThemeTokens = {
  mode: ThemeMode;
  colors: {
    backgroundPrimary: string;
    backgroundSecondary: string;
    textPrimary: string;
    textSecondary: string;
    card: string;
    inputBackground: string;
    inputPlaceholder: string;
    accent: string; // jaune
    purple: string;
    black: string;
    white: string;
  };
  radii: {
    pill: number;
    md: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    input: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  fonts: {
    heading: string;
    body: string;
  };
  gradient: {
    start: string;
    end: string;
  };
};

const purple = '#36034E';
const black = '#000000';
const white = '#FFFFFF';
const yellow = '#FFE815';

const createDarkTheme = (): ThemeTokens => ({
  mode: 'dark',
  colors: {
    backgroundPrimary: black,
    backgroundSecondary: purple,
    textPrimary: white,
    textSecondary: '#CFC7DF',
    card: '#1E1027',
    inputBackground: white,
    inputPlaceholder: '#B7B0C8',
    accent: yellow,
    purple,
    black,
    white,
  },
  radii: {
    pill: 28,
    md: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  shadows: {
    input: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 10,
    },
  },
  fonts: {
    heading: 'Orbitron',
    body: 'Rubik',
  },
  gradient: {
    start: black,
    end: purple,
  },
});

const createLightTheme = (): ThemeTokens => ({
  mode: 'light',
  colors: {
    backgroundPrimary: '#F7F6F9',
    backgroundSecondary: '#EDEAF3',
    textPrimary: '#1B1524',
    textSecondary: '#4E4560',
    card: white,
    inputBackground: white,
    inputPlaceholder: '#8A839C',
    accent: yellow,
    purple,
    black,
    white,
  },
  radii: {
    pill: 28,
    md: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  shadows: {
    input: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  fonts: {
    heading: 'Orbitron',
    body: 'Rubik',
  },
  gradient: {
    start: '#F0EEFA',
    end: '#E6E0F0',
  },
});

type ThemeContextValue = {
  theme: ThemeTokens;
  mode: ThemeMode;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const value = useMemo<ThemeContextValue>(() => {
    const theme = mode === 'dark' ? createDarkTheme() : createLightTheme();
    return {
      theme,
      mode,
      toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};



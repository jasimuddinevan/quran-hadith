import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsState {
  prayerReminders: boolean;
  dailyVerse: boolean;
  dailyHadith: boolean;
  autoLocation: boolean;
}

interface SettingsContextType extends SettingsState {
  setPrayerReminders: (value: boolean) => void;
  setDailyVerse: (value: boolean) => void;
  setDailyHadith: (value: boolean) => void;
  setAutoLocation: (value: boolean) => void;
}

const defaultSettings: SettingsState = {
  prayerReminders: false,
  dailyVerse: false,
  dailyHadith: false,
  autoLocation: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'app-settings';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setPrayerReminders = (value: boolean) => {
    setSettings(prev => ({ ...prev, prayerReminders: value }));
  };

  const setDailyVerse = (value: boolean) => {
    setSettings(prev => ({ ...prev, dailyVerse: value }));
  };

  const setDailyHadith = (value: boolean) => {
    setSettings(prev => ({ ...prev, dailyHadith: value }));
  };

  const setAutoLocation = (value: boolean) => {
    setSettings(prev => ({ ...prev, autoLocation: value }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setPrayerReminders,
        setDailyVerse,
        setDailyHadith,
        setAutoLocation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

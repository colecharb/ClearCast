import React, { useEffect } from "react";
import { createContext, ReactNode, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Units } from "../types"

// export type SettingsContextData = {
//   units: Units,
//   setUnits: React.Dispatch<React.SetStateAction<Units>>,
// }

export type SettingsData = {
  units: Units,
}

type SettingsSetters = {
  setUnits: React.Dispatch<React.SetStateAction<Units>>,
}

export type SettingsContextData = SettingsData & SettingsSetters;

export const STORAGE_KEYS = {
  SETTINGS: "@storage_settings",
} as const;
// "as const" makes properties read-only

export const defaultSettings: SettingsData = {
  units: 'imperial'
}

export const SettingsContext = createContext({} as SettingsContextData);

export const SettingsProvider = ({ storedSettings, children }: { storedSettings: SettingsData, children: ReactNode }) => {

  const [units, setUnits] = useState<Units>(storedSettings.units);

  // all settings stored in this object
  const settings: SettingsData = {
    units,
  }

  useEffect(() => {
    console.log('AsyncStorage.setItem: settings =', settings);
    AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    // AsyncStorage.clear();
  }, [...Object.values(settings)]);

  const settingsContextData = {
    units,
    setUnits,
  };

  return (
    <SettingsContext.Provider value={settingsContextData}>
      {children}
    </SettingsContext.Provider>
  )
}
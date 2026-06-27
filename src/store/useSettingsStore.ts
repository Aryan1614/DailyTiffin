import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings, Location } from '../types';

interface SettingsState extends UserSettings {
  setVendorName: (name: string) => void;
  setVendorPhone: (phone: string) => void;
  setReminderTime: (time: string) => void;
  setDefaultLocation: (location: Location) => void;
  setCustomLocation: (location: string) => void;
  completeSetup: () => void;
  resetSettings: () => void;
}

const initialState: UserSettings = {
  vendorName: '',
  vendorPhone: '',
  reminderTime: '08:00',
  defaultLocation: 'PG',
  customLocation: '',
  isSetupComplete: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setVendorName: (name) => set({ vendorName: name }),
      setVendorPhone: (phone) => set({ vendorPhone: phone }),
      setReminderTime: (time) => set({ reminderTime: time }),
      setDefaultLocation: (location) => set({ defaultLocation: location }),
      setCustomLocation: (location) => set({ customLocation: location }),
      completeSetup: () => set({ isSetupComplete: true }),
      resetSettings: () => set(initialState),
    }),
    {
      name: 'tiffin-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
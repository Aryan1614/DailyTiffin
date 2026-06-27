import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DaySchedule, DayOfWeek, MealType } from '../types';
import { DEFAULT_SCHEDULE } from '../utils/constants';

interface ScheduleState {
  schedule: DaySchedule[];
  updateDay: (day: DayOfWeek, mealType: MealType | 'off') => void;
  toggleDay: (day: DayOfWeek) => void;
  resetSchedule: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      schedule: DEFAULT_SCHEDULE,
      updateDay: (day, mealType) =>
        set((state) => ({
          schedule: state.schedule.map((s) =>
            s.day === day ? { ...s, mealType, isActive: mealType !== 'off' } : s,
          ),
        })),
      toggleDay: (day) =>
        set((state) => ({
          schedule: state.schedule.map((s) =>
            s.day === day ? { ...s, isActive: !s.isActive } : s,
          ),
        })),
      resetSchedule: () => set({ schedule: DEFAULT_SCHEDULE }),
    }),
    {
      name: 'tiffin-schedule',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { OrderHistoryItem, MealType, OrderStatus } from '../types';
import { generateId } from '../utils/helpers';

interface HistoryState {
  orders: OrderHistoryItem[];
  addOrder: (mealType: MealType, status: OrderStatus, location: string) => void;
  getTodayOrder: () => OrderHistoryItem | undefined;
  getOrdersForMonth: (month: number, year: number) => OrderHistoryItem[];
  getMonthlyStats: (month: number, year: number) => { ordered: number; changed: number; skipped: number; total: number };
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (mealType, status, location) => {
        const today = dayjs().format('YYYY-MM-DD');
        const existingIndex = get().orders.findIndex((o) => o.date === today);
        const newOrder: OrderHistoryItem = {
          id: generateId(),
          date: today,
          mealType,
          status,
          location,
          messageSent: true,
          createdAt: dayjs().toISOString(),
        };
        set((state) => ({
          orders: existingIndex >= 0
            ? state.orders.map((o, i) => (i === existingIndex ? newOrder : o))
            : [newOrder, ...state.orders],
        }));
      },
      getTodayOrder: () => {
        const today = dayjs().format('YYYY-MM-DD');
        return get().orders.find((o) => o.date === today);
      },
      getOrdersForMonth: (month, year) => {
        return get().orders.filter((o) => {
          const d = dayjs(o.date);
          return d.month() === month && d.year() === year;
        });
      },
      getMonthlyStats: (month, year) => {
        const monthOrders = get().getOrdersForMonth(month, year);
        return {
          ordered: monthOrders.filter((o) => o.status === 'ordered').length,
          changed: monthOrders.filter((o) => o.status === 'changed').length,
          skipped: monthOrders.filter((o) => o.status === 'skipped').length,
          total: monthOrders.length,
        };
      },
      clearHistory: () => set({ orders: [] }),
    }),
    {
      name: 'tiffin-history',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
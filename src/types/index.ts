export type MealType = 'veg' | 'nonveg';
export type OrderStatus = 'ordered' | 'changed' | 'skipped';
export type Location = 'PG' | 'Office' | 'Custom';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface UserSettings {
  vendorName: string;
  vendorPhone: string;
  reminderTime: string;
  defaultLocation: Location;
  customLocation: string;
  isSetupComplete: boolean;
}

export interface DaySchedule {
  day: DayOfWeek;
  mealType: MealType | 'off';
  isActive: boolean;
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  mealType: MealType;
  status: OrderStatus;
  location: string;
  messageSent: boolean;
  createdAt: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  MealDecision: undefined;
  Location: { mealType: MealType; status: 'ordered' | 'changed' };
  Confirmation: { mealType: MealType; location: string; status: OrderStatus };
  History: undefined;
  Settings: undefined;
};
import { DayOfWeek, DaySchedule } from '../types';

export const DAYS: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

export const DEFAULT_SCHEDULE: DaySchedule[] = DAYS.map(day => ({
  day,
  mealType: day === 'sunday' ? 'off' : 'veg',
  isActive: day !== 'sunday',
}));

export const LOCATIONS = ['PG', 'Office', 'Custom'] as const;

export const MEAL_LABELS = {
  veg: 'Veg',
  nonveg: 'Non-Veg',
  off: 'Off',
};
import dayjs from 'dayjs';
import { DayOfWeek, DaySchedule } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getTodayDayOfWeek = (): DayOfWeek => {
  const days: DayOfWeek[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  ];
  return days[dayjs().day()];
};

export const getTodaySchedule = (schedule: DaySchedule[]): DaySchedule | undefined => {
  const today = getTodayDayOfWeek();
  return schedule.find(s => s.day === today);
};

export const formatDate = (date: string): string => {
  return dayjs(date).format('DD MMM YYYY');
};

export const formatTime = (time: string): string => {
  const [hour, minute] = time.split(':');
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minute} ${ampm}`;
};

export const getGreeting = (): string => {
  const hour = dayjs().hour();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};
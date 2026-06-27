import dayjs from 'dayjs';

export const buildOrderMessage = (
  vendorName: string,
  mealType: string,
  location: string,
): string => {
  const today = dayjs().format('DD MMM');
  return `Hi ${vendorName}, please send ${mealType} tiffin to ${location} today (${today}). Thank you!`;
};

export const buildChangeMessage = (
  vendorName: string,
  newMeal: string,
  location: string,
): string => {
  const today = dayjs().format('DD MMM');
  return `Hi ${vendorName}, please change today\'s (${today}) tiffin to ${newMeal} at ${location}. Thanks!`;
};

export const buildCancelMessage = (vendorName: string): string => {
  const today = dayjs().format('DD MMM');
  return `Hi ${vendorName}, no tiffin needed today (${today}). Thank you!`;
};
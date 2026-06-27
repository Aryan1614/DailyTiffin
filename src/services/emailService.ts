import { Linking } from 'react-native';
import dayjs from 'dayjs';
import { OrderHistoryItem } from '../types';

export const sendMonthlyReport = async (
  email: string,
  orders: OrderHistoryItem[],
): Promise<void> => {
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  const monthName = dayjs().format('MMMM YYYY');

  const monthOrders = orders.filter((o) => {
    const d = dayjs(o.date);
    return d.month() === currentMonth && d.year() === currentYear;
  });

  const vegCount = monthOrders.filter(o => o.status !== 'skipped' && o.mealType === 'veg').length;
  const nonvegCount = monthOrders.filter(o => o.status !== 'skipped' && o.mealType === 'nonveg').length;
  const skippedCount = monthOrders.filter(o => o.status === 'skipped').length;
  const totalOrdered = vegCount + nonvegCount;

  const subject = `Tiffin Report - ${monthName}`;
  const body = `Monthly Tiffin Report - ${monthName}

Summary:
- Veg meals: ${vegCount}
- Non-Veg meals: ${nonvegCount}
- Total ordered: ${totalOrdered}
- Skipped days: ${skippedCount}

Order Details:
${monthOrders.map(o => `${dayjs(o.date).format('DD MMM')} - ${o.status === 'skipped' ? 'Skipped' : `${o.mealType === 'veg' ? 'Veg' : 'Non-Veg'} (${o.location})`}`).join('\n')}

---
Sent from Daily Tiffin App`;

  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  try {
    await Linking.openURL(url);
  } catch (error) {
    console.log('Failed to open email:', error);
  }
};
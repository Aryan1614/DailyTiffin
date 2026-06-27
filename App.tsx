import React, { useEffect } from 'react';
import notifee, { EventType } from '@notifee/react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { setupNotificationChannel, requestPermissions } from './src/services/notificationService';
import { useSettingsStore } from './src/store/useSettingsStore';
import { useScheduleStore } from './src/store/useScheduleStore';
import { useHistoryStore } from './src/store/useHistoryStore';
import { sendTiffinMessage } from './src/services/whatsappService';
import { getTodaySchedule } from './src/utils/helpers';
import { MealType } from './src/types';

const App: React.FC = () => {
  useEffect(() => {
    const init = async () => {
      await setupNotificationChannel();
      await requestPermissions();
    };
    init();

    // Handle notification action presses (foreground)
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.ACTION_PRESS) {
        handleNotificationAction(detail.pressAction?.id);
      }
    });

    return unsubscribe;
  }, []);

  return <AppNavigator />;
};

// Handle notification button taps
async function handleNotificationAction(actionId: string | undefined) {
  if (!actionId) return;

  const { vendorName, vendorPhone } = useSettingsStore.getState();
  const schedule = useScheduleStore.getState().schedule;
  const addOrder = useHistoryStore.getState().addOrder;
  const todaySchedule = getTodaySchedule(schedule);
  const currentMeal = todaySchedule?.mealType as MealType;

  if (todaySchedule?.mealType === 'off') return;

  switch (actionId) {
    case 'pg':
      const sentPG = await sendTiffinMessage(vendorName, vendorPhone, currentMeal, 'PG', 'ordered');
      if (sentPG) addOrder(currentMeal, 'ordered', 'PG');
      break;
    case 'office':
      const sentOffice = await sendTiffinMessage(vendorName, vendorPhone, currentMeal, 'Office', 'ordered');
      if (sentOffice) addOrder(currentMeal, 'ordered', 'Office');
      break;
    case 'skip':
      const sentSkip = await sendTiffinMessage(vendorName, vendorPhone, currentMeal, '', 'skipped');
      if (sentSkip) addOrder(currentMeal, 'skipped', '');
      break;
  }
}

export default App;
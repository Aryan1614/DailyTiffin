import notifee, {
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
  TimestampTrigger,
  AuthorizationStatus,
} from '@notifee/react-native';

export const setupNotificationChannel = async (): Promise<void> => {
  // Android channel
  await notifee.createChannel({
    id: 'tiffin-reminder',
    name: 'Tiffin Reminder',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });

  // iOS categories with actions
  await notifee.setNotificationCategories([
    {
      id: 'tiffin-actions',
      actions: [
        { id: 'pg', title: 'PG', foreground: true },
        { id: 'office', title: 'Office', foreground: true },
        { id: 'skip', title: 'Skip', destructive: true, foreground: true },
      ],
    },
  ]);
};

const getNextTriggerTime = (hour: number, minute: number): number => {
  const now = new Date();
  const trigger = new Date();
  trigger.setHours(hour, minute, 0, 0);
  if (trigger.getTime() <= now.getTime()) {
    trigger.setDate(trigger.getDate() + 1);
  }
  return trigger.getTime();
};

export const scheduleDailyReminder = async (time: string): Promise<void> => {
  await cancelAllReminders();

  const [hour, minute] = time.split(':').map(Number);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: getNextTriggerTime(hour, minute),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      title: 'Tiffin Time!',
      body: 'Confirm your meal for today',
      android: {
        channelId: 'tiffin-reminder',
        pressAction: { id: 'default' },
        smallIcon: 'ic_launcher',
        actions: [
          { title: 'PG', pressAction: { id: 'pg' } },
          { title: 'Office', pressAction: { id: 'office' } },
          { title: 'Skip', pressAction: { id: 'skip' } },
        ],
      },
      ios: {
        categoryId: 'tiffin-actions',
        sound: 'default',
      },
    },
    trigger,
  );
};

export const cancelAllReminders = async (): Promise<void> => {
  await notifee.cancelAllNotifications();
};

export const requestPermissions = async (): Promise<boolean> => {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
};
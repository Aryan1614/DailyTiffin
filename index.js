/**
 * @format
 */
import notifee, { EventType } from '@notifee/react-native';

// Handle notification actions when app is in background/killed
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.ACTION_PRESS) {
    // Actions will be handled when app opens
    console.log('Background action:', detail.pressAction?.id);
  }
});

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

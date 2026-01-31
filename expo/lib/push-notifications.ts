// @ts-ignore - expo-notifications types may not be available during build
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiPost } from './api-client';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions and register for push notifications
 */
export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }

  try {
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'b58c24a2-a6c1-49f2-90b9-1ae4680bc62b',
    })).data;

    // Send token to backend
    await apiPost('/api/users/push-token', {
      userId,
      pushToken: token,
    });

    console.log('Push token registered:', token);
  } catch (error) {
    console.error('Error registering push token:', error);
  }

  return token;
}

/**
 * Setup notification listeners
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: any) => void,
  onNotificationTapped?: (response: any) => void
) {
  // Handle notifications received while app is foregrounded
  const receivedListener = Notifications.addNotificationReceivedListener((notification: any) => {
    console.log('Notification received:', notification);
    onNotificationReceived?.(notification);
  });

  // Handle notification taps
  const responseListener = Notifications.addNotificationResponseReceivedListener((response: any) => {
    console.log('Notification tapped:', response);
    onNotificationTapped?.(response);
  });

  return () => {
    Notifications.removeNotificationSubscription(receivedListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}

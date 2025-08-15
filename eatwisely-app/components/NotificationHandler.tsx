import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { useAppContext } from '@/providers/AppContext';
import { Platform } from 'react-native';

import * as Sentry from '@sentry/react-native';

const NotificationHandler = () => {
  const { setRequestState } = useAppContext();

  useEffect(() => {
    let unsubscribeAndroid: any;
    let unsubscribeIosReceived: any;
    let unsubscribeIosResponse: any;

    if (Platform.OS === 'android') {
      unsubscribeAndroid = messaging().onMessage(async (remoteMessage: any) => {
        const { connects, creditsAdded } = remoteMessage.data;

        setRequestState({
          connects: Number(connects),
          initialConnects: Number(connects),
          notificationMessage: `${creditsAdded} credits have been added.`,
        });
      });

      messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
        const { connects } = remoteMessage.data;

        setRequestState({
          connects: Number(connects),
          initialConnects: Number(connects),
        });
      });
    } else if (Platform.OS === 'ios') {
      unsubscribeIosReceived = Notifications.addNotificationReceivedListener(
        async (notification) => {
          const payload = (notification.request.trigger as any).payload || {};
          const { connects, creditsAdded } = payload || {};

          Sentry.captureException(
            new Error(
              `Notification response 1: ${JSON.stringify(notification)}`,
            ),
          );

          Sentry.captureException(
            new Error(`Notification payload 1: ${JSON.stringify(payload)}`),
          );

          Sentry.captureException(
            new Error(
              `Notification data 1: ${JSON.stringify(
                payload.notification.request.content.data,
              )}`,
            ),
          );

          setRequestState({
            connects: Number(connects),
            initialConnects: Number(connects),
            notificationMessage: `${creditsAdded} credits have been added.`,
          });
        },
      );

      unsubscribeIosResponse =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const payload =
            (response.notification.request.trigger as any).payload || {};
          const { connects, creditsAdded } = payload || {};

          Sentry.captureException(
            new Error(`Notification response 2: ${JSON.stringify(response)}`),
          );

          Sentry.captureException(
            new Error(`Notification payload 2: ${JSON.stringify(payload)}`),
          );

          Sentry.captureException(
            new Error(
              `Notification data 2: ${JSON.stringify(
                response.notification.request.content.data,
              )}`,
            ),
          );

          setRequestState({
            connects: Number(connects),
            initialConnects: Number(connects),
            notificationMessage: `${creditsAdded} credits have been added.`,
          });
        });
    }

    return () => {
      if (unsubscribeAndroid) {
        unsubscribeAndroid();
      }
      if (unsubscribeIosReceived) {
        unsubscribeIosReceived.remove();
      }
      if (unsubscribeIosResponse) {
        unsubscribeIosResponse.remove();
      }
    };
  }, []);

  return null;
};

export default NotificationHandler;

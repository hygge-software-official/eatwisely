import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { Platform } from 'react-native';
import { sns } from '@/helpers/aws';
import { BASE_URL } from '@/constants/baseUrl';
import * as Sentry from '@sentry/react-native';

async function getExpoPushToken() {
  try {
    const token = (await Notifications.getDevicePushTokenAsync()).data;
    return token;
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        message: 'Failed to get Expo push token',
      },
    });
    console.error('Failed to get Expo push token:', error);
    throw error;
  }
}

async function registerDevice(
  token: string,
  platformArn: string,
  userId: string,
) {
  try {
    const response = await axios.post(`${BASE_URL}sns/register-device`, {
      deviceToken: token,
      platform: platformArn,
      userId,
    });
    return response.data.endpointArn;
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        message: 'Failed to register device',
        token,
        platformArn,
        userId,
      },
    });
    console.error('Failed to register device:', error);
    throw error;
  }
}

export const initializeNotifications = async (userId: string) => {
  if (Platform.OS === 'android') {
    await registerAndroidDevice(userId);
  } else if (Platform.OS === 'ios') {
    await registerIOSDevice(userId);
  }
};

export const registerAndroidDevice = async (userId: string) => {
  try {
    const token = await getExpoPushToken();

    if (!token) {
      throw new Error('Failed to get Expo push token');
    }

    const endpointArn = await registerDevice(token, 'android', userId);

    const topicArn =
      'arn:aws:sns:us-east-1:767397662013:UserConnectsNotifications';
    await subscribeToMessages(endpointArn, topicArn);
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        message: 'Failed to register Android device',
        userId,
      },
    });
    console.error('Failed to register Android device:', error);
    throw error;
  }
};

export const registerIOSDevice = async (userId: string) => {
  try {
    const token = await getExpoPushToken();

    if (!token) {
      throw new Error('Failed to get Expo push token');
    }

    const endpointArn = await registerDevice(token, 'ios', userId);

    const topicArn =
      'arn:aws:sns:us-east-1:767397662013:UserConnectsNotifications';
    await subscribeToMessages(endpointArn, topicArn);
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        message: 'Failed to register iOS device',
        userId,
      },
    });
    console.error('Failed to register iOS device:', error);
    throw error;
  }
};

const subscribeToMessages = async (endpointArn: string, topicArn: string) => {
  const params = {
    Protocol: 'application',
    TopicArn: topicArn,
    Endpoint: endpointArn,
  };

  try {
    const response = await sns.subscribe(params).promise();
    return response;
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        message: 'Failed to subscribe to messages',
        endpointArn,
        topicArn,
      },
    });
    console.error('Failed to subscribe to messages:', error);
    throw error;
  }
};

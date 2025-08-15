import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { Slot, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { AppProvider, useAppContext } from '@/providers/AppContext';
import useCustomFonts from '@/hooks/useCustomFonts';
import { Mixpanel } from 'mixpanel-react-native';
import * as Sentry from '@sentry/react-native';
import { initializeNotifications } from '@/api/snsService';
import NotificationHandler from '@/components/NotificationHandler';
import useVersionCheck from '@/hooks/useVersionCheck';

const isProd = process.env.NODE_ENV === 'production';

const publishableKey = isProd
  ? process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
  : process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY_DEV;
const mixpanelToken = isProd
  ? process.env.EXPO_PUBLIC_MIXPANEL_TOKEN
  : process.env.EXPO_PUBLIC_MIXPANEL_TOKEN_DEV;
const sentryDsn = isProd
  ? process.env.EXPO_PUBLIC_SENTRY_DSN
  : process.env.EXPO_PUBLIC_SENTRY_DSN_DEV;
Sentry.init({
  dsn: sentryDsn,
});

const trackAutomaticEvents = false;

export const mixpanel = new Mixpanel(mixpanelToken ?? '', trackAutomaticEvents);
mixpanel.init();

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const { isUpdateRequired, loading, handleUpdate } = useVersionCheck();
  const segments = useSegments();

  const loadResources = async () => {
    const fontPromise = useCustomFonts();
    const segmentPromise = new Promise((resolve) => {
      if (segments) {
        resolve(true);
      } else {
        const interval = setInterval(() => {
          if (segments) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
      }
    });

    await Promise.all([fontPromise, segmentPromise]);
    setIsAppReady(true);
  };

  useEffect(() => {
    loadResources();
  }, []);

  if (isUpdateRequired) {
    return (
      <View style={styles.container}>
        <Text>New version available. Please update to continue.</Text>
        <Button title="Update" onPress={handleUpdate} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.appContainer}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={publishableKey ?? ''}
      >
        <ClerkLoaded>
          <AppProvider>
            <NotificationHandler />
            <InitialLayout
              isAppReady={
                isAppReady && !!tokenCache && !!publishableKey && !loading
              }
            />
          </AppProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}

function InitialLayout({ isAppReady }: { isAppReady: boolean }) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { initializeSettings } = useAppContext();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      (!segments.length || segments[0] === 'home')
    ) {
      router.replace('/home');
    }
  }, [isSignedIn, isLoaded]);

  const intitializeProjectSettings = async () => {
    if (isLoaded && isAppReady && userId) {
      await initializeNotifications(userId);
    }
    if (userId) {
      setTimeout(() => {
        initializeSettings();
      }, 100);
    }
  };

  useEffect(() => {
    intitializeProjectSettings();
  }, [isAppReady, isLoaded, userId]);

  return <Slot />;
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

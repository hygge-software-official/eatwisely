import { useState, useEffect, useRef } from 'react';
import { SplashScreen, useNavigation, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Animated } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mixpanel } from '@/app/_layout';
import { useAuth } from '@clerk/clerk-expo';
import { useAppContext } from '@/providers/AppContext';

export const useSplashScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { signOut, isSignedIn } = useAuth();

  const { resetRequestState } = useAppContext();

  const titlePosition = useRef(new Animated.Value(252)).current;

  const [showContent, setShowContent] = useState(false);

  const handleStartPress = async () => {
    mixpanel.track('START_CREATE', {
      timestamp: new Date().toISOString(),
    });

    await AsyncStorage.setItem('hasSeenSplash', 'true');
    router.replace('/home');
  };

  const handleResetAction = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ key: '/', name: 'index' }],
      }),
    );
  };

  useEffect(() => {
    const checkIfSeen = async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenSplash');
      if (hasSeen) {
        router.replace('/home');
      } else {
        handleResetAction();

        await Notifications.requestPermissionsAsync();

        if (isSignedIn) {
          await signOut();
          resetRequestState(true);
        }
      }

      SplashScreen.hideAsync();
    };

    checkIfSeen();
  }, [isSignedIn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(titlePosition, {
        toValue: 100,
        duration: 600,
        useNativeDriver: false,
      }).start(() => {
        setShowContent(true);
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return {
    titlePosition,
    showContent,
    handleStartPress,
  };
};

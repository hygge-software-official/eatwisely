import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '@/providers/AppContext';
import { useAuth } from '@clerk/clerk-expo';
import { subtractConnects } from '@/api/paymentService';
import { mixpanel } from '@/app/_layout';

const checkboxLabels = [
  'Preference analysis',
  'Launch of AI',
  'Calibrating settings',
  'Preparing the recipe',
  'Preparing instructions',
  'Checking ingredients',
  'Nutrient calculation',
  'Recipe analysis',
  'A few more checks',
];

export const useLoadingScreen = () => {
  const { successMessage } = useLocalSearchParams<{
    successMessage?: string;
  }>();

  const { getToken, userId } = useAuth();
  const { generateRecipe, requestState, setRequestState } = useAppContext();
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState(true);
  const router = useRouter();

  const defaultActivationDelays = new Array(checkboxLabels.length).fill(1400);
  const defaultOpacityDuration = 750;
  const defaultTranslateDuration = 1050;
  const defaultPostDelay = 750;

  const translateY = useRef(new Animated.Value(44)).current;
  const opacityValues = useRef(
    checkboxLabels.map(() => new Animated.Value(0)),
  ).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const [requestCompleted, setRequestCompleted] = useState(false);

  useEffect(() => {
    const onBackPress = () => true;

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  useEffect(() => {
    const loadRecipe = async () => {
      const token = await getToken();
      if (token && userId) {
        try {
          await generateRecipe();
          setRequestCompleted(true);
        } catch (error) {
          setLoadingError(true);
        }
      } else {
        setLoadingError(true);
      }
    };

    loadRecipe();
  }, [userId]);

  useEffect(() => {
    if (activeIndex < checkboxLabels.length) {
      Animated.sequence([
        Animated.delay(defaultActivationDelays[activeIndex]),
        Animated.parallel([
          Animated.timing(opacityValues[activeIndex], {
            toValue: 1,
            duration: defaultOpacityDuration,
            useNativeDriver: false,
          }),
        ]),
        Animated.timing(translateY, {
          toValue:
            activeIndex < checkboxLabels.length - 1
              ? -56 * (activeIndex + 1) + 44
              : -56 * (checkboxLabels.length - 1) + 44,
          duration: defaultTranslateDuration,
          useNativeDriver: true,
        }),
        Animated.delay(defaultPostDelay),
      ]).start(() => {
        setActiveIndex((prev) => prev + 1);
      });
    } else {
      if (
        requestCompleted &&
        activeIndex > checkboxLabels.length &&
        requestState.connects &&
        requestState.recipeData &&
        userId
      ) {
        subtractConnects(userId, 1);
        setRequestState({ connects: requestState?.connects - 1 });
        router.push('/recipe');

        mixpanel.identify(userId);
        mixpanel.getPeople().set('RECIPES_REMAIN', requestState?.connects - 1);
      } else if (
        (requestCompleted &&
          activeIndex > checkboxLabels.length &&
          !requestState.recipeData) ||
        loadingError ||
        !requestState.connects
      ) {
        router.push({
          pathname: '/home',
          params: {
            errorMessage: 'Something went wrong. Please try again.',
          },
        });
      }
    }
  }, [activeIndex, requestCompleted]);

  const closeError = () => {
    setErrorVisible(false);
    router.setParams({ successMessage: undefined });
  };

  const getCheckboxStyle = (index: number) => ({
    backgroundColor: opacityValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['#FFF', '#FFF2C4'],
    }),
  });

  const getIconStyle = (index: number) => ({
    backgroundColor: opacityValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['#F0F4F7', '#F94145'],
    }),
  });

  return {
    checkboxLabels,
    translateY,
    activeIndex,
    opacityValues,
    getCheckboxStyle,
    getIconStyle,
    errorVisible,
    successMessage,
    closeError,
  };
};

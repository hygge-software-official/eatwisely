import { useState, useRef, useEffect, useCallback } from 'react';
import { LayoutAnimation, Animated, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useAppContext } from '@/providers/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { deletePreferencesSettings } from '@/api/recipeService';
import { mixpanel } from '@/app/_layout';

export const useHomeScreen = () => {
  const { errorMessage } = useLocalSearchParams<{
    errorMessage?: string;
  }>();

  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const router = useRouter();

  const {
    requestState,
    setRequestState,
    fetchIngredientsData,
    fetchAllergiesData,
    fetchCuisineData,
    fetchDietsData,
    saveOrUpdateSettings,
  } = useAppContext();

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const [isDietModalOpen, setIsDietModalOpen] = useState<boolean>(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState(true);

  useEffect(() => {
    if (user && userId) {
      const registrationDate = new Date(user.createdAt!).toLocaleDateString();
      const lastLogin = new Date(user.lastSignInAt!).toLocaleDateString();

      mixpanel.identify(userId);
      mixpanel.getPeople().set('USER_ID', userId);
      mixpanel.getPeople().set('RECIPES_REMAIN', requestState.connects);
      mixpanel.getPeople().set('REG_DATE', registrationDate);
      mixpanel.getPeople().set('LAST_LOGIN', lastLogin);
      mixpanel.getPeople().set('SIGNUP_METHOD', requestState.lastAuthMethod);
      mixpanel.getPeople().set('TOTAL_RECIPES', requestState.initialConnects);
    }
  }, [userId, requestState.connects]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (requestState.allIngredients?.length === 0) {
        await fetchIngredientsData();
      }
      if (requestState.allAllergies?.length === 0) {
        await fetchAllergiesData();
      }
      if (requestState.allCuisines?.length === 0) {
        await fetchCuisineData();
      }
      if (requestState.allDiets?.length === 0) {
        await fetchDietsData();
      }
      setLoading(false);
    };
    fetchData();
    setRequestState({ recipeData: null });
  }, []);

  const closeError = () => {
    setErrorVisible(false);
    router.setParams({ errorMessage: null });
  };

  const toggleSwitch = async () => {
    if (requestState.savePreferences && userId) {
      setRequestState({ savePreferences: !requestState.savePreferences });
      deletePreferencesSettings(userId);
    } else {
      setRequestState({ savePreferences: !requestState.savePreferences });
      const newSettings = {
        diet: requestState.selectedDiet,
        goal: requestState.selectedGoal,
        dislikes: requestState.selectedDislikes,
        allergies: requestState.selectedAllergies,
      };

      await saveOrUpdateSettings(newSettings);
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openDietModal = () => setIsDietModalOpen(true);
  const closeDietModal = () => setIsDietModalOpen(false);
  const openGoalModal = () => setIsGoalModalOpen(true);
  const closeGoalModal = () => setIsGoalModalOpen(false);

  const toggleExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRequestState({ isExpanded: !requestState.isExpanded });
  };

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: requestState.isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [requestState.isExpanded]);

  const rotateIcon = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const onGenerateRecipe = () => {
    mixpanel.track('CREATE_RECIPE', {
      timestamp: new Date().toISOString(),
      meal_type: requestState.type,
      cuisine: requestState.selectedCuisine,
      ingredients: requestState.selectedIngredients,
      time_to_cook: requestState.minutes,
      servings: requestState.servings,
      diet: requestState.selectedDiet,
      goal: requestState.selectedGoal,
      dislikes: requestState.selectedDislikes,
      allergies: requestState.selectedAllergies,
      save_preferences: requestState.savePreferences,
    });

    if (isSignedIn) {
      if (requestState.connects === 0) {
        router.push({
          pathname: '/home/add-credits',
          params: {
            withRedirect: 'true',
          },
        });
      } else {
        router.replace('/recipe/loading');
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const removeSelectedIngredient = async (item: string) => {
    setRequestState({
      selectedIngredients: requestState.selectedIngredients.filter(
        (i) => i !== item,
      ),
    });
  };

  const removeSelectedDislike = async (item: string) => {
    if (requestState.savePreferences && userId) {
      const newSettings = {
        diet: requestState.selectedDiet,
        goal: requestState.selectedGoal,
        dislikes: requestState.selectedDislikes.filter((i) => i !== item),
        allergies: requestState.selectedAllergies,
      };

      mixpanel.identify(userId);
      mixpanel.getPeople().set(
        'DISLIKES',
        requestState.selectedDislikes.filter((i) => i !== item),
      );

      await saveOrUpdateSettings(newSettings);
    } else {
      setRequestState({
        selectedDislikes: requestState.selectedDislikes.filter(
          (i) => i !== item,
        ),
      });
    }
  };

  const removeSelectedAllergy = async (item: string) => {
    if (requestState.savePreferences && userId) {
      const newSettings = {
        diet: requestState.selectedDiet,
        goal: requestState.selectedGoal,
        dislikes: requestState.selectedDislikes,
        allergies: requestState.selectedAllergies.filter((i) => i !== item),
      };

      mixpanel.identify(userId);
      mixpanel.getPeople().set(
        'Allergies',
        requestState.selectedAllergies.filter((i) => i !== item),
      );

      await saveOrUpdateSettings(newSettings);
    } else {
      setRequestState({
        selectedAllergies: requestState.selectedAllergies.filter(
          (i) => i !== item,
        ),
      });
    }
  };

  const getSelectedFieldsCount = () => {
    let count = 0;
    if (
      requestState.selectedDiet &&
      requestState.selectedDiet !== 'No Specific Diet'
    )
      count++;
    if (
      requestState.selectedGoal &&
      requestState.selectedGoal !== 'No Specific Goal'
    )
      count++;
    if (requestState.selectedDislikes?.length > 0) count++;
    if (requestState.selectedAllergies?.length > 0) count++;
    return count;
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  return {
    requestState,
    isDietModalOpen,
    isGoalModalOpen,
    isAuthModalOpen,
    loading,
    toggleSwitch,
    openAuthModal,
    closeAuthModal,
    errorVisible,
    closeError,
    errorMessage,
    openDietModal,
    closeDietModal,
    openGoalModal,
    closeGoalModal,
    toggleExpansion,
    rotateIcon,
    onGenerateRecipe,
    removeSelectedIngredient,
    removeSelectedDislike,
    removeSelectedAllergy,
    getSelectedFieldsCount,
  };
};

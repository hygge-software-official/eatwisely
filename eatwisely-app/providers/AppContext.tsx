import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { useAuth } from '@clerk/clerk-expo';
import {
  fetchPreferencesSettings,
  savePreferencesSettings,
  updatePreferencesSettings,
} from '@/api/recipeService';
import {
  getAllergiesData,
  getIngredientsData,
  getCuisineData,
  getRecipe,
  getDietsData,
} from '@/api/recipeService';
import { setConnects, subtractConnects } from '@/api/paymentService';

interface State {
  type: string;
  allIngredients: string[];
  selectedIngredients: string[];
  allAllergies: string[];
  selectedAllergies: string[];
  allCuisines: { label: string; flag: string }[];
  selectedCuisine: { label: string; flag: string };
  allDislikes: string[];
  selectedDislikes: string[];
  allDiets: string[];
  selectedDiet: string;
  selectedGoal: string;
  minutes: number;
  servings: number;
  savePreferences: boolean | null;
  isExpanded: boolean;
  recipeData: any;
  excludeTitles: {
    title: [];
  };
  recipeId: string;
  connects: number | null;
  recipeCount: number | null;
  initialConnects: number | null;
  lastAuthMethod: string | null;
  feedbackSubmitted: boolean | null;
  notificationMessage: string;
}

interface PreferencesSettings {
  diet: string;
  goal: string;
  dislikes: string[];
  allergies: string[];
}

interface AppContextProps {
  requestState: State;
  setRequestState: (newState: Partial<State>) => void;
  fetchAllergiesData: () => Promise<void>;
  fetchIngredientsData: () => Promise<void>;
  fetchCuisineData: () => Promise<void>;
  fetchDietsData: () => Promise<void>;
  generateRecipe: () => Promise<void>;
  resetRequestState: (fullReset: boolean) => void;
  clearRecipe: () => void;
  saveOrUpdateSettings: (settings: PreferencesSettings) => Promise<void>;
  updateConnects: () => void;
  initializeSettings: () => void;
  isPaymentLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setNotificationMessage: (messsage: string) => void;
}

const initialState: State = {
  type: 'Breakfast',
  allIngredients: [],
  selectedIngredients: [],
  allAllergies: [],
  selectedAllergies: [],
  allCuisines: [],
  selectedCuisine: { label: '', flag: '' },
  allDislikes: [],
  selectedDislikes: [],
  selectedDiet: '',
  allDiets: [],
  selectedGoal: '',
  minutes: 15,
  servings: 1,
  savePreferences: null,
  isExpanded: false,
  recipeData: null,
  excludeTitles: {
    title: [],
  },
  recipeId: '',
  connects: null,
  recipeCount: null,
  initialConnects: null,
  lastAuthMethod: null,
  feedbackSubmitted: null,
  notificationMessage: '',
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { getToken, userId } = useAuth();

  const [requestState, setRequestStateInternal] = useState<State>(initialState);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const startLoading = () => setIsPaymentLoading(true);
  const stopLoading = () => setIsPaymentLoading(false);

  const setRequestState = (newState: Partial<State>) => {
    setRequestStateInternal((prevState: any) => ({
      ...prevState,
      ...newState,
    }));
  };

  const resetRequestState = (fullReset?: boolean) => {
    if (fullReset || !requestState.savePreferences) {
      setRequestState(initialState);
    } else {
      setRequestState({
        type: 'Breakfast',
        selectedIngredients: [],
        selectedCuisine: { label: '', flag: '' },
        minutes: 15,
        servings: 1,
        recipeData: null,
        excludeTitles: {
          title: [],
        },
        recipeId: '',
        connects: null,
        recipeCount: null,
        initialConnects: null,
        savePreferences: false,
      });
    }
  };

  const fetchAllergiesData = useCallback(async () => {
    try {
      const allergiesData = await getAllergiesData();
      setRequestState({ allAllergies: Object.keys(allergiesData) });
    } catch (error) {
      console.error('Error fetching allergies data', error);
    }
  }, []);

  const fetchIngredientsData = useCallback(async () => {
    try {
      const ingredientsData = await getIngredientsData();
      setRequestState({ allIngredients: ingredientsData });
    } catch (error) {
      console.error('Error fetching ingredients data', error);
    }
  }, []);

  const fetchCuisineData = useCallback(async () => {
    try {
      const cuisineData = await getCuisineData();
      setRequestState({ allCuisines: cuisineData });
    } catch (error) {
      console.error('Error fetching cuisine data', error);
    }
  }, []);

  const fetchDietsData = useCallback(async () => {
    try {
      const dietsData = await getDietsData();
      setRequestState({ allDiets: dietsData });
    } catch (error) {
      console.error('Error fetching cuisine data', error);
    }
  }, []);

  const generateRecipe = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Failed to get token');
      }

      const requestBody = {
        parameters: {
          mealType: requestState.type,
          cuisine: requestState.selectedCuisine?.label,
          ingredients: requestState.selectedIngredients || [],
          timeToCook: `${
            requestState.minutes === 31 ? '' : `${requestState.minutes} minutes`
          }`,
          servings: requestState.servings,
          diet: requestState.selectedDiet,
          goal: requestState.selectedGoal,
          dislikes: requestState.selectedDislikes || [],
          allergies: requestState.selectedAllergies || [],
        },
      };
      if (userId && token) {
        const recipe = await getRecipe(requestBody, token, userId);

        setRequestState({
          recipeData: recipe.response,
          recipeId: recipe.recipeId,
        });
      }
    } catch (error) {
      console.error('Error generating recipe', error);
    }
  }, [requestState, getToken, userId]);

  const clearRecipe = () => {
    setRequestState({ recipeData: null });
  };

  const saveOrUpdateSettings = useCallback(
    async (settings: PreferencesSettings) => {
      if (userId) {
        try {
          if (requestState.savePreferences) {
            const updatedPreferences = await updatePreferencesSettings(
              userId,
              settings,
            );

            setRequestState({
              selectedAllergies:
                updatedPreferences.allergies ?? requestState.selectedAllergies,
              selectedDiet:
                updatedPreferences.diet ?? requestState.selectedDiet,
              selectedDislikes:
                updatedPreferences.dislikes ?? requestState.selectedDislikes,
              connects: updatedPreferences.connects ?? requestState.connects,
              initialConnects:
                updatedPreferences.initialConnects ?? requestState.connects,
            });
          } else {
            await savePreferencesSettings(userId, settings);
          }
        } catch (error) {
          console.error('Error saving or updating settings', error);
        }
      }
    },
    [requestState, userId],
  );

  const initializeSettings = async () => {
    if (userId) {
      const settings = await fetchPreferencesSettings(userId);

      setRequestState({
        selectedAllergies: settings.allergies.length
          ? settings.allergies
          : requestState.selectedAllergies,
        selectedDiet: settings.diet || requestState.selectedDiet,
        selectedDislikes: settings.dislikes.length
          ? settings.dislikes
          : requestState.selectedDislikes,
        selectedGoal: settings.goal || requestState.selectedGoal,
        connects: +settings.connects,
        recipeCount: settings.recipeCount,
        initialConnects: +settings.initialConnects,
        savePreferences:
          !!settings.allergies.length ||
          !!settings.dislikes.length ||
          !!settings.diet ||
          !!settings.goal,
        feedbackSubmitted: settings.feedbackSubmitted,
      });

      if (
        settings &&
        settings.initialConnects === 0 &&
        settings.recipeCount === 0
      ) {
        const response = await setConnects(userId);

        setRequestState({
          connects: response.connects,
          initialConnects: response.initialConnects,
        });
      }
    }
  };

  const updateConnects = async () => {
    if (userId) {
      try {
        const response = await subtractConnects(userId, 1);
        setRequestState({ connects: response.connects });
      } catch (error) {
        console.error('Error updating connects', error);
      }
    }
  };

  const setNotificationMessage = (message: string) => {
    setRequestState({ notificationMessage: message });
  };

  return (
    <AppContext.Provider
      value={{
        requestState,
        setRequestState,
        fetchAllergiesData,
        fetchIngredientsData,
        fetchCuisineData,
        generateRecipe,
        resetRequestState,
        clearRecipe,
        fetchDietsData,
        saveOrUpdateSettings,
        updateConnects,
        initializeSettings,
        isPaymentLoading,
        startLoading,
        stopLoading,
        setNotificationMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

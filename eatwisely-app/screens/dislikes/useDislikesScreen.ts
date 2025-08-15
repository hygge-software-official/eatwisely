import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/providers/AppContext';
import { useAuth } from '@clerk/clerk-expo';
import { mixpanel } from '@/app/_layout';

export const useDislikesScreen = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const {
    requestState,
    setRequestState,
    fetchIngredientsData,
    saveOrUpdateSettings,
  } = useAppContext();
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [localSelectedDislikes, setLocalSelectedDislikes] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchIngredientsData();
      setLoading(false);
    };
    fetchData();
  }, [fetchIngredientsData]);

  useEffect(() => {
    if (requestState.selectedDislikes) {
      setLocalSelectedDislikes(requestState.selectedDislikes);
    }
  }, [requestState.selectedDislikes]);

  const addSelectedItem = (item: string) => {
    const trimmedItem = item.trim();
    if (!localSelectedDislikes.includes(trimmedItem)) {
      setLocalSelectedDislikes([...localSelectedDislikes, trimmedItem]);
    }
    setSearch('');
  };

  const removeSelectedItem = (item: string) => {
    setLocalSelectedDislikes(
      localSelectedDislikes.filter((selectedItem) => selectedItem !== item),
    );
  };

  const filteredIngredients = requestState.allIngredients.filter(
    (ingredient) =>
      ingredient.toLowerCase().includes(search.toLowerCase().trim()) &&
      !localSelectedDislikes.includes(ingredient) &&
      !requestState.selectedIngredients?.includes(ingredient) &&
      !requestState.selectedAllergies?.includes(ingredient),
  );

  const onSave = async () => {
    setRequestState({ selectedDislikes: localSelectedDislikes });
    if (requestState.savePreferences && userId) {
      const newSettings = {
        diet: requestState.selectedDiet,
        goal: requestState.selectedGoal,
        dislikes: localSelectedDislikes,
        allergies: requestState.selectedAllergies,
      };

      mixpanel.identify(userId);
      mixpanel.getPeople().set('DISLIKES', localSelectedDislikes);

      await saveOrUpdateSettings(newSettings);
    } else {
      setRequestState({ selectedDislikes: localSelectedDislikes });
    }
    router.replace('/home');
  };

  return {
    search,
    setSearch,
    selectedDislikes: localSelectedDislikes,
    addSelectedItem,
    removeSelectedItem,
    filteredIngredients,
    loading,
    onSave,
  };
};

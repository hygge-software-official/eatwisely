import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/providers/AppContext';
import { useAuth } from '@clerk/clerk-expo';

export const useAllergiesScreen = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const {
    requestState,
    setRequestState,
    fetchAllergiesData,
    saveOrUpdateSettings,
  } = useAppContext();
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [localSelectedAllergies, setLocalSelectedAllergies] = useState<
    string[]
  >([]);

  useEffect(() => {
    const fetchAllergies = async () => {
      setLoading(true);
      await fetchAllergiesData();
      setLoading(false);
    };
    fetchAllergies();
  }, [fetchAllergiesData]);

  useEffect(() => {
    if (requestState.selectedAllergies) {
      setLocalSelectedAllergies(requestState.selectedAllergies);
    }
  }, [requestState.selectedAllergies]);

  const addSelectedItem = (item: string) => {
    const trimmedItem = item.trim();
    if (!localSelectedAllergies.includes(trimmedItem)) {
      setLocalSelectedAllergies([...localSelectedAllergies, trimmedItem]);
    }
    setSearch('');
  };

  const removeSelectedItem = (item: string) => {
    setLocalSelectedAllergies(
      localSelectedAllergies.filter((selectedItem) => selectedItem !== item),
    );
  };

  const filteredAllergies = requestState.allAllergies.filter(
    (item) =>
      item.toLowerCase().includes(search.toLowerCase().trim()) &&
      !localSelectedAllergies?.includes(item) &&
      !requestState.selectedIngredients?.includes(item) &&
      !requestState.selectedDislikes?.includes(item),
  );

  const onSave = async () => {
    if (requestState.savePreferences && userId) {
      const newSettings = {
        diet: requestState.selectedDiet,
        goal: requestState.selectedGoal,
        dislikes: requestState.selectedDislikes,
        allergies: localSelectedAllergies,
      };

      await saveOrUpdateSettings(newSettings);
    } else {
      setRequestState({ selectedAllergies: localSelectedAllergies });
    }
    router.replace('/home');
  };

  return {
    search,
    setSearch,
    selectedAllergies: localSelectedAllergies,
    addSelectedItem,
    removeSelectedItem,
    filteredAllergies,
    loading,
    onSave,
  };
};

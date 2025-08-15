import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/providers/AppContext';

export const useIngredientsScreen = () => {
  const router = useRouter();
  const { requestState, setRequestState } = useAppContext();
  const [search, setSearch] = useState<string>('');
  const [localSelectedIngredients, setLocalSelectedIngredients] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (requestState.selectedIngredients) {
      setLocalSelectedIngredients(requestState.selectedIngredients);
    }
  }, [requestState.selectedIngredients]);

  const addSelectedItem = (item: string) => {
    const trimmedItem = item.trim();
    if (!localSelectedIngredients.includes(trimmedItem)) {
      setLocalSelectedIngredients([...localSelectedIngredients, trimmedItem]);
    }
    setSearch('');
  };

  const removeSelectedItem = (item: string) => {
    setLocalSelectedIngredients(
      localSelectedIngredients.filter((selectedItem) => selectedItem !== item),
    );
  };

  const filteredIngredients = requestState.allIngredients.filter(
    (ingredient) =>
      ingredient.toLowerCase().includes(search.toLowerCase().trim()) &&
      !localSelectedIngredients?.includes(ingredient) &&
      !requestState.selectedDislikes?.includes(ingredient) &&
      !requestState.selectedAllergies?.includes(ingredient),
  );

  const onSave = () => {
    setRequestState({ selectedIngredients: localSelectedIngredients });
    router.replace('/home');
  };

  return {
    search,
    setSearch,
    selectedIngredients: localSelectedIngredients,
    addSelectedItem,
    removeSelectedItem,
    filteredIngredients,
    onSave,
  };
};

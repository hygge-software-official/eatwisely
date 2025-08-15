import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/providers/AppContext';
import { mixpanel } from '@/app/_layout';
import { useAuth } from '@clerk/clerk-expo';

export const useCuisineScreen = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { setRequestState, requestState } = useAppContext();
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const handleSelectCuisine = (label: string | null) => {
    setSelectedCuisine(label);
  };

  const onSave = () => {
    if (selectedCuisine) {
      const selectedCuisineData = requestState.allCuisines.find(
        (cuisine) => cuisine.label === selectedCuisine,
      );
      setRequestState({
        selectedCuisine: selectedCuisineData
          ? selectedCuisineData
          : { label: '', flag: '' },
      });
      if (userId) {
        mixpanel.identify(userId);
        mixpanel.getPeople().set({
          $property_name: 'CUISINE',
          CUISINE: selectedCuisine,
        });
      }
    }
    router.replace('/home');
  };

  return {
    selectedCuisine: selectedCuisine || requestState.selectedCuisine?.label,
    cuisines: requestState.allCuisines,
    handleSelectCuisine,
    onSave,
  };
};

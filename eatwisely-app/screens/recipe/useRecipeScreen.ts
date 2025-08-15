import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Platform, Share } from 'react-native';
import { useAppContext } from '@/providers/AppContext';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { likeRecipe, saveRecipe } from '@/api/recipeService';
import { useAuth } from '@clerk/clerk-expo';

import { mixpanel } from '@/app/_layout';

export const useRecipeScreen = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [isHeartPressed, setIsHeartPressed] = useState(false);
  const [isBookmarkPressed, setIsBookmarkPressed] = useState(false);
  const { requestState, setRequestState } = useAppContext();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId && requestState.recipeData && requestState?.connects) {
      mixpanel.track('VIEW_RECIPE', {
        timestamp: new Date().toISOString(),
        recipeId: requestState.recipeId,
      });
    }
  }, []);

  const handleHeartPress = async () => {
    setIsHeartPressed(!isHeartPressed);
    if (userId && requestState.recipeData) {
      try {
        mixpanel.track('LIKE_RECIPE', {
          timestamp: new Date().toISOString(),
          recipeId: requestState.recipeId,
        });
        const response = await likeRecipe(userId, requestState.recipeId);
        setRequestState({
          excludeTitles: response.excludeTitles,
        });
      } catch (error) {
        console.error('Error liking recipe:', error);
      }
    }
  };

  const capitalizeFirstLetter = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatRecipeMessage = (recipe: any) => {
    const { title, ingredients, instructions } = recipe;
    let message = `${title}\n\nIngredients\n\n`;

    ingredients.forEach((ingredient: any) => {
      const displayQuantity = toFraction(ingredient.quantity);
      let unit = ingredient.unit;

      const words = unit.split(' ');
      const firstWord = words[0];
      const lastWord = words[words.length - 1];

      if (firstWord === lastWord && words.length > 1) {
        unit = words.slice(0, words.length - 1).join(' ');
      }

      message += `• ${capitalizeFirstLetter(ingredient.ingredient_name)}: `;
      if (ingredient.unit === 'tsp' || ingredient.unit === 'tbsp') {
        message += `${
          +displayQuantity > 1
            ? `${displayQuantity} tablespoons`
            : `${displayQuantity} tablespoon`
        }\n`;
      } else {
        message += `${
          displayQuantity ? `${displayQuantity} ${unit}` : `${unit}`
        }\n`;
      }
    });

    message += `\nInstructions\n`;

    const instructionSections = ['prep', 'cook', 'serving'];

    instructionSections.forEach((section, index) => {
      message += `\n${index + 1}. ${capitalizeFirstLetter(section)}\n`;
      if (instructions[section] && instructions[section].length > 0) {
        message += `• ${instructions[section].join('\n• ')}\n`;
      } else {
        message += `Skip this step\n`;
      }
    });

    message += `\n\nCreated by eatwisely(${
      Platform.OS === 'ios'
        ? 'https://eatwisely.app/#ios'
        : 'https://eatwisely.app/#android'
    })`;

    return message;
  };

  const handleBookmarkPress = async () => {
    if (isBookmarkPressed) {
      setIsBookmarkPressed(false);
    } else {
      mixpanel.track('SAVE_RECIPE', {
        timestamp: new Date().toISOString(),
        recipeId: requestState.recipeId,
      });
      const recipeMessage = formatRecipeMessage(requestState.recipeData);

      await Clipboard.setStringAsync(recipeMessage);
      setIsBookmarkPressed(!isBookmarkPressed);

      if (userId && requestState.recipeId) {
        await saveRecipe(userId, requestState.recipeId);
      }

      try {
        await Share.share({
          message: recipeMessage,
        });
      } catch (error: any) {
        console.error('Error sharing:', error.message);
      }
    }
  };

  const handleGeneratePress = () => {
    mixpanel.track('OPEN_RECREATE', {
      timestamp: new Date().toISOString(),
      recipeId: requestState.recipeId,
    });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    mixpanel.track('CANCEL_RECREATE', {
      timestamp: new Date().toISOString(),
      recipeId: requestState.recipeId,
    });
  };

  const handleGenerate = async () => {
    setModalVisible(false);
    mixpanel.track('CONFIRM_RECREATE', {
      timestamp: new Date().toISOString(),
      recipeId: requestState.recipeId,
    });
    setTimeout(() => {
      router.replace('/home');
    }, 50);
  };

  const decimalToFraction: any = {
    '0.250': '1/4',
    '0.500': '1/2',
    '0.750': '3/4',
    '0.333': '1/3',
    '0.667': '2/3',
    '0.125': '1/8',
    '0.375': '3/8',
    '0.625': '5/8',
    '0.875': '7/8',
  };

  const toFraction = (decimal: string): string => {
    const decimalValue = parseFloat(decimal).toFixed(3);
    return decimalToFraction[decimalValue] || decimal;
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace('/home');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  return {
    modalVisible,
    isHeartPressed,
    isBookmarkPressed,
    handleHeartPress,
    handleBookmarkPress,
    handleGeneratePress,
    handleCloseModal,
    handleGenerate,
    recipeData: requestState.recipeData,
    toFraction,
    capitalizeFirstLetter,
  };
};

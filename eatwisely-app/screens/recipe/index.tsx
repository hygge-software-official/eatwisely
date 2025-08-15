import React from 'react';
import {
  View,
  Text,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
  ActivityIndicator,
} from 'react-native';
import BottomBar from '@/components/BottomBar';
import GenerateRecipeModal from '@/components/GenerateRecipeModal';

import { useRecipeScreen } from './useRecipeScreen';

import styles from './recipe.styles';

type RecipeInfo = {
  minutes: number;
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
};

type Instruction = {
  [key: string]: string[];
};

type Ingredient = {
  ingredient_name: string;
  quantity: string;
  unit: string;
};

type SectionItem = RecipeInfo | Ingredient | Instruction | number;

type Section = {
  title: string;
  data: SectionItem[];
  renderItem: (
    info: SectionListRenderItemInfo<SectionItem>,
  ) => React.ReactElement | null;
};

const RecipeScreen: React.FC = () => {
  const {
    modalVisible,
    isHeartPressed,
    isBookmarkPressed,
    handleHeartPress,
    handleBookmarkPress,
    handleGeneratePress,
    handleCloseModal,
    handleGenerate,
    recipeData,
    toFraction,
    capitalizeFirstLetter,
  } = useRecipeScreen();

  if (!recipeData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0C0C19" />
      </View>
    );
  }

  const renderInfo = ({ item }: SectionListRenderItemInfo<SectionItem>) => {
    const recipeInfo = item as RecipeInfo;
    return (
      <View style={styles.infoContainer}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>Cook time</Text>
          <View style={styles.infoDetailsContainer}>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailTop}>{recipeInfo.minutes}</Text>
              <Text style={styles.infoDetailBottom}>minutes</Text>
            </View>
          </View>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>Macronutrients per serving</Text>
          <View style={styles.infoDetailsContainer}>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailTop}>{recipeInfo.calories}</Text>
              <Text style={styles.infoDetailBottom}>calories</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailTop}>{recipeInfo.protein}</Text>
              <Text style={styles.infoDetailBottom}>protein</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailTop}>{recipeInfo.fat}</Text>
              <Text style={styles.infoDetailBottom}>fat</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailTop}>{recipeInfo.carbs}</Text>
              <Text style={styles.infoDetailBottom}>carbs</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderIngredients = ({
    item,
  }: SectionListRenderItemInfo<SectionItem>) => {
    const ingredients = item as unknown as Ingredient[];
    return (
      <View style={styles.ingredientsContainer}>
        {ingredients.map((ingredient, index) => {
          const displayQuantity = toFraction(ingredient.quantity);

          if (+displayQuantity !== 0) {
            let unit = ingredient.unit;

            const words = unit.split(' ');
            const firstWord = words[0];
            const lastWord = words[words.length - 1];

            if (firstWord === lastWord && words.length > 1) {
              unit = words.slice(0, words.length - 1).join(' ');
            }

            return (
              <Text key={index} style={styles.ingredient}>
                {ingredient.unit === 'tsp' || ingredient.unit === 'tbsp'
                  ? `• ${capitalizeFirstLetter(ingredient.ingredient_name)}: ${
                      +displayQuantity > 1
                        ? `${displayQuantity} tablespoons`
                        : `${displayQuantity} tablespoon`
                    }`
                  : `• ${capitalizeFirstLetter(ingredient.ingredient_name)}: ${
                      displayQuantity ? `${displayQuantity} ${unit}` : `${unit}`
                    }`}
              </Text>
            );
          } else {
            return null;
          }
        })}
      </View>
    );
  };

  const renderInstruction = ({
    item,
  }: SectionListRenderItemInfo<SectionItem>) => {
    const instruction = item as Instruction;
    let displayIndex = 0;

    const instructionSections = Object.keys(instruction).map((key) => {
      displayIndex++;

      return (
        <View key={key} style={styles.instructionItem}>
          <Text style={styles.instructionStep}>
            {displayIndex}. {key.charAt(0).toUpperCase() + key.slice(1)}
          </Text>
          {instruction[key].length ? (
            instruction[key].map((step: string, stepIndex: number) => (
              <Text key={stepIndex} style={styles.instructionDetail}>
                • {step}
              </Text>
            ))
          ) : (
            <Text style={styles.instructionDetail}>Skip this step</Text>
          )}
        </View>
      );
    });

    return <View>{instructionSections}</View>;
  };

  const sections: Section[] = [
    {
      title: recipeData.title,
      data: [
        {
          minutes: recipeData.cook_time + recipeData.prep_time,
          calories: recipeData.macronutrients_per_serving.calories,
          protein: `${recipeData.macronutrients_per_serving.protein}g`,
          fat: `${recipeData.macronutrients_per_serving.fat}g`,
          carbs: `${recipeData.macronutrients_per_serving.carbs.total}g`,
        },
      ] as SectionItem[],
      renderItem: renderInfo,
    },
    {
      title: 'Ingredients',
      data: [recipeData.ingredients] as SectionItem[],
      renderItem: renderIngredients,
    },
    {
      title: 'Instructions',
      data: [recipeData.instructions] as SectionItem[],
      renderItem: renderInstruction,
    },
  ];

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<SectionItem>;
  }) => {
    const isFirstSection = sections[0].title === section.title;
    const titleStyle = isFirstSection
      ? styles.screenTitle
      : styles.sectionTitle;

    return (section as Section).title ? (
      <View style={[styles.sectionHeaderBackground]}>
        <Text style={titleStyle}>{(section as Section).title}</Text>
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={renderSectionHeader}
        renderItem={(info) => {
          const section = sections.find((sec) => sec.data.includes(info.item));
          return section ? section.renderItem(info) : null;
        }}
      />

      <BottomBar
        onHeartPress={handleHeartPress}
        onBookmarkPress={handleBookmarkPress}
        onGeneratePress={handleGeneratePress}
        isHeartPressed={isHeartPressed}
        isBookmarkPressed={isBookmarkPressed}
      />

      <GenerateRecipeModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onGenerate={handleGenerate}
        isBookmarkPressed={isBookmarkPressed}
      />
    </View>
  );
};

export default RecipeScreen;

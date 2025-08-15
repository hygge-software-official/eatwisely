import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

//providers
import { useAppContext } from '@/providers/AppContext';

//components
import DietModal from '@/components/DietModal';
import Counter from '@/components/Counter';
import Toggle from '@/components/Toggle';
import DishTypeSelector from '@/components/DishTypeSelector';
import DropdownInputWithLabel from '@/components/DropdownInputWithLabel';
import MultiselectInputWithLabel from '@/components/MultiselectInputWithLabel';
import { VariedButton } from '@/components/VariedButton';
import GoalModal from '@/components/GoalModal';
import AuthModal from '@/components/AuthModal';
import WarningBlock from '@/components/WarningBlock';

//constants
import { carouselData } from '@/constants/data/carouselData';

//hooks
import { useHomeScreen } from './useHomeScreen';

//styles
import styles from './home.styles';
import { useAuth } from '@clerk/clerk-expo';

export default function HomeScreen() {
  const { requestState, setRequestState, setNotificationMessage } =
    useAppContext();
  const { userId } = useAuth();
  const router = useRouter();

  const {
    isDietModalOpen,
    isGoalModalOpen,
    isAuthModalOpen,
    toggleSwitch,
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
  } = useHomeScreen();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentWrapper}>
        <DishTypeSelector data={carouselData} />

        <View style={styles.contentWrapper}>
          <DropdownInputWithLabel
            label="Cuisine"
            placeholder="Surprise me"
            value={requestState.selectedCuisine?.label}
            onClick={() => router.replace('/home/cuisine')}
          />

          <MultiselectInputWithLabel
            label="With"
            placeholder="Ingredients, optional"
            value={requestState.selectedIngredients}
            onClick={() => router.replace('/home/ingredients')}
            removeSelectedItem={removeSelectedIngredient}
          />

          <View style={styles.countersContainer}>
            <Counter
              label="min to cook"
              value={requestState.minutes}
              step={15}
              min={15}
              onChange={(value) => setRequestState({ minutes: value })}
            />

            <Counter
              label="servings"
              value={requestState.servings}
              step={1}
              min={1}
              max={10}
              onChange={(value) => setRequestState({ servings: value })}
            />
          </View>

          <TouchableOpacity onPress={toggleExpansion}>
            <View style={styles.expandableHeader}>
              <Text style={styles.expandableHeaderText}>
                Allergies and preferences
              </Text>
              <View
                style={[
                  styles.expandableCounterContainer,
                  !!getSelectedFieldsCount() && styles.haveSelectedFields,
                ]}
              >
                {!!getSelectedFieldsCount() && (
                  <Text style={styles.expandableHeaderText}>
                    {getSelectedFieldsCount()}
                  </Text>
                )}
                <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                  <Ionicons name="chevron-down" size={20} color="#0C0C19" />
                </Animated.View>
              </View>
            </View>
          </TouchableOpacity>

          {requestState.isExpanded && (
            <View style={styles.expandableContent}>
              <DropdownInputWithLabel
                label="Diet"
                placeholder="No Specific Diet"
                value={requestState.selectedDiet}
                onClick={openDietModal}
              />
              <DropdownInputWithLabel
                label="Goal"
                placeholder="No Specific Goal"
                value={requestState.selectedGoal}
                onClick={openGoalModal}
              />
              <MultiselectInputWithLabel
                label="Dislikes"
                placeholder="Ingredients to avoid"
                value={requestState.selectedDislikes}
                onClick={() => router.replace('/home/dislikes')}
                removeSelectedItem={removeSelectedDislike}
              />
              <MultiselectInputWithLabel
                label="Allergies"
                placeholder="e.g. lactose, nuts"
                value={requestState.selectedAllergies}
                onClick={() => router.replace('/home/allergies')}
                removeSelectedItem={removeSelectedAllergy}
              />
              <Toggle
                isEnabled={!!requestState.savePreferences}
                onToggle={toggleSwitch}
                label="Save my preferences"
                disabled={!userId}
              />
            </View>
          )}

          <AuthModal visible={isAuthModalOpen} onClose={closeAuthModal} />
          <DietModal visible={isDietModalOpen} onClose={closeDietModal} />
          <GoalModal visible={isGoalModalOpen} onClose={closeGoalModal} />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <VariedButton
          variant="red"
          title="Create recipe"
          onClick={onGenerateRecipe}
        />
      </View>

      {errorMessage && (
        <WarningBlock
          visible={errorVisible}
          errorMessage={errorMessage}
          onClose={closeError}
          top={4}
        />
      )}
      {requestState.notificationMessage && (
        <WarningBlock
          visible={!!requestState.notificationMessage}
          errorMessage={requestState.notificationMessage}
          onClose={() => setNotificationMessage('')}
          top={4}
          type="success"
        />
      )}
    </View>
  );
}

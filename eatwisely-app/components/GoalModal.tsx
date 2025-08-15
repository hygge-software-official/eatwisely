import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VariedButton } from './VariedButton';
import BaseModal from './BaseModal';
import SelectItemList from './SelectItemList';
import { useAppContext } from '../providers/AppContext';
import { useAuth } from '@clerk/clerk-expo';
import { mixpanel } from '@/app/_layout';

interface IDietModalProps {
  visible: boolean;
  onClose: () => void;
}

const goals = [
  { label: 'No Specific Goal' },
  { label: 'Weight Loss' },
  { label: 'Weight Gain' },
  { label: 'Maintain Weight' },
  { label: 'Muscle Gain' },
  { label: 'Balanced Diet' },
];

const GoalModal: React.FC<IDietModalProps> = ({ visible, onClose }) => {
  const { userId } = useAuth();
  const { requestState, setRequestState, saveOrUpdateSettings } =
    useAppContext();
  const [selectedGoal, setSelectedGoal] = useState<string>(
    requestState.selectedGoal,
  );

  useEffect(() => {
    setSelectedGoal(requestState.selectedGoal);
  }, [requestState.selectedGoal]);

  const handleSelectGoal = (label: string) => {
    setSelectedGoal(label);
  };

  const onSave = async () => {
    setRequestState({ selectedGoal: selectedGoal });
    if (requestState.savePreferences && userId) {
      const newSettings = {
        diet: requestState.selectedDiet,
        goal: requestState.selectedGoal,
        dislikes: requestState.selectedDislikes,
        allergies: requestState.selectedAllergies,
      };

      if (userId) {
        mixpanel.identify(userId);
        mixpanel.getPeople().set({
          GOAL: selectedGoal,
        });
      }

      await saveOrUpdateSettings(newSettings);
    }
    onClose();
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <Text style={styles.title}>Goal</Text>
      <SelectItemList
        items={goals}
        selectedItem={selectedGoal}
        onSelectItem={handleSelectGoal}
      />
      <View style={styles.buttonWrapper}>
        <VariedButton variant="red" title="Save" onClick={onSave} />
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'GolosText-ExtraBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default GoalModal;

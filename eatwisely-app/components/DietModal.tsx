import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VariedButton } from './VariedButton';
import BaseModal from './BaseModal';
import SelectItemList from './SelectItemList';
import { useAppContext } from '@/providers/AppContext';
import { useAuth } from '@clerk/clerk-expo';
import { mixpanel } from '@/app/_layout';

interface IDietModalProps {
  visible: boolean;
  onClose: () => void;
}

const DietModal: React.FC<IDietModalProps> = ({ visible, onClose }) => {
  const { userId } = useAuth();
  const { requestState, setRequestState, saveOrUpdateSettings } =
    useAppContext();
  const [selectedDiet, setSelectedDiet] = useState<string>(
    requestState.selectedDiet,
  );

  const handleSelectDiet = (label: string) => {
    setSelectedDiet(label);
  };

  const onSave = async () => {
    setRequestState({ selectedDiet: selectedDiet || '' });
    if (requestState.savePreferences && userId) {
      const newSettings = {
        diet: selectedDiet,
        goal: requestState.selectedGoal,
        dislikes: requestState.selectedDislikes,
        allergies: requestState.selectedAllergies,
        connects: requestState.connects,
      };

      if (userId) {
        mixpanel.identify(userId);
        mixpanel.getPeople().set({
          DIET: selectedDiet,
        });
      }

      await saveOrUpdateSettings(newSettings);
    }
    onClose();
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <Text style={styles.title}>Diet</Text>
      <SelectItemList
        items={requestState.allDiets?.map((diet) => ({ label: diet }))}
        selectedItem={selectedDiet}
        onSelectItem={handleSelectDiet}
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

export default DietModal;

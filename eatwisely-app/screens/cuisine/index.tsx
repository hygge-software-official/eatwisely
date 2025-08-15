import React from 'react';
import { View, SafeAreaView } from 'react-native';

import { useAppContext } from '@/providers/AppContext';

//components
import { VariedButton } from '@/components/VariedButton';
import SelectItemList from '@/components/SelectItemList';
import WarningBlock from '@/components/WarningBlock';

//hooks
import { useCuisineScreen } from './useCuisineScreen';

//styles
import styles from './cuisine.styles';

export default function CuisineScreen() {
  const { requestState, setNotificationMessage } = useAppContext();

  const { selectedCuisine, cuisines, handleSelectCuisine, onSave } =
    useCuisineScreen();

  return (
    <View
      style={[
        styles.screenContainer,
        !selectedCuisine && styles.noPaddingBottom,
      ]}
    >
      <SelectItemList
        items={cuisines}
        selectedItem={selectedCuisine}
        onSelectItem={handleSelectCuisine}
      />
      {selectedCuisine && (
        <View style={styles.saveButtonContainer}>
          <VariedButton variant="red" title="Save" onClick={onSave} />
        </View>
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

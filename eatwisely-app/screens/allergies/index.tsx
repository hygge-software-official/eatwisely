import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

import { useAppContext } from '@/providers/AppContext';

//components
import { VariedButton } from '@/components/VariedButton';
import SelectedItemsInput from '@/components/SelectedItemsInput';
import ItemList from '@/components/ItemList';
import WarningBlock from '@/components/WarningBlock';

//hooks
import { useAllergiesScreen } from './useAllergiesScreen';

//styles
import styles from './allergies.styles';

export default function AllergiesScreen() {
  const { requestState, setNotificationMessage } = useAppContext();

  const {
    search,
    setSearch,
    selectedAllergies,
    addSelectedItem,
    removeSelectedItem,
    filteredAllergies,
    loading,
    onSave,
  } = useAllergiesScreen();

  const [paddingBottom, setPaddingBottom] = useState(12);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (Platform.OS === 'android') {
          setPaddingBottom(12);
        }
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (Platform.OS === 'android') {
          setPaddingBottom(12);
        }
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 48 : 0}
    >
      <View style={styles.innerContainer}>
        <SelectedItemsInput
          selectedItems={selectedAllergies}
          search={search}
          setSearch={setSearch}
          addSelectedItem={addSelectedItem}
          allItems={filteredAllergies}
          removeSelectedItem={removeSelectedItem}
        />
        <ItemList
          data={filteredAllergies}
          addSelectedItem={addSelectedItem}
          loading={loading}
        />
        <View
          style={[
            styles.saveButtonContainer,
            {
              paddingBottom: Platform.select({
                ios: 60,
                android: paddingBottom,
              }),
            },
          ]}
        >
          <VariedButton variant="red" title="Save" onClick={onSave} />
        </View>
      </View>
      {requestState.notificationMessage && (
        <WarningBlock
          visible={!!requestState.notificationMessage}
          errorMessage={requestState.notificationMessage}
          onClose={() => setNotificationMessage('')}
          top={4}
          type="success"
        />
      )}
    </KeyboardAvoidingView>
  );
}

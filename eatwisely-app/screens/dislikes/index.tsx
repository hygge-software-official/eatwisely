import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

//components
import { VariedButton } from '@/components/VariedButton';
import SelectedItemsInput from '@/components/SelectedItemsInput';
import ItemList from '@/components/ItemList';

//hooks
import { useDislikesScreen } from './useDislikesScreen';

//styles
import styles from './dislikes.styles';
import { useAppContext } from '@/providers/AppContext';
import WarningBlock from '@/components/WarningBlock';

export default function DislikesScreen() {
  const { requestState, setNotificationMessage } = useAppContext();

  const {
    search,
    setSearch,
    selectedDislikes,
    addSelectedItem,
    removeSelectedItem,
    filteredIngredients,
    loading,
    onSave,
  } = useDislikesScreen();

  const [paddingBottom, setPaddingBottom] = useState(60);

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
          selectedItems={selectedDislikes}
          search={search}
          setSearch={setSearch}
          removeSelectedItem={removeSelectedItem}
          addSelectedItem={addSelectedItem}
          allItems={filteredIngredients}
        />
        <ItemList
          data={filteredIngredients}
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

import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

//providers
import { useAppContext } from '@/providers/AppContext';

//components
import { VariedButton } from '@/components/VariedButton';
import SelectedItemsInput from '@/components/SelectedItemsInput';
import ItemList from '@/components/ItemList';
import WarningBlock from '@/components/WarningBlock';

//hooks
import { useIngredientsScreen } from './useIngredientsScreen';

//styles
import styles from './ingredients.styles';

export default function IngredientsScreen() {
  const { requestState, setNotificationMessage } = useAppContext();

  const {
    search,
    setSearch,
    selectedIngredients,
    addSelectedItem,
    removeSelectedItem,
    filteredIngredients,
    onSave,
  } = useIngredientsScreen();

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
          search={search}
          setSearch={setSearch}
          selectedItems={selectedIngredients}
          addSelectedItem={addSelectedItem}
          allItems={filteredIngredients}
          removeSelectedItem={removeSelectedItem}
        />
        <ItemList
          data={filteredIngredients}
          addSelectedItem={addSelectedItem}
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

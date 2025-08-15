import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  Keyboard,
} from 'react-native';

//providers
import { useAppContext } from '@/providers/AppContext';

// components
import { VariedButton } from '@/components/VariedButton';
import TextInputWithLabel from '@/components/TextInputWithLabel';
import WarningBlock from '@/components/WarningBlock';

// hooks
import { useEditNameScreen } from './useEditNameScreen';

// styles
import styles from './editName.styles';

export default function EditNameScreen() {
  const { requestState, setNotificationMessage } = useAppContext();

  const {
    newFirstName,
    handleFirstNameChange,
    newLastName,
    handleLastNameChange,
    handleNameChange,
    firstNameError,
    lastNameError,
  } = useEditNameScreen();

  const isButtonDisabled =
    newFirstName.trim().length < 1 || newLastName.trim().length < 1;

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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 76 : 0}
    >
      <View style={styles.innerContainer}>
        <TextInputWithLabel
          label="First name"
          placeholder="Enter your first name"
          onChangeText={handleFirstNameChange}
          value={newFirstName}
        />
        {firstNameError ? (
          <Text style={styles.errorText}>{firstNameError}</Text>
        ) : null}

        <TextInputWithLabel
          label="Last name"
          placeholder="Enter your last name"
          onChangeText={handleLastNameChange}
          value={newLastName}
        />
        {lastNameError ? (
          <Text style={styles.errorText}>{lastNameError}</Text>
        ) : null}
      </View>
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
        <VariedButton variant="red" title="Save" onClick={handleNameChange} />
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

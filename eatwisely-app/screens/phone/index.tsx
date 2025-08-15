import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { VariedButton } from '@/components/VariedButton';
import WarningBlock from '@/components/WarningBlock';

//hooks
import { usePhoneScreen } from './usePhoneScreen';

//styles
import styles from './phone.styles';

export default function PhoneInputScreen() {
  const {
    phoneNumber,
    isValid,
    handleSignIn,
    handlePhoneChange,
    signInError,
    signUpError,
    closeSignInErrorModal,
    closeSignUpErrorModal,
  } = usePhoneScreen();

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
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>Your phone number</Text>
          <View style={styles.numberContainer}>
            <View style={styles.phoneInputWrapper}>
              <Text style={styles.countryCodeInput}>🇺🇸 +1</Text>
            </View>
            <View style={[styles.phoneInputWrapper, styles.numberWrapper]}>
              <TextInput
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                placeholder="Phone number"
                keyboardType="phone-pad"
                style={styles.phoneNumberInput}
                maxLength={14}
              />
            </View>
          </View>
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
          <VariedButton
            title="Get code"
            variant="red"
            onClick={handleSignIn}
            disabled={!isValid}
          />
        </View>
        {signInError && (
          <WarningBlock
            visible={!!signInError}
            errorMessage={signInError}
            onClose={closeSignInErrorModal}
            top={4}
          />
        )}
        {signUpError && (
          <WarningBlock
            visible={!!signUpError}
            errorMessage={signUpError}
            onClose={closeSignUpErrorModal}
            top={4}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

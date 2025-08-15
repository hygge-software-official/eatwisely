import React from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

//hooks
import { useVerificationScreen } from './useVerificationScreen';
import WarningBlock from '@/components/WarningBlock';

//styles
import styles from './verification.styles';

export default function VerificationScreen() {
  const {
    code,
    setCode,
    timer,
    isResendDisabled,
    isResendLoading,
    handleResendCode,
    signInPendingVerification,
    signUpPendingVerification,
    signInError,
    signUpError,
    closeSignInErrorModal,
    closeSignUpErrorModal,
    formatTime,
  } = useVerificationScreen();

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });
  const ref = useBlurOnFulfill({ value: code, cellCount: 6 });

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>Code from SMS</Text>
          <CodeField
            ref={ref}
            {...props}
            value={code}
            onChangeText={setCode}
            cellCount={6}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            InputComponent={TextInput}
            autoFocus
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={styles.cell}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
            editable={!signInPendingVerification && !signUpPendingVerification}
          />
          {isResendLoading ? (
            <ActivityIndicator
              style={styles.loader}
              size="small"
              color="#07000E"
            />
          ) : (
            <Text
              style={[
                styles.resendCodeText,
                isResendDisabled && styles.disabledResendCodeText,
              ]}
              onPress={!isResendDisabled ? handleResendCode : undefined}
            >
              Resend code {isResendDisabled ? `in (${formatTime(timer)})` : ''}
            </Text>
          )}
        </View>
        {signInError && (
          <WarningBlock
            visible={!!signInError}
            errorMessage={signInError}
            onClose={closeSignInErrorModal}
            top={12}
          />
        )}
        {signUpError && (
          <WarningBlock
            visible={!!signUpError}
            errorMessage={signUpError}
            onClose={closeSignUpErrorModal}
            top={12}
          />
        )}
      </View>
    </View>
  );
}

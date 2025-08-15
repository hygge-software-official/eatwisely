import React from 'react';
import { View, Text, ImageBackground } from 'react-native';

//components
import AuthButtons from '@/components/AuthButtons';
import WarningBlock from '@/components/WarningBlock';

//hooks
import { useFailureScreen } from './useFailureScreen';

//styles
import styles from './failure.styles';

export default function FailureScreen() {
  const { errorVisible, closeError } = useFailureScreen();

  return (
    <View style={styles.pageContainer}>
      <WarningBlock
        visible={errorVisible}
        errorMessage={
          'Something went wrong. Please try again or choose another option.'
        }
        onClose={closeError}
      />

      <ImageBackground
        source={require('@/assets/images/splash.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Eat Wisely</Text>
          <View style={styles.authButtonsWrapper}>
            <AuthButtons />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

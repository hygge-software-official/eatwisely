import React from 'react';
import { ActivityIndicator, View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

//hooks
import { useLoadingScreen } from './useLoadingScreen';

//styles
import styles from './loading.styles';
import WarningBlock from '@/components/WarningBlock';

export default function LoadingScreen() {
  const {
    checkboxLabels,
    translateY,
    activeIndex,
    getCheckboxStyle,
    getIconStyle,
    errorVisible,
    successMessage,
    closeError,
  } = useLoadingScreen();

  return (
    <View style={styles.container}>
      <ActivityIndicator style={styles.loader} size={24} color="#07000E" />

      <View style={styles.animationWrapper}>
        <LinearGradient
          colors={['#FFFFFF', 'rgba(255, 255, 255, 0)']}
          style={styles.gradientTopOverlay}
        />
        <Animated.View
          style={[styles.innerContainer, { transform: [{ translateY }] }]}
        >
          {checkboxLabels.map((label, index) => (
            <Animated.View
              key={index}
              style={[styles.listItem, getCheckboxStyle(index)]}
            >
              <Animated.View style={[styles.icon, getIconStyle(index)]}>
                {index <= activeIndex && (
                  <Ionicons name="checkmark" size={24} color="#FFF" />
                )}
              </Animated.View>
              <Text style={styles.checkboxLabel}>{label}</Text>
            </Animated.View>
          ))}
        </Animated.View>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', '#FFFFFF']}
          style={styles.gradientBottomOverlay}
        />
      </View>
      {successMessage && (
        <WarningBlock
          visible={errorVisible}
          errorMessage={successMessage}
          onClose={closeError}
          top={4}
          type="success"
          loading
        />
      )}
    </View>
  );
}

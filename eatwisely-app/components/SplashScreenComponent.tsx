import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import styles from '@/screens/splash/splash.styles';

export const SplashScreenComponent: React.FC = () => {
  return (
    <View style={styles.pageContainer}>
      <ImageBackground
        source={require('@/assets/images/splash.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={[styles.title, { top: 252 }]}>Eat{'\n'}Wisely</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

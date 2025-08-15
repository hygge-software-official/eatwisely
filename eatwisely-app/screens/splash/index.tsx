import React from 'react';
import { View, Animated, Image, ImageBackground } from 'react-native';

//components
import { VariedButton } from '@/components/VariedButton';

//hooks
import { useSplashScreen } from './useSplashScreen';

//styles
import styles from './splash.styles';

export default function SplashScreen() {
  const { titlePosition, showContent, handleStartPress } = useSplashScreen();

  return (
    <View style={styles.pageContainer}>
      <ImageBackground
        source={require('@/assets/images/splash.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Animated.Text style={[styles.title, { top: titlePosition }]}>
            Eat{'\n'}Wisely
          </Animated.Text>
          {showContent && (
            <Image
              source={require('@/assets/images/bubble.png')}
              resizeMode="contain"
              style={styles.bubble}
              width={361}
              height={188}
            />
          )}
        </View>
        {showContent && (
          <View style={styles.buttonWrapper}>
            <VariedButton
              title="Start creating"
              variant="red"
              onClick={handleStartPress}
            />
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

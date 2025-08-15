import * as Font from 'expo-font';

const useCustomFonts = async () => {
  try {
    await Font.loadAsync({
      'Nunito-Regular': require('@/assets/fonts/Nunito-Regular.ttf'),
      'Nunito-SemiBold': require('@/assets/fonts/Nunito-SemiBold.ttf'),
      'GolosText-ExtraBold': require('@/assets/fonts/GolosText-ExtraBold.ttf'),
      'LuckiestGuy-Regular': require('@/assets/fonts/LuckiestGuy-Regular.ttf'),
    });
  } catch (error) {
    console.error('Error loading fonts:', error);
  }
};

export default useCustomFonts;

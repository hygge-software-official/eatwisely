import React, { useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { View, Text, BackHandler } from 'react-native';

//components
import AuthButtons from '@/components/AuthButtons';

//styles
import styles from './profile.styles';

const UserProfileUnauthenticated: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.replace('/home');
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <AuthButtons />
    </View>
  );
};

export default UserProfileUnauthenticated;

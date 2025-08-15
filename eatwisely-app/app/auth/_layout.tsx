import React from 'react';
import { Stack } from 'expo-router';

import BackButton from '@/components/BackButton';

function StackNavigator() {
  const handleGoBack = () => {};

  return (
    <Stack>
      <Stack.Screen
        name="phone"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerLeft: () => <BackButton link="/home/profile" />,
        }}
      />
      <Stack.Screen
        name="verification"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen name="failure" options={{ headerShown: false }} />
    </Stack>
  );
}

export default StackNavigator;

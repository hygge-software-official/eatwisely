import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function StackNavigator() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="edit-name"
        options={{
          title: 'Edit name',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/home/profile')}
              style={styles.closeButtonWrapper}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="feedback"
        options={{
          title: '',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/home/profile')}
              style={styles.closeButtonWrapper}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="terms-of-use"
        options={{
          title: 'Terms of Use',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/home/profile')}
              style={styles.closeButtonWrapper}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: 'Privacy Policy',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/home/profile')}
              style={styles.closeButtonWrapper}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  closeButtonWrapper: {
    position: 'absolute',
    left: -6,
  },
});

export default StackNavigator;

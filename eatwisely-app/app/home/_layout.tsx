import React from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';

//providers
import { useAppContext } from '@/providers/AppContext';

//components
import CircularProgressBar from '@/components/CircularProgressBar';
import Header from '@/components/Header';

function StackNavigator() {
  const router = useRouter();
  const { isPaymentLoading } = useAppContext();
  const { isSignedIn } = useAuth();
  const { from } = useLocalSearchParams();

  const handleGoBack = () => {
    if (from === 'recipe') {
      router.replace('/recipe');
    } else {
      router.replace('/home');
    }
  };

  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          title: '',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.closeButtonWrapper}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <Header headerStyle={styles.homeHeader}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
              />
              <View style={styles.headerRightContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.replace('/home/profile?from=home')}
                >
                  {isSignedIn && (
                    <CircularProgressBar size={48} strokeWidth={5} />
                  )}
                  <Image
                    source={require('@/assets/images/profile.png')}
                    style={styles.profile}
                  />
                </TouchableOpacity>
              </View>
            </Header>
          ),
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="cuisine"
        options={{
          title: 'Cuisine',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/home')}
              style={styles.closeButtonWrapper}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add-credits"
        options={{
          title: '',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => !isPaymentLoading && router.back()}
              style={styles.closeButtonWrapper}
              disabled={isPaymentLoading}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="dislikes"
        options={{
          title: 'Dislikes',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/home')}
              style={styles.closeButtonWrapper}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="allergies"
        options={{
          title: 'Food allergies',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/home')}
              style={styles.closeButtonWrapper}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ingredients"
        options={{
          title: 'Ingredients',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/home')}
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
  homeHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  logo: {
    width: 96,
    height: 48,
    marginTop: 8,
  },
  headerRightContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  profile: {
    width: 48,
    height: 48,
    marginLeft: 20,
    marginTop: 8,
  },
});

export default StackNavigator;

import React from 'react';
import { Link, Stack, useRouter } from 'expo-router';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

//components
import CircularProgressBar from '@/components/CircularProgressBar';
import BackButton from '@/components/BackButton';
import Header from '@/components/Header';

function StackNavigator() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="loading"
        options={{
          header: () => (
            <Header headerStyle={styles.loadingHeader}>
              <View style={styles.headerRightContainer}>
                {isSignedIn && (
                  <CircularProgressBar size={48} strokeWidth={5} />
                )}
                <Image
                  source={require('@/assets/images/profile.png')}
                  style={styles.profile}
                />
              </View>
            </Header>
          ),
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <Header headerStyle={styles.recipeHeader}>
              <BackButton link="/home" />
              <View style={styles.headerRightContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.replace('/home/profile?from=recipe')}
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
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'flex-end',
  },
  recipeHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'space-between',
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

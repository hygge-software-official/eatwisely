import React from 'react';
import { View, Text, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';

import { VariedButton } from '@/components/VariedButton';

import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { useAppleOAuth } from '@/hooks/useAppleOAuth';
import { mixpanel } from '@/app/_layout';

interface AuthButtonsProps {
  onClose?: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  onClose,
}: AuthButtonsProps) => {
  const router = useRouter();
  const { handleGoogleAuth } = useGoogleOAuth(onClose);
  const { handleAppleOAuth } = useAppleOAuth(onClose);

  useWarmUpBrowser();

  const handleTermsOfUse = () => {
    mixpanel.track('TERMS_OF_USE', {
      timestamp: new Date().toISOString(),
    });
    router.push('/user/terms-of-use');
  };

  const handlePrivacyPolicy = () => {
    mixpanel.track('PRIVACY_POLICY', {
      timestamp: new Date().toISOString(),
    });
    router.push('/user/privacy-policy');
  };

  const handlePressGoogle = async () => {
    await handleGoogleAuth();
  };

  const handlePressApple = async () => {
    await handleAppleOAuth();
  };

  const navigateToPhoneSignUp = () => {
    if (onClose) {
      onClose();
      setTimeout(() => {
        router.push({
          pathname: '/auth/phone',
          params: {
            withRedirect: 'true',
          },
        });
      }, 200);
    } else {
      router.replace('/auth/phone');
    }
  };

  return (
    <>
      <Text style={styles.title}>Sign up or log in to continue</Text>

      {Platform.OS === 'ios' && (
        <View style={styles.buttonWrapper}>
          <VariedButton
            title="Continue with Apple"
            variant="dark"
            icon="logo-apple"
            onClick={handlePressApple}
          />
        </View>
      )}

      <View style={styles.buttonWrapper}>
        <VariedButton
          title="Continue with Google"
          variant="light"
          onClick={handlePressGoogle}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <VariedButton
          title="Continue with phone number"
          variant="light"
          onClick={navigateToPhoneSignUp}
        />
      </View>

      <Text style={styles.footerText}>
        By continuing, I agree to the{' '}
        <Text style={styles.link} onPress={handleTermsOfUse}>
          Terms of Use
        </Text>{' '}
        and{' '}
        <Text style={styles.link} onPress={handlePrivacyPolicy}>
          Privacy Policy
        </Text>
        .
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
    marginBottom: 20,
  },
  buttonWrapper: {
    width: '100%',
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#7C8D9D',
    paddingTop: 10,
  },
  link: {
    textDecorationLine: 'underline',
  },
});

export default AuthButtons;

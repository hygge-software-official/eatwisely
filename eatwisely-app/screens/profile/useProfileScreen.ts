import { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useAppContext } from '@/providers/AppContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mixpanel } from '@/app/_layout';
import { Linking } from 'react-native';

export const useProfileScreen = () => {
  const { errorMessage, successMessage } = useLocalSearchParams<{
    errorMessage?: string;
    successMessage?: string;
  }>();

  const router = useRouter();
  const { resetRequestState } = useAppContext();
  const { signOut } = useAuth();
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [errorVisible, setErrorVisible] = useState(true);

  const onSignOutPress = async () => {
    try {
      await signOut();
      resetRequestState(true);
      mixpanel.track('SIGN_OUT', {
        timestamp: new Date().toISOString(),
      });

      router.replace('/home');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const onDeleteProfilePress = () => {
    setShowModal(true);
  };

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

  const handleAddCredits = () => {
    mixpanel.track('ADD_CREDITS', {
      timestamp: new Date().toISOString(),
    });
    router.push('/home/add-credits');
  };

  const handleShareFeedback = () => {
    mixpanel.track('SHARE_FEEDBACK', {
      timestamp: new Date().toISOString(),
    });
    router.push('/user/feedback');
  };

  const handleEmailPress = () => {
    mixpanel.track('CONTACT_US', {
      timestamp: new Date().toISOString(),
    });
    Linking.openURL('mailto:hello@eatwisely.app?subject=eatwisely%20app');
  };

  const closeError = () => {
    setErrorVisible(false);
    router.setParams({ errorMessage: undefined, successMessage: undefined });
  };

  return {
    user,
    showModal,
    errorVisible,
    errorMessage,
    successMessage,
    closeError,
    setShowModal,
    onSignOutPress,
    onDeleteProfilePress,
    handleTermsOfUse,
    handlePrivacyPolicy,
    handleEmailPress,
    handleAddCredits,
    handleShareFeedback,
  };
};

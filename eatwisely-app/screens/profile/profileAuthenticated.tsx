import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

//providers
import { useAppContext } from '@/providers/AppContext';

//components
import ConfirmationModal from '@/components/ConfirmationModal';
import VariedButton from '@/components/VariedButton';
import WarningBlock from '@/components/WarningBlock';

//hooks
import { useProfileScreen } from './useProfileScreen';

//styles
import styles from './profile.styles';

const UserProfileAuthenticated: React.FC = () => {
  const {
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
  } = useProfileScreen();
  const { requestState, setNotificationMessage } = useAppContext();

  const router = useRouter();
  const { from } = useLocalSearchParams();

  const handleGoBack = () => {
    if (from === 'recipe') {
      router.replace('/recipe');
    } else {
      router.replace('/home');
    }
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
      <View style={styles.nameContainer}>
        {user?.firstName?.length || user?.lastName?.length ? (
          <>
            <Text style={[styles.subtitle, { maxWidth: '85%' }]}>
              {`${!!user.firstName ? user.firstName : ''} ${
                !!user.lastName ? user.lastName : ''
              }`}
            </Text>
            <TouchableOpacity onPress={() => router.push('/user/edit-name')}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => router.push('/user/edit-name')}>
            <Text style={styles.subtitle}>Add name</Text>
          </TouchableOpacity>
        )}
      </View>
      {user?.phoneNumbers[0]?.phoneNumber ? (
        <View style={styles.nameContainer}>
          <Text style={styles.subtitle}>
            {user?.phoneNumbers[0]?.phoneNumber}
          </Text>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.creditsContainer}>
        <Text style={styles.creditsCount}>
          {requestState?.connects ?? (
            <ActivityIndicator color={'#0C0C19'} size={'small'} />
          )}{' '}
          credits left
        </Text>
        <Text style={styles.subtitle}>
          Add credits and continue creating more delicious recipes.
        </Text>

        <View style={styles.buttonWrapper}>
          <VariedButton
            title="Add credits"
            variant="red"
            size="small"
            onClick={handleAddCredits}
          />
        </View>
        {requestState.feedbackSubmitted === false && (
          <View style={styles.buttonWrapper}>
            <VariedButton
              title="Share feedback and get 5 credits"
              variant="white"
              size="small"
              onClick={handleShareFeedback}
            />
          </View>
        )}
      </View>

      <TouchableOpacity onPress={handleEmailPress}>
        <Text style={[styles.subtitle, { marginBottom: 24 }]}>Contact us</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSignOutPress}>
        <Text style={[styles.subtitle, { marginBottom: 24 }]}>Sign out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDeleteProfilePress}>
        <Text style={[styles.subtitle, { marginBottom: 24 }]}>
          Delete profile
        </Text>
      </TouchableOpacity>
      <View style={styles.termsWrapper}>
        <TouchableOpacity onPress={handleTermsOfUse} activeOpacity={0.8}>
          <Text style={[styles.legalText, styles.linkText]}>Terms of use</Text>
        </TouchableOpacity>
        <Text style={styles.legalText}> and </Text>
        <TouchableOpacity onPress={handlePrivacyPolicy} activeOpacity={0.8}>
          <Text style={[styles.legalText, styles.linkText]}>
            Privacy policy
          </Text>
        </TouchableOpacity>
      </View>
      <ConfirmationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
      {errorMessage && (
        <WarningBlock
          visible={errorVisible}
          errorMessage={errorMessage}
          onClose={closeError}
          top={4}
        />
      )}
      {successMessage && (
        <WarningBlock
          visible={errorVisible}
          errorMessage={successMessage}
          onClose={closeError}
          top={4}
          type="success"
        />
      )}
      {requestState.notificationMessage && (
        <WarningBlock
          visible={!!requestState.notificationMessage}
          errorMessage={requestState.notificationMessage}
          onClose={() => setNotificationMessage('')}
          top={4}
          type="success"
        />
      )}
    </View>
  );
};

export default UserProfileAuthenticated;

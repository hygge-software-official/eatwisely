import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { mixpanel } from '@/app/_layout';

import { deleteUserSettings } from '@/api/userService';

import { VariedButton } from './VariedButton';
import BaseModal from './BaseModal';
import { useAppContext } from '@/providers/AppContext';
import { useRouter } from 'expo-router';

interface IConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
}

const ConfirmationModal: React.FC<IConfirmationModalProps> = ({
  visible,
  onClose,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const { signOut, userId } = useAuth();
  const { setRequestState, resetRequestState } = useAppContext();

  const onCancelDelete = () => {
    onClose();
  };

  const onConfirmDelete = async () => {
    try {
      if (userId) {
        await deleteUserSettings(userId);
      }
      mixpanel.track('DELETE_PROFILE', { timestamp: new Date().toISOString() });

      await user?.delete();
      await signOut();
      resetRequestState(true);
      setRequestState({ savePreferences: false });
      router.replace('/home');
    } catch (error) {
      console.error('Failed to delete profile', error);
    } finally {
      onClose();
    }
  };

  return (
    <BaseModal visible={visible} onClose={onCancelDelete}>
      <Text style={styles.title}>
        Are you sure you want to delete your profile?
      </Text>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <VariedButton
            variant="light"
            title="Cancel"
            onClick={onCancelDelete}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <VariedButton
            variant="red"
            title="Delete"
            onClick={onConfirmDelete}
          />
        </View>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  buttonWrapper: {
    width: '50%',
    flexDirection: 'row',
  },
});

export default ConfirmationModal;

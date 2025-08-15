import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useAppContext } from '@/providers/AppContext';

export default function LoadingOverlay() {
  const { isPaymentLoading } = useAppContext();

  if (!isPaymentLoading) return null;

  return (
    <Modal transparent={true} animationType="none" visible={isPaymentLoading}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

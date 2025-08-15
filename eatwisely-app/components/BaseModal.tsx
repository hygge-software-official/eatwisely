import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

interface IBaseModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseModal: React.FC<IBaseModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} onPress={onClose} />
        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    paddingBottom: Platform.select({
      ios: 60,
      android: 12,
    }),
  },
});

export default BaseModal;

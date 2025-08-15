import React from 'react';
import BaseModal from './BaseModal';
import AuthButtons from './AuthButtons';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <AuthButtons onClose={onClose} />
    </BaseModal>
  );
};

export default AuthModal;

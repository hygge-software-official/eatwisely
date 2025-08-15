import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VariedButton } from './VariedButton';
import BaseModal from './BaseModal';

const GenerateRecipeModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onGenerate: () => void;
  isBookmarkPressed: boolean;
}> = ({ visible, onClose, onGenerate, isBookmarkPressed }) => {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <Text style={styles.title}>Create another recipe?</Text>
      {!isBookmarkPressed && (
        <Text style={styles.subtitle}>
          By clicking on "Create", you will lose the current recipe.
        </Text>
      )}

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <VariedButton variant="light" title="Cancel" onClick={onClose} />
        </View>
        <View style={styles.buttonWrapper}>
          <VariedButton variant="red" title="Create" onClick={onGenerate} />
        </View>
      </View>
    </BaseModal>
  );
};

export default GenerateRecipeModal;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'GolosText-ExtraBold',
    marginBottom: 10,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
    marginBottom: 24,
    textAlign: 'left',
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

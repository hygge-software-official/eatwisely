import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IInputWithLabelProps {
  label: string;
  value?: string;
  placeholder: string;
  onClick?: () => void;
}

const DropdownInputWithLabel: React.FC<IInputWithLabelProps> = ({
  label,
  value,
  placeholder,
  onClick,
}: IInputWithLabelProps) => {
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.labelWrapper}>
          <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>
          <View style={styles.dropdownContainer}>
            <Text style={styles.input} numberOfLines={1} ellipsizeMode="tail">
              {value ? value : placeholder}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#7C8D9D" />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F0F4F7',
    borderRadius: 12,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    lineHeight: 24,
    color: '#7C8D9D',
    width: 92,
    marginRight: 8,
  },
  input: {
    fontFamily: 'Nunito-Semibold',
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    flex: 1,
  },
  dropdownContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default DropdownInputWithLabel;

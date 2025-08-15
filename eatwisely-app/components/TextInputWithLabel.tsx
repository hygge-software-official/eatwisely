import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

interface IInputWithLabelProps {
  label: string;
  value?: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
}

const TextInputWithLabel: React.FC<IInputWithLabelProps> = ({
  label,
  value,
  placeholder,
  onChangeText,
}: IInputWithLabelProps) => {
  const inputRef = useRef<TextInput>(null);

  const handleLabelPress = () => {
    inputRef.current?.focus();
  };

  return (
    <TouchableWithoutFeedback onPress={handleLabelPress}>
      <View style={styles.container}>
        <View style={styles.labelWrapper}>
          <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={'#B6C0CA'}
            value={value}
            onChangeText={onChangeText}
          />
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
});

export default TextInputWithLabel;

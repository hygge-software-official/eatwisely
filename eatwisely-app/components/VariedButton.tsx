import React from 'react';
import {
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shadow } from 'react-native-shadow-2';
import ControlledButton from './ControlledButton';

interface IVariedButtonProps extends TouchableOpacityProps {
  title: string;
  onClick: () => Promise<void> | void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'dark' | 'light' | 'red' | 'white';
  disabled?: boolean;
  size?: 'normal' | 'small';
}

const buttonStyles = {
  dark: {
    backgroundColor: '#0C0C19',
    textColor: '#fff',
    shadowColor: '#0C0C19',
  },
  light: {
    backgroundColor: '#FFF2C4',
    textColor: '#0C0C19',
    shadowColor: '#F8DFB3',
  },
  red: {
    backgroundColor: '#F94145',
    textColor: '#fff',
    shadowColor: '#D4373B',
  },
  white: {
    backgroundColor: '#ffffff',
    textColor: '#0C0C19',
    shadowColor: '#D6E0E7',
  },
  disabled: {
    backgroundColor: '#F0F4F7',
    textColor: '#7C8D9D',
    shadowColor: '#D6E0E7',
  },
};

const sizeStyles = {
  normal: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 20,
    lineHeight: 28,
    loaderSize: 28,
  },
  small: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 17,
    lineHeight: 24,
    loaderSize: 20,
  },
};

export function VariedButton({
  title,
  onClick,
  icon,
  variant = 'light',
  disabled = false,
  size = 'normal',
  ...rest
}: IVariedButtonProps) {
  const stylesVariant = disabled
    ? buttonStyles.disabled
    : buttonStyles[variant];

  const stylesSize = sizeStyles[size];

  const buttonStyle = StyleSheet.flatten([
    styles.button,
    {
      backgroundColor: stylesVariant.backgroundColor,
      paddingVertical: stylesSize.paddingVertical,
      paddingHorizontal: stylesSize.paddingHorizontal,
    },
  ]) as StyleProp<ViewStyle>;

  return (
    <Shadow
      style={styles.shadow}
      distance={1}
      offset={[0, 4]}
      startColor={stylesVariant.shadowColor}
    >
      <ControlledButton
        disabled={disabled}
        style={buttonStyle}
        loaderColor={stylesVariant.textColor}
        loaderSize={stylesSize.loaderSize}
        onClick={onClick}
        {...rest}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={24}
            color={stylesVariant.textColor}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            {
              color: stylesVariant.textColor,
              fontSize: stylesSize.fontSize,
              lineHeight: stylesSize.lineHeight,
            },
          ]}
        >
          {title}
        </Text>
      </ControlledButton>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  shadow: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    paddingTop: 4,
    maxHeight: 60,
    marginBottom: 10,
  },
  button: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 12,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Nunito-Semibold',
  },
  icon: {
    marginRight: 8,
  },
});

export default VariedButton;

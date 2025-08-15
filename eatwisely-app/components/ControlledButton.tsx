import React, { useState } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  StyleSheet,
  StyleProp,
} from 'react-native';

interface IControlledButtonProps extends TouchableOpacityProps {
  onClick: () => Promise<void> | void;
  loaderColor?: string;
  loaderSize?: 'small' | 'large' | number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const ControlledButton: React.FC<IControlledButtonProps> = ({
  onClick,
  loaderColor = '#FFFFFF',
  loaderSize = 'small',
  style,
  children,
  disabled,
  ...rest
}: IControlledButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handleClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={loaderColor} size={loaderSize} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default ControlledButton;

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface IToggleProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const CustomSwitch: React.FC<IToggleProps> = ({
  isEnabled,
  onToggle,
  disabled,
}) => {
  const animatedValue = useRef(new Animated.Value(isEnabled ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isEnabled ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isEnabled]);

  const trackWidth = 51;
  const trackHeight = 31;
  const thumbSize = trackHeight - 4;
  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackWidth - thumbSize - 4],
  });

  const trackColor = disabled ? '#E0E0E0' : isEnabled ? '#F94145' : '#B6C0CA';
  const thumbColor = disabled ? '#B0B0B0' : '#FFFFFF';

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      onPress={() => !disabled && onToggle(!isEnabled)}
      style={[
        styles.track,
        {
          width: trackWidth,
          height: trackHeight,
          backgroundColor: trackColor,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            transform: [{ translateX: thumbPosition }],
            backgroundColor: thumbColor,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const Toggle: React.FC<IToggleProps> = ({
  isEnabled,
  onToggle,
  label,
  disabled,
}) => {
  return (
    <View style={styles.toggleContainer}>
      <CustomSwitch
        isEnabled={isEnabled}
        onToggle={onToggle}
        disabled={disabled}
      />
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.8}
        onPress={() => !disabled && onToggle(!isEnabled)}
      >
        <Text style={[styles.toggleLabel, disabled && styles.disabledLabel]}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Toggle;

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  thumb: {
    borderRadius: 15,
  },
  toggleLabel: {
    marginLeft: 12,
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Nunito-Regular',
    color: '#0C0C19',
  },
  disabledLabel: {
    color: '#B0B0B0',
  },
});

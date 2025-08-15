import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ICounterProps {
  label: string;
  value: number;
  step: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const Counter: React.FC<ICounterProps> = ({
  label,
  value,
  step,
  min = 0,
  max = Infinity,
  onChange,
}) => {
  const handleIncrease = () => {
    if (label === 'min to cook' && value === 30) {
      onChange(value + 1);
    } else {
      onChange(Math.min(max, value + step));
    }
  };

  const handleDecrease = () => {
    if (label === 'min to cook' && value > 30) {
      onChange(30);
    } else {
      onChange(Math.max(min, value - step));
    }
  };

  const displayValue = () => {
    if (label === 'min to cook' && value > 30) {
      return '30+';
    }
    return value;
  };

  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity
        onPress={handleDecrease}
        disabled={value <= min}
        style={styles.iconContainer}
      >
        <Ionicons
          name="remove"
          size={20}
          color={value > min ? '#7C8D9D' : '#B6C0CA'}
        />
      </TouchableOpacity>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{displayValue()}</Text>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleIncrease}
        disabled={value >= max || (label === 'min to cook' && value > 30)}
        style={styles.iconContainer}
      >
        <Ionicons
          name="add"
          size={20}
          color={
            value < max && !(label === 'min to cook' && value > 30)
              ? '#7C8D9D'
              : '#B6C0CA'
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F4F7',
    width: '50%',
    borderRadius: 12,
  },
  iconContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  valueContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  valueText: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'Nunito-SemiBold',
    color: '#0C0C19',
    textAlign: 'center',
  },
  labelContainer: {
    position: 'absolute',
    bottom: -20,
    minWidth: 175,
    height: 27,
    zIndex: 1,
  },
  labelText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#7C8D9D',
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
});

export default Counter;

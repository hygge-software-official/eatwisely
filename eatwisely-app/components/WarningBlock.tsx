import React, { useEffect } from 'react';
import { StyleSheet, Text, Animated, PanResponder, Image } from 'react-native';

const tickRoundedIcon = require('@/assets/images/tick-rounded.png');
const warningIcon = require('@/assets/images/warning.png');

interface WarningBlockProps {
  visible: boolean;
  errorMessage: string;
  onClose: () => void;
  duration?: number;
  top?: number;
  type?: 'warning' | 'success';
  loading?: boolean;
}

const WarningBlock: React.FC<WarningBlockProps> = ({
  visible,
  errorMessage,
  onClose,
  duration = 5000,
  top = 64,
  type = 'warning',
  loading = false,
}) => {
  const translateX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (loading)
        requestAnimationFrame(() => {
          const timeout = setTimeout(() => {
            Animated.timing(translateX, {
              toValue: -500,
              duration: 300,
              useNativeDriver: true,
            }).start(() => onClose());
          }, duration);

          return () => clearTimeout(timeout);
        });
      else {
        const timeout = setTimeout(() => {
          Animated.timing(translateX, {
            toValue: -500,
            duration: 300,
            useNativeDriver: true,
          }).start(() => onClose());
        }, duration);

        return () => clearTimeout(timeout);
      }
    }
  }, [visible, duration, onClose]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      translateX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (event, gestureState) => {
      if (Math.abs(gestureState.dx) > 100) {
        Animated.timing(translateX, {
          toValue: gestureState.dx > 0 ? 500 : -500,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose());
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.warningBlock,
        { transform: [{ translateX }], top },
        type === 'success' ? styles.successBlock : {},
      ]}
    >
      {type === 'success' ? (
        <Image source={tickRoundedIcon} style={styles.warningIcon} />
      ) : (
        <Image source={warningIcon} style={styles.warningIcon} />
      )}
      <Text style={styles.warningText}>
        {errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  warningBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF492',
    shadowColor: '#00000026',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 1,
  },
  successBlock: {
    backgroundColor: '#5CE270',
  },
  warningIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  warningText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'left',
    color: '#0C0C19',
    flex: 1,
  },
});

export default WarningBlock;

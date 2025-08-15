import { useAppContext } from '@/providers/AppContext';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CircularProgressBarProps {
  size: number;
  strokeWidth: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size,
  strokeWidth,
}) => {
  const { requestState } = useAppContext();

  const connects = +(requestState?.connects ?? 0);
  const initialConnects = +(requestState?.initialConnects ?? 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset =
    circumference - (connects / initialConnects ?? 1) * circumference;

  const isZeroConnects = requestState?.connects === 0;
  const isLoading = requestState.connects === null;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isZeroConnects ? '#F94145' : '#FFF2C4',
        },
      ]}
    >
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop
              offset="0%"
              stopColor={isZeroConnects ? '#F94145' : 'red'}
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={isZeroConnects ? '#F94145' : 'orange'}
              stopOpacity="1"
            />
          </LinearGradient>
        </Defs>
        <Circle
          stroke={isZeroConnects ? '#F94145' : '#FFF2C4'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="url(#grad)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={isFinite(strokeDashoffset) ? strokeDashoffset : 0}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {isLoading ? (
        <ActivityIndicator
          size={'small'}
          style={styles.progressLoader}
          color="#0C0C19"
        />
      ) : (
        !isLoading && (
          <Text numberOfLines={1} style={[styles.progressText]}>
            {connects}
          </Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    left: -20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  progressText: {
    position: 'absolute',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Nunito-SemiBold',
  },
  progressLoader: {
    position: 'absolute',
  },
});

export default CircularProgressBar;

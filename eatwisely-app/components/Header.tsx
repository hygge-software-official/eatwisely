import React from 'react';
import {
  ViewStyle,
  Platform,
  SafeAreaView as RNSafeAreaView,
} from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';

type HeaderProps = {
  children?: React.ReactNode;
  headerStyle?: ViewStyle;
};

const Header: React.FC<HeaderProps> = ({ children, headerStyle }) => {
  if (Platform.OS === 'ios') {
    return <RNSafeAreaView style={[headerStyle]}>{children}</RNSafeAreaView>;
  } else {
    return (
      <SafeAreaViewContext style={[headerStyle]}>
        {children}
      </SafeAreaViewContext>
    );
  }
};

export default Header;

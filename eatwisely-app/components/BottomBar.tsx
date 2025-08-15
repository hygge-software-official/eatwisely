import React from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomBarProps {
  onHeartPress: () => void;
  onBookmarkPress: () => void;
  onGeneratePress: () => void;
  isHeartPressed: boolean;
  isBookmarkPressed: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({
  onHeartPress,
  onBookmarkPress,
  onGeneratePress,
  isHeartPressed,
  isBookmarkPressed,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={onHeartPress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isHeartPressed ? 'heart' : 'heart-outline'}
            size={28}
            color={isHeartPressed ? '#F94145' : 'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={onBookmarkPress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isBookmarkPressed ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={onGeneratePress}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  button: {
    alignItems: 'center',
  },
});

export default BottomBar;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PrivacyPolicy() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://www.eatwisely.app/privacy-policy' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

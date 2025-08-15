import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: Platform.select({
      android: 144,
      ios: 144,
    }),
  },
  noPaddingBottom: {
    paddingBottom: 0,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: Platform.select({
      android: 12,
      ios: 60,
    }),
    shadowColor: '#425464',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
});

export default styles;

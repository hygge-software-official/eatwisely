import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    maxHeight: '100%',
  },
  innerContainer: {
    flex: 1,
    paddingTop: 16,
  },
  saveButtonContainer: {
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#425464',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
});

export default styles;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    maxHeight: '100%',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    marginBottom: 8,
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

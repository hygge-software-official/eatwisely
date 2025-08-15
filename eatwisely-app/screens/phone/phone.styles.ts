import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    maxHeight: '100%',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 74,
    width: '100%',
  },
  inputWrapper: {
    paddingHorizontal: 16,
    minWidth: '100%',
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
    marginBottom: 14,
  },
  numberContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  phoneInputWrapper: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F0F4F7',
  },
  numberWrapper: {
    flex: 1,
  },
  countryCodeInput: {
    fontSize: 20,
    lineHeight: 28,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
    marginRight: 10,
    textAlign: 'center',
  },
  phoneNumberInput: {
    width: '100%',
    minWidth: 240,
    fontSize: 20,
    lineHeight: 28,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
  },
  saveButtonContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
});

export default styles;

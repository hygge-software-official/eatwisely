import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 74,
    paddingBottom: Platform.select({
      ios: 104,
      android: 90,
    }),
    width: '100%',
  },
  inputWrapper: {
    minWidth: '100%',
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
    marginBottom: 10,
  },
  codeFieldRoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: 48,
    height: 60,
    lineHeight: 60,
    fontSize: 40,
    backgroundColor: '#F0F4F7',
    borderRadius: 12,
    textAlign: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
  },
  resendCodeText: {
    fontSize: 17,
    lineHeight: 24,
    color: '#7C8D9D',
    marginVertical: 20,
  },
  disabledResendCodeText: {
    color: '#B0B8C1',
  },
  loader: {
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default styles;

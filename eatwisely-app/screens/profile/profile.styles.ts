import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 28,
    fontFamily: 'GolosText-ExtraBold',
    marginBottom: 24,
    color: '#0C0C19',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
  },
  edit: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    lineHeight: 24,
    color: '#7C8D9D',
  },
  creditsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F0F4F7',
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  creditsCount: {
    fontFamily: 'GolosText-ExtraBold',
    fontSize: 22,
    lineHeight: 24,
    color: '#0C0C19',
  },
  legalText: {
    fontFamily: 'Nunito',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'left',
    color: '#7C8D9D',
    width: 'auto',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  termsWrapper: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    width: '100%',
  },
});

export default styles;

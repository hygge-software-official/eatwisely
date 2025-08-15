import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    maxHeight: '100%',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    lineHeight: 28,
    fontFamily: 'GolosText-ExtraBold',
    color: '#0C0C19',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
    marginBottom: 8,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 28,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedEmoji: {
    backgroundColor: '#FFF2C4',
    borderRadius: 8,
  },
  textInput: {
    height: 116,
    borderRadius: 12,
    padding: 12,
    paddingTop: 16,
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
    marginBottom: 16,
    backgroundColor: '#F0F4F7',
    textAlignVertical: 'top',
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

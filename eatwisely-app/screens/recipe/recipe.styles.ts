import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screenTitle: {
    fontFamily: 'GolosText-ExtraBold',
    fontSize: 28,
    lineHeight: 28,
    color: '#0C0C19',
    paddingHorizontal: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    gap: 12,
    paddingHorizontal: 16,
  },
  infoBlock: {
    backgroundColor: '#F0F4F7',
    padding: 12,
    paddingTop: 8,
    borderRadius: 12,
  },
  infoTitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 15,
    lineHeight: 20,
    color: '#0C0C19',
    marginBottom: 7,
  },
  infoDetailsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  infoDetail: {
    flexDirection: 'column',
  },
  infoDetailTop: {
    fontFamily: 'GolosText-ExtraBold',
    fontSize: 22,
    lineHeight: 24,
    color: '#0C0C19',
  },
  infoDetailBottom: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#0C0C19',
  },
  sectionHeaderBackground: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
  },
  sectionTitle: {
    fontFamily: 'GolosText-ExtraBold',
    fontSize: 22,
    lineHeight: 24,
    color: '#0C0C19',
    paddingHorizontal: 16,
  },
  ingredient: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
  },
  ingredientsContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  instructionItem: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  instructionStep: {
    fontFamily: 'GolosText-ExtraBold',
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    marginBottom: 2,
  },
  instructionDetail: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
  },
  servingText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
  },
});

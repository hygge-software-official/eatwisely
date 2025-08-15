import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  textContainer: {
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    lineHeight: 28,
    fontFamily: 'GolosText-ExtraBold',
    color: '#0C0C19',
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'Nunito-Regular',
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    borderRadius: 12,
    backgroundColor: '#F0F4F7',
  },
  optionLabel: {
    padding: 4,
    backgroundColor: '#F94145',
    borderRadius: 12,
  },
  bestValueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Nunito-SemiBold',
  },
  bestValueText: {
    color: '#fff',
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Nunito-SemiBold',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingTop: 16,
    backgroundColor: '#F0F4F7',
    borderRadius: 12,
  },
  optionShadow: {
    shadowColor: '#FAFF00',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  optionLeftSideContainer: {
    flexDirection: 'column',
  },
  optionTitle: {
    fontSize: 22,
    lineHeight: 24,
    fontFamily: 'GolosText-ExtraBold',
    color: '#0C0C19',
  },
  pricesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  originalPrice: {
    fontSize: 17,
    lineHeight: 24,
    color: '#7C8D9D',
    fontFamily: 'Nunito-Regular',
    textDecorationLine: 'line-through',
  },
  totalPrice: {
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
    fontFamily: 'Nunito-SemiBold',
  },
  optionRightSideContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  optionSubText: {
    fontSize: 17,
    lineHeight: 24,
    color: '#7C8D9D',
    fontFamily: 'Nunito-Regular',
    textAlign: 'right',
  },
});

export default styles;

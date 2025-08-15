import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: Platform.select({
      ios: 140,
      android: 88,
    }),
  },
  scrollContentWrapper: {},
  contentWrapper: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  countersContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    paddingRight: 12,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  expandableCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginRight: 8,
  },
  haveSelectedFields: {
    gap: 4,
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 0,
    backgroundColor: '#F0F4F7',
  },
  expandableHeaderText: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Nunito-Regular',
    color: '#0C0C19',
  },
  expandableContent: {
    gap: 12,
    marginBottom: 20,
  },
  buttonContainer: {
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

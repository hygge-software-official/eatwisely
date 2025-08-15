import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 48,
  },
  loader: {
    paddingTop: 172,
    marginBottom: 32,
  },
  animationWrapper: {
    position: 'relative',
    width: '100%',
    maxHeight: 200,
    overflow: 'hidden',
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  checkboxLabel: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Nunito-SemiBold',
    color: '#0C0C19',
    marginLeft: 10,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientTopOverlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 40,
    zIndex: 1,
  },
  gradientBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
    zIndex: 1,
  },
});

export default styles;

import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    paddingTop: 30,
  },
  title: {
    fontSize: 60,
    fontFamily: 'LuckiestGuy-Regular',
    color: '#fff',
    marginBottom: 32,
  },
  bubble: {
    width: '100%',
    height: '100%',
    minWidth: 360,
    minHeight: 180,
  },
  buttonWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    bottom: Platform.select({
      ios: 60,
      android: 16,
    }),
    paddingHorizontal: 16,
  },
});

export default styles;

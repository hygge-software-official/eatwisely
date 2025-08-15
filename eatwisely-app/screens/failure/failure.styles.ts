import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    top: 160,
    width: 198,
    fontSize: 60,
    fontFamily: 'LuckiestGuy-Regular',
    color: '#fff',
  },
  authButtonsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    minWidth: '100%',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#f8f8f8',
  },
});

export default styles;

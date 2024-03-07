import {StyleSheet} from 'react-native';

const Toggler = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrowLeftContainer: {
    flex: 0.125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  togglerContainer: {
    flex: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowRightContainer: {
    flex: 0.125,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Toggler;

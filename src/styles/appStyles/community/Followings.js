import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const Followings = StyleSheet.create({
  searchCardContainer: {
    backgroundColor: Colors.white,
    marginTop: 0,
    marginBottom: 0,
  },
  searchIconContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  searchTextInput: {
    height: 40,
  },
  skeletonUserContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  skeletonUserImageContainer: {
    width: 44,
    height: 44,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 44 / 2,
  },
});

export default Followings;

import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const FollowRequests = StyleSheet.create({
  searchCardContainer: {
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  searchIconContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  searchTextInput: {
    height: 40,
  },
  buttonContainer: {
    width: '45%',
    height: 28,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  skeletonUserContainer: {
    flex: 0.475,
    flexDirection: 'row',
    justifyContent: 'center',
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
  skeletonButtonContainer: {
    width: '45%',
    height: 28,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});

export default FollowRequests;

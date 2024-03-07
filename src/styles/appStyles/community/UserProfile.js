import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const UserProfile = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  userImageContainer: {
    width: 56,
    height: 56,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 56 / 2,
  },
  followerFollowingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  followUnfollowButtonContainer: {
    width: '42.5%',
    height: 36,
    alignSelf: 'center',
    borderRadius: 10,
  },
  feedContainer: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
    marginHorizontal: 8,
  },
  feedUserContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  feedUserImageContainer: {
    width: 28,
    height: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28 / 2,
  },
  feedImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedLikeViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  feedLikeContainer: {
    flex: 0.1875,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  feedViewContainer: {
    flex: 0.1875,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  feedDateContainer: {
    flex: 0.5875,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  imageLoader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  skeletonUserContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  skeletonUserImageContainer: {
    width: 56,
    height: 56,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 56 / 2,
  },
});

export default UserProfile;

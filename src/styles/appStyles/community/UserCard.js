import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const UserCard = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  imageContainer: {
    width: 44,
    height: 44,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 44 / 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: 4,
    paddingLeft: 4,
    paddingVertical: 4,
  },
  imageLoader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});

export default UserCard;

import {I18nManager, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const Notification = StyleSheet.create({
  container: {
    width: '99.75%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  imageContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 40 / 2,
  },
  textOuterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInnerContainer: {
    flex: 0.875,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  newContainer: {
    backgroundColor: Colors.orangeYellow,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rightActionsContainer: {
    height: '80%',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  deleteContainer: {
    flex: 1,
    backgroundColor: Colors.primary125,
    justifyContent: 'center',
  },
  readContainer: {
    flex: 1,
    backgroundColor: Colors.secondaryText25,
    justifyContent: 'center',
  },
});

export default Notification;

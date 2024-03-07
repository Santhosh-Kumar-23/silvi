import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const BudgetView = StyleSheet.create({
  headerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  attachmentViewContainer: {
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
  },
  attachmentView: {width: '100%', height: 236, borderRadius: 8},
  skeletonAttachmentViewContainer: {
    width: '100%',
    height: 236,
    borderRadius: 8,
    marginTop: 16,
  },
  imageLoaderStyles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default BudgetView;

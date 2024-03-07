import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const CreateBalance = StyleSheet.create({
  modalContainer: {
    borderRadius: 10,
    marginHorizontal: 12,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 16,
    elevation: 4,
    maxHeight: '75%',
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.barBackground,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  backIconContainer: {
    position: 'absolute',
    left: 8,
  },
  formContainer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
});

export default CreateBalance;

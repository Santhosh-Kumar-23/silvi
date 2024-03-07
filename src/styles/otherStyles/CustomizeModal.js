import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const CustomizeModal = StyleSheet.create({
  modalContainer: {
    borderRadius: 20,
    marginHorizontal: 18,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 16,
    elevation: 4,
  },
  backIconContainer: {
    position: 'absolute',
    left: 0,
  },
  customizeIconContainer: {
    width: 28,
    height: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28 / 2,
  },
  floatingTextInputCardContainer: {
    borderColor: Colors.stroke,
    borderWidth: 1,
    paddingVertical: 2,
    elevation: 0,
  },
  floatingTextInputContainer: {paddingBottom: 12},
  floatingTextInputLabel: {left: 4},
  floatingTextInput: {
    height: 36,
    top: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  buttonContainer: {width: '90%', alignSelf: 'center', marginTop: 4},
});

export default CustomizeModal;

import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const CustomModal = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSubContainer: {
    borderRadius: 10,
    marginBottom: 4,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 16,
    elevation: 4,
  },
  modalItemContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  modalButtonContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  negativeContainer: {
    backgroundColor: Colors.barBackground,
    borderColor: Colors.barBackground,
    marginVertical: 8,
  },
  positiveContainer: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    marginVertical: 8,
  },
});

export default CustomModal;

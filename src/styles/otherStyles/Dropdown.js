import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const Dropdown = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 8,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderColor: Colors.border,
  },
  textContainer: {flex: 1, justifyContent: 'center', marginLeft: 8},
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    maxHeight: '75%',
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
  modalSubContainer: {
    flexShrink: 1,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  optionRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginVertical: 16,
  },
});

export default Dropdown;

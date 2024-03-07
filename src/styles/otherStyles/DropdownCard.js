import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const Dropdown = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 0.9,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  arrowDownContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionModalContainer: {
    maxHeight: '50%',
    borderRadius: 8,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 16,
    elevation: 4,
  },
  optionModalSubContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  optionLabelContainer: {
    flex: 0.9,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  optionIconContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  buttonCardContainer: {
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 2,
  },
  buttonContainer: {width: '95%'},
});

export default Dropdown;

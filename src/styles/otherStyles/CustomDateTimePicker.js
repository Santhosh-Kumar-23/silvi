import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const CustomDateTimePicker = StyleSheet.create({
  cardConatiner: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  customModalContainer: {
    borderRadius: 8,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 16,
    elevation: 4,
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
  dateTimeContainerI: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dateTimeConatinerII: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: Colors.border,
    borderTopWidth: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dateTimeLabelContainer: {
    flex: 0.475,
    justifyContent: 'center',
  },
  dateTimeValueContainer: {
    flex: 0.475,
    justifyContent: 'center',
  },
  errorCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  dateTimePickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: Colors.border,
  },
});

export default CustomDateTimePicker;

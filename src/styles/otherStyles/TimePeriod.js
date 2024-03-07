import {StyleSheet} from 'react-native';

const TimePeriod = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeContainer: {
    flex: 0.4875,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  floatingTextInputCardContainer: {
    marginVertical: 8,
    paddingVertical: 2,
  },
  floatingTextInputContainer: {paddingBottom: 12},
  floatingTextInputLabel: {left: 4},
  floatingTextInput: {
    height: 36,
    top: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  frequencyContainer: {
    flex: 0.4875,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dropdownCardLabelContainerStyle: {flex: 0.75, paddingHorizontal: 4},
});

export default TimePeriod;

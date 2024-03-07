import {StyleSheet} from 'react-native';
import Colors from '../../../../utils/Colors';

const CreateCreditCard = StyleSheet.create({
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

export default CreateCreditCard;

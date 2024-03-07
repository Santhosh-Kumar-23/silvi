import {StyleSheet} from 'react-native';

const FloatingTextInput = StyleSheet.create({
  textInputLabel: {
    bottom: 4,
    fontFamily: 'Proxima Nova',
    fontSize: 12,
    fontWeight: '400',
    position: 'absolute',
  },
  textInputView: {
    flex: 1,
    fontFamily: 'Proxima Nova',
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 0,
    top: 12,
  },
});

export default FloatingTextInput;

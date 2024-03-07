import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const Search = StyleSheet.create({
  cardContainer: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: Colors.barBackground,
    borderColor: Colors.barBackground,
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 0,
    paddingVertical: 0,
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  closeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});

export default Search;

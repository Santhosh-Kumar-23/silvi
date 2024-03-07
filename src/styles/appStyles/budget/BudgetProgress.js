import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const Budget = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },

  budgetAccordionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.sectionBar,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },

  budgetAccordionLabelContainer: {
    flex: 0.95,
    justifyContent: 'center',
  },

  budgetAccordion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  budgetAccordionImage: {
    width: 20,
    height: 20,
    tintColor: Colors.primaryText,
  },

  budgetAccordionImageContainer: {
    flex: 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  monthItemsSubContainerI: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthItemsSubContainerII: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default Budget;

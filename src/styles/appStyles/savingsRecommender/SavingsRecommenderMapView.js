import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';
import * as Helpers from '../../../utils/Helpers';

const SavingsRecommenderMapView = StyleSheet.create({
  screenContainer: {
    flex: 1,
    marginVertical: 4,
  },
  headerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContainer: {
    position: 'absolute',
    height: Helpers.windowHeight * 0.1875,
    width: '100%',
    backgroundColor: Colors.transparent,
    bottom: 16,
    paddingVertical: 4,
  },
  cardItemContainer: {
    width: Helpers.windowWidth * 0.5,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 4,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  cardItemImageContainer: {
    flex: 0.625,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.stroke,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  imageLoader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  cardItemTextSubContainerI: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardItemTextSubContainerII: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  skeletonCardItemContainer: {
    width: Helpers.windowWidth * 0.5,
    flexDirection: 'row',
    borderRadius: 4,
  },
});

export default SavingsRecommenderMapView;

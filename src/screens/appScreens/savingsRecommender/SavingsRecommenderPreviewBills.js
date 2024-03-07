import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Image, RefreshControl, View} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Colors from '../../../utils/Colors';
import Labels from '../../../utils/Strings';
import Network from '../../../containers/Network';
import NoResponse from '../../../components/appComponents/NoResponse';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import Styles from '../../../styles/appStyles/savingsRecommender/SavingsRecommenderPreviewBills';
import Swiper from 'react-native-swiper';
import Toggler from '../../../components/appComponents/Toggler';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const SavingsRecommenderPreviewBills = () => {
  // SavingsRecommenderPreviewBills Variables
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [imageLoader, setImageLoader] = useState(null);
  const [bills, setBills] = useState(null);

  // Other Variables
  const [refreshing, setRefreshing] = useState(false);
  const billsList = [
    'https://www.bluefintech.com/wp-content/uploads/2019/10/Breach-Cost-Receipt-PHI-3-1-650x1024.png',
    'https://user-images.githubusercontent.com/23262259/44022744-c92c859a-9ee8-11e8-999c-60dbeae00255.jpg',
    'https://media.istockphoto.com/photos/receipt-for-pig-food-1948-picture-id1362414342?b=1&k=20&m=1362414342&s=170667a&w=0&h=L5ICqBVE6H3g0FjeTPnV1XnCB10HpqZATFrTweyGZSE=',
  ];

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setBills(billsList);

        setRefreshing(false);
      }, 1000);
    }, [refreshing == true]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    setBills(null);
  };

  const handleSwiperIndexChange = swipeIndex => {
    ENV.currentEnvironment == Labels.development &&
      console.log(
        'SAVINGS RECOMMENDER PREVIEW BILLS SWIPER INDEX::: ',
        swipeIndex,
      );

    setSwiperIndex(swipeIndex);
  };

  const LabelSkeleton = ({height = 32, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        <View style={[HelperStyles.flex(1), HelperStyles.margin(20, 16)]}>
          {Boolean(bills) ? (
            Array.isArray(bills) &&
            bills.length != 0 && (
              <View style={HelperStyles.flex(0.1)}>
                <Toggler
                  index={swiperIndex}
                  label={Labels.previewItems}
                  length={bills.length}
                  onValueChange={selectedValue => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log(
                        'SAVINGS RECOMMENDER PREVIEW BILLS TOGGLER SELECTED VALUE::: ',
                        selectedValue,
                      );

                    setSwiperIndex(selectedValue);
                  }}
                />
              </View>
            )
          ) : (
            <View
              style={[
                HelperStyles.flex(0.11125),
                HelperStyles.justView('justifyContent', 'center'),
              ]}>
              <LabelSkeleton style={Styles.skeletonToggler} />
            </View>
          )}
          <View
            style={[
              HelperStyles.flex(
                Boolean(bills) && Array.isArray(bills) && bills.length != 0
                  ? 0.9
                  : 1,
              ),
              HelperStyles.margin(0, 8),
            ]}>
            {Boolean(bills) ? (
              Array.isArray(bills) && bills.length != 0 ? (
                <Swiper
                  horizontal={true}
                  automaticallyAdjustContentInsets={true}
                  contentInsetAdjustmentBehavior={'automatic'}
                  index={swiperIndex}
                  loop={false}
                  onIndexChanged={swipeIndex => {
                    handleSwiperIndexChange(swipeIndex);
                  }}
                  refreshControl={
                    <RefreshControl
                      tintColor={Colors.primary}
                      refreshing={refreshing}
                      onRefresh={() => {
                        onRefresh();
                      }}
                    />
                  }
                  showsButtons={false}
                  showsPagination={false}>
                  {bills.map((billListData, index) => (
                    <View
                      key={index}
                      style={HelperStyles.justView(
                        'left',
                        swiperIndex == 0 || swiperIndex + 1 == bills.length
                          ? 0
                          : 40,
                      )}>
                      <Image
                        onLoadStart={() => {
                          setImageLoader(true);
                        }}
                        onLoadEnd={() => {
                          setImageLoader(false);
                        }}
                        resizeMode={'cover'}
                        source={{
                          uri: billListData,
                        }}
                        style={HelperStyles.imageView('100%', '100%')}
                      />
                      {imageLoader && (
                        <ActivityIndicator
                          size={'large'}
                          color={Colors.primary}
                          style={Styles.imageLoader}
                        />
                      )}
                    </View>
                  ))}
                </Swiper>
              ) : (
                <NoResponse />
              )
            ) : (
              <LabelSkeleton
                height={Helpers.windowHeight * 0.7325}
                style={[HelperStyles.justView('width', '100%')]}
              />
            )}
          </View>
        </View>
      </View>
    </Network>
  );
};

export default SavingsRecommenderPreviewBills;

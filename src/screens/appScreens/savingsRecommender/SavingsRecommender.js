import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Card from '../../../containers/Card';
import Colors from '../../../utils/Colors';
import Labels from '../../../utils/Strings';
import Network from '../../../containers/Network';
import NoResponse from '../../../components/appComponents/NoResponse';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import Styles from '../../../styles/appStyles/savingsRecommender/SavingsRecommender';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const SavingsRecommender = props => {
  // SavingsRecommender Variables
  const [imageLoader, setImageLoader] = useState(false);
  const [savingsRecommender, setSavingsRecommender] = useState(null);

  // Other Variables
  const [refreshing, setRefreshing] = useState(false);
  const savingsRecommenderList = [
    {
      coordinates: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      image: 'https://wallpaperaccess.com/full/418610.jpg',
      name: 'H&M',
      percentage: 30,
      ratings: 4.5,
      views: Math.floor(Math.random() * 500),
    },
    {
      coordinates: {
        latitude: 37.77,
        longitude: -122.5,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTms3Oba-iPSOyMZid7rxHkBEaEyUZGY3RGTHaZW3NmM3jg50KQSSrq3rNb_GCrld5i41E&usqp=CAU',
      name: 'Uniqlo',
      percentage: 20,
      ratings: 4.0,
      views: Math.floor(Math.random() * 250),
    },
    {
      coordinates: {
        latitude: 37.75,
        longitude: -122.375,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMf-Mk5QXgi6TWWvzermzUm7iKr7CCrpFP7uigisQmGIBMgDlZwdzdIk2MYMEi-B3kASs&usqp=CAU',
      name: 'Cotton On',
      percentage: 15,
      ratings: 3.5,
      views: Math.floor(Math.random() * 750),
    },
    {
      coordinates: {
        latitude: 37.78,
        longitude: -122.4,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-SPWQYHVVRrCYTHwVrW-sUEL3OxxLEGHCA3Bn5_WMi4-sswUX3FMwTNgi5s5V_71J4Fk&usqp=CAU',
      name: 'Victoria’s Secret',
      percentage: 10,
      ratings: 4.5,
      views: Math.floor(Math.random() * 125),
    },
    {
      coordinates: {
        latitude: 37.74,
        longitude: -122.4,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      image:
        'https://images.unsplash.com/photo-1533481405265-e9ce0c044abb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFsbHxlbnwwfHwwfHw%3D&w=1000&q=80',
      name: 'La La Land',
      percentage: 10,
      ratings: 4.0,
      views: Math.floor(Math.random() * 625),
    },
  ];

  // Theme Variables
  const Theme = useTheme().colors;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => renderHeaderRight(),
    });
  });

  const renderHeaderRight = () => {
    return (
      <View style={HelperStyles.flexDirection('row')}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('SavingsRecommenderMapView');
          }}
          style={Styles.headerIconContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.mapView}
            style={[
              HelperStyles.imageView(24, 24),
              HelperStyles.justView('tintColor', Theme.text),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setSavingsRecommender(savingsRecommenderList);

        setRefreshing(false);
      }, 1000);
    }, [refreshing == true]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    setSavingsRecommender(null);
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const CardSkeleton = ({
    height = Helpers.windowHeight * 0.12125,
    style = {},
  }) => {
    return (
      <SkeletonCard
        height={height}
        style={[HelperStyles.margin(0, 8), style]}
      />
    );
  };

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        <ScrollView
          contentContainerStyle={HelperStyles.flexGrow(1)}
          keyboardShouldPersistTaps={'handled'}
          refreshControl={
            <RefreshControl
              tintColor={Colors.primary}
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }
          showsVerticalScrollIndicator={false}>
          <View style={[HelperStyles.flex(1), HelperStyles.margin(20, 24)]}>
            {Boolean(savingsRecommender) ? (
              Array.isArray(savingsRecommender) &&
              savingsRecommender.length != 0 && (
                <Text
                  style={HelperStyles.textView(
                    14,
                    '600',
                    Theme.text,
                    'left',
                    'lowercase',
                  )}>
                  {savingsRecommender.length} {Labels.resultsFound}
                </Text>
              )
            ) : (
              <LabelSkeleton
                height={16}
                style={HelperStyles.justView('width', '50%')}
              />
            )}
            {Boolean(savingsRecommender) ? (
              Array.isArray(savingsRecommender) &&
              savingsRecommender.length != 0 && (
                <Text
                  style={[
                    HelperStyles.textView(
                      14,
                      '400',
                      Theme.text,
                      'left',
                      'none',
                    ),
                    HelperStyles.justView('marginTop', 4),
                  ]}>
                  {Labels.discountOfferedByMerchants}
                </Text>
              )
            ) : (
              <LabelSkeleton
                height={16}
                style={HelperStyles.justView('marginTop', 4)}
              />
            )}
            <View style={[HelperStyles.flex(1), HelperStyles.margin(0, 16)]}>
              {Boolean(savingsRecommender) ? (
                Array.isArray(savingsRecommender) &&
                savingsRecommender.length != 0 ? (
                  savingsRecommender.map((savingsRecommenderData, index) => (
                    <Card
                      key={index}
                      containerStyle={Styles.cardContainer}
                      disabled={false}
                      onPress={() => {
                        props.navigation.navigate('SavingsRecommenderView', {
                          savingsRecommenderData,
                        });
                      }}>
                      <View
                        style={[
                          HelperStyles.flex(0.35),
                          HelperStyles.justifyContentCenteredView('center'),
                        ]}>
                        <Image
                          onLoadStart={() => {
                            setImageLoader(true);
                          }}
                          onLoadEnd={() => {
                            setImageLoader(false);
                          }}
                          resizeMode={'cover'}
                          source={{
                            uri: savingsRecommenderData.image,
                          }}
                          style={[
                            HelperStyles.imageView(64, '100%'),
                            HelperStyles.justView('borderRadius', 4),
                          ]}
                        />
                        {imageLoader && (
                          <ActivityIndicator
                            size={'small'}
                            color={Colors.primary}
                            style={Styles.imageLoader}
                          />
                        )}
                      </View>
                      <View
                        style={[
                          HelperStyles.flex(0.65),
                          HelperStyles.padding(8, 4),
                        ]}>
                        <View style={Styles.cardTextSubContainerI}>
                          <View style={Styles.cardTextNameContainer}>
                            <Text
                              numberOfLines={1}
                              style={HelperStyles.textView(
                                14,
                                '700',
                                Colors.primaryText,
                                'left',
                                'none',
                              )}>
                              {savingsRecommenderData.name}
                            </Text>
                            <Text
                              style={[
                                HelperStyles.textView(
                                  18,
                                  '900',
                                  Colors.secondaryText,
                                  'center',
                                  'none',
                                ),
                                HelperStyles.justView('bottom', 4),
                              ]}>
                              {' | '}
                            </Text>
                            <Text
                              style={HelperStyles.textView(
                                14,
                                '700',
                                Colors.primary,
                                'center',
                                'none',
                              )}>
                              {savingsRecommenderData.percentage}%
                            </Text>
                          </View>
                          <View style={Styles.cardTextRatingsContainer}>
                            <Text
                              style={[
                                HelperStyles.textView(
                                  12,
                                  '600',
                                  Colors.primaryText,
                                  'center',
                                  'none',
                                ),
                                HelperStyles.justView('top', 1),
                              ]}>
                              {savingsRecommenderData.ratings}
                            </Text>
                            <View style={HelperStyles.margin(2, 0)}>
                              <Image
                                resizeMode={'contain'}
                                source={Assets.star}
                                style={HelperStyles.imageView(16, 16)}
                              />
                            </View>
                          </View>
                        </View>
                        <View style={Styles.cardTextSubContainerII}>
                          <View style={Styles.cardTextDistanceContainer}>
                            <Text
                              style={HelperStyles.textView(
                                12,
                                '400',
                                Colors.darkElectricBlue,
                                'center',
                                'none',
                              )}>
                              {Helpers.kFormatter(1)} {Labels.kmsAway}
                            </Text>
                          </View>
                          <View style={Styles.cardTextViewItemsContainer}>
                            <Text
                              style={HelperStyles.textView(
                                12,
                                '400',
                                Colors.black,
                                'center',
                                'none',
                              )}>
                              {Labels.viewItems}
                            </Text>
                            <View style={HelperStyles.margin(2, 0)}>
                              <Image
                                resizeMode={'contain'}
                                source={Assets.back}
                                style={[
                                  HelperStyles.imageView(16, 16),
                                  HelperStyles.justView(
                                    'tintColor',
                                    Colors.primary,
                                  ),
                                  HelperStyles.justView('transform', [
                                    {rotate: '180deg'},
                                  ]),
                                ]}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </Card>
                  ))
                ) : (
                  <NoResponse />
                )
              ) : (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Network>
  );
};

export default SavingsRecommender;

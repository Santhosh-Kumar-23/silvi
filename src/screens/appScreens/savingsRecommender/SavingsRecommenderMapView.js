import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Colors from '../../../utils/Colors';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Network from '../../../containers/Network';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import Styles from '../../../styles/appStyles/savingsRecommender/SavingsRecommenderMapView';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const SavingsRecommenderMapView = props => {
  // SavingsRecommenderMapView Variables
  const [imageLoader, setImageLoader] = useState(false);
  const [region, setRegion] = useState(null);
  const [savingsRecommender, setSavingsRecommender] = useState(null);
  const [selectedSavingsRecommender, setSelectedSavingsRecommender] =
    useState(null);

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
            props.navigation.navigate('SavingsRecommender');
          }}
          style={Styles.headerIconContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.listView}
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
        if (
          Boolean(savingsRecommenderList) &&
          Array.isArray(savingsRecommenderList) &&
          savingsRecommenderList.length != 0
        ) {
          setSavingsRecommender(savingsRecommenderList);

          setRegion(savingsRecommenderList[0].coordinates);

          setSelectedSavingsRecommender(savingsRecommenderList[0].coordinates);
        } else {
          setSavingsRecommender([]);

          setRegion(null);

          setSelectedSavingsRecommender(null);
        }

        setRefreshing(false);
      }, 1000);
    }, [refreshing == true]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    setSavingsRecommender(null);
  };

  const renderSavingsRecommender = (savingsRecommenderData, index) => {
    return (
      <View
        style={[
          Styles.cardItemContainer,
          HelperStyles.justView(
            'borderColor',
            Boolean(selectedSavingsRecommender) &&
              selectedSavingsRecommender == savingsRecommenderData.coordinates
              ? Colors.bittersweet
              : Colors.transparent,
          ),
          HelperStyles.justView('marginLeft', index == 0 ? 24 : 8),
          HelperStyles.justView(
            'marginRight',
            savingsRecommenderList.length == index + 1 ? 24 : 8,
          ),
        ]}>
        <View style={Styles.cardItemImageContainer}>
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
            style={HelperStyles.imageView('100%', '100%')}
          />
          {imageLoader && (
            <ActivityIndicator
              size={'small'}
              color={Colors.primary}
              style={Styles.imageLoader}
            />
          )}
        </View>
        <View style={[HelperStyles.flex(0.375), HelperStyles.padding(8, 0)]}>
          <View style={Styles.cardItemTextSubContainerI}>
            <Text
              style={HelperStyles.textView(
                12,
                '700',
                Colors.primaryText,
                'left',
                'none',
              )}>
              {savingsRecommenderData.name}
            </Text>
            <Text
              style={HelperStyles.textView(
                16,
                '900',
                Colors.secondaryText,
                'left',
                'none',
              )}>
              {' | '}
            </Text>
            <Text
              style={HelperStyles.textView(
                12,
                '700',
                Colors.primary,
                'left',
                'none',
              )}>
              {savingsRecommenderData.percentage}%
            </Text>
          </View>
          <View style={Styles.cardItemTextSubContainerII}>
            <Text
              style={HelperStyles.textView(
                12,
                '600',
                Colors.primaryText,
                'left',
                'none',
              )}>
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
      </View>
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
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}>
          <View style={Styles.screenContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              region={region}
              style={Styles.mapView}>
              {Boolean(selectedSavingsRecommender) && (
                <Marker coordinate={selectedSavingsRecommender} />
              )}
            </MapView>
            <View style={Styles.cardContainer}>
              {Boolean(savingsRecommender) &&
              Array.isArray(savingsRecommender) &&
              savingsRecommender.length != 0 ? (
                <ScrollView
                  contentContainerStyle={HelperStyles.flexGrow(1)}
                  horizontal={true}
                  keyboardShouldPersistTaps={'handled'}
                  nestedScrollEnabled={true}
                  showsHorizontalScrollIndicator={false}>
                  {savingsRecommender.map((savingsRecommenderData, index) => (
                    <TouchableWithoutFeedback
                      key={index}
                      onPress={() => {
                        setRegion(savingsRecommenderData.coordinates);

                        setSelectedSavingsRecommender(
                          savingsRecommenderData.coordinates,
                        );
                      }}>
                      {renderSavingsRecommender(savingsRecommenderData, index)}
                    </TouchableWithoutFeedback>
                  ))}
                </ScrollView>
              ) : (
                <View style={Styles.skeletonCardItemContainer}>
                  <SkeletonCard
                    height={Helpers.windowHeight * 0.175}
                    style={[
                      HelperStyles.justView('marginLeft', 24),
                      HelperStyles.justView('marginRight', 8),
                    ]}
                    width={Helpers.windowWidth * 0.5}
                  />
                  <SkeletonCard
                    height={Helpers.windowHeight * 0.175}
                    style={[
                      HelperStyles.justView('marginLeft', 8),
                      HelperStyles.justView('marginRight', 24),
                    ]}
                    width={Helpers.windowWidth * 0.5}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Network>
  );
};

export default SavingsRecommenderMapView;

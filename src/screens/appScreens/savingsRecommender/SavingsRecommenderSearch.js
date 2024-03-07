import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {
  savingsRecommenderCategory,
  savingsRecommenderSubCategory,
  savingsRecommenderCreateSubCategory,
} from '../../../redux/Root.Actions';
import Assets from '../../../assets/Index';
import Button from '../../../components/appComponents/Button';
import Card from '../../../containers/Card';
import Colors from '../../../utils/Colors';
import Dropdown from '../../../components/appComponents/Dropdown';
import DropdownCard from '../../../components/appComponents/DropdownCard';
import Geolocation from '@react-native-community/geolocation';
import Labels from '../../../utils/Strings';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Network from '../../../containers/Network';
import SkeletonButton from '../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonDropdown from '../../../components/skeletonComponents/SkeletonDropdown';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import Styles from '../../../styles/appStyles/savingsRecommender/SavingsRecommenderSearch';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';
import CustomizeModal from '../../../components/appComponents/CustomizeModal';

const SavingsRecommenderSearch = props => {
  // SavingsRecommenderSearch Variables
  const [recommenderCategory, setRecommenderCategory] = useState(null);
  const [recommenderSubCategory, setRecommenderSubCategory] = useState(null);
  const [areaRange, setAreaRange] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState(null);
  const [regions, setRegions] = useState(null);

  // Error Variables
  const [recommenderCategoryError, setRecommenderCategoryError] =
    useState(false);
  const [recommenderSubCategoryError, setRecommenderSubCategoryError] =
    useState(false);
  const [areaRangeError, setAreaRangeError] = useState(false);
  const [selectedRegionsError, setSelectedRegionsError] = useState(false);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recommenderCategoryOption, setRecommenderCategoryOption] =
    useState(null);
  const [recommenderSubCategoryOption, setRecommenderSubCategoryOption] =
    useState(null);
  const [areaRangeList, setAreaRangeList] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [customizeModalStatus, setCustomizeModalStatus] = useState(false);
  const [customizeFor, setCustomizeFor] = useState(null);
  let watchID;

  // Theme Variables
  const Theme = useTheme().colors;

  const areaRangeArray = [
    {
      name: '1 Kilometers',
      id: '1 Kilometers',
    },
    {
      name: '2 Kilometers',
      id: '2 Kilometers',
    },
    {
      name: '3 Kilometers',
      id: '3 Kilometers',
    },
    {
      name: '4 Kilometers',
      id: '4 Kilometers',
    },
  ];

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => renderHeaderLeft(),
    });
  });

  const renderHeaderLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Menu');
        }}
        style={[
          HelperStyles.justifyContentCenteredView('center'),
          HelperStyles.padding(4, 4),
        ]}>
        <Image
          resizeMode={'contain'}
          source={Assets.home}
          style={[
            HelperStyles.imageView(24, 24),
            HelperStyles.justView('tintColor', Theme.text),
          ]}
        />
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      savingsRecommenderCategory();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoading(false);

        requestLocationPermission();

        setRefreshing(false);
      }, 1000);
    }, [refreshing == true]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    handleReset();

    setLoading(true);
  };

  const handleReset = () => {
    setRecommenderCategory(null);
    setRecommenderSubCategory(null);
    setAreaRange(null);
    setSelectedRegions(null);
    setRegions(null);
    setRecommenderCategoryError(false);
    setRecommenderSubCategoryError(false);
    setAreaRangeError(false);
    setSelectedRegionsError(false);
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setAreaRangeList(areaRangeArray);

      return () => {
        isFocus = false;

        Boolean(watchID) && Geolocation.clearWatch(watchID);
      };
    }, []),
  );

  const savingsRecommenderCategory = async () => {
    await props.savingsRecommenderCategory(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log(
          'SAVINGS RECOMMENDERS CATEGORY RESPONSE DATA::: ',
          response,
        );

      setRecommenderCategoryOption(response);
    });
  };

  const savingsRecommenderSubCategory = async (
    categoryId,
    customSubCategoryName,
  ) => {
    await props.savingsRecommenderSubCategory(categoryId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log(
          'SAVINGS RECOMMENDER SUB CATEGORY RESPONSE DATA::: ',
          response,
        );

      const customizeObject = {
        icon: Assets.customize,
        id: Labels.customize,
        name: Labels.customize,
      };

      if (Array.isArray(response)) {
        const checkForUncategorized =
          Boolean(recommenderCategoryOption) &&
          Array.isArray(recommenderCategoryOption)
            ? recommenderCategoryOption.filter(lol => lol.id == categoryId)
            : [{id: categoryId, name: customSubCategoryName}];

        checkForUncategorized.length != 0 &&
          checkForUncategorized[0].name == Labels.uncategorized &&
          response.push(customizeObject);

        if (Boolean(customSubCategoryName)) {
          const filteredSubCategory = response.filter(
            lol => lol.name == customSubCategoryName,
          );
          ENV.currentEnvironment == Labels.development &&
            console.log('FILTERED SUB CATEGORY::: ', filteredSubCategory);

          filteredSubCategory.length != 0 &&
            setRecommenderSubCategory(filteredSubCategory[0].id);
        } else {
          setRecommenderSubCategory(null);
        }

        setRecommenderSubCategoryOption(response);
      } else {
        setRecommenderSubCategoryOption(null);
      }
    });
  };

  const handleSubCategorySelection = selectedValue => {
    setCustomizeFor(Labels.subCategory);
    recommenderSubCategoryError && setRecommenderSubCategoryError(false);

    const selectedSavingsRecommenderSubCategory =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    if (
      Boolean(selectedSavingsRecommenderSubCategory) &&
      selectedSavingsRecommenderSubCategory == Labels.customize
    ) {
      setRecommenderSubCategory(selectedSavingsRecommenderSubCategory);

      setCustomizeModalStatus(!customizeModalStatus);
    } else {
      setRecommenderSubCategory(selectedSavingsRecommenderSubCategory);
    }
  };

  const renderCustomizeModal = () => {
    return (
      <CustomizeModal
        label={customizeFor}
        onBack={() => {
          setCustomizeModalStatus(!customizeModalStatus);

          switch (customizeFor) {
            case Labels.subCategory:
              setRecommenderSubCategoryError(false);

              setRecommenderSubCategory(null);

              setCustomizeFor(null);
              break;

            default:
              setCustomizeFor(null);
              break;
          }
        }}
        onConfirm={txt => {
          switch (customizeFor) {
            case Labels.subCategory:
              ENV.currentEnvironment == Labels.development &&
                console.log(
                  'SAVINGS RECOMMENDER SUB CATEGORY CUSTOMIZE MODAL TXT::: ',
                  txt,
                );

              const filteredSubCategory = recommenderSubCategoryOption.filter(
                lol => lol.name == txt,
              );

              if (filteredSubCategory.length != 0) {
                setRecommenderSubCategory(filteredSubCategory[0].id);
              } else {
                savingsRecommenderCreateSubCategory(txt);
              }

              setCustomizeFor(null);
              break;

            default:
              setCustomizeFor(null);
              break;
          }
        }}
        onRequestClose={() => {
          setCustomizeModalStatus(!customizeModalStatus);
        }}
        visible={customizeModalStatus}
      />
    );
  };

  const savingsRecommenderCreateSubCategory = customSubCategoryName => {
    const requestData = {
      category: {_id: recommenderCategory},
      icon: null,
      name: customSubCategoryName,
    };

    props.savingsRecommenderCreateSubCategory(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SPENDING CREATE SUB CATEGORY RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedSubCategoryData,
        position: 'bottom',
        type: 'default',
      });
      savingsRecommenderSubCategory(recommenderCategory, customSubCategoryName);
    });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        subscribeLocationLocation();
      } else {
        showMessage({
          description: Labels.permissionDenied,
          icon: 'auto',
          message: Labels.warning,
          type: 'warning',
        });
      }
    } catch (err) {
      showMessage({
        description: Labels.permissionDenied,
        icon: 'auto',
        message: Labels.error,
        type: 'danger',
      });
    }
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        const getCurrentRegion = {
          latitude: Number(JSON.stringify(position.coords.latitude)),
          longitude: Number(JSON.stringify(position.coords.longitude)),
        };

        setRegions({
          ...getCurrentRegion,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0421,
        });

        Boolean(selectedRegions) &&
          setSelectedRegions({
            ...getCurrentRegion,
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0421,
          });

        setMapLoading(false);
      },
      error => {
        showMessage({
          description: error.message,
          icon: 'auto',
          message: Labels.error,
          type: 'danger',
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );
  };

  const handleConfirm = () => {
    if (checkSavingsRecommender()) {
      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('SAVINGS RECOMMENDER REQUESTDATA :::: ', requestData);

      props.navigation.navigate('SavingsRecommender');
    } else {
      handleErrorValidation();
    }
  };

  const checkSavingsRecommender = () => {
    if (
      Boolean(recommenderCategory) &&
      Boolean(recommenderSubCategory) &&
      Boolean(areaRange)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {};

    requestData = {
      ...requestData,
      category: recommenderCategory,
      subCategory: recommenderSubCategory,
      areaRange: areaRange,
    };

    return requestData;
  };

  const handleErrorValidation = () => {
    setRecommenderCategoryError(Boolean(recommenderCategory) ? false : true);
    setRecommenderSubCategoryError(
      Boolean(recommenderSubCategory) ? false : true,
    );
    setAreaRangeError(Boolean(areaRange) ? false : true);
    setSelectedRegionsError(Boolean(selectedRegions) ? false : true);
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const DropdownSkeleton = () => {
    return <SkeletonDropdown textWidth={Helpers.windowWidth * 0.3} />;
  };

  const DropdownCardSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCard />
      </View>
    );
  };

  const ButtonSkeleton = ({height = 40, width = '100%'}) => {
    return (
      <SkeletonButton
        height={height}
        style={[
          HelperStyles.justView('alignSelf', 'center'),
          HelperStyles.justView('elevation', 0),
        ]}
        width={width}
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
          <View style={HelperStyles.margin(20, 24)}>
            {!loading ? (
              <Text
                style={HelperStyles.textView(
                  14,
                  '600',
                  Theme.primaryText,
                  'left',
                  'none',
                )}>
                {Labels.savingSearch}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            <View style={Styles.savingsRecommenderContainer}>
              <View style={Styles.savingsRecommenderCategoryContainer}>
                {!loading ? (
                  <Dropdown
                    modalHeaderLabel={`${Labels.select} ${Labels.savingsRecommender} ${Labels.category}`}
                    onValueChange={selectedValue => {
                      ENV.currentEnvironment == Labels.development &&
                        console.log(
                          'SAVINGS RECOMMENDER CATEGORY SELECTED VALUE::: ',
                          selectedValue,
                        );

                      recommenderCategoryError &&
                        setRecommenderCategoryError(false);

                      setRecommenderCategory(
                        Boolean(selectedValue) &&
                          Object.keys(selectedValue).length != 0
                          ? selectedValue.id
                          : null,
                      );

                      Object.keys(selectedValue).length != 0 &&
                        savingsRecommenderSubCategory(selectedValue.id);
                    }}
                    optionImageKey={'icon'}
                    optionLabelKey={'name'}
                    options={recommenderCategoryOption}
                    optionValueKey={'id'}
                    searchEnabled={true}
                    value={recommenderCategory}
                  />
                ) : (
                  <DropdownSkeleton />
                )}
                {recommenderCategoryError && (
                  <Text
                    style={[
                      HelperStyles.errorText,
                      HelperStyles.justView('marginHorizontal', 0),
                    ]}>
                    {Labels.categoryError}
                  </Text>
                )}
                {!recommenderCategoryError && recommenderSubCategoryError && (
                  <Text
                    style={[
                      HelperStyles.errorText,
                      HelperStyles.justView('marginHorizontal', 0),
                    ]}
                  />
                )}
              </View>
              <View style={Styles.savingsRecommenderCategoryContainer}>
                {!loading ? (
                  <Dropdown
                    disabled={!Boolean(recommenderCategory)}
                    label={Labels.subCategory}
                    modalHeaderLabel={`${Labels.select} ${Labels.savingsRecommender} ${Labels.subCategory}`}
                    onValueChange={selectedValue => {
                      ENV.currentEnvironment == Labels.development &&
                        console.log(
                          'SAVINGS RECOMMENDER SUB CATEGORY SELECTED VALUE::: ',
                          selectedValue,
                        );

                      handleSubCategorySelection(selectedValue);
                    }}
                    optionImageKey={'icon'}
                    optionLabelKey={'name'}
                    options={recommenderSubCategoryOption}
                    optionValueKey={'id'}
                    searchEnabled={true}
                    value={recommenderSubCategory}
                  />
                ) : (
                  <DropdownSkeleton />
                )}
                {recommenderSubCategoryError && (
                  <Text
                    style={[
                      HelperStyles.errorText,
                      HelperStyles.justView('marginHorizontal', 0),
                    ]}>
                    {Labels.subCategoryError}
                  </Text>
                )}
                {!recommenderSubCategoryError && recommenderCategoryError && (
                  <Text
                    style={[
                      HelperStyles.errorText,
                      HelperStyles.justView('marginHorizontal', 0),
                    ]}
                  />
                )}
              </View>
            </View>
            {!loading ? (
              <DropdownCard
                disabled={
                  !Boolean(recommenderCategory && recommenderSubCategory)
                }
                floatLabel={Labels.areaRange}
                label={`${Labels.areaRange}...`}
                labelContainerStyle={Styles.dropdownCardLabelContainerStyle}
                onValueChange={selectedValue => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log('AREA RANGE SELECTED VALUE::: ', selectedValue);

                  areaRangeError && setAreaRangeError(false);

                  setAreaRange(
                    Boolean(selectedValue) &&
                      Object.keys(selectedValue).length != 0
                      ? selectedValue.id
                      : null,
                  );
                }}
                optionLabelKey={'name'}
                options={areaRangeList}
                optionValueKey={'id'}
                value={areaRange}
              />
            ) : (
              <DropdownCardSkeleton />
            )}
            {areaRangeError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                {Labels.areaRangeError}
              </Text>
            )}
            {!loading ? (
              <Card
                disabled={false}
                containerStyle={[
                  HelperStyles.margin(0, 8),
                  HelperStyles.padding(12, 14),
                  HelperStyles.flex(1),
                  HelperStyles.flexDirection('row'),
                  HelperStyles.justifyContentCenteredView('space-between'),
                ]}>
                <Text
                  style={HelperStyles.textView(
                    16,
                    '600',
                    Theme.primaryText,
                    'left',
                    'none',
                  )}>
                  {Labels.location}
                </Text>
                <Image
                  resizeMode={'contain'}
                  source={Assets.location}
                  style={[HelperStyles.imageView(24, 24)]}
                />
              </Card>
            ) : (
              <DropdownCardSkeleton />
            )}
            <View style={[Styles.mapContainer, HelperStyles.margin(0, 8)]}>
              {!loading ? (
                <MapView
                  focusable={true}
                  followsUserLocation={true}
                  loadingEnabled={mapLoading}
                  onPress={location => {
                    setRegions({
                      ...location.nativeEvent.coordinate,
                      latitudeDelta: 0.0422,
                      longitudeDelta: 0.0421,
                    });

                    setSelectedRegions(location.nativeEvent.coordinate);
                  }}
                  pitchEnabled={true}
                  provider={PROVIDER_GOOGLE}
                  region={regions}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  style={{...StyleSheet.absoluteFillObject}}>
                  {Boolean(selectedRegions) && (
                    <Marker
                      coordinate={selectedRegions}
                      draggable={true}
                      onDragEnd={e => {
                        setSelectedRegions(e.nativeEvent.coordinate);
                      }}
                    />
                  )}
                </MapView>
              ) : (
                <LabelSkeleton
                  height={Helpers.windowHeight * 0.5}
                  style={HelperStyles.justView('width', '100%')}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <Card containerStyle={Styles.buttonCardContainer}>
          {!loading ? (
            <Button
              containerStyle={Styles.buttonContainer}
              label={Labels.searchForDiscount}
              onPress={() => {
                handleConfirm();
              }}
            />
          ) : (
            <ButtonSkeleton width={Helpers.windowWidth * 0.9125} />
          )}
        </Card>

        {renderCustomizeModal()}
      </View>
    </Network>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    savingsRecommenderCategory: onResponse => {
      dispatch(savingsRecommenderCategory(onResponse));
    },

    savingsRecommenderSubCategory: (categoryId, onResponse) => {
      dispatch(savingsRecommenderSubCategory(categoryId, onResponse));
    },

    savingsRecommenderCreateSubCategory: (requestData, onResponse) => {
      dispatch(savingsRecommenderCreateSubCategory(requestData, onResponse));
    },
  };
};

export default connect(null, mapDispatchToProps)(SavingsRecommenderSearch);

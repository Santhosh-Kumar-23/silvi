import React, {useState, useLayoutEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {creditCardDelete, creditCardList} from '../../../../redux/Root.Actions';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../assets/Index';
import Colors from '../../../../utils/Colors';
import CustomModal from '../../../../components/appComponents/CustomModal';
import Labels from '../../../../utils/Strings';
import Network from '../../../../containers/Network';
import NoResponse from '../../../../components/appComponents/NoResponse';
import SkeletonCard from '../../../../components/skeletonComponents/SkeletonCard';
import Styles from '../../../../styles/appStyles/balance/creditCard/CreditCardList';
import * as ENV from '../../../../../env';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';

const CreditCardList = props => {
  // CreditCardList Variables
  const [credit, setCredit] = useState(null);
  const [imageLoader, setImageLoader] = useState(false);

  // Other Variables
  const [offset, setOffset] = useState(1);
  const [lastOffSet, setLastOffSet] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [indicator, setIndicator] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);

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
            editStatus && setEditStatus(!editStatus);

            props.navigation.navigate('CreateCreditCard');
          }}
          style={[
            Styles.headerIconContainer,
            HelperStyles.justView('marginRight', 12),
          ]}>
          <Image
            resizeMode={'contain'}
            source={Assets.plus}
            style={[
              HelperStyles.imageView(24, 24),
              HelperStyles.justView('tintColor', Theme.text),
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Boolean(credit) && Array.isArray(credit) && credit.length != 0
              ? setEditStatus(!editStatus)
              : showMessage({
                  icon: 'auto',
                  message: Labels.noCreditCartsFound,
                  position: 'bottom',
                  type: 'info',
                });
          }}
          style={Styles.headerIconContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.edit}
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
      let isFocus = true;

      getCreditCardList();

      return () => {
        isFocus = false;

        setEditStatus(false);
      };
    }, []),
  );

  const getCreditCardList = () => {
    const requestData = {
      limit: ENV.dataLimit,
      offset: 1,
    };

    props.creditCardList(requestData, res => {
      const response = res.resJson.data.list;

      ENV.currentEnvironment == Labels.development &&
        console.log('CREDIT CARD LIST RESPONSE::: ', response);

      setCredit(response.results);

      setLastOffSet(response.totalPages);

      setRefreshing(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      shouldHandeLoadMore();

      return () => {
        isFocus = false;
      };
    }, [loadMore == true]),
  );

  const shouldHandeLoadMore = () => {
    if (offset <= lastOffSet && loadMore) {
      setIndicator(true);

      const requestData = {
        offset: offset,
        limit: ENV.dataLimit,
      };

      props.creditCardList(requestData, res => {
        const response = res.resJson.data.list;

        setCredit([...credit, ...response.results]);

        setIndicator(false);
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    setIndicator(false);

    setOffset(1);

    setCredit(null);

    getCreditCardList();
  };

  const handleDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    setEditStatus(!editStatus);

    const creditCardId = selectedRecord.id;

    props.creditCardDelete(creditCardId, res => {
      setSelectedRecord(null);

      getCreditCardList();
    });
  };

  const momentumScroll = e => {
    const scrollPosition = e.nativeEvent.contentOffset.y;
    const scrolViewHeight = e.nativeEvent.layoutMeasurement.height;
    const contentHeight = e.nativeEvent.contentSize.height;
    const isScrolledToBottom = scrolViewHeight + scrollPosition;

    if (isScrolledToBottom >= contentHeight - 50 && offset < lastOffSet) {
      setOffset(prevCount => prevCount + 1);

      setLoadMore(!loadMore);
    }
  };

  const renderCreditCardSkeleton = () => {
    return (
      <View style={HelperStyles.margin(20, 0)}>
        <BudgetCardSkeleton />
        <BudgetCardSkeleton />
        <BudgetCardSkeleton />
        <BudgetCardSkeleton />
        <BudgetCardSkeleton />
      </View>
    );
  };

  const BudgetCardSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCard
          height={Helpers.windowHeight * 0.1}
          style={HelperStyles.justView('borderRadius', 8)}
        />
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
          onMomentumScrollEnd={e => {
            momentumScroll(e);
          }}
          showsVerticalScrollIndicator={false}>
          {Boolean(credit) ? (
            Array.isArray(credit) && credit.length != 0 ? (
              <View style={HelperStyles.margin(20, 16)}>
                {credit.map((itemData, index) => {
                  const cardName =
                    itemData.hasOwnProperty('bank') && Boolean(itemData.bank)
                      ? itemData.bank.name
                      : '-';

                  const cardType =
                    itemData.hasOwnProperty('cardtype') &&
                    Boolean(itemData.cardtype)
                      ? itemData.cardtype.name
                      : '-';

                  return (
                    <View
                      key={index}
                      style={[
                        HelperStyles.flex(1),
                        HelperStyles.flexDirection('row'),
                      ]}>
                      {Boolean(editStatus) && (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedRecord(itemData);

                            setDeleteModalStatus(!deleteModalStatus);
                          }}
                          style={[
                            HelperStyles.flex(0.0875),
                            HelperStyles.justView('justifyContent', 'center'),
                            HelperStyles.justView('alignItems', 'flex-start'),
                          ]}>
                          <Image
                            resizeMode={'contain'}
                            source={Assets.remove}
                            style={HelperStyles.imageView(22, 22)}
                          />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        disabled={editStatus}
                        onPress={() => {
                          props.navigation.navigate('CreditCardView', {
                            creditCardId: itemData.id,
                          });
                        }}
                        style={[
                          HelperStyles.flex(Boolean(editStatus) ? 0.9125 : 1),
                          Styles.creditItemContainer,
                          HelperStyles.justView(
                            'marginTop',
                            index != 0 ? 8 : 0,
                          ),
                        ]}>
                        <View
                          style={[
                            HelperStyles.flex(0.125),
                            HelperStyles.justifyContentCenteredView('center'),
                          ]}>
                          <View style={Styles.creditItemImageContainer}>
                            <Image
                              onLoadStart={() => {
                                setImageLoader(true);
                              }}
                              onLoadEnd={() => {
                                setImageLoader(false);
                              }}
                              resizeMode={'contain'}
                              source={Assets.creditCard}
                              style={Styles.creditItemImage}
                            />
                            {imageLoader && (
                              <ActivityIndicator
                                size={'small'}
                                color={Colors.primary}
                                style={Styles.imageLoader}
                              />
                            )}
                          </View>
                        </View>
                        <View style={Styles.creditItemLabelContainer}>
                          <Text
                            numberOfLines={1}
                            style={[
                              HelperStyles.textView(
                                14,
                                '700',
                                Colors.primaryText,
                                'left',
                                'none',
                              ),
                            ]}>
                            {cardName}
                          </Text>
                          <Text
                            style={[
                              HelperStyles.textView(
                                12,
                                '400',
                                Colors.primaryText,
                                'left',
                                'capitalize',
                              ),
                              HelperStyles.justView('marginTop', 2),
                            ]}>
                            {cardType}
                          </Text>
                        </View>
                        <View style={Styles.creditItemValueContainer}>
                          {Boolean(editStatus) ? (
                            <TouchableOpacity
                              onPress={() => {
                                props.navigation.navigate('CreateCreditCard', {
                                  editData: itemData,
                                });
                              }}
                              style={[
                                HelperStyles.justView(
                                  'justifyContent',
                                  'center',
                                ),
                                HelperStyles.justView('alignItems', 'flex-end'),
                                HelperStyles.justView('right', 8),
                                HelperStyles.padding(4, 4),
                              ]}>
                              <Image
                                resizeMode={'contain'}
                                source={Assets.edit}
                                style={[
                                  HelperStyles.imageView(24, 24),
                                  HelperStyles.justView(
                                    'tintColor',
                                    Colors.primaryText,
                                  ),
                                ]}
                              />
                            </TouchableOpacity>
                          ) : (
                            <Text
                              style={[
                                HelperStyles.textView(
                                  16,
                                  '700',
                                  Colors.primaryText,
                                  'right',
                                  'none',
                                ),
                              ]}>
                              {`${Labels.rm} `}
                              {Boolean(itemData.amount)
                                ? parseFloat(
                                    (itemData.amount || 0.0) -
                                      (itemData.spent || 0.0),
                                  ).toFixed(2)
                                : '0.00'}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <NoResponse />
            )
          ) : (
            renderCreditCardSkeleton()
          )}
        </ScrollView>

        {indicator && <ActivityIndicator size="large" color={Colors.primary} />}

        <CustomModal
          message={Labels.deleteCreditCard}
          onNegative={() => {
            setDeleteModalStatus(!deleteModalStatus);
          }}
          onPositive={() => {
            handleDelete();
          }}
          onRequestClose={() => {
            setDeleteModalStatus(!deleteModalStatus);
          }}
          visible={deleteModalStatus}
        />
      </View>
    </Network>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    creditCardDelete: (creditCardId, onResponse) => {
      dispatch(creditCardDelete(creditCardId, onResponse));
    },

    creditCardList: (requestData, onResponse) => {
      dispatch(creditCardList(requestData, onResponse));
    },
  };
};

export default connect(null, mapDispatchToProps)(CreditCardList);

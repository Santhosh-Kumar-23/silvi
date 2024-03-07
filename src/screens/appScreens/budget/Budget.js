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
import {budgetDelete, budgetList} from '../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Colors from '../../../utils/Colors';
import CustomModal from '../../../components/appComponents/CustomModal';
import Labels from '../../../utils/Strings';
import moment from 'moment';
import MonthToggler from '../../../components/appComponents/MonthToggler';
import Network from '../../../containers/Network';
import NoResponse from '../../../components/appComponents/NoResponse';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import Styles from '../../../styles/appStyles/budget/Budget';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const Budget = props => {
  // Budget Variables
  const [budget, setBudget] = useState(null);
  const [month, setMonth] = useState(moment());
  const [imageLoader, setImageLoader] = useState(false);

  // Other Variables
  const [offset, setOffset] = useState(1);
  const [lastOffSet, setLastOffSet] = useState(null);
  const [indicator, setIndicator] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
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

            props.navigation.navigate('CreateBudget');
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
            Boolean(budget) && Array.isArray(budget) && budget.length != 0
              ? setEditStatus(!editStatus)
              : showMessage({
                  icon: 'auto',
                  message: Labels.noTransactionsFound,
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

  const handleDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    const budgetId = selectedRecord.id;

    props.budgetDelete(budgetId, res => {
      const response = res.resJson.data;

      setOffset(1);

      setSelectedRecord(null);

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET DELETE RESPONSE DATA::: ', response);

      budgetList();
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setMonth(moment());

      setBudget(null);

      return () => {
        isFocus = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      budgetList();

      return () => {
        isFocus = false;
      };
    }, [month]),
  );

  const budgetList = () => {
    const requestData = {
      limit: ENV.dataLimit,
      offset: 1,
      month: Helpers.formatDateTime(month, null, Labels.formatM),
      year: Helpers.formatDateTime(month, null, Labels.formatYYYY),
    };

    props.budgetList(requestData, res => {
      const response = res.resJson.data.result;

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET LISTED RESPONSE DATA::: ', response);

      setBudget(response.results);

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
    }, [loadMore]),
  );

  const shouldHandeLoadMore = () => {
    if (offset <= lastOffSet) {
      setIndicator(true);

      const requestData = {
        offset: offset,
        limit: ENV.dataLimit,
        month: Helpers.formatDateTime(month, null, Labels.formatM),
        year: Helpers.formatDateTime(month, null, Labels.formatYYYY),
      };

      props.budgetList(requestData, res => {
        const response = res.resJson.data.result;

        setBudget([...budget, ...response.results]);

        setIndicator(false);
      });
    }
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

  const onRefresh = () => {
    setRefreshing(true);

    setOffset(1);

    setBudget(null);

    budgetList();
  };

  const renderBudgetCardSkeleton = () => {
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
          <View style={HelperStyles.margin(20, 16)}>
            <MonthToggler
              onValueChange={selectedValue => {
                ENV.currentEnvironment == Labels.development &&
                  console.log(
                    'MONTH TOGGLER SELECTED VALUE::: ',
                    selectedValue,
                  );

                setMonth(selectedValue);

                setBudget(null);
              }}
              value={month}
            />
          </View>
          {Boolean(budget) ? (
            Array.isArray(budget) && budget.length != 0 ? (
              <View style={HelperStyles.margin(20, 0)}>
                {budget.map((budgetData, index) => {
                  const category =
                    budgetData.hasOwnProperty('category') &&
                    Boolean(budgetData.category) &&
                    budgetData.category.hasOwnProperty('name') &&
                    (budgetData.category.name || null);

                  const categoryIcon =
                    budgetData.hasOwnProperty('category') &&
                    Boolean(budgetData.category) &&
                    budgetData.category.hasOwnProperty('icon') &&
                    (budgetData.category.icon || null);

                  const group =
                    budgetData.hasOwnProperty('group') &&
                    Boolean(budgetData.group) &&
                    budgetData.group.hasOwnProperty('name') &&
                    (budgetData.group.name || null);

                  return (
                    <View
                      key={index}
                      style={[
                        HelperStyles.flexDirection('row'),
                        HelperStyles.justView(
                          'justifyContent',
                          'space-between',
                        ),
                      ]}>
                      {Boolean(editStatus) && (
                        <TouchableOpacity
                          onPress={() => {
                            setEditStatus(!editStatus);

                            setSelectedRecord(budgetData);

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
                        disabled={Boolean(editStatus)}
                        onPress={() => {
                          props.navigation.navigate('BudgetView', {
                            budgetId: budgetData.id,
                          });
                        }}
                        style={[
                          HelperStyles.flex(Boolean(editStatus) ? 0.9125 : 1),
                          Styles.budgetItemContainer,
                        ]}>
                        <View
                          style={[
                            HelperStyles.flex(0.125),
                            HelperStyles.justifyContentCenteredView('center'),
                          ]}>
                          <View style={Styles.budgetItemImageContainer}>
                            <Image
                              onLoadStart={() => {
                                setImageLoader(true);
                              }}
                              onLoadEnd={() => {
                                setImageLoader(false);
                              }}
                              resizeMode={'contain'}
                              source={
                                Boolean(categoryIcon)
                                  ? {uri: categoryIcon}
                                  : null
                              }
                              style={Styles.budgetItemImage}
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
                        <View style={Styles.budgetItemLabelContainer}>
                          <Text
                            numberOfLines={1}
                            style={HelperStyles.textView(
                              14,
                              '700',
                              Theme.primaryText,
                              'left',
                              'none',
                            )}>
                            {group}
                          </Text>
                          <Text
                            style={[
                              HelperStyles.textView(
                                12,
                                '400',
                                Theme.primaryText,
                                'left',
                                'none',
                              ),
                              HelperStyles.justView('marginTop', 2),
                            ]}>
                            {category}
                          </Text>
                        </View>
                        <View style={Styles.budgetItemValueContainer}>
                          {Boolean(editStatus) ? (
                            <View
                              style={[
                                HelperStyles.justView(
                                  'justifyContent',
                                  'center',
                                ),
                                HelperStyles.justView('alignItems', 'flex-end'),
                                HelperStyles.justView('right', 8),
                              ]}>
                              <TouchableOpacity
                                onPress={() => {
                                  setEditStatus(!editStatus);

                                  props.navigation.navigate('CreateBudget', {
                                    budgetId: budgetData.id,
                                  });
                                }}
                                style={HelperStyles.padding(4, 4)}>
                                <Image
                                  resizeMode={'contain'}
                                  source={Assets.edit}
                                  style={[
                                    HelperStyles.imageView(24, 24),
                                    HelperStyles.justView(
                                      'tintColor',
                                      Theme.primaryText,
                                    ),
                                  ]}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <Text
                              style={HelperStyles.textView(
                                16,
                                '700',
                                Theme.primaryText,
                                'right',
                                'none',
                              )}>
                              {`${budgetData.currency} ${
                                Boolean(budgetData.amount)
                                  ? parseFloat(budgetData.amount).toFixed(2)
                                  : '0.00'
                              }`}
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
            renderBudgetCardSkeleton()
          )}
        </ScrollView>

        {indicator && <ActivityIndicator size="large" color={Colors.primary} />}

        <CustomModal
          message={Labels.deleteBudget}
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
    budgetDelete: (budgetId, onResponse) => {
      dispatch(budgetDelete(budgetId, onResponse));
    },

    budgetList: (requestData, onResponse) => {
      dispatch(budgetList(requestData, onResponse));
    },
  };
};

export default connect(null, mapDispatchToProps)(Budget);

import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {
  accountDelete,
  accountList,
  storeAccountEditStatus,
} from '../../../../redux/Root.Actions';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import AccountCard from '../../../../components/appComponents/AccountCard';
import Assets from '../../../../assets/Index';
import CustomModal from '../../../../components/appComponents/CustomModal';
import Colors from '../../../../utils/Colors';
import Labels from '../../../../utils/Strings';
import Network from '../../../../containers/Network';
import NoResponse from '../../../../components/appComponents/NoResponse';
import SkeletonCard from '../../../../components/skeletonComponents/SkeletonCard';
import SkeletonPlaceholder from '../../../../containers/SkeletonPlaceholder';
import Store from '../../../../redux/Store';
import Styles from '../../../../styles/appStyles/balance/account/Account';
import * as ENV from '../../../../../env';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';

const Account = props => {
  // Account Variables
  const [accounts, setAccounts] = useState(null);
  const [totalCashFlow, setTotalCashFlow] = useState(0);

  // Other Variables
  const [offset, setOffset] = useState(1);
  const [lastOffSet, setLastOffSet] = useState(null);
  const [indicator, setIndicator] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      getAccountList();

      return () => {
        Store.dispatch(storeAccountEditStatus(false));

        isFocus = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      shouldHandeLoadMore();

      return () => {
        isFocus = false;
      };
    }, [loadMore]),
  );

  const getAccountList = () => {
    const requestData = {offset: 1, limit: ENV.dataLimit};

    props.accountList(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('ACCOUNT LIST RESPONSE DATA::: ', response.list.results);

      setAccounts(response.list.results);

      setLastOffSet(response.list.totalPages);

      setTotalCashFlow(
        response.hasOwnProperty('sum') && Boolean(response.sum)
          ? response.sum
          : '0.00',
      );

      setRefreshing(false);
    });
  };

  const shouldHandeLoadMore = () => {
    const requestData = {offset: offset, limit: ENV.dataLimit};

    if (offset <= lastOffSet) {
      setIndicator(true);

      props.accountList(requestData, res => {
        const response = res.resJson.data;

        setAccounts([...accounts, ...response.list.results]);

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

    setAccounts(null);

    getAccountList();
  };

  const handleDelete = async () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    Store.dispatch(storeAccountEditStatus(false));

    const accountId = selectedRecord._id;

    props.accountDelete(accountId, res => {
      setOffset(1);

      setSelectedRecord(null);

      getAccountList();
    });
  };

  const renderTotalCashFlow = () => {
    return (
      <View style={Styles.totalCashFlowContainer}>
        <View style={Styles.totalCashFlowTextContainer}>
          <Text
            style={HelperStyles.textView(
              14,
              '700',
              Colors.primaryText,
              'left',
              'none',
            )}>
            {Labels.totalCashFlow}
          </Text>
        </View>
        <View style={Styles.totalCashFlowValueContainer}>
          <Text
            style={HelperStyles.textView(
              14,
              '700',
              Colors.primaryText,
              'right',
              'none',
            )}>
            {Labels.rm}{' '}
            {typeof totalCashFlow == 'string'
              ? '0.00'
              : totalCashFlow.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  const TotalCashFlowSkeleton = () => {
    return (
      <SkeletonPlaceholder>
        <View style={HelperStyles.imageView(43, '100%')} />
      </SkeletonPlaceholder>
    );
  };

  const AccountCardSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCard
          height={Helpers.windowHeight * 0.11625}
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
          showsVerticalScrollIndicator={true}>
          <View style={HelperStyles.flex(1)}>
            {Boolean(accounts) ? (
              Array.isArray(accounts) && accounts.length != 0 ? (
                <>
                  {Boolean(accounts) ? (
                    renderTotalCashFlow()
                  ) : (
                    <TotalCashFlowSkeleton />
                  )}

                  <View style={HelperStyles.margin(24, 8)}>
                    {accounts.map((accountData, index) => (
                      <View
                        key={index}
                        style={[
                          HelperStyles.flex(1),
                          HelperStyles.flexDirection('row'),
                          HelperStyles.justView(
                            'justifyContent',
                            'space-between',
                          ),
                        ]}>
                        {Boolean(props.editStatus) && (
                          <TouchableOpacity
                            onPress={() => {
                              if (
                                accountData.bank.name.toLowerCase() !=
                                Labels.default.toLowerCase()
                              ) {
                                setSelectedRecord(accountData);

                                setDeleteModalStatus(!deleteModalStatus);
                              } else {
                                Store.dispatch(storeAccountEditStatus(false));

                                showMessage({
                                  icon: 'auto',
                                  message: Labels.defaultAccountDeleteWarning,
                                  position: 'bottom',
                                  type: 'info',
                                });
                              }
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
                        <View
                          style={[
                            HelperStyles.flex(
                              Boolean(props.editStatus) ? 0.9125 : 1,
                            ),
                            HelperStyles.justView('justifyContent', 'center'),
                          ]}>
                          <AccountCard
                            {...props}
                            index={index}
                            data={accountData}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <NoResponse />
              )
            ) : (
              <>
                <TotalCashFlowSkeleton />
                <View style={HelperStyles.margin(24, 8)}>
                  <AccountCardSkeleton />
                  <AccountCardSkeleton />
                  <AccountCardSkeleton />
                  <AccountCardSkeleton />
                  <AccountCardSkeleton />
                </View>
              </>
            )}
          </View>
        </ScrollView>
        {indicator && <ActivityIndicator size="large" color={Colors.primary} />}

        <CustomModal
          message={Labels.deleteAccount}
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

const mapStateToProps = state => {
  return {
    editStatus: state.app.account.accountEditStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    accountDelete: (accountId, onResponse) => {
      dispatch(accountDelete(accountId, onResponse));
    },

    accountList: (requestData, onResponse) => {
      dispatch(accountList(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);

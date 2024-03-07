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
import {showMessage} from 'react-native-flash-message';
import {
  creditCardAmountPointsList,
  creditCardPointsList,
  earningDelete,
  spendingDelete,
  storeCreditCardExpiry,
  storeCreditCardId,
  storeCreditCardPointsEditStatus,
  storeCreditCardRewardsIndex,
  storeCreditCardViewOffset,
} from '../../../../../../redux/Root.Actions';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../../../assets/Index';
import Colors from '../../../../../../utils/Colors';
import CustomModal from '../../../../../../components/appComponents/CustomModal';
import Labels from '../../../../../../utils/Strings';
import moment from 'moment';
import Network from '../../../../../../containers/Network';
import NoResponse from '../../../../../../components/appComponents/NoResponse';
import SkeletonLabel from '../../../../../../components/skeletonComponents/SkeletonLabel';
import SkeletonPlaceholder from '../../../../../../containers/SkeletonPlaceholder';
import Store from '../../../../../../redux/Store';
import Styles from '../../../../../../styles/appStyles/balance/creditCard/rewards/points/Points';
import Swiper from 'react-native-swiper';
import Tooltip from 'rn-tooltip';
import * as ENV from '../../../../../../../env';
import * as Helpers from '../../../../../../utils/Helpers';
import * as HelperStyles from '../../../../../../utils/HelperStyles';

const Points = props => {
  // Props variable
  const index = !Boolean(props.index) ? 0 : props.index;
  const offsetProps = Boolean(props.offset) ? props.offset : null;

  // Points Variables
  const [offset, setOffset] = useState(1);
  const [lastOffSet, setLastOffSet] = useState(null);
  const [totalRecords, setTotalRecords] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [transactionAccordionIndex, setTransactionAccordionIndex] = useState(0);
  const [imageLoader, setImageLoader] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [usedPoints, setUsedPoints] = useState(null);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(null);
  const [loadMore, setLoadMore] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setLoading(true);

      setOffset(offsetProps || 1);

      setSwiperIndex(index);

      getCreditCardPointsList();

      return () => {
        isFocus = false;
      };
    }, [index, offsetProps]),
  );

  const getCreditCardPointsList = () => {
    const requestData = {offset: offsetProps || 1, limit: ENV.dataLimit};

    props.creditCardPointsList(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('CREDIT CARD POINTS LIST RESPONSE DATA::: ', response.list);

      handleAccountResponse(1, response);
    });
  };

  const handleAccountResponse = (type, response) => {
    if (
      Boolean(response) &&
      response.hasOwnProperty('list') &&
      Boolean(response.list)
    ) {
      response.list.hasOwnProperty('totalPages') &&
        setLastOffSet(response.list.totalPages);

      response.list.hasOwnProperty('totalResults') &&
        setTotalRecords(response.list.totalResults);

      let helperResponse, uniques;

      response.list.hasOwnProperty('results') &&
        Array.isArray(response.list.results) && [
          (helperResponse =
            type != 1 && Boolean(fullData)
              ? (offsetProps || 1) > 1 && swiperIndex == 0
                ? [...response.list.results, ...fullData]
                : [...fullData, ...response.list.results]
              : response.list.results),
          (uniques = Object.values(
            helperResponse.reduce((a, c) => {
              a[c.id] = c;

              return a;
            }, {}),
          )),
          setFullData(helperResponse),
        ];
    } else {
      setLastOffSet(1);

      setTotalRecords(null);

      setFullData([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      handleReset();

      Boolean(fullData) && getCreditCardAmountPointsList(swiperIndex);

      return () => {
        isFocus = false;
      };
    }, [fullData, swiperIndex]),
  );

  const getCreditCardAmountPointsList = swiperIndex => {
    props.creditCardAmountPointsList(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('CREDIT CARD TRANSACTIONS RESPONSE DATA::: ', response);

      const creditCardAmountPointsList =
        Boolean(response) &&
        response.hasOwnProperty('cardRewardPointTransaction')
          ? response.cardRewardPointTransaction.reverse()
          : [];

      fetchCreditCardItems(swiperIndex, creditCardAmountPointsList);
    });
  };

  const fetchCreditCardItems = (index, creditCardList) => {
    const filteredBank = getCreditCard(index, creditCardList);

    if (filteredBank.length != 0) {
      let sum = filteredBank[0].points,
        usedPoints = 0;

      Store.dispatch(storeCreditCardExpiry(filteredBank[0].expiry));
      Store.dispatch(storeCreditCardId(filteredBank[0]._id));

      if (
        Boolean(filteredBank[0].transaction) &&
        Array.isArray(filteredBank[0].transaction) &&
        filteredBank[0].transaction.length != 0
      ) {
        const outerHelperArray = filteredBank[0].transaction.map(
          transactionData => {
            if (
              transactionData.hasOwnProperty('list') &&
              Array.isArray(transactionData.list) &&
              transactionData.list.length != 0
            ) {
              let monthAmount = 0;
              const innerHelperArray = transactionData.list.map(itemData => {
                const customAmount =
                  itemData.hasOwnProperty('points') && Boolean(itemData.points)
                    ? itemData.points
                    : 0;

                sum =
                  itemData.transactiontype == Labels.spending.toLowerCase()
                    ? sum - customAmount
                    : sum + customAmount;

                monthAmount =
                  itemData.transactiontype == Labels.spending.toLowerCase()
                    ? monthAmount + customAmount
                    : monthAmount;

                usedPoints =
                  itemData.transactiontype == Labels.spending.toLowerCase()
                    ? usedPoints + customAmount
                    : usedPoints;

                return {
                  ...itemData,
                  usedPoints,
                  updatedBalance: sum,
                };
              });

              setUsedPoints(usedPoints);

              return {
                ...transactionData,
                total: monthAmount,
                list: innerHelperArray.reverse(),
              };
            } else {
              return [];
            }
          },
        );

        ENV.currentEnvironment == Labels.development &&
          console.log('UPDATED RESPONSE::: ', outerHelperArray);

        setTransactions(outerHelperArray.reverse());
      } else {
        setTransactions([]);
      }

      setLoading(false);

      setRefreshing(false);
    } else {
      setUsedPoints(null);

      setTransactions([]);

      setLoading(false);

      setRefreshing(false);
    }
  };

  const getCreditCard = (index, creditCardList) => {
    if (
      Boolean(creditCardList) &&
      Array.isArray(creditCardList) &&
      creditCardList.length != 0
    ) {
      Boolean(offsetProps > 1)
        ? creditCardList.splice(0, (offsetProps - 1) * ENV.dataLimit)
        : creditCardList.splice(
            (offsetProps || 1) * ENV.dataLimit,
            creditCardList.length,
          );

      return creditCardList.filter(
        (_, amountPointsListIndex) => amountPointsListIndex == index,
      );
    } else {
      return [];
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    handleReset();
  };

  const handleReset = () => {
    setTransactions(null);
    setTransactionAccordionIndex(0);
    setImageLoader(false);
    setDeleteModalStatus(false);
    setSelectedRecord(null);
    setUsedPoints(null);
    setLoading(true);
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setLoading(true);

      handleLoadMore();

      return () => {
        isFocus = false;
      };
    }, [loadMore]),
  );

  const handleLoadMore = () => {
    const requestData = {offset: offset, limit: ENV.dataLimit};

    if (offset <= lastOffSet) {
      Store.dispatch(storeCreditCardViewOffset(offset));

      props.creditCardPointsList(requestData, res => {
        const response = res.resJson.data;

        ENV.currentEnvironment == Labels.development &&
          console.log(
            'CREDIT CARD POINTS LIST RESPONSE DATA::: ',
            response.list,
          );

        handleAccountResponse(2, response);
      });
    }
  };

  const handleSwiperIndexChange = swipeIndex => {
    ENV.currentEnvironment == Labels.development &&
      console.log('SWIPER INDEX::: ', swipeIndex);

    setSwiperIndex(swipeIndex);

    Store.dispatch(storeCreditCardRewardsIndex(swipeIndex));

    if ((offsetProps || 1) > 1 && swipeIndex == 0) {
      setOffset(prev => (prev > offsetProps ? offsetProps - 1 : prev - 1));

      setLoadMore(!loadMore);
    } else {
      if (swipeIndex + 1 < totalRecords && fullData.length == swipeIndex + 1) {
        setOffset(prev =>
          Boolean(offsetProps)
            ? prev < offsetProps || prev == offsetProps
              ? offsetProps + 1
              : offsetProps + 2
            : prev + 1,
        );

        setLoadMore(!loadMore);
      } else {
        handleReset();

        getCreditCardAmountPointsList(swipeIndex);
      }
    }
  };

  const renderCreditCardView = (data = null) => {
    return (
      <View style={HelperStyles.flex(1)}>
        {!loading && Boolean(data) ? renderCard(data) : <CardSkeleton />}
        <View style={HelperStyles.flex(0.775)}>
          <View
            style={[
              HelperStyles.padding(20, 16),
              HelperStyles.justView('paddingTop', 4),
            ]}>
            {!loading ? (
              <Text
                style={HelperStyles.textView(
                  14,
                  '700',
                  Theme.primaryText,
                  'left',
                  'none',
                )}>
                {Labels.transactionHistory}
              </Text>
            ) : (
              <LabelSkeleton height={19} />
            )}
          </View>
          {!loading ? (
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
              showsVerticalScrollIndicator={false}
              style={HelperStyles.flex(1)}>
              {Boolean(transactions) ? (
                Array.isArray(transactions) && transactions.length != 0 ? (
                  transactions.map((transactionData, index) => (
                    <View
                      key={index}
                      style={HelperStyles.justView(
                        'marginBottom',
                        index == transactionAccordionIndex ? 0 : 16,
                      )}>
                      {renderTransactionAccordion(index, transactionData)}
                      {index == transactionAccordionIndex &&
                        renderTransactionItems(transactionData)}
                    </View>
                  ))
                ) : (
                  <NoResponse />
                )
              ) : (
                renderTransactionAccordionSkeleton()
              )}
            </ScrollView>
          ) : (
            renderTransactionAccordionSkeleton()
          )}
        </View>
      </View>
    );
  };

  const renderCard = cardData => {
    return (
      <View style={Styles.cardContainer}>
        <View style={Styles.cardSubContainerI}>
          <View style={Styles.cardInnerContainer}>
            <View style={Styles.cardLabelContainer}>
              <Text
                numberOfLines={1}
                style={HelperStyles.textView(
                  18,
                  '700',
                  Colors.primaryText,
                  'left',
                  'none',
                )}>
                {Boolean(cardData.bank) && cardData.bank.hasOwnProperty('name')
                  ? cardData.bank.name
                  : '-'}
              </Text>
            </View>
            <View style={Styles.cardImageContainer}>
              <Image
                resizeMode={'contain'}
                source={Assets.creditCard}
                style={[
                  HelperStyles.imageView(24, 24),
                  HelperStyles.justView('tintColor', Colors.primaryText),
                ]}
              />
            </View>
          </View>
          <Text
            numberOfLines={1}
            style={[
              HelperStyles.textView(14, '600', Colors.primary, 'left', 'none'),
              HelperStyles.margin(0, 4),
            ]}>
            {Boolean(cardData.cardtype) &&
            cardData.cardtype.hasOwnProperty('name') &&
            Boolean(cardData.cardtype.name)
              ? cardData.cardtype.name
              : ''}
            <Text
              style={HelperStyles.textView(
                10,
                '700',
                Colors.secondaryText,
                'left',
                'none',
              )}>
              {Boolean(cardData.name) ? ` (${cardData.name})` : null}
            </Text>
          </Text>
          <Text
            style={[
              HelperStyles.textView(
                12,
                '400',
                Colors.primaryText,
                'left',
                'none',
              ),
              HelperStyles.margin(0, 4),
            ]}>
            {Labels.creditCard}
          </Text>
        </View>
        <View style={Styles.cardSubContainerII}>
          <Text
            style={HelperStyles.textView(
              24,
              '700',
              Colors.primaryText,
              'center',
              'none',
            )}>
            {Boolean(cardData.points) ? cardData.points : 0} {Labels.pts}
          </Text>
        </View>
        <View style={Styles.cardSubContainerIII}>
          {Boolean(cardData) && cardData.hasOwnProperty('expiry') && (
            <View
              style={[
                HelperStyles.flex(0.2875),
                HelperStyles.flexDirection('row'),
                HelperStyles.justifyContentCenteredView('flex-start'),
              ]}>
              <Text
                style={HelperStyles.textView(
                  10,
                  '400',
                  Colors.primaryText,
                  'center',
                  'none',
                )}>
                {handleCardExpiry(cardData.expiry)}
              </Text>
              <Tooltip
                backgroundColor={Colors.darkElectricBlue}
                popover={
                  <Text
                    style={HelperStyles.textView(
                      14,
                      '400',
                      Colors.white,
                      'center',
                      'none',
                    )}>
                    The card{' '}
                    {handleCardExpiry(cardData.expiry) == Labels.expired
                      ? 'has'
                      : 'will'}{' '}
                    expire on{' '}
                    {Helpers.formatDateTime(
                      cardData.expiry,
                      `${Labels.formatMM}/${Labels.formatYY}`,
                      `${Labels.formatMMM}, ${Labels.formatYYYY}`,
                    )}
                    !
                  </Text>
                }
                toggleWrapperProps={{
                  disabled: !Boolean(cardData.expiry),
                }}
                width={Helpers.windowWidth * 0.625}
                withOverlay={false}>
                <Image
                  resizeMode={'contain'}
                  source={Assets.info}
                  style={[
                    HelperStyles.imageView(16, 16),
                    HelperStyles.justView('tintColor', Colors.primaryText),
                    HelperStyles.margin(2, 0),
                  ]}
                />
              </Tooltip>
            </View>
          )}
          <View
            style={[
              HelperStyles.flex(0.6875),
              HelperStyles.flexDirection('row'),
              HelperStyles.justifyContentCenteredView('flex-end'),
            ]}>
            <Text
              style={HelperStyles.textView(
                10,
                '400',
                Colors.primaryText,
                'center',
                'none',
              )}>
              {Labels.usedPoints}
            </Text>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '600',
                  Colors.primaryText,
                  'center',
                  'none',
                ),
                HelperStyles.justView('marginLeft', 4),
              ]}>
              {usedPoints || 0}
              {` ${Labels.pts}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const handleCardExpiry = expiryDate => {
    const currentMonthYear = moment().format(
      `${Labels.formatMM}/${Labels.formatYY}`,
    );

    const checkExpiry = Helpers.checkCardExpiry(
      expiryDate,
      currentMonthYear,
      `${Labels.formatMM}/${Labels.formatYY}`,
    );

    return Boolean(checkExpiry) ? Labels.notExpired : Labels.expired;
  };

  const renderTransactionAccordion = (index, transactionData) => {
    return (
      <View style={Styles.transactionAccordionContainer}>
        <View style={Styles.transactionAccordionLabelContainer}>
          <View style={Styles.transactionAccordionLabelSubContainerI}>
            <Text
              style={HelperStyles.textView(
                14,
                '700',
                Colors.primaryText,
                'left',
                'none',
              )}>
              {Helpers.formatDateTime(
                `${transactionData._id.month} ${transactionData._id.year}`,
                `${Labels.formatMM} ${Labels.formatYYYY}`,
                `${Labels.formatMMMM} ${Labels.formatYYYY}`,
              )}
            </Text>
          </View>
          <View style={Styles.transactionAccordionLabelSubContainerII}>
            <Text
              style={HelperStyles.textView(
                14,
                '700',
                handleTransactionColor('accordion', transactionData.total),
                'right',
                'none',
              )}>
              {handleTransactionSign('accordion', transactionData.total)}
              {Boolean(transactionData.total)
                ? transactionData.total < 0
                  ? ` ${-transactionData.total}`
                  : ` ${transactionData.total}`
                : ` ${0}`}{' '}
              {Labels.pts}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            index != transactionAccordionIndex
              ? setTransactionAccordionIndex(index)
              : setTransactionAccordionIndex(null);
          }}
          style={Styles.transactionAccordionImageContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.arrow}
            style={[
              Styles.transactionAccordionImage,
              HelperStyles.justView('transform', [
                {
                  rotate:
                    index == transactionAccordionIndex ? '180deg' : '0deg',
                },
              ]),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTransactionItems = transactionData => {
    return (
      <View style={HelperStyles.margin(20, 16)}>
        {transactionData.hasOwnProperty('list') &&
        Array.isArray(transactionData.list) &&
        transactionData.list.length != 0 ? (
          transactionData.list.map((itemData, index) => (
            <TouchableOpacity
              disabled={props.editStatus}
              key={index}
              onPress={() => {
                handleView(itemData);
              }}
              style={[
                Styles.transactionItemContainer,
                HelperStyles.justView('marginTop', index != 0 ? 8 : 0),
              ]}>
              <View
                style={[
                  HelperStyles.flex(0.125),
                  HelperStyles.justifyContentCenteredView('center'),
                ]}>
                {props.editStatus ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRecord(itemData);

                      setDeleteModalStatus(!deleteModalStatus);
                    }}>
                    <Image
                      resizeMode={'contain'}
                      source={Assets.remove}
                      style={HelperStyles.imageView(22, 22)}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={Styles.transactionItemImageContainer}>
                    <Image
                      onLoadStart={() => {
                        setImageLoader(true);
                      }}
                      onLoadEnd={() => {
                        setImageLoader(false);
                      }}
                      resizeMode={'contain'}
                      source={
                        itemData.hasOwnProperty('category') &&
                        Boolean(itemData.category) &&
                        itemData.category.hasOwnProperty('icon') &&
                        Boolean(itemData.category.icon)
                          ? {uri: itemData.category.icon}
                          : null
                      }
                      style={Styles.transactionItemImage}
                    />
                    {imageLoader && (
                      <ActivityIndicator
                        size={'small'}
                        color={Colors.primary}
                        style={Styles.imageLoader}
                      />
                    )}
                  </View>
                )}
              </View>
              <View style={Styles.transactionItemLabelContainer}>
                <Text
                  numberOfLines={1}
                  style={HelperStyles.textView(
                    14,
                    '600',
                    Theme.primaryText,
                    'left',
                    'none',
                  )}>
                  {itemData.name}
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
                  {Helpers.formatDateTime(
                    itemData.datedOn,
                    null,
                    Labels.formatll,
                  )}
                </Text>
              </View>
              <View style={Styles.transactionItemValueContainer}>
                {props.editStatus ? (
                  <TouchableOpacity
                    onPress={() => {
                      handleEdit(itemData);
                    }}
                    style={[
                      HelperStyles.justifyContentCenteredView('center'),
                      HelperStyles.justView('left', '25%'),
                      HelperStyles.padding(4, 6),
                    ]}>
                    <Image
                      resizeMode={'contain'}
                      source={Assets.edit}
                      style={[
                        HelperStyles.imageView(24, 24),
                        HelperStyles.justView('tintColor', Theme.primaryText),
                      ]}
                    />
                  </TouchableOpacity>
                ) : (
                  <>
                    <Text
                      style={HelperStyles.textView(
                        16,
                        '600',
                        handleTransactionColor(
                          itemData.transactiontype,
                          itemData,
                        ),
                        'right',
                        'none',
                      )}>
                      {handleTransactionSign(
                        itemData.transactiontype,
                        itemData,
                      )}
                      {Boolean(itemData.points)
                        ? itemData.points < 0
                          ? ` ${-itemData.points}`
                          : ` ${itemData.points}`
                        : ` ${0}`}{' '}
                      {Labels.pts}
                    </Text>
                    {Boolean(itemData.amount) && Boolean(itemData.points) ? (
                      <Text
                        style={[
                          HelperStyles.textView(
                            12,
                            '400',
                            Colors.primaryText,
                            'right',
                            'none',
                          ),
                          HelperStyles.justView('marginTop', 2),
                        ]}>
                        {Labels.rm}{' '}
                        {Boolean(itemData.amount)
                          ? parseFloat(itemData.amount).toFixed(2)
                          : '0.00'}
                        {' X '}
                        {Boolean(itemData.points) ? itemData.points : 0}{' '}
                        {Labels.pts}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          HelperStyles.textView(
                            12,
                            '400',
                            Theme.primaryText,
                            'right',
                            'none',
                          ),
                          HelperStyles.justView('marginTop', 2),
                        ]}>
                        {`${Labels.balance} ${itemData?.updatedBalance ?? 0} ${
                          Labels.pts
                        }`}
                      </Text>
                    )}
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text
            style={HelperStyles.textView(
              14,
              '600',
              Colors.secondaryText,
              'center',
              'none',
            )}>
            No transaction(s) found for{' '}
            {Helpers.formatDateTime(
              `${transactionData._id.month} ${transactionData._id.year}`,
              `${Labels.formatMM} ${Labels.formatYYYY}`,
              `${Labels.formatMMMM} ${Labels.formatYYYY}`,
            )}
            !
          </Text>
        )}
      </View>
    );
  };

  const handleTransactionColor = (type, value) => {
    let sign = null;

    switch (type) {
      case 'accordion':
        sign = Boolean(value) && value != 0 ? '-' : null;

        return handleSignColor(sign, 'accordion');

      case Labels.earning.toLowerCase():
        return Colors.green;

      case Labels.spending.toLowerCase():
        return Colors.red;

      default:
        return Theme.primaryText;
    }
  };

  const handleSignColor = (sign, type) => {
    switch (sign) {
      case '+':
        return Colors.green;

      case '-':
        return Colors.red;

      default:
        return type == 'accordion' ? Colors.primaryText : Theme.primaryText;
    }
  };

  const handleTransactionSign = (type, value) => {
    switch (type) {
      case 'accordion':
        return Boolean(value) && value != 0 ? '-' : null;

      case Labels.earning.toLowerCase():
        return '+';

      case Labels.spending.toLowerCase():
        return '-';

      default:
        return null;
    }
  };

  const handleEdit = itemData => {
    Store.dispatch(storeCreditCardPointsEditStatus(false));

    switch (itemData?.transactiontype ?? null) {
      case Labels.earning.toLowerCase():
        props.navigation.navigate(Labels.earning, {
          editData: itemData,
        });
        break;

      case Labels.spending.toLowerCase():
        props.navigation.navigate(Labels.spending, {
          editData: itemData,
        });
        break;

      default:
        break;
    }
  };

  const handleView = itemData => {
    switch (itemData?.transactiontype ?? null) {
      case Labels.earning.toLowerCase():
        props.navigation.navigate('EarningView', {
          earningId: itemData._id,
        });

        break;

      case Labels.spending.toLowerCase():
        props.navigation.navigate('SpendingView', {
          spendingId: itemData._id,
        });

        break;

      default:
        break;
    }
  };

  const handleDelete = () => {
    Store.dispatch(storeCreditCardPointsEditStatus(false));

    switch (selectedRecord?.transactiontype ?? null) {
      case Labels.earning.toLowerCase():
        handleEarningDelete();
        break;

      case Labels.spending.toLowerCase():
        handleSpendingDelete();
        break;

      default:
        break;
    }
  };

  const handleEarningDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    const earningId = selectedRecord._id;

    props.earningDelete(earningId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EARNING DELETE RESPONSE DATA::: ', response);

      setSelectedRecord(null);

      setLoadMore(!loadMore);
    });
  };

  const handleSpendingDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    const spendingId = selectedRecord._id;

    props.spendingDelete(spendingId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SPENDING DELETE RESPONSE DATA::: ', response);

      setSelectedRecord(null);

      setLoadMore(!loadMore);
    });
  };

  const CardSkeleton = () => {
    return (
      <SkeletonPlaceholder>
        <View style={Styles.cardSkeleton} />
      </SkeletonPlaceholder>
    );
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const TransactionAccordionSkeleton = ({style = {}}) => {
    return (
      <SkeletonPlaceholder>
        <View
          style={[
            HelperStyles.imageView(36, '100%'),
            HelperStyles.justView('marginTop', 16),
            style,
          ]}
        />
      </SkeletonPlaceholder>
    );
  };

  const renderTransactionAccordionSkeleton = () => {
    return (
      <>
        <TransactionAccordionSkeleton
          style={HelperStyles.justView('marginTop', 0)}
        />
        <TransactionAccordionSkeleton />
        <TransactionAccordionSkeleton />
        <TransactionAccordionSkeleton />
        <TransactionAccordionSkeleton />
        <TransactionAccordionSkeleton />
        <TransactionAccordionSkeleton />
        <TransactionAccordionSkeleton />
        <TransactionAccordionSkeleton />
        <TransactionAccordionSkeleton />
      </>
    );
  };

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        {Boolean(fullData) && Array.isArray(fullData) ? (
          fullData.length != 0 ? (
            <Swiper
              horizontal={true}
              automaticallyAdjustContentInsets={true}
              contentInsetAdjustmentBehavior={'automatic'}
              index={swiperIndex}
              loop={false}
              onScrollBeginDrag={() => {
                setLoading(true);
              }}
              onMomentumScrollEnd={() => {
                setLoading(false);
              }}
              onIndexChanged={swipeIndex => {
                handleSwiperIndexChange(swipeIndex);
              }}
              showsButtons={false}
              showsPagination={false}>
              {fullData.map((accountData, index) => (
                <React.Fragment key={index}>
                  {renderCreditCardView(accountData)}
                </React.Fragment>
              ))}
            </Swiper>
          ) : (
            <NoResponse />
          )
        ) : (
          <>
            <CardSkeleton />
            <View
              style={[
                HelperStyles.padding(20, 16),
                HelperStyles.justView('paddingTop', 4),
              ]}>
              <LabelSkeleton height={19} />
            </View>
            {renderTransactionAccordionSkeleton()}
          </>
        )}

        <CustomModal
          message={`Are you sure that you want to delete this ${
            Boolean(selectedRecord) &&
            selectedRecord.hasOwnProperty('transactiontype') &&
            Boolean(selectedRecord.transactiontype)
              ? selectedRecord.transactiontype
              : 'point(s)'
          }?`}
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
    editStatus: state.app.creditCard.creditCardPointsEditStatus,
    index: state.app.creditCard.creditCardRewardsIndex,
    offset: state.app.creditCard.creditCardViewOffset,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    creditCardAmountPointsList: onResponse => {
      dispatch(creditCardAmountPointsList(onResponse));
    },

    creditCardPointsList: (requestData, onResponse) => {
      dispatch(creditCardPointsList(requestData, onResponse));
    },

    earningDelete: (earningId, onResponse) => {
      dispatch(earningDelete(earningId, onResponse));
    },

    spendingDelete: (spendingId, onResponse) => {
      dispatch(spendingDelete(spendingId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Points);

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
import {
  accountList,
  accountView,
  billingDelete,
  expenseDelete,
  incomeDelete,
  storeAccountViewOffset,
} from '../../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../assets/Index';
import Button from '../../../../components/appComponents/Button';
import Colors from '../../../../utils/Colors';
import CustomModal from '../../../../components/appComponents/CustomModal';
import Labels from '../../../../utils/Strings';
import LinearGradient from 'react-native-linear-gradient';
import Network from '../../../../containers/Network';
import NoResponse from '../../../../components/appComponents/NoResponse';
import SkeletonLabel from '../../../../components/skeletonComponents/SkeletonLabel';
import SkeletonPlaceholder from '../../../../containers/SkeletonPlaceholder';
import Store from '../../../../redux/Store';
import Styles from '../../../../styles/appStyles/balance/account/AccountView';
import Swiper from 'react-native-swiper';
import * as ENV from '../../../../../env';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';

const AccountView = props => {
  // Props Variables
  const index = props.route.params.hasOwnProperty('index')
    ? props.route.params.index
    : null;
  const offsetProps = Boolean(props.offset) ? props.offset : null;

  // AccountView Variables
  const [offset, setOffset] = useState(1);
  const [lastOffSet, setLastOffSet] = useState(null);
  const [totalRecords, setTotalRecords] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [bankData, setBankData] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [transactionAccordionIndex, setTransactionAccordionIndex] = useState(0);
  const [imageLoader, setImageLoader] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [cardAmount, setCardAmount] = useState(null);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [warningModalStatus, setWarningModalStatus] = useState(false);
  const [warningText, setWarningText] = useState(null);

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

            props.navigation.navigate('ReceiptScanning', {
              initialRouteName: 'AddManually',
            });
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
            Boolean(transactions) &&
            Array.isArray(transactions) &&
            transactions.length != 0
              ? [
                  setEditStatus(!editStatus),
                  !Boolean(transactionAccordionIndex) &&
                    setTransactionAccordionIndex(0),
                ]
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

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setLoading(true);

      setOffset(offsetProps || 1);

      setSwiperIndex(index);

      getAccountList();

      return () => {
        isFocus = false;
      };
    }, [index, offsetProps]),
  );

  const getAccountList = () => {
    const requestData = {offset: offsetProps || 1, limit: ENV.dataLimit};

    props.accountList(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('ACCOUNT LIST RESPONSE DATA::: ', response.list);

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
              a[c._id] = c;

              return a;
            }, {}),
          )),
          setFullData(uniques),
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

      Boolean(fullData) && fetchAccountItems(swiperIndex, fullData);

      return () => {
        isFocus = false;
      };
    }, [fullData, swiperIndex]),
  );

  const fetchAccountItems = (index, accountList) => {
    const filteredBank = getBank(index, accountList);

    if (filteredBank.length != 0) {
      setBankData(filteredBank[0]);

      let sum = filteredBank[0].amount;

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
              let monthAmount = 0.0;

              const innerHelperArray = transactionData.list.map(itemData => {
                const customAmount =
                  itemData.hasOwnProperty('amount') && Boolean(itemData.amount)
                    ? itemData.amount
                    : 0.0;

                sum = sum + customAmount;

                monthAmount =
                  itemData.type == Labels.expense.toLowerCase()
                    ? itemData.hasOwnProperty('isSettled')
                      ? !Boolean(itemData.isSettled)
                        ? monthAmount + customAmount
                        : monthAmount
                      : monthAmount + customAmount
                    : monthAmount;

                return {...itemData, updatedBalance: sum};
              });

              setCardAmount(innerHelperArray.reverse()[0].updatedBalance);

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
      setBankData({});

      setCardAmount(null);

      setTransactions([]);

      setLoading(false);

      setRefreshing(false);
    }
  };

  const getBank = (index, accountList) => {
    if (
      Boolean(accountList) &&
      Array.isArray(accountList) &&
      accountList.length != 0
    ) {
      return accountList.filter((_, fullDataIndex) => fullDataIndex == index);
    } else {
      return [];
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    handleReset();
  };

  const handleReset = () => {
    setBankData(null);
    setTransactions(null);
    setTransactionAccordionIndex(0);
    setImageLoader(false);
    setEditStatus(false);
    setDeleteModalStatus(false);
    setSelectedRecord(null);
    setCardAmount(null);
    setLoading(true);
    setWarningModalStatus(false);
    setWarningText(null);
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
      props.accountList(requestData, res => {
        const response = res.resJson.data;

        ENV.currentEnvironment == Labels.development &&
          console.log('ACCOUNT LIST RESPONSE DATA::: ', response.list);

        handleAccountResponse(2, response);
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      return () => {
        isFocus = false;

        Store.dispatch(storeAccountViewOffset(null));
      };
    }, []),
  );

  const handleSwiperIndexChange = swipeIndex => {
    ENV.currentEnvironment == Labels.development &&
      console.log('SWIPER INDEX::: ', swipeIndex);

    setSwiperIndex(swipeIndex);

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

        fetchAccountItems(swipeIndex, fullData);
      }
    }
  };

  const renderAccountView = (data = null) => {
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

                    getAccountList();
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
      <LinearGradient
        colors={
          cardData.hasOwnProperty('color')
            ? cardData.color.color
            : Colors.gradientGrey
        }
        end={cardData.start}
        start={cardData.end}
        style={Styles.cardContainer}>
        <View style={Styles.cardSubContainerI}>
          <View style={Styles.cardInnerContainer}>
            <View style={Styles.cardLabelContainer}>
              <Text
                numberOfLines={1}
                style={HelperStyles.textView(
                  18,
                  '700',
                  Colors.white,
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
                source={accountTypeSource(cardData.accountType)}
                style={[
                  HelperStyles.imageView(24, 24),
                  HelperStyles.justView('tintColor', Colors.white),
                ]}
              />
            </View>
          </View>
          <Text
            style={[
              HelperStyles.textView(12, '400', Colors.white, 'left', 'none'),
              HelperStyles.margin(0, 4),
            ]}>
            {cardData.accountType || null}
          </Text>
        </View>
        <View style={Styles.cardSubContainerII}>
          <Text
            style={HelperStyles.textView(
              24,
              '700',
              Colors.white,
              'center',
              'none',
            )}>
            {cardData.currency ? `${cardData.currency} ` : null}
            {Boolean(cardAmount)
              ? parseFloat(cardAmount).toFixed(2)
              : Boolean(cardData.amount)
              ? parseFloat(
                  (cardData.amount || 0.0) + (cardData.cb || 0.0),
                ).toFixed(2)
              : '0.00'}
          </Text>
        </View>
      </LinearGradient>
    );
  };

  const accountTypeSource = accounttype => {
    switch (accounttype) {
      case Labels.bank:
        return Assets.bank;

      case Labels.cashInHand:
        return Assets.cash;

      case Labels.credit:
        return Assets.creditCard;

      case Labels.eWallet:
        return Assets.eWallet;

      default:
        return;
    }
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
              {Boolean(bankData.currency) ? ` ${bankData.currency} ` : null}
              {Boolean(transactionData.total)
                ? parseFloat(
                    transactionData.total < 0
                      ? ` ${-transactionData.total}`
                      : ` ${transactionData.total}`,
                  ).toFixed(2)
                : ` ${'0.00'}`}
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
              disabled={editStatus}
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
                {editStatus ? (
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
                  {itemData.payee || itemData.payer}
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
                {editStatus ? (
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
                        handleTransactionColor(itemData.type, itemData),
                        'right',
                        'none',
                      )}>
                      {handleTransactionSign(itemData.type, itemData)}
                      {Boolean(bankData.currency)
                        ? ` ${bankData.currency} `
                        : null}
                      {Boolean(itemData.amount)
                        ? parseFloat(
                            itemData.amount < 0
                              ? ` ${-itemData.amount}`
                              : ` ${itemData.amount}`,
                          ).toFixed(2)
                        : ` ${'0.00'}`}
                    </Text>
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
                      {`${Labels.balance} `}
                      {Boolean(bankData.currency)
                        ? `${bankData.currency} `
                        : null}
                      {Boolean(itemData.updatedBalance)
                        ? parseFloat(itemData.updatedBalance).toFixed(2)
                        : '0.00'}
                    </Text>
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

      case Labels.bill.toLowerCase():
      case Labels.expense.toLowerCase():
        sign =
          Boolean(value) &&
          value.hasOwnProperty('isSettled') &&
          Boolean(value.isSettled)
            ? '+'
            : type == Labels.expense.toLowerCase()
            ? '-'
            : null;

        return handleSignColor(sign);

      case Labels.income.toLowerCase():
        return Colors.green;

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

      case Labels.bill.toLowerCase():
      case Labels.expense.toLowerCase():
        return Boolean(value) &&
          value.hasOwnProperty('isSettled') &&
          Boolean(value.isSettled)
          ? '+'
          : type == Labels.expense.toLowerCase()
          ? '-'
          : null;

      case Labels.income.toLowerCase():
        return '+';

      default:
        return null;
    }
  };

  const handleView = itemData => {
    switch (itemData.type) {
      case Labels.bill.toLowerCase():
        props.navigation.navigate('BillingView', {
          billingId: itemData._id,
        });

        break;

      case Labels.expense.toLowerCase():
        props.navigation.navigate('ExpenseView', {
          expenseId: itemData._id,
        });

        break;

      case Labels.income.toLowerCase():
        props.navigation.navigate('IncomeView', {
          incomeId: itemData._id,
        });

        break;

      default:
        break;
    }
  };

  const handleDelete = () => {
    setEditStatus(!editStatus);

    switch (selectedRecord.type) {
      case Labels.bill.toLowerCase():
        handleBillingDelete();

        break;

      case Labels.expense.toLowerCase():
        handleExpenseDelete();

        break;

      case Labels.income.toLowerCase():
        handleIncomeDelete();

        break;

      default:
        break;
    }
  };

  const handleBillingDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    const billingId = selectedRecord._id;

    props.billingDelete(billingId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING DELETE RESPONSE DATA::: ', response);

      setSelectedRecord(null);

      setLoadMore(!loadMore);
    });
  };

  const handleExpenseDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    const expenseId = selectedRecord._id;

    props.expenseDelete(expenseId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE DELETE RESPONSE DATA::: ', response);

      setSelectedRecord(null);

      setLoadMore(!loadMore);
    });
  };

  const handleIncomeDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    const incomeId = selectedRecord._id;

    props.incomeDelete(incomeId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME DELETE RESPONSE DATA::: ', response);

      setSelectedRecord(null);

      setLoadMore(!loadMore);
    });
  };

  const handleEdit = itemData => {
    setEditStatus(!editStatus);

    switch (itemData.type) {
      case Labels.bill.toLowerCase():
      case Labels.expense.toLowerCase():
        Boolean(itemData) &&
        itemData.hasOwnProperty('isSettled') &&
        Boolean(itemData.isSettled)
          ? [
              setWarningText(
                `Sorry! You can't edit this ${itemData.type} once settled!`,
              ),
              setWarningModalStatus(!warningModalStatus),
            ]
          : Boolean(itemData.claimable) && Boolean(itemData.isWriteOff)
          ? [
              setWarningText(
                `Sorry! You can't edit this ${itemData.type} once write offed!`,
              ),
              setWarningModalStatus(!warningModalStatus),
            ]
          : props.navigation.navigate(
              itemData.type == Labels.expense.toLowerCase()
                ? 'Expense'
                : 'CreateBilling',
              {
                [itemData.type == Labels.expense.toLowerCase()
                  ? 'expenseId'
                  : 'billingId']: itemData._id,
              },
            );

        break;

      case Labels.income.toLowerCase():
        props.navigation.navigate('Income', {
          incomeId: itemData._id,
        });
        break;

      default:
        break;
    }
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

  const renderWarning = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        onRequestClose={() => {
          setWarningModalStatus(!warningModalStatus);

          setWarningText(null);
        }}
        visible={warningModalStatus}>
        <View
          style={[
            Styles.warningModalContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
          ]}>
          <View style={HelperStyles.margin(20, 20)}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Theme.primaryText,
                  'center',
                  'none',
                ),
                HelperStyles.justView('lineHeight', 24),
              ]}>
              {warningText}
            </Text>
            <Button
              containerStyle={Styles.warningModalButtonContainer}
              label={Labels.done}
              loading={false}
              onPress={() => {
                setWarningModalStatus(!warningModalStatus);

                setWarningText(null);
              }}
            />
          </View>
        </View>
      </CustomModal>
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
                  {renderAccountView(accountData)}
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
            selectedRecord.hasOwnProperty('type') &&
            Boolean(selectedRecord.type)
              ? selectedRecord.type
              : 'record'
          }?`}
          onNegative={() => {
            setDeleteModalStatus(!deleteModalStatus);

            setEditStatus(!editStatus);
          }}
          onPositive={() => {
            handleDelete();
          }}
          onRequestClose={() => {
            setDeleteModalStatus(!deleteModalStatus);
          }}
          visible={deleteModalStatus}
        />

        {renderWarning()}
      </View>
    </Network>
  );
};

const mapStateToProps = state => {
  return {
    offset: state.app.account.accountViewOffset,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    accountList: (requestData, onResponse) => {
      dispatch(accountList(requestData, onResponse));
    },

    accountView: (accountId, onResponse) => {
      dispatch(accountView(accountId, onResponse));
    },

    billingDelete: (billingId, onResponse) => {
      dispatch(billingDelete(billingId, onResponse));
    },

    expenseDelete: (expenseId, onResponse) => {
      dispatch(expenseDelete(expenseId, onResponse));
    },

    incomeDelete: (incomeId, onResponse) => {
      dispatch(incomeDelete(incomeId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountView);

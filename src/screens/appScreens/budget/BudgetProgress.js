import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {budgetSummaryList} from '../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Colors from '../../../utils/Colors';
import Icon from 'react-native-vector-icons/Entypo';
import Labels from '../../../utils/Strings';
import MonthToggler from '../../../components/appComponents/MonthToggler';
import moment from 'moment';
import NoResponse from '../../../components/appComponents/NoResponse';
import Network from '../../../containers/Network';
import ProgressCard from '../../../components/appComponents/ProgressCard';
import Styles from '../../../styles/appStyles/budget/BudgetProgress';
import SkeletonPlaceholder from '../../../containers/SkeletonPlaceholder';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const Budget = props => {
  // Budget Variables
  const [budget, setBudget] = useState(null);
  const [totalMonthBudget, setTotalMonthBudget] = useState(null);
  const [month, setMonth] = useState(moment());
  const [budgetAccordionIndex, setBudgetAccordionIndex] = useState(0);

  // OtherVariables
  const [refreshing, setRefreshing] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => renderHeaderLeft(),
      headerRight: () => renderHeaderRight(),
    });
  });

  const renderHeaderLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Menu')}
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

  const renderHeaderRight = () => {
    return (
      <View style={HelperStyles.flexDirection('row')}>
        <TouchableOpacity
          onPress={() => {
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
            props.navigation.navigate('Budget');
          }}
          style={Styles.headerIconContainer}>
          <Icon name="list" size={22} color={Theme.text} />
        </TouchableOpacity>
      </View>
    );
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

      budgetSummaryList();

      return () => {
        isFocus = false;
      };
    }, [refreshing == true, month]),
  );

  const budgetSummaryList = () => {
    const requestData = {
      month: Helpers.formatDateTime(month, null, Labels.formatM),
      year: Helpers.formatDateTime(month, null, Labels.formatYYYY),
    };

    props.budgetSummaryList(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET LISTED RESPONSE DATA::: ', response);

      handleResponseData(response);

      setRefreshing(false);
    });
  };

  const handleResponseData = response => {
    const summaryData =
      response.hasOwnProperty('summary') &&
      Array.isArray(response.summary) &&
      response.summary.length != 0
        ? response.summary
        : null;

    let totalAmountSpent = 0;

    if (Boolean(summaryData) && Array.isArray(summaryData)) {
      let helperArray = [];

      summaryData.map(lol => {
        const groupId =
          Boolean(lol) && lol.hasOwnProperty('_id') && Boolean(lol._id)
            ? lol._id
            : null;

        const listArray =
          lol.hasOwnProperty('transaction') &&
          Array.isArray(lol.transaction) &&
          lol.transaction.length != 0
            ? lol.transaction.map(transactionData => {
                const percentage = Boolean(transactionData.budgetAmount)
                  ? parseFloat(
                      (100 * transactionData.spent) /
                        transactionData.budgetAmount,
                    ).toFixed(0)
                  : 0;

                const budgetRemainingAmount = Boolean(
                  transactionData.budgetAmount,
                )
                  ? transactionData.budgetAmount - transactionData.spent
                  : 0;

                totalAmountSpent = totalAmountSpent + transactionData.spent;

                return {
                  ...transactionData,
                  groupId,
                  percentage,
                  budgetRemainingAmount,
                };
              })
            : [];

        const group =
          Boolean(lol) && lol.hasOwnProperty('group') && Boolean(lol.group)
            ? lol.group
            : null;

        const helperObject = {
          group: group,
          list: listArray,
        };

        helperArray.push(helperObject);
      });

      ENV.currentEnvironment == Labels.development &&
        console.log(
          'BUDGET LIST HANDLE RESPONSE DATA HELPER ARRAY::: ',
          helperArray,
        );

      setBudget(helperArray);
    } else {
      setBudget([]);
    }

    const budgetData =
      response.hasOwnProperty('budget') &&
      Array.isArray(response.budget) &&
      response.budget.length == 1
        ? response.budget[0]
        : null;

    let budgetObject = {
      amount: totalAmountSpent,
      outOf: null,
      percent: null,
    };

    Boolean(budgetData) && [
      (budgetObject = {
        ...budgetObject,
        outOf: budgetData.total,
        percent: parseFloat(
          (100 * totalAmountSpent) / budgetData.total,
        ).toFixed(0),
      }),
    ];

    setTotalMonthBudget(budgetObject);
  };

  const onRefresh = async () => {
    setRefreshing(true);

    handleReset();
  };

  const handleReset = () => {
    setBudget(null);
    setTotalMonthBudget(null);
    setBudgetAccordionIndex(0);
  };

  const renderMonthCashFlow = () => {
    return (
      <View
        style={[
          HelperStyles.flexDirection('row'),
          HelperStyles.justView('justifyContent', 'space-between'),
          HelperStyles.padding(16, 16),
        ]}>
        <View
          style={[
            HelperStyles.flex(0.5),
            HelperStyles.justView('justifyContent', 'center'),
            HelperStyles.justView('alignItems', 'flex-start'),
          ]}>
          <Text
            style={HelperStyles.textView(
              16,
              '600',
              Theme.primaryText,
              'center',
              'none',
            )}>
            {Labels.monthly} {Labels.total}
          </Text>
          <Text
            style={HelperStyles.textView(
              12,
              '400',
              Theme.primaryText,
              'center',
              'none',
            )}>
            {Helpers.formatDateTime(
              month,
              null,
              `${Labels.formatMMM} ${Labels.formatYYYY}`,
            )}
          </Text>
        </View>
        <View
          style={[
            HelperStyles.flex(0.5),
            HelperStyles.justView('justifyContent', 'center'),
            HelperStyles.justView('alignItems', 'flex-end'),
          ]}>
          <Text
            style={HelperStyles.textView(
              16,
              '600',
              Theme.primaryText,
              'center',
              'none',
            )}>
            {`${Labels.rm} ${totalMonthBudget.amount}`}
          </Text>
          <Text
            style={HelperStyles.textView(
              12,
              '400',
              Theme.primaryText,
              'center',
              'none',
            )}>
            {`out of ${Labels.rm} ${totalMonthBudget.outOf}`}
          </Text>
        </View>
      </View>
    );
  };

  const renderMonthItems = budgetItem => {
    return (
      <View style={Styles.monthItemsContainer}>
        <View
          style={[
            HelperStyles.flex(0.5),
            HelperStyles.justView('justifyContent', 'center'),
          ]}>
          <View style={Styles.monthItemsSubContainerI}>
            {/* <Image
            resizeMode={'contain'}
            source={Assets.dining}
            style={HelperStyles.imageView(28, 28)}
          /> */}
            <Text
              style={[
                HelperStyles.textView(
                  16,
                  '600',
                  Theme.primaryText,
                  'center',
                  'none',
                ),
                // HelperStyles.justView('marginHorizontal', 10),
              ]}>
              {budgetItem.name}
            </Text>
            {Boolean(budgetItem.percentage) && budgetItem.percentage <= 100 && (
              <Text
                style={[
                  HelperStyles.textView(
                    16,
                    '600',
                    Theme.primaryText,
                    'center',
                    'none',
                  ),
                  HelperStyles.justView('marginLeft', 8),
                ]}>
                {`${budgetItem.percentage} %`}
              </Text>
            )}
          </View>
          <View
            style={[
              HelperStyles.justView('justifyContent', 'center'),
              HelperStyles.justView('alignItems', 'flex-start'),
              HelperStyles.justView('marginTop', 2),
            ]}>
            <Text
              style={HelperStyles.textView(
                12,
                '400',
                Theme.primaryText,
                'center',
                'none',
              )}>
              {`${Labels.spent}: ${Labels.rm} ${budgetItem.spent || '0'}`}
            </Text>
          </View>
        </View>
        <View style={[HelperStyles.flex(0.5), Styles.monthItemsSubContainerII]}>
          <View>
            <Text
              style={HelperStyles.textView(
                16,
                '600',
                Theme.primaryText,
                'right',
                'none',
              )}>
              {`${Labels.rm} ${budgetItem.budgetAmount || '0'}`}
            </Text>
            <Text
              style={HelperStyles.textView(
                12,
                '400',
                Theme.primaryText,
                'center',
                'none',
              )}>
              {`${
                Boolean(budgetItem.percentage) && budgetItem.percentage > 100
                  ? Labels.overDue
                  : Labels.balance
              } ${Labels.rm} ${
                Boolean(budgetItem.budgetRemainingAmount)
                  ? budgetItem.budgetRemainingAmount < 0
                    ? -budgetItem.budgetRemainingAmount
                    : budgetItem.budgetRemainingAmount
                  : '0'
              }`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBudgetAccordion = (budget, index) => {
    return (
      <View>
        <View style={Styles.budgetAccordionContainer}>
          <View style={Styles.budgetAccordionLabelContainer}>
            <Text
              style={HelperStyles.textView(
                14,
                '700',
                Colors.primaryText,
                'left',
                'none',
              )}>
              {budget.group}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              index != budgetAccordionIndex
                ? setBudgetAccordionIndex(index)
                : setBudgetAccordionIndex(null);
            }}
            style={Styles.budgetAccordionImageContainer}>
            <Image
              resizeMode={'contain'}
              source={Assets.arrow}
              style={[
                Styles.budgetAccordionImage,
                HelperStyles.justView('transform', [
                  {
                    rotate: index == budgetAccordionIndex ? '180deg' : '0deg',
                  },
                ]),
              ]}
            />
          </TouchableOpacity>
        </View>
        {index == budgetAccordionIndex && (
          <View style={HelperStyles.margin(22, 8)}>
            {budget.list.length != 0 ? (
              budget.list.map((lol, index) => (
                <View
                  key={index}
                  style={[
                    HelperStyles.flex(1),
                    HelperStyles.flexDirection('row'),
                    HelperStyles.justView('alignItems', 'center'),
                    HelperStyles.margin(0, 4),
                  ]}>
                  <ProgressCard
                    contentStyles={HelperStyles.flex(1)}
                    animationPercent={Number(lol.percentage)}>
                    {renderMonthItems(lol)}
                  </ProgressCard>
                </View>
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
                {Labels.noBillingsExpensesFound}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderBudgetAccordionSkeleton = () => {
    return (
      <>
        <BudgetAccordionSkeleton
          style={HelperStyles.justView('marginTop', 0)}
        />
        <BudgetAccordionSkeleton />
        <BudgetAccordionSkeleton />
        <BudgetAccordionSkeleton />
        <BudgetAccordionSkeleton />
        <BudgetAccordionSkeleton />
        <BudgetAccordionSkeleton />
        <BudgetAccordionSkeleton />
        <BudgetAccordionSkeleton />
        <BudgetAccordionSkeleton />
      </>
    );
  };

  const BudgetAccordionSkeleton = ({style = {}}) => {
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

  const BudgetMonthSkeleton = () => {
    return (
      <View>
        <SkeletonCard
          height={Helpers.windowHeight * 0.083}
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
          }>
          <View style={HelperStyles.margin(20, 16)}>
            <MonthToggler
              onValueChange={selectedValue => {
                ENV.currentEnvironment == Labels.development &&
                  console.log(
                    'MONTH TOGGLER SELECTED VALUE::: ',
                    selectedValue,
                  );

                setMonth(selectedValue);
              }}
              value={month}
            />
            <View style={HelperStyles.justView('marginTop', 8)}>
              {Boolean(budget) && Array.isArray(budget) ? (
                budget.length != 0 ? (
                  Boolean(totalMonthBudget) ? (
                    <ProgressCard
                      animationPercent={
                        totalMonthBudget.hasOwnProperty('percent')
                          ? Number(totalMonthBudget.percent)
                          : 0
                      }>
                      {renderMonthCashFlow()}
                    </ProgressCard>
                  ) : (
                    <BudgetMonthSkeleton />
                  )
                ) : (
                  <></>
                )
              ) : (
                <BudgetMonthSkeleton />
              )}
            </View>
          </View>

          {Boolean(budget) ? (
            Array.isArray(budget) && budget.length != 0 ? (
              budget.map((budgetData, index) => (
                <View
                  key={index}
                  style={HelperStyles.justView(
                    'marginBottom',
                    index == budgetAccordionIndex ? 0 : 16,
                  )}>
                  {renderBudgetAccordion(budgetData, index)}
                </View>
              ))
            ) : (
              <NoResponse />
            )
          ) : (
            renderBudgetAccordionSkeleton()
          )}
        </ScrollView>
      </View>
    </Network>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    budgetSummaryList: (requestData, onResponse) => {
      dispatch(budgetSummaryList(requestData, onResponse));
    },
  };
};

export default connect(null, mapDispatchToProps)(Budget);

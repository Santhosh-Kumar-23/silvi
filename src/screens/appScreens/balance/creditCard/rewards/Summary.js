import React, {useState, useCallback} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {} from '../../../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../../assets/Index';
import Colors from '../../../../../utils/Colors';
import Labels from '../../../../../utils/Strings';
import moment from 'moment';
import Network from '../../../../../containers/Network';
import NoResponse from '../../../../../components/appComponents/NoResponse';
import Styles from '../../../../../styles/appStyles/balance/creditCard/rewards/Summary';
import Swiper from 'react-native-swiper';
import SkeletonPlaceholder from '../../../../../containers/SkeletonPlaceholder';
import SkeletonLabel from '../../../../../components/skeletonComponents/SkeletonLabel';
import Tooltip from 'rn-tooltip';
import * as ENV from '../../../../../../env';
import * as Helpers from '../../../../../utils/Helpers';
import * as HelperStyles from '../../../../../utils/HelperStyles';

const Summary = () => {
  // Summary Variables
  const [fullData, setFullData] = useState(null);
  const [cardPoints, setCardPoints] = useState(null);
  const [summaryAccordionIndex, setSummaryAccordionIndex] = useState(null);
  const [imageLoader, setImageLoader] = useState(false);
  //Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(null);
  const [accordionStatus, setAccordionStatus] = useState([]);

  // Theme Variables
  const Theme = useTheme().colors;

  const summaryData = [
    {
      points: 1800,
      bank: {
        id: '62553013325e3ef930fbcab8',
        name: 'ICICI',
      },
      creditCard: {
        expiryDate: '05/27',
        id: '62553013325e3ef930fbcab8',
        name: 'American',
        type: 'Golden Card',
      },
      otherBenefits: [
        {
          key: 'Premium',
          value:
            'Enjoy zero green fees at participating gold clubs in Malaysia, up to 30 June 2020. ',
          isTable: [],
        },
        {
          key: 'Petrol',
          value:
            'Enjoy zero green fees at participating gold clubs in Malaysia, up to 30 June 2020. ',
          isTable: [],
        },
        {
          key: 'Travel',
          value:
            '5x complimentary access to Plaza Premium Lounges in Malaysia for you to indulge in the exclusivity and privacy. Also, complement your journey with a free travel insurance coverage for RM600,000.',
          isTable: [
            {expenseForCovert: 'Travel Coverage', expenseForSum: 'Sum Insured'},
            {
              expenseForCovert: 'Travel Insurance',
              expenseForSum: 'Up to RM600,000',
            },
            {
              expenseForCovert: 'Delayed Flight',
              expenseForSum: 'Up to RM500',
            },
            {
              expenseForCovert: 'Missed Flight',
              expenseForSum: 'Up to RM500',
            },
            {
              expenseForCovert: 'Lost Luggage',
              expenseForSum: 'Up to RM1,000',
            },
            {
              expenseForCovert: 'Delayed Luggage',
              expenseForSum: 'Up to RM500',
            },
          ],
        },
      ],
      transaction: [
        {
          _id: {
            name: 'Points Breakdown',
          },
          data: [
            {
              points: 5,
              amount: 40,
              totalPoints: 200,
              summaryFor: 'Online Shopping',
              cardIcon: Assets.shopping,
              currency: Labels.rm,
              pts: Labels.pts,
            },
            {
              points: 5,
              amount: 40,
              totalPoints: 200,
              summaryFor: 'Offline Shopping',
              cardIcon: Assets.shopping,
              currency: Labels.rm,
              pts: Labels.pts,
            },
            {
              points: 5,
              amount: 40,
              totalPoints: 200,
              summaryFor: 'Utilities',
              cardIcon: Assets.vector,
              currency: Labels.rm,
              pts: Labels.pts,
            },
          ],
        },
      ],
      usedPoints: 120,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoading(false);

        setRefreshing(false);
      }, 1000);
    }, [refreshing == true]),
  );

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setFullData(summaryData);

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);

    setLoading(true);
  };

  const handleAccordion = accordionTitle => {
    if (accordionStatus.includes(accordionTitle)) {
      let status = accordionStatus;
      let item = accordionStatus.indexOf(accordionTitle);
      status.splice(item, 1);
      setAccordionStatus([...status]);
    } else {
      setAccordionStatus([...accordionStatus, accordionTitle]);
    }
  };

  const renderSummaryCardView = (data = null) => {
    return (
      <View style={HelperStyles.flex(1)}>
        {!loading && Boolean(data) ? renderCard(data) : <CardSkeleton />}
        <View style={HelperStyles.flex(0.775)}>
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
              {!loading
                ? renderPointsAccordion()
                : renderTransactionAccordionSkeleton()}
              {Boolean(data) &&
              data.hasOwnProperty('transaction') &&
              Array.isArray(data.transaction) ? (
                data.transaction.length != 0 ? (
                  data.transaction.map((summaryData, index) => (
                    <View
                      key={index}
                      style={HelperStyles.justView(
                        'marginBottom',
                        index == summaryAccordionIndex ? 0 : 16,
                      )}>
                      {!accordionStatus.includes(Labels.pointsBreakDown) &&
                        renderSummaryItems(summaryData)}
                    </View>
                  ))
                ) : (
                  <NoResponse />
                )
              ) : (
                renderTransactionAccordionSkeleton()
              )}
              {!loading
                ? renderBenefitsAccordion()
                : renderTransactionAccordionSkeleton()}
              {!accordionStatus.includes(Labels.otherBenefit) &&
                otherBenefits(data.otherBenefits)}
            </ScrollView>
          ) : (
            renderTransactionAccordionSkeleton()
          )}
        </View>
      </View>
    );
  };

  const renderCard = summaryData => {
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
                {Boolean(summaryData.bank) &&
                summaryData.bank.hasOwnProperty('name')
                  ? summaryData.bank.name
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
            {Boolean(summaryData.creditCard) &&
            summaryData.creditCard.hasOwnProperty('type') &&
            Boolean(summaryData.creditCard.type)
              ? summaryData.creditCard.type
              : ''}
            <Text
              style={HelperStyles.textView(
                10,
                '700',
                Colors.secondaryText,
                'left',
                'none',
              )}>
              {Boolean(summaryData.creditCard) &&
              summaryData.creditCard.hasOwnProperty('name')
                ? ` (${summaryData.creditCard.name})`
                : '-'}
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
            {Boolean(cardPoints)
              ? cardPoints
              : Boolean(summaryData.points)
              ? summaryData.points || 0
              : 0}{' '}
            {Labels.pts}
          </Text>
        </View>
        <View style={Styles.cardSubContainerIII}>
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
              {Labels.notExpired}
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
                  The card will expire on{' '}
                  {Helpers.formatDateTime(
                    summaryData.creditCard.expiryDate,
                    `${Labels.formatMM}/${Labels.formatYY}`,
                    `${Labels.formatMMM}, ${Labels.formatYYYY}`,
                  )}
                  !
                </Text>
              }
              toggleWrapperProps={{
                disabled:
                  Boolean(summaryData.creditCard) &&
                  summaryData.creditCard.hasOwnProperty('expiryDate') &&
                  !Boolean(summaryData.creditCard.expiryDate),
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
              {summaryData.hasOwnProperty('usedPoints') &&
              Boolean(summaryData.usedPoints)
                ? summaryData.usedPoints
                : 0}{' '}
              {Labels.pts}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPointsAccordion = () => {
    return (
      <View style={Styles.summaryAccordionContainer}>
        <View style={Styles.summaryAccordionLabelContainer}>
          <View style={Styles.summaryAccordionLabelSubContainerI}>
            <Text
              style={HelperStyles.textView(
                14,
                '700',
                Colors.primaryText,
                'left',
                'none',
              )}>
              {Labels.pointsBreakDown}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleAccordion(Labels.pointsBreakDown);
          }}
          style={Styles.summaryAccordionImageContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.arrow}
            style={[
              Styles.summaryAccordionImage,
              HelperStyles.justView('transform', [
                {
                  rotate: !accordionStatus.includes(Labels.pointsBreakDown)
                    ? '180deg'
                    : '0deg',
                },
              ]),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBenefitsAccordion = () => {
    return (
      <View style={Styles.summaryAccordionContainer}>
        <View style={Styles.summaryAccordionLabelContainer}>
          <View style={Styles.summaryAccordionLabelSubContainerI}>
            <Text
              style={HelperStyles.textView(
                14,
                '700',
                Colors.primaryText,
                'left',
                'none',
              )}>
              {Labels.otherBenefit}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleAccordion(Labels.otherBenefit);
          }}
          style={Styles.summaryAccordionImageContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.arrow}
            style={[
              Styles.summaryAccordionImage,
              HelperStyles.justView('transform', [
                {
                  rotate: !accordionStatus.includes(Labels.otherBenefit)
                    ? '180deg'
                    : '0deg',
                },
              ]),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSummaryItems = summaryData => {
    return (
      <View
        style={[
          HelperStyles.flex(1),
          HelperStyles.flexDirection('column'),
          HelperStyles.justView('justifyContent', 'space-between'),
          HelperStyles.margin(20, 16),
        ]}>
        {summaryData.hasOwnProperty('data') &&
        Array.isArray(summaryData.data) &&
        summaryData.data != 0 ? (
          summaryData.data.map((itemData, index) => {
            const summary =
              itemData.hasOwnProperty('summaryFor') &&
              Boolean(itemData.summaryFor)
                ? itemData.summaryFor
                : '-';

            return (
              <View
                key={index}
                style={[
                  HelperStyles.flex(1),
                  HelperStyles.flexDirection('row'),
                ]}>
                <TouchableOpacity
                  disabled={false}
                  onPress={() => {}}
                  style={[
                    HelperStyles.flex(1),
                    Styles.summaryItemContainer,
                    HelperStyles.justView('marginTop', index != 0 ? 8 : 0),
                  ]}>
                  <View
                    style={[
                      HelperStyles.flex(0.125),
                      HelperStyles.justifyContentCenteredView('center'),
                    ]}>
                    <View style={Styles.summaryItemImageContainer}>
                      <Image
                        onLoadStart={() => {
                          setImageLoader(true);
                        }}
                        onLoadEnd={() => {
                          setImageLoader(false);
                        }}
                        resizeMode={'contain'}
                        source={
                          itemData.hasOwnProperty('cardIcon') &&
                          Boolean(itemData.cardIcon)
                            ? itemData.cardIcon
                            : null
                        }
                        style={Styles.summaryItemImage}
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
                  <View style={Styles.summaryItemLabelContainer}>
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
                      {summary}
                    </Text>
                  </View>
                  <View style={Styles.summaryItemValueContainer}>
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
                      {`${itemData.totalPoints} ${Labels.pts}`}
                    </Text>
                    {Boolean(itemData.amount) && Boolean(itemData.points) && (
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
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text
            style={HelperStyles.textView(
              14,
              '600',
              Colors.secondaryText,
              'center',
              'none',
            )}>
            No summary(s) found for {summaryData._id.name}!
          </Text>
        )}
      </View>
    );
  };

  const otherBenefits = data => {
    return (
      <View
        style={[
          HelperStyles.flexDirection('column'),
          HelperStyles.margin(20, 16),
        ]}>
        {Boolean(data) &&
          Array.isArray(data) &&
          data.length != 0 &&
          data.map((value, index) => {
            return (
              <View key={index} style={[HelperStyles.flexDirection('column')]}>
                <View
                  style={[
                    HelperStyles.flex(1),
                    HelperStyles.flexDirection('row'),
                  ]}>
                  <Text
                    style={[
                      HelperStyles.justView('textAlignVertical', 'top'),
                      HelperStyles.flex(0.4),
                      HelperStyles.textView(
                        14,
                        '400',
                        Colors.primaryText,
                        'left',
                        'none',
                      ),
                    ]}>
                    {value.key}
                  </Text>
                  <Text
                    adjustsFontSizeToFit={true}
                    style={[
                      HelperStyles.justView('textAlignVertical', 'top'),
                      HelperStyles.flex(0.6),
                      HelperStyles.textView(
                        14,
                        '400',
                        Colors.primaryText,
                        'auto',
                        'none',
                      ),
                    ]}>
                    {value.value}
                  </Text>
                </View>
                {data.length - 1 != index && (
                  <View style={HelperStyles.speratorLine} />
                )}
                {Boolean(value.isTable) &&
                  Array.isArray(value.isTable) &&
                  value.isTable.length != 0 && (
                    <View
                      style={[
                        // HelperStyles.justView('textAlignVertical', 'top'),
                        {marginVertical: 10},
                      ]}>
                      {value.isTable.map((lol, index) => {
                        return (
                          <View
                            key={index}
                            style={[
                              HelperStyles.flex(1),
                              HelperStyles.flexDirection('column'),
                              {
                                borderWidth: 0.2,
                                borderColor: Colors.primaryText,
                              },
                            ]}>
                            <View
                              style={[
                                HelperStyles.flex(1),
                                HelperStyles.flexDirection('row'),
                                HelperStyles.padding(18, 18),
                                {
                                  backgroundColor:
                                    index == 0
                                      ? Colors.dropShadow
                                      : Colors.background,
                                },
                              ]}>
                              <Text
                                style={[
                                  HelperStyles.textView(
                                    14,
                                    '400',
                                    index == 0
                                      ? Colors.white
                                      : Colors.primaryText,
                                    'left',
                                    'none',
                                  ),
                                  HelperStyles.flex(0.5),
                                  HelperStyles.justView(
                                    'textAlignVertical',
                                    'top',
                                  ),
                                ]}>
                                {lol.expenseForCovert}
                              </Text>
                              <Text
                                style={[
                                  HelperStyles.textView(
                                    14,
                                    '400',
                                    index == 0
                                      ? Colors.white
                                      : Colors.primaryText,
                                    'left',
                                    'none',
                                  ),
                                  HelperStyles.flex(0.5),
                                  HelperStyles.justView(
                                    'textAlignVertical',
                                    'top',
                                  ),
                                ]}>
                                {lol.expenseForSum}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
              </View>
            );
          })}
      </View>
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
                  {renderSummaryCardView(accountData)}
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
      </View>
    </Network>
  );
};

export default Summary;

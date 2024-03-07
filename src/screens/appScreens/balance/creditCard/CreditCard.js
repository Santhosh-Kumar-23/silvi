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
  creditCardAmountPointsList,
  storeCreditCardExpiry,
  storeCreditCardId,
  storeCreditCardRewardsIndex,
  storeCreditCardViewOffset,
} from '../../../../redux/Root.Actions';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../assets/Index';
import Button from '../../../../components/appComponents/Button';
import Colors from '../../../../utils/Colors';
import Labels from '../../../../utils/Strings';
import Network from '../../../../containers/Network';
import SkeletonPlaceholder from '../../../../containers/SkeletonPlaceholder';
import Store from '../../../../redux/Store';
import Styles from '../../../../styles/appStyles/balance/creditCard/CreditCard';
import * as ENV from '../../../../../env';
import * as HelperStyles from '../../../../utils/HelperStyles';

const CreditCard = props => {
  // CreditCard Variables
  const [selectedAccordion, setSelectedAccordion] = useState(null);
  const [imageLoader, setImageLoader] = useState(false);
  const [amountList, setAmountList] = useState(null);
  const [pointsList, setPointsList] = useState(null);
  const [amountLimits, setAmountLimits] = useState(0);
  const [pointsLimits, setPointsLimits] = useState(0);

  // Other Variables
  const [refreshing, setRefreshing] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Store.dispatch(storeCreditCardExpiry(null));
      Store.dispatch(storeCreditCardId(null));
      Store.dispatch(storeCreditCardRewardsIndex(null));
      Store.dispatch(storeCreditCardViewOffset(null));

      return () => {
        isFocus = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      getCreditCardAmountPointsList();

      return () => {
        isFocus = false;
      };
    }, [refreshing == true]),
  );

  const getCreditCardAmountPointsList = () => {
    props.creditCardAmountPointsList(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('CREDIT CARD LIST RESPONSE DATA::: ', response);

      setAmountLimits(
        Boolean(response) && response.hasOwnProperty('cardAvailableLimit')
          ? response.cardAvailableLimit
          : 0,
      );

      setAmountList(
        Boolean(response) && response.hasOwnProperty('cardAmountTransaction')
          ? response.cardAmountTransaction.reverse()
          : null,
      );

      setPointsLimits(
        Boolean(response) && response.hasOwnProperty('cardAvailableRewardPoint')
          ? response.cardAvailableRewardPoint
          : 0,
      );

      setPointsList(
        Boolean(response) &&
          response.hasOwnProperty('cardRewardPointTransaction')
          ? response.cardRewardPointTransaction.reverse()
          : null,
      );

      setRefreshing(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      !Boolean(selectedAccordion) && setSelectedAccordion(null);

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);

    handleReset();
  };

  const handleReset = () => {
    setSelectedAccordion(null);
    setAmountList(null);
    setPointsList(null);
    setAmountLimits(0);
    setPointsLimits(0);
  };

  const renderCreditAccordion = (creditType, creditAmountPoints) => {
    return (
      <View style={Styles.creditAccordionContainer}>
        <View style={Styles.creditAccordionLabelContainer}>
          <Text
            style={HelperStyles.textView(
              14,
              '700',
              Colors.primaryText,
              'left',
              'none',
            )}>
            {creditType}
          </Text>
          <Text
            style={HelperStyles.textView(
              14,
              '700',
              Colors.primaryText,
              'left',
              'none',
            )}>
            {Boolean(creditAmountPoints) &&
            creditType == Labels.totalCreditAmount
              ? `${Labels.rm} `
              : null}
            {Boolean(creditAmountPoints) &&
            creditType == Labels.totalCreditAmount
              ? parseFloat(creditAmountPoints || '0.00').toFixed(2)
              : creditAmountPoints}
            {Boolean(creditAmountPoints) &&
            creditType == Labels.totalCreditPoints
              ? ` ${Labels.pts}`
              : null}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            creditType != selectedAccordion
              ? setSelectedAccordion(creditType)
              : setSelectedAccordion(null);
          }}
          style={Styles.creditAccordionImageContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.arrow}
            style={[
              Styles.creditAccordionImage,
              HelperStyles.justView('transform', [
                {
                  rotate: creditType == selectedAccordion ? '180deg' : '0deg',
                },
              ]),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCreditItems = (creditType, creditData) => {
    return (
      <View
        style={[
          HelperStyles.flex(1),
          HelperStyles.flexDirection('column'),
          HelperStyles.justView('justifyContent', 'space-between'),
          HelperStyles.margin(20, 16),
        ]}>
        {Boolean(creditData) &&
        Array.isArray(creditData) &&
        creditData.length != 0 ? (
          creditData.map((itemData, index) => {
            const cardName = Boolean(itemData?.bank?.name)
              ? itemData.bank.name
              : '-';

            const card = Boolean(itemData?.cardtype?.name)
              ? itemData.cardtype.name
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
                  onPress={() => {
                    const index = findSelectedBankIndexOffset(
                      itemData?._id ?? null,
                    );

                    Boolean(itemData) && creditType == Labels.totalCreditPoints
                      ? [
                          Store.dispatch(
                            storeCreditCardExpiry(itemData.expiry),
                          ),
                          Store.dispatch(storeCreditCardId(itemData._id)),
                          Store.dispatch(storeCreditCardRewardsIndex(index)),
                          props.navigation.navigate('Rewards'),
                        ]
                      : props.navigation.navigate('CreditCardTransaction', {
                          index,
                        });
                  }}
                  style={[
                    HelperStyles.flex(1),
                    Styles.creditItemContainer,
                    HelperStyles.justView('marginTop', index != 0 ? 8 : 0),
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
                      {card}
                    </Text>
                  </View>
                  <View style={Styles.creditItemValueContainer}>
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
                      {Boolean(itemData.amount) &&
                      creditType == Labels.totalCreditAmount
                        ? `${Labels.rm} `
                        : null}
                      {creditType == Labels.totalCreditAmount
                        ? parseFloat(
                            (itemData.amount || 0.0) - (itemData.spent || 0.0),
                          ).toFixed(2)
                        : itemData.available || 0}
                      {Boolean(itemData.points) &&
                      creditType == Labels.totalCreditPoints
                        ? ` ${Labels.pts}`
                        : null}
                    </Text>
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
            {Labels.noCreditCartsFound}
          </Text>
        )}
      </View>
    );
  };

  const findSelectedBankIndexOffset = creditCardId => {
    const selectedAccountIndex = amountList.findIndex(
      lol => lol._id == creditCardId,
    );

    const offset = Math.ceil((selectedAccountIndex + 1) / ENV.dataLimit);

    Store.dispatch(storeCreditCardViewOffset(offset));

    return selectedAccountIndex - (offset - 1) * ENV.dataLimit;
  };

  const renderCreateCreditCard = () => {
    return (
      <View style={Styles.screenContainer}>
        <View style={HelperStyles.margin(24, 24)}>
          <Text
            style={HelperStyles.textView(
              14,
              '400',
              Colors.primaryText,
              'center',
              'none',
            )}>
            {Labels.createFirstCreditCard}
          </Text>
          <Button
            containerStyle={HelperStyles.margin(0, 16)}
            label={Labels.createYourCreditCardAccount}
            onPress={() => {
              props.navigation.navigate('CreateCreditCard');
            }}
            textStyle={HelperStyles.justView('textTransform', 'none')}
          />
        </View>
      </View>
    );
  };

  const renderCreditAccordionSkeleton = () => {
    return (
      <>
        <CreditAccordionSkeleton
          style={HelperStyles.justView('marginTop', 0)}
        />
        <CreditAccordionSkeleton />
        <CreditAccordionSkeleton />
        <CreditAccordionSkeleton />
        <CreditAccordionSkeleton />
        <CreditAccordionSkeleton />
        <CreditAccordionSkeleton />
        <CreditAccordionSkeleton />
        <CreditAccordionSkeleton />
        <CreditAccordionSkeleton />
      </>
    );
  };

  const CreditAccordionSkeleton = ({style = {}}) => {
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
        <ScrollView
          contentContainerStyle={HelperStyles.flexGrow(1)}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={Colors.primary}
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }>
          {Boolean(amountList) || Boolean(pointsList) ? (
            amountList.length != 0 ? (
              <View style={HelperStyles.justView('marginBottom', 16)}>
                {renderCreditAccordion(Labels.totalCreditAmount, amountLimits)}
                {selectedAccordion != Labels.totalCreditAmount &&
                  renderCreditItems(Labels.totalCreditAmount, amountList)}
                {renderCreditAccordion(Labels.totalCreditPoints, pointsLimits)}
                {selectedAccordion != Labels.totalCreditPoints &&
                  renderCreditItems(Labels.totalCreditPoints, pointsList)}
              </View>
            ) : (
              renderCreateCreditCard()
            )
          ) : (
            renderCreditAccordionSkeleton()
          )}
        </ScrollView>
      </View>
    </Network>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    creditCardAmountPointsList: onResponse => {
      dispatch(creditCardAmountPointsList(onResponse));
    },
  };
};

export default connect(null, mapDispatchToProps)(CreditCard);

import React, {useLayoutEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {creditCartView, creditCardDelete} from '../../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../assets/Index';
import Colors from '../../../../utils/Colors';
import CustomModal from '../../../../components/appComponents/CustomModal';
import Labels from '../../../../utils/Strings';
import Network from '../../../../containers/Network';
import NoResponse from '../../../../components/appComponents/NoResponse';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import SkeletonLabel from '../../../../components/skeletonComponents/SkeletonLabel';
import Styles from '../../../../styles/appStyles/balance/creditCard/CreditCardView';
import * as Endpoints from '../../../../api/Endpoints';
import * as ENV from '../../../../../env';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';
import * as ShareContent from '../../../../utils/ShareContent';

const CreditCardView = props => {
  // Props variables
  const creditCardId =
    props.route.params && props.route.params.hasOwnProperty('creditCardId')
      ? props.route.params.creditCardId
      : null;

  // CreditCard Variables
  const [creditCardData, setCreditCardData] = useState(null);

  // Other Variables
  const [refreshing, setRefreshing] = useState(false);
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
            handleShare();
          }}
          style={[
            Styles.headerIconContainer,
            HelperStyles.justView('marginRight', 12),
          ]}>
          <Image
            resizeMode={'contain'}
            source={Assets.share}
            style={[
              HelperStyles.imageView(24, 24),
              HelperStyles.justView('tintColor', Theme.text),
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDeleteModalStatus(!deleteModalStatus);
          }}
          style={[
            Styles.headerIconContainer,
            HelperStyles.justView('marginRight', 12),
          ]}>
          <Image
            resizeMode={'contain'}
            source={Assets.delete}
            style={[
              HelperStyles.imageView(22, 22),
              HelperStyles.justView('tintColor', Theme.text),
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('CreateCreditCard', {
              editData: creditCardData,
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

  const handleShare = async () => {
    const userId =
      Boolean(props.userDetails) &&
      props.userDetails.hasOwnProperty('user') &&
      props.userDetails.user.hasOwnProperty('id') &&
      Boolean(props.userDetails.user.id)
        ? props.userDetails.user.id
        : null;

    const fileName = `${Labels.creditCard}${
      Boolean(userId) ? `_${userId}` : ''
    }`;

    let htmlTopdfOptions = {
      html: ShareContent.creditCardShareContent(creditCardData),
      fileName: fileName,
      directory: 'Documents',
    };

    const fileData = await RNHTMLtoPDF.convert(htmlTopdfOptions);

    if (Boolean(fileData) && typeof fileData == 'object') {
      const shareOptions = {
        message: `Click the below link to view the credit card: \n ${ENV.deepLinkingHost}/${Endpoints.creditCard}/${creditCardId}`,
        subject: Labels.creditCard,
        title: Labels.creditCard,
        type: 'application/pdf',
        url: `file://${fileData.filePath}`,
      };

      await Share.open(shareOptions);
    } else {
      showMessage({
        description: Labels.conversionError,
        icon: 'auto',
        message: Labels.error,
        type: 'danger',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      fetchCreditCard();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const fetchCreditCard = () => {
    props.creditCartView(creditCardId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('CREDIT CARD VIEW RESPONSE DATA::: ', response);

      setCreditCardData(response);

      setRefreshing(false);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    setCreditCardData(null);

    showMessage({
      icon: 'auto',
      message: Labels.fetchingData,
      position: 'bottom',
      type: 'default',
    });

    fetchCreditCard();
  };

  const renderBankCardType = () => {
    const bankData = creditCardData || null;

    const bank =
      Boolean(bankData) &&
      bankData.hasOwnProperty('bank') &&
      bankData.bank.hasOwnProperty('name') &&
      Boolean(bankData.bank.name)
        ? bankData.bank.name
        : '-';

    const creditCardType =
      Boolean(bankData) &&
      bankData.hasOwnProperty('cardtype') &&
      bankData.cardtype.hasOwnProperty('name') &&
      Boolean(bankData.cardtype.name)
        ? bankData.cardtype.name
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <View
          style={[
            HelperStyles.flexDirection('row'),
            HelperStyles.justView('justifyContent', 'space-between'),
          ]}>
          <View
            style={[
              HelperStyles.flex(0.4875),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            <Text
              style={HelperStyles.textView(
                12,
                '600',
                Colors.secondaryText,
                'left',
                'none',
              )}>
              {Labels.bank}
            </Text>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Theme.primaryText,
                  'left',
                  'none',
                ),
                HelperStyles.justView('marginTop', 2),
              ]}>
              {bank}
            </Text>
          </View>
          <View
            style={[
              HelperStyles.flex(0.4875),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            <Text
              style={HelperStyles.textView(
                12,
                '600',
                Colors.secondaryText,
                'left',
                'none',
              )}>
              {Labels.creditCardType}
            </Text>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Theme.primaryText,
                  'left',
                  'none',
                ),
                HelperStyles.justView('marginTop', 2),
              ]}>
              {creditCardType}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCreditCardName = () => {
    const bankData = creditCardData || null;

    const creditCardName =
      Boolean(bankData) &&
      bankData.hasOwnProperty('name') &&
      Boolean(bankData.name)
        ? bankData.name
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.creditCardName}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {creditCardName}
        </Text>
      </View>
    );
  };

  const renderCreditCardExpiry = () => {
    const bankData = creditCardData || null;

    const creditCardExpiryDate =
      Boolean(bankData) &&
      bankData.hasOwnProperty('expiry') &&
      Boolean(bankData.expiry)
        ? bankData.expiry
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.expiryDate}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {creditCardExpiryDate}
        </Text>
      </View>
    );
  };

  const renderCreditCardLimit = () => {
    const bankData = creditCardData || null;

    const creditCardLimit =
      Boolean(bankData) &&
      bankData.hasOwnProperty('amount') &&
      Boolean(bankData.amount)
        ? bankData.amount
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.creditCardLimit}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {Labels.rm} {creditCardLimit}
        </Text>
      </View>
    );
  };

  const renderCreditCardReward = () => {
    const bankData = creditCardData || null;

    const creditCardPoints =
      Boolean(bankData) &&
      bankData.hasOwnProperty('points') &&
      Boolean(bankData.points)
        ? bankData.points
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.creditCardRewardPoints}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {creditCardPoints} {Labels.pts}
        </Text>
      </View>
    );
  };

  const renderCreditCardStatementDate = () => {
    const bankData = creditCardData || null;

    const creditCardStatementDate =
      Boolean(bankData) &&
      bankData.hasOwnProperty('billCycle') &&
      Boolean(bankData.billCycle)
        ? bankData.billCycle
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.statementDate}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {`${Helpers.ordinalFormatter(
            creditCardStatementDate,
          )} of every month will be your ${Labels.statementDate.toLowerCase()}.`}
        </Text>
      </View>
    );
  };

  const renderCreditCardDueDate = () => {
    const bankData = creditCardData || null;

    const creditCardDueDate =
      Boolean(bankData) &&
      bankData.hasOwnProperty('billCycle') &&
      Boolean(bankData.billCycle)
        ? bankData.billCycle
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.dueDate}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {`${Helpers.ordinalFormatter(
            Helpers.dueCalculator(creditCardDueDate),
          )} of every month will be your ${Labels.dueDate.toLowerCase()}.`}
        </Text>
      </View>
    );
  };

  const BankCardTypeSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <View
          style={[
            HelperStyles.flexDirection('row'),
            HelperStyles.justView('justifyContent', 'space-between'),
            HelperStyles.justView('marginTop', 4),
          ]}>
          <View
            style={[
              HelperStyles.flex(0.4875),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            <SkeletonLabel
              width={Helpers.windowWidth * 0.375}
              style={[HelperStyles.justView('alignSelf', 'flex-start')]}
            />
            <SkeletonLabel
              height={17}
              width={Helpers.windowWidth * 0.25}
              style={[
                HelperStyles.justView('alignSelf', 'flex-start'),
                HelperStyles.justView('marginTop', 2),
              ]}
            />
          </View>
          <View
            style={[
              HelperStyles.flex(0.4875),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            <SkeletonLabel
              width={Helpers.windowWidth * 0.375}
              style={[HelperStyles.justView('alignSelf', 'flex-start')]}
            />
            <SkeletonLabel
              height={17}
              width={Helpers.windowWidth * 0.25}
              style={[
                HelperStyles.justView('alignSelf', 'flex-start'),
                HelperStyles.justView('marginTop', 2),
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  const CreditCardNameSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const CreditCardExpirySkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const CreditCardLimitSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const CreditCardRewardSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const CreditCardStatementDateSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.85}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const CreditCardDueDateSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.85}
          style={HelperStyles.justView('marginTop', 2)}
        />
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

    props.creditCardDelete(creditCardId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('CREDIT CARD VIEW DELETE RESPONSE DATA::: ', response);

      props.navigation.goBack();
    });
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
          <View style={HelperStyles.flex(1)}>
            {Boolean(creditCardData) ? (
              Object.keys(creditCardData).length != 0 ? (
                <View style={HelperStyles.margin(20, 8)}>
                  {renderBankCardType()}
                  {renderCreditCardName()}
                  {renderCreditCardExpiry()}
                  {renderCreditCardLimit()}
                  {renderCreditCardReward()}
                  {renderCreditCardStatementDate()}
                  {renderCreditCardDueDate()}
                </View>
              ) : (
                <NoResponse />
              )
            ) : (
              <View style={HelperStyles.margin(20, 8)}>
                <BankCardTypeSkeleton />
                <CreditCardNameSkeleton />
                <CreditCardExpirySkeleton />
                <CreditCardLimitSkeleton />
                <CreditCardRewardSkeleton />
                <CreditCardStatementDateSkeleton />
                <CreditCardDueDateSkeleton />
              </View>
            )}
          </View>
        </ScrollView>

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

const mapStateToProps = state => {
  return {
    userDetails: state.auth.userDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    creditCartView: (creditCardId, onResponse) => {
      dispatch(creditCartView(creditCardId, onResponse));
    },

    creditCardDelete: (creditCardId, onResponse) => {
      dispatch(creditCardDelete(creditCardId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardView);

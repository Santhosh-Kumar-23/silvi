import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  billingDelete,
  billingList,
  billingStopRecurring,
  storeBillingEditStatus,
} from '../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Button from '../../../components/appComponents/Button';
import Card from '../../../containers/Card';
import Colors from '../../../utils/Colors';
import CustomModal from '../../../components/appComponents/CustomModal';
import Labels from '../../../utils/Strings';
import moment from 'moment';
import MonthToggler from '../../../components/appComponents/MonthToggler';
import Network from '../../../containers/Network';
import NoResponse from '../../../components/appComponents/NoResponse';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import SkeletonPlaceholder from '../../../containers/SkeletonPlaceholder';
import Store from '../../../redux/Store';
import Styles from '../../../styles/appStyles/billing/Billing';
import * as Endpoints from '../../../api/Endpoints';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';
import * as ShareContent from '../../../utils/ShareContent';

const Billing = props => {
  // Billing Variables
  const [billing, setBilling] = useState(null);
  const [month, setMonth] = useState(moment());
  const [billingAccordionIndex, setBillingAccordionIndex] = useState(0);
  const [imageLoader, setImageLoader] = useState(false);
  const [optionsModalStatus, setOptionsModalStatus] = useState(false);
  const [deleteWarningModalStatus, setDeleteWarningModalStatus] =
    useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [stopRecurringWarningModalStatus, setStopRecurringWarningModalStatus] =
    useState(false);
  const [settleWarningModalStatus, setSettleWarningModalStatus] =
    useState(false);
  const [stopRecurringModalStatus, setStopRecurringModalStatus] =
    useState(false);

  // Other Variables
  const [refreshing, setRefreshing] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setMonth(moment());

      setBilling(null);

      return () => {
        Store.dispatch(storeBillingEditStatus(false));

        isFocus = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Boolean(props.editStatus) &&
        !Boolean(billingAccordionIndex) &&
        setBillingAccordionIndex(0);

      return () => {
        isFocus = false;
      };
    }, [props.editStatus]),
  );

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      billingList();

      return () => {
        isFocus = false;
      };
    }, [month, refreshing == true]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    setBilling(null);
  };

  const billingList = () => {
    const requestData = {
      month: Helpers.formatDateTime(month, null, Labels.formatM),
      year: Helpers.formatDateTime(month, null, Labels.formatYYYY),
    };

    props.billingList(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING LIST RESPONSE DATA:::  ', response);

      setBilling(response);

      setRefreshing(false);
    });
  };

  const renderBillingAccordion = (billingData, index) => {
    return (
      <View style={Styles.billingAccordionContainer}>
        <View style={Styles.billingAccordionLabelContainer}>
          <Text
            style={HelperStyles.textView(
              14,
              '700',
              Colors.primaryText,
              'left',
              'none',
            )}>
            {billingData._id.name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            index != billingAccordionIndex
              ? setBillingAccordionIndex(index)
              : setBillingAccordionIndex(null);
          }}
          style={Styles.billingAccordionImageContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.arrow}
            style={[
              Styles.billingAccordionImage,
              HelperStyles.justView('transform', [
                {
                  rotate: index == billingAccordionIndex ? '180deg' : '0deg',
                },
              ]),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBillingItems = billingData => {
    return (
      <View
        style={[
          HelperStyles.flex(1),
          HelperStyles.flexDirection('column'),
          HelperStyles.justView('justifyContent', 'space-between'),
          HelperStyles.margin(20, 16),
        ]}>
        {billingData.hasOwnProperty('data') &&
        Array.isArray(billingData.data) &&
        billingData.data.length != 0 ? (
          billingData.data.map((itemData, index) => {
            const category =
              itemData.hasOwnProperty('category') &&
              Boolean(itemData.category) &&
              itemData.category.hasOwnProperty('name') &&
              (itemData.category.name || null);

            return (
              <View
                key={index}
                style={[
                  HelperStyles.flex(1),
                  HelperStyles.flexDirection('row'),
                ]}>
                {Boolean(props.editStatus) && (
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
                  disabled={Boolean(props.editStatus)}
                  onPress={() => {
                    setSelectedRecord(itemData);

                    setOptionsModalStatus(!optionsModalStatus);
                  }}
                  style={[
                    HelperStyles.flex(Boolean(props.editStatus) ? 0.9125 : 1),
                    Styles.billingItemContainer,
                    HelperStyles.justView('marginTop', index != 0 ? 8 : 0),
                  ]}>
                  <View
                    style={[
                      HelperStyles.flex(0.125),
                      HelperStyles.justifyContentCenteredView('center'),
                    ]}>
                    <View style={Styles.billingItemImageContainer}>
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
                        style={Styles.billingItemImage}
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
                  <View style={Styles.billingItemLabelContainer}>
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
                        itemData.isDeleted && [
                          HelperStyles.justView(
                            'textDecorationColor',
                            Colors.primaryText,
                          ),
                          HelperStyles.textStrikeThrough,
                        ],
                      ]}>
                      {itemData.payee}
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
                        HelperStyles.justView('marginTop', 2),
                      ]}>
                      {category}
                    </Text>
                  </View>
                  <View style={Styles.billingItemValueContainer}>
                    {Boolean(props.editStatus) ? (
                      <TouchableOpacity
                        onPress={() => {
                          Store.dispatch(storeBillingEditStatus(false));

                          if (!Boolean(itemData.isSettled)) {
                            props.navigation.navigate('CreateBilling', {
                              billingId: itemData._id,
                            });
                          } else {
                            showMessage({
                              icon: 'auto',
                              message: Labels.billEditWarning,
                              position: 'bottom',
                              type: 'info',
                            });
                          }
                        }}
                        style={[
                          HelperStyles.justView('justifyContent', 'center'),
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
                      <View>
                        <Text
                          style={[
                            HelperStyles.textView(
                              16,
                              '700',
                              Colors.primaryText,
                              'right',
                              'none',
                            ),
                            itemData.isDeleted && [
                              HelperStyles.justView(
                                'textDecorationColor',
                                Colors.primaryText,
                              ),
                              HelperStyles.textStrikeThrough,
                            ],
                          ]}>
                          {Boolean(itemData.currency)
                            ? `${itemData.currency} `
                            : null}
                          {Boolean(itemData.amount)
                            ? parseFloat(itemData.amount).toFixed(2)
                            : '0.00'}
                        </Text>
                        <Text
                          style={[
                            HelperStyles.textView(
                              12,
                              '400',
                              Colors.primaryText,
                              'right',
                              'none',
                            ),
                          ]}>
                          {handleDueDate(itemData)}
                        </Text>
                      </View>
                    )}
                  </View>
                  {Boolean(handleBillingStatus(itemData)) && (
                    <View
                      style={[
                        Styles.billingStatus,
                        HelperStyles.justView(
                          'backgroundColor',
                          handleBillingStatusColor(itemData),
                        ),
                      ]}>
                      <Text
                        style={HelperStyles.textView(
                          8,
                          '700',
                          Colors.white,
                          'center',
                          'none',
                        )}>
                        {handleBillingStatus(itemData)}
                      </Text>
                    </View>
                  )}
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
            No claim(s) found for {claimData._id.name}!
          </Text>
        )}
      </View>
    );
  };

  const handleDueDate = itemData => {
    const datedOn = itemData.datedOn || moment().format();

    const reccurenceFrequency =
      Boolean(itemData) &&
      itemData.hasOwnProperty('reccurenceFrequency') &&
      Boolean(itemData.reccurenceFrequency)
        ? itemData.reccurenceFrequency
        : null;

    const reccurenceTime =
      Boolean(itemData) &&
      itemData.hasOwnProperty('reccurenceTime') &&
      Boolean(itemData.reccurenceTime)
        ? String(itemData.reccurenceTime)
        : null;

    const reccurenceTimeFrequency =
      Boolean(itemData) &&
      itemData.hasOwnProperty('reccurenceTimeFrequency') &&
      Boolean(itemData.reccurenceTimeFrequency)
        ? itemData.reccurenceTimeFrequency
        : null;

    const checkForFrequency =
      Boolean(reccurenceFrequency) &&
      reccurenceFrequency.toLowerCase() == Labels.others.toLowerCase()
        ? reccurenceTimeFrequency
        : reccurenceFrequency;

    const checkForTime =
      Boolean(reccurenceFrequency) &&
      reccurenceFrequency.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(reccurenceTime)
          ? Number(reccurenceTime)
          : 0
        : 1;

    switch (checkForFrequency) {
      case Labels.daily:
      case 'Day(s)':
        const getDays = Helpers.formatDateTimeNow(
          moment(datedOn).add(checkForTime, 'days'),
          null,
        );

        return Boolean(getDays) ? `Due in ${getDays}` : null;

      case Labels.monthly:
      case 'Month(s)':
        const getMonths = Helpers.formatDateTimeNow(
          moment(datedOn).add(checkForTime, 'months'),
          null,
        );

        return Boolean(getMonths) ? `Due in ${getMonths}` : null;

      case Labels.weekly:
      case 'Week(s)':
        const getWeeks = Helpers.formatDateTimeNow(
          moment(datedOn).add(checkForTime, 'weeks'),
          null,
        );

        return Boolean(getWeeks) ? `Due in ${getWeeks}` : null;

      case Labels.yearly:
      case 'Year(s)':
        const getYears = Helpers.formatDateTimeNow(
          moment(datedOn).add(checkForTime, 'years'),
          null,
        );

        return Boolean(getYears) ? `Due in ${getYears}` : null;

      default:
        return null;
    }
  };

  const handleBillingStatusColor = itemData => {
    if (Boolean(itemData)) {
      if (itemData.hasOwnProperty('isSettled') && Boolean(itemData.isSettled)) {
        return Colors.primary;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const handleBillingStatus = itemData => {
    if (Boolean(itemData)) {
      if (itemData.hasOwnProperty('isSettled') && Boolean(itemData.isSettled)) {
        return 'Settled';
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const renderOptionsModal = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        onRequestClose={() => {
          setSelectedRecord(null);

          setOptionsModalStatus(!optionsModalStatus);
        }}
        visible={optionsModalStatus}>
        <View
          style={[
            Styles.optionModalContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
          ]}>
          <View style={Styles.optionModalSubContainer}>
            <ScrollView
              contentContainerStyle={HelperStyles.flexGrow(1)}
              keyboardShouldPersistTaps={'handled'}
              showsVerticalScrollIndicator={false}>
              {renderOptions()}
            </ScrollView>
          </View>
        </View>
        <Card
          containerStyle={[
            Styles.optionButtonCardContainer,
            HelperStyles.justView('marginTop', 4),
          ]}>
          <Button
            containerStyle={Styles.optionButtonContainer}
            label={Labels.cancel}
            loading={false}
            onPress={() => {
              setSelectedRecord(null);

              setOptionsModalStatus(!optionsModalStatus);
            }}
          />
        </Card>
      </CustomModal>
    );
  };

  const renderOptions = () => {
    const customOptions = [
      Labels.settle,
      Labels.recurring,
      Labels.share,
      Labels.delete,
      Labels.view,
    ];

    return (
      <>
        {customOptions.map((lol, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => {
              handleOptionSelection(lol);
            }}>
            <View
              style={[
                Styles.optionContainer,
                HelperStyles.justView('marginTop', index != 0 ? 8 : 0),
              ]}>
              <View style={Styles.optionLabelContainer}>
                <Text
                  style={HelperStyles.textView(
                    14,
                    '600',
                    Theme.text,
                    'left',
                    'none',
                  )}>
                  {lol}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </>
    );
  };

  const handleOptionSelection = selectedOption => {
    setOptionsModalStatus(!optionsModalStatus);

    switch (selectedOption) {
      case Labels.delete:
        Boolean(selectedRecord.isDeleted)
          ? setDeleteWarningModalStatus(!deleteWarningModalStatus)
          : setDeleteModalStatus(!deleteModalStatus);
        break;

      case Labels.recurring:
        Boolean(selectedRecord.isReccurening)
          ? setStopRecurringModalStatus(!stopRecurringModalStatus)
          : setStopRecurringWarningModalStatus(
              !stopRecurringWarningModalStatus,
            );
        break;

      case Labels.share:
        handleShare(selectedRecord);
        break;

      case Labels.settle:
        Boolean(selectedRecord.isSettled)
          ? setSettleWarningModalStatus(!settleWarningModalStatus)
          : props.navigation.navigate('SettleBillings', {
              settleData: selectedRecord,
            });
        break;

      case Labels.view:
        props.navigation.navigate('BillingView', {
          billingId: selectedRecord._id,
        });
        break;

      default:
        break;
    }
  };

  const handleDelete = itemData => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    Store.dispatch(storeBillingEditStatus(false));

    ENV.currentEnvironment == Labels.development &&
      console.log('DELETE RECORD DATA::: ', itemData);

    const billingId = selectedRecord._id;

    props.billingDelete(billingId, res => {
      const response = res.resJson.data;

      setSelectedRecord(null);

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING DELETE RESPONSE DATA::: ', response);

      billingList();
    });
  };

  const handleShare = async billingData => {
    const billingId = billingData._id;

    const userId =
      Boolean(props.userDetails) &&
      props.userDetails.hasOwnProperty('user') &&
      props.userDetails.user.hasOwnProperty('id') &&
      Boolean(props.userDetails.user.id)
        ? props.userDetails.user.id
        : null;

    const fileName = `${Labels.bill}${Boolean(userId) ? `_${userId}` : ''}`;

    let htmlTopdfOptions = {
      html: ShareContent.billShareContent(billingData),
      fileName: fileName,
      directory: 'Documents',
    };

    const fileData = await RNHTMLtoPDF.convert(htmlTopdfOptions);

    if (Boolean(fileData) && typeof fileData == 'object') {
      const shareOptions = {
        message: `Click the below link to view the bill: \n ${ENV.deepLinkingHost}/${Endpoints.billing}/${billingId}`,
        subject: Labels.billing,
        title: Labels.billing,
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

  const handleStopRecurrence = () => {
    setStopRecurringModalStatus(!stopRecurringModalStatus);

    const billingId = selectedRecord._id;

    props.billingStopRecurring(billingId, res => {
      const response = res.resJson.data;

      billingList();

      ENV.currentEnvironment == Labels.development &&
        console.log('STOP RECURRING RESPONSE::::: ', response);
    });
  };

  const renderDeleteWarning = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        onRequestClose={() => {
          setDeleteWarningModalStatus(!deleteWarningModalStatus);
        }}
        visible={deleteWarningModalStatus}>
        <View
          style={[
            Styles.modalContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
          ]}>
          <View style={HelperStyles.margin(20, 20)}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Colors.primaryText,
                  'center',
                  'none',
                ),
                HelperStyles.justView('lineHeight', 24),
              ]}>
              {`You can't undo ${
                Boolean(selectedRecord) &&
                selectedRecord.hasOwnProperty('payee') &&
                Boolean(selectedRecord.payee)
                  ? `'${selectedRecord.payee}' claim`
                  : 'it'
              } once you delete`}
            </Text>
            <Button
              containerStyle={Styles.modalButtonContainer}
              label={Labels.done}
              loading={false}
              onPress={() => {
                setDeleteWarningModalStatus(!deleteWarningModalStatus);
              }}
            />
          </View>
        </View>
      </CustomModal>
    );
  };

  const renderStopRecurringWarning = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        onRequestClose={() => {
          setStopRecurringWarningModalStatus(!stopRecurringWarningModalStatus);
        }}
        visible={stopRecurringWarningModalStatus}>
        <View
          style={[
            Styles.modalContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
          ]}>
          <View style={HelperStyles.margin(20, 20)}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Colors.primaryText,
                  'center',
                  'none',
                ),
                HelperStyles.justView('lineHeight', 24),
              ]}>
              {Labels.stopRecurringWarning}
            </Text>
            <Button
              containerStyle={Styles.modalButtonContainer}
              label={Labels.done}
              loading={false}
              onPress={() => {
                setStopRecurringWarningModalStatus(
                  !stopRecurringWarningModalStatus,
                );
              }}
            />
          </View>
        </View>
      </CustomModal>
    );
  };

  const renderSettleWarning = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        onRequestClose={() => {
          setSettleWarningModalStatus(!settleWarningModalStatus);
        }}
        visible={settleWarningModalStatus}>
        <View
          style={[
            Styles.modalContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
          ]}>
          <View style={HelperStyles.margin(20, 20)}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Colors.primaryText,
                  'center',
                  'none',
                ),
                HelperStyles.justView('lineHeight', 24),
              ]}>
              {Labels.billSettleWarning}
            </Text>
            <Button
              containerStyle={Styles.modalButtonContainer}
              label={Labels.done}
              loading={false}
              onPress={() => {
                setSettleWarningModalStatus(!settleWarningModalStatus);
              }}
            />
          </View>
        </View>
      </CustomModal>
    );
  };

  const renderClaimAccordionSkeleton = () => {
    return (
      <>
        <ClaimAccordionSkeleton style={HelperStyles.justView('marginTop', 0)} />
        <ClaimAccordionSkeleton />
        <ClaimAccordionSkeleton />
        <ClaimAccordionSkeleton />
        <ClaimAccordionSkeleton />
        <ClaimAccordionSkeleton />
        <ClaimAccordionSkeleton />
        <ClaimAccordionSkeleton />
        <ClaimAccordionSkeleton />
        <ClaimAccordionSkeleton />
      </>
    );
  };

  const ClaimAccordionSkeleton = ({style = {}}) => {
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
          <View style={HelperStyles.margin(20, 16)}>
            <MonthToggler
              onValueChange={selectedValue => {
                ENV.currentEnvironment == Labels.development &&
                  console.log(
                    'MONTH TOGGLER SELECTED VALUE::: ',
                    selectedValue,
                  );

                setMonth(selectedValue);

                setBilling(null);
              }}
              value={month}
            />
          </View>
          {Boolean(billing) ? (
            Array.isArray(billing) && billing.length != 0 ? (
              billing.map((billingData, index) => (
                <View
                  key={index}
                  style={HelperStyles.justView(
                    'marginBottom',
                    index == billingAccordionIndex ? 0 : 16,
                  )}>
                  {renderBillingAccordion(billingData, index)}
                  {index == billingAccordionIndex &&
                    renderBillingItems(billingData)}
                </View>
              ))
            ) : (
              <NoResponse />
            )
          ) : (
            renderClaimAccordionSkeleton()
          )}
        </ScrollView>

        <CustomModal
          message={Labels.deleteBilling}
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

        <CustomModal
          message={Labels.writeOffClaim}
          onNegative={() => {
            setStopRecurringModalStatus(!stopRecurringModalStatus);
          }}
          onPositive={() => {
            handleStopRecurrence();
          }}
          onRequestClose={() => {
            setStopRecurringModalStatus(!stopRecurringModalStatus);
          }}
          visible={stopRecurringModalStatus}
        />

        {renderOptionsModal()}

        {renderDeleteWarning()}

        {renderStopRecurringWarning()}

        {renderSettleWarning()}
      </View>
    </Network>
  );
};

const mapStateToProps = state => {
  return {
    editStatus: state.app.billing.billingEditStatus,
    userDetails: state.auth.userDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    billingDelete: (billingId, onResponse) => {
      dispatch(billingDelete(billingId, onResponse));
    },

    billingList: (requestData, onResponse) => {
      dispatch(billingList(requestData, onResponse));
    },

    billingStopRecurring: (billingId, onResponse) => {
      dispatch(billingStopRecurring(billingId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Billing);

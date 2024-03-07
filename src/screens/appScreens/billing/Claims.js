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
  claimDelete,
  claimList,
  claimView,
  claimWriteOff,
  routingName,
  storeClaimEditStatus,
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
import Styles from '../../../styles/appStyles/billing/Claims';
import * as Endpoints from '../../../api/Endpoints';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';
import * as ShareContent from '../../../utils/ShareContent';

const Claims = props => {
  // Claims Variables
  const [claims, setClaims] = useState(null);
  const [month, setMonth] = useState(moment());
  const [claimAccordionIndex, setClaimAccordionIndex] = useState(0);
  const [imageLoader, setImageLoader] = useState(false);
  const [optionsModalStatus, setOptionsModalStatus] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [writeOffModalStatus, setWriteOffModalStatus] = useState(false);
  const [deleteWarningModalStatus, setDeleteWarningModalStatus] =
    useState(false);
  const [writeOffWarningModalStatus, setWriteOffWarningModalStatus] =
    useState(false);
  const [settleWarningModalStatus, setSettleWarningModalStatus] =
    useState(false);

  // Other Variables
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [warningModalStatus, setWarningModalStatus] = useState(false);
  const [warningText, setWarningText] = useState(null);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setMonth(moment());

      setClaims(null);

      return () => {
        Store.dispatch(storeClaimEditStatus(false));

        isFocus = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Boolean(props.editStatus) &&
        !Boolean(claimAccordionIndex) &&
        setClaimAccordionIndex(0);

      return () => {
        isFocus = false;
      };
    }, [props.editStatus]),
  );

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      claimList();

      return () => {
        isFocus = false;
      };
    }, [month]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    claimList();
  };

  const claimList = () => {
    const requestData = {
      month: Helpers.formatDateTime(month, null, Labels.formatM),
      year: Helpers.formatDateTime(month, null, Labels.formatYYYY),
    };

    props.claimList(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('CLAIMS LIST RESPONSE DATA:::  ', response);

      setClaims(response);

      setRefreshing(false);
    });
  };

  const renderClaimAccordion = (index, claimData) => {
    return (
      <View style={Styles.claimAccordionContainer}>
        <View style={Styles.claimAccordionLabelContainer}>
          <Text
            style={HelperStyles.textView(
              14,
              '700',
              Colors.primaryText,
              'left',
              'none',
            )}>
            {claimData._id.name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            index != claimAccordionIndex
              ? setClaimAccordionIndex(index)
              : setClaimAccordionIndex(null);
          }}
          style={Styles.claimAccordionImageContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.arrow}
            style={[
              Styles.claimAccordionImage,
              HelperStyles.justView('transform', [
                {
                  rotate: index == claimAccordionIndex ? '180deg' : '0deg',
                },
              ]),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderClaimItems = claimData => {
    return (
      <View
        style={[
          HelperStyles.flex(1),
          HelperStyles.flexDirection('column'),
          HelperStyles.justView('justifyContent', 'space-between'),
          HelperStyles.margin(20, 16),
        ]}>
        {claimData.hasOwnProperty('data') &&
        Array.isArray(claimData.data) &&
        claimData.data.length != 0 ? (
          claimData.data.map((itemData, index) => {
            const payee =
              itemData.hasOwnProperty('payee') && Boolean(itemData.payee)
                ? itemData.payee
                : '-';

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
                    Styles.claimItemContainer,
                    HelperStyles.justView('marginTop', index != 0 ? 8 : 0),
                  ]}>
                  <View
                    style={[
                      HelperStyles.flex(0.125),
                      HelperStyles.justifyContentCenteredView('center'),
                    ]}>
                    <View style={Styles.claimItemImageContainer}>
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
                        style={Styles.claimItemImage}
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
                  <View style={Styles.claimItemLabelContainer}>
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
                      {payee}
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
                  <View style={Styles.claimItemValueContainer}>
                    {Boolean(props.editStatus) ? (
                      <TouchableOpacity
                        onPress={() => {
                          Store.dispatch(storeClaimEditStatus(false));

                          if (!Boolean(itemData.isSettled)) {
                            props.navigation.navigate('Expense', {
                              expenseId: itemData._id,
                            });
                          } else {
                            showMessage({
                              icon: 'auto',
                              message: Labels.claimEditWarning,
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
                        {Boolean(itemData.balance.currency)
                          ? `${itemData.balance.currency} `
                          : null}
                        {Boolean(itemData.amount)
                          ? parseFloat(itemData.amount).toFixed(2)
                          : '0.00'}
                      </Text>
                    )}
                  </View>
                  {Boolean(handleClaimStatus(itemData)) && (
                    <View
                      style={[
                        Styles.claimStatus,
                        HelperStyles.justView(
                          'backgroundColor',
                          handleClaimStatusColor(itemData),
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
                        {handleClaimStatus(itemData)}
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
            No claim(s) found for {claimData.group}!
          </Text>
        )}
      </View>
    );
  };

  const handleClaimStatusColor = itemData => {
    if (Boolean(itemData)) {
      if (itemData.hasOwnProperty('isSettled') && Boolean(itemData.isSettled)) {
        return Colors.primary;
      } else if (
        itemData.hasOwnProperty('isWriteOff') &&
        Boolean(itemData.isWriteOff)
      ) {
        return Colors.orangeYellow;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const handleClaimStatus = itemData => {
    if (Boolean(itemData)) {
      if (itemData.hasOwnProperty('isSettled') && Boolean(itemData.isSettled)) {
        return 'Settled';
      } else if (
        itemData.hasOwnProperty('isWriteOff') &&
        Boolean(itemData.isWriteOff)
      ) {
        return 'Write Offed';
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
      Labels.writeOff,
      Labels.share,
      Labels.delete,
      Labels.view,
    ];

    return customOptions.map((lol, index) => (
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
    ));
  };

  const handleOptionSelection = selectedOption => {
    setOptionsModalStatus(!optionsModalStatus);

    switch (selectedOption) {
      case Labels.delete:
        Boolean(selectedRecord.isDeleted)
          ? setDeleteWarningModalStatus(!deleteWarningModalStatus)
          : setDeleteModalStatus(!deleteModalStatus);
        break;

      case Labels.settle:
        Boolean(selectedRecord.isSettled)
          ? setSettleWarningModalStatus(!settleWarningModalStatus)
          : props.navigation.navigate('SettleClaims', {
              settleData: selectedRecord,
            });
        break;

      case Labels.share:
        handleShare(selectedRecord);
        break;

      case Labels.view:
        Store.dispatch(routingName(Labels.claimRouteName));
        props.navigation.navigate('ExpenseView', {
          expenseId: selectedRecord._id,
        });
        break;

      case Labels.writeOff:
        !Boolean(selectedRecord.isSettled)
          ? Boolean(selectedRecord.claimable) &&
            !Boolean(selectedRecord.isWriteOff)
            ? setWriteOffModalStatus(!writeOffModalStatus)
            : setWriteOffWarningModalStatus(!writeOffWarningModalStatus)
          : [
              setWarningText(Labels.claimWriteOffWarning),

              setWarningModalStatus(!warningModalStatus),
            ];
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

    Store.dispatch(storeClaimEditStatus(false));

    ENV.currentEnvironment == Labels.development &&
      console.log('DELETE RECORD DATA::: ', itemData);

    const claimId = selectedRecord._id;

    props.claimDelete(claimId, res => {
      const response = res.resJson.data;

      setSelectedRecord(null);

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING DELETE RESPONSE DATA::: ', response);

      claimList();
    });
  };

  const handleShare = claimData => {
    showMessage({
      icon: 'auto',
      message: `${Labels.fetchingData}...`,
      position: 'bottom',
      type: 'default',
    });

    const claimId = claimData._id;

    props.claimView(claimId, async res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE VIEW RESPONSE DATA::: ', response);

      const userId =
        Boolean(props.userDetails) &&
        props.userDetails.hasOwnProperty('user') &&
        props.userDetails.user.hasOwnProperty('id') &&
        Boolean(props.userDetails.user.id)
          ? props.userDetails.user.id
          : null;

      const fileName = `${Labels.claim}${Boolean(userId) ? `_${userId}` : ''}`;

      let htmlTopdfOptions = {
        html: ShareContent.expenseShareContent(response.info, response.items),
        fileName: fileName,
        directory: 'Documents',
      };

      const fileData = await RNHTMLtoPDF.convert(htmlTopdfOptions);

      if (Boolean(fileData) && typeof fileData == 'object') {
        const shareOptions = {
          message: `Click the below link to view the claim: \n ${ENV.deepLinkingHost}/${Endpoints.expense}/${claimId}`,
          subject: Labels.claim,
          title: Labels.claim,
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
    });
  };

  const handleWriteOff = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.writingOff}...`,
      position: 'bottom',
      type: 'default',
    });

    const requestData = {
      isWriteOff: true,
      writeOffOn: new Date(),
    };

    setWriteOffModalStatus(!writeOffModalStatus);

    const claimId = selectedRecord._id;

    props.claimWriteOff(claimId, requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('STOP WRITE OFF RESPONSE::::: ', response);

      claimList();
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
              {Labels.claimSettleWarning}
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

  const renderStopRecurringWarning = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        onRequestClose={() => {
          setWriteOffWarningModalStatus(!writeOffWarningModalStatus);
        }}
        visible={writeOffWarningModalStatus}>
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
              {Labels.stopWriteOffWarning}
            </Text>
            <Button
              containerStyle={Styles.modalButtonContainer}
              label={Labels.done}
              loading={false}
              onPress={() => {
                setWriteOffWarningModalStatus(!writeOffWarningModalStatus);
              }}
            />
          </View>
        </View>
      </CustomModal>
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
              {warningText}
            </Text>
            <Button
              containerStyle={Styles.modalButtonContainer}
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
          refreshControl={
            <RefreshControl
              tintColor={Colors.primary}
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }
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

                setClaims(null);
              }}
              value={month}
            />
          </View>
          {Boolean(claims) ? (
            Array.isArray(claims) && claims.length != 0 ? (
              claims.map((claimData, index) => (
                <View
                  key={index}
                  style={HelperStyles.justView(
                    'marginBottom',
                    index == claimAccordionIndex ? 0 : 16,
                  )}>
                  {renderClaimAccordion(index, claimData)}
                  {index == claimAccordionIndex && renderClaimItems(claimData)}
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
          message={Labels.deleteClaim}
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
            setWriteOffModalStatus(!writeOffModalStatus);
          }}
          onPositive={() => {
            handleWriteOff();
          }}
          onRequestClose={() => {
            setWriteOffModalStatus(!writeOffModalStatus);
          }}
          visible={writeOffModalStatus}
        />

        {renderOptionsModal()}

        {renderDeleteWarning()}

        {renderSettleWarning()}

        {renderStopRecurringWarning()}

        {renderWarning()}
      </View>
    </Network>
  );
};

const mapStateToProps = state => {
  return {
    editStatus: state.app.claims.claimEditStatus,
    userDetails: state.auth.userDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    claimDelete: (claimId, onResponse) => {
      dispatch(claimDelete(claimId, onResponse));
    },

    claimList: (requestData, onResponse) => {
      dispatch(claimList(requestData, onResponse));
    },

    claimView: (claimId, onResponse) => {
      dispatch(claimView(claimId, onResponse));
    },

    claimWriteOff: (claimId, requestData, onResponse) => {
      dispatch(claimWriteOff(claimId, requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Claims);

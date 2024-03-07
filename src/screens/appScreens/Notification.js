import React, {useCallback, useRef, useState} from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Card from '../../containers/Card';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Network from '../../containers/Network';
import NoResponse from '../../components/appComponents/NoResponse';
import SkeletonCard from '../../components/skeletonComponents/SkeletonCard';
import Styles from '../../styles/appStyles/Notification';
import * as ENV from '../../../env';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const Notification = () => {
  // Notification Variables
  const [notificationData, setNotificationData] = useState(null);

  // Ref Variables
  const swipeable = useRef();

  // Theme Variables
  const Theme = useTheme().colors;

  // Other Variables
  const [refreshing, setRefreshing] = useState(false);
  const notificationList = [
    {
      date: `${Helpers.formatDateTime(
        moment(),
        null,
        `${Labels.formatMDY} ${moment().format(Labels.formatHMA)}`,
      )}`,
      isRead: true,
      title: Labels.balance,
      type: 'balance',
    },
    {
      date: `${Helpers.formatDateTime(
        moment(),
        null,
        `${Labels.formatMDY} 4:15 PM`,
      )}`,
      isRead: false,
      title: Labels.budget,
      type: 'budget',
    },
    {
      date: `${Helpers.formatDateTime(
        moment(),
        null,
        `${Labels.formatMDY} 3:00 PM`,
      )}`,
      isRead: false,
      title: Labels.billingClaims,
      type: 'claims',
    },
    {
      date: `${Helpers.formatDateTime(
        moment(),
        null,
        `${Labels.formatMDY} 12:45 PM`,
      )}`,
      isRead: false,
      title: Labels.billingClaims,
      type: 'billing',
    },
  ];

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setRefreshing(false);

        setNotificationData(notificationList);
      }, 1000);
    }, [refreshing == true]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    setNotificationData(null);
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setNotificationData(notificationList);

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const handleImage = type => {
    switch (type) {
      case 'balance':
        return Assets.balance;

      case 'billing':
      case 'claims':
        return Assets.billingClaims;

      case 'budget':
        return Assets.budget;

      default:
        return Assets.bell;
    }
  };

  const renderRightActions = function (lol) {
    return (
      <View
        style={[
          HelperStyles.justView('width', Boolean(lol.isRead) ? '50%' : '25%'),
          Styles.rightActionsContainer,
        ]}>
        <View style={Styles.deleteContainer}>
          <TouchableOpacity
            style={HelperStyles.justView('alignItems', 'center')}
            onPress={() => {
              handleSwipeTiggerAction();
            }}>
            <MaterialIcons
              color={Theme.primaryText}
              name={'delete'}
              size={20}
            />
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '400',
                  Theme.primaryText,
                  'center',
                  'none',
                ),
                HelperStyles.justView('marginTop', 4),
              ]}>
              {Labels.delete}
            </Text>
          </TouchableOpacity>
        </View>
        {Boolean(lol.isRead) && (
          <View style={Styles.readContainer}>
            <TouchableOpacity
              style={HelperStyles.justView('alignItems', 'center')}
              onPress={() => {
                handleSwipeTiggerAction();
              }}>
              <MaterialIcons
                color={Theme.primaryText}
                name={'done-all'}
                size={20}
              />
              <Text
                style={[
                  HelperStyles.textView(
                    14,
                    '400',
                    Theme.primaryText,
                    'center',
                    'none',
                  ),
                  HelperStyles.justView('marginTop', 4),
                ]}>
                {Labels.read}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const handleSwipeTiggerAction = () => {
    swipeable.current.close();
  };

  const NotificationSkeleton = () => {
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
          showsVerticalScrollIndicator={false}>
          <View style={[HelperStyles.flex(1), HelperStyles.margin(20, 16)]}>
            {Boolean(notificationData) ? (
              Array.isArray(notificationData) &&
              notificationData.length != 0 ? (
                notificationData.map((lol, index) => (
                  <GestureHandlerRootView key={index}>
                    <Swipeable
                      enableTrackpadTwoFingerGesture={false}
                      friction={2}
                      onSwipeableClose={() => {
                        handleSwipeTiggerAction();
                      }}
                      ref={swipeable}
                      renderRightActions={() => renderRightActions(lol)}
                      rightThreshold={40}>
                      <Card containerStyle={Styles.container}>
                        <View
                          style={[
                            HelperStyles.flex(0.175),
                            HelperStyles.justifyContentCenteredView('center'),
                          ]}>
                          <View style={Styles.imageContainer}>
                            <Image
                              resizeMode={'contain'}
                              source={handleImage(lol.type)}
                              style={[
                                HelperStyles.imageView(24, 24),
                                HelperStyles.justView(
                                  'tintColor',
                                  Theme.primaryText,
                                ),
                              ]}
                            />
                          </View>
                        </View>
                        <View
                          style={[
                            HelperStyles.flex(1),
                            HelperStyles.flexDirection('column'),
                            HelperStyles.padding(8, 8),
                          ]}>
                          <View
                            style={[
                              HelperStyles.flex(
                                Boolean(lol.isRead) ? 0.825 : 1,
                              ),
                              Styles.textOuterContainer,
                            ]}>
                            <View style={Styles.textInnerContainer}>
                              <Text
                                numberOfLines={1}
                                style={HelperStyles.textView(
                                  14,
                                  '600',
                                  Theme.primaryText,
                                  'left',
                                  'none',
                                )}>
                                {lol.title}
                              </Text>
                            </View>
                            {Boolean(lol.isRead) && (
                              <View
                                style={[
                                  HelperStyles.flex(0.125),
                                  HelperStyles.justifyContentCenteredView(
                                    'center',
                                  ),
                                ]}>
                                <View style={Styles.newContainer}>
                                  <Text
                                    style={HelperStyles.textView(
                                      10,
                                      '700',
                                      Colors.white,
                                      'left',
                                      'none',
                                    )}>
                                    {Labels.new}
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                          <Text
                            style={[
                              HelperStyles.textView(
                                12,
                                '400',
                                Colors.border,
                                'left',
                                'none',
                              ),
                              HelperStyles.justView('marginTop', 4),
                            ]}>
                            {Helpers.formatDateTimeNow(
                              lol.date,
                              `${Labels.formatMDY} ${Labels.formatHMA}`,
                            )}
                          </Text>
                        </View>
                      </Card>
                    </Swipeable>
                  </GestureHandlerRootView>
                ))
              ) : (
                <NoResponse />
              )
            ) : (
              <>
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </Network>
  );
};

export default Notification;

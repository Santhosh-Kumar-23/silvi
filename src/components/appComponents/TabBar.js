import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useTheme,
} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/TabBar';
import * as HelperStyles from '../../utils/HelperStyles';

const TabBar = ({
  descriptors,
  getCurrentRoute = () => {},
  horizontalScrollView = false,
  navigation,
  state,
  tabBarActiveTintColor = Colors.primaryText,
  tabBarInactiveTintColor = Colors.lightText,
  tabBarItemTintColor = Colors.primary,
  tabBarItemStyle = null,
  tabBarLabelStyle = null,
  tabBarStyle = null,
  type = 'outlined',
}) => {
  // Ref Variables
  const scrollViewRef = useRef(null);

  const Theme = useTheme().colors;

  // Other Variables
  let customtTabBarContainer = {},
    customTabBarItem = {};

  switch (type) {
    case 'outlined':
    default:
      customtTabBarContainer = [Styles.outLinedTabBarContainer];
      customTabBarItem = [Styles.outLinedContainer];
      tabBarActiveTintColor = Theme.primaryText;
      tabBarInactiveTintColor = Colors.lightText;
      break;

    case 'solid':
      customtTabBarContainer = [Styles.solidTabBarContainer];
      customTabBarItem = [Styles.solidContainer];
      tabBarActiveTintColor = Colors.white;
      tabBarInactiveTintColor = Colors.primaryText;
      break;
  }

  useEffect(() => {
    scrollViewRef.current &&
      scrollViewRef.current.scrollTo({
        x: state.index * 100,
        y: 0,
        animated: true,
      });
  }, [state.index]);

  const renderTopTabs = () => {
    return state.routes.map((route, index) => {
      const {options} = descriptors[route.key];

      const label = options.tabBarLabel || options.title || route.name;

      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          getCurrentRoute(route.name);

          navigation.navigate({name: route.name, merge: true});
        }
      };

      const onLongPress = () => {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      };

      switch (type) {
        case 'outlined':
        default:
          customTabBarItem = [
            ...customTabBarItem,
            HelperStyles.justView(
              'borderColor',
              isFocused ? tabBarItemTintColor : Colors.barBackground,
            ),
          ];
          break;

        case 'solid':
          customTabBarItem = [
            ...customTabBarItem,
            Styles.solidTabBarBorderLeft(index == 0 ? 10 : 0),
            Styles.solidTabBarBorderRight(
              state.routes.length == index + 1 ? 10 : 0,
            ),
            HelperStyles.justView(
              'backgroundColor',
              isFocused ? tabBarItemTintColor : Colors.barBackground,
            ),
            HelperStyles.justView(
              'borderColor',
              isFocused ? tabBarItemTintColor : Colors.barBackground,
            ),
          ];
          break;
      }

      const handleImageRendering = () => {
        switch (label) {
          case Labels.scanReceipt:
            return Assets.scan;

          default:
            return false;
        }
      };

      return (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={isFocused ? {selected: true} : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          key={index}
          testID={options.tabBarTestID}
          onPress={onPress}
          onLongPress={onLongPress}
          style={HelperStyles.flex(1)}>
          <View style={[customTabBarItem, tabBarItemStyle]}>
            <View
              style={[
                HelperStyles.flexDirection('row'),
                HelperStyles.justifyContentCenteredView('center'),
              ]}>
              {Boolean(handleImageRendering()) && (
                <Image
                  resizeMode={'contain'}
                  source={Assets.scan}
                  style={[
                    HelperStyles.imageView(14, 14),
                    HelperStyles.justView(
                      'tintColor',
                      isFocused
                        ? tabBarActiveTintColor
                        : tabBarInactiveTintColor,
                    ),
                  ]}
                />
              )}
              <View
                style={HelperStyles.justView(
                  'marginLeft',
                  Boolean(handleImageRendering()) ? 8 : 0,
                )}>
                <Animated.Text
                  style={[
                    HelperStyles.textView(
                      14,
                      '600',
                      isFocused
                        ? tabBarActiveTintColor
                        : tabBarInactiveTintColor,
                      'center',
                      'capitalize',
                    ),
                    tabBarLabelStyle,
                  ]}>
                  {label}
                </Animated.Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return horizontalScrollView ? (
    <View>
      <ScrollView
        contentContainerStyle={[customtTabBarContainer, tabBarStyle]}
        horizontal={horizontalScrollView}
        ref={list => (scrollViewRef.current = list)}
        showsHorizontalScrollIndicator={false}>
        {renderTopTabs()}
      </ScrollView>
    </View>
  ) : (
    <View style={[customtTabBarContainer, tabBarStyle]}>{renderTopTabs()}</View>
  );
};

export default TabBar;

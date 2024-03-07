import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useTheme,
} from '@react-navigation/native';
import {enableLatestRenderer} from 'react-native-maps';
import {Provider} from 'react-redux';
import {Security} from './src/components/otherComponents/Security';
import Colors from './src/utils/Colors';
import DeepLinking from './src/utils/DeepLinking';
import FlashMessage from 'react-native-flash-message';
import InAppUpdate from './src/components/appComponents/InAppUpdate';
import Labels from './src/utils/Strings';
import RootNavigation from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import Store from './src/redux/Store';
import * as ENV from './env';
import * as HelperNavigation from './src/utils/HelperNavigation';
import * as Helpers from './src/utils/Helpers';
import * as HelperStyles from './src/utils/HelperStyles';

const App = () => {
  // Configuration Variables
  // Dark Theme
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.black,
      primary: Colors.primary,
      text: Colors.white,
      primaryText: Colors.white,
    },
  };

  // Light Theme
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.white,
      primary: Colors.primary,
      text: Colors.black,
      primaryText: Colors.primaryText,
    },
  };

  // Theme Variables
  const themeScheme = Helpers.getThemeScheme();
  const Theme = useTheme().colors;

  useEffect(() => {
    let isFocus = true;

    // For react-native-maps configuration
    enableLatestRenderer();

    // For react-native-splash-screen configuration
    SplashScreen.hide();

    ENV.currentEnvironment != Labels.development &&
      InAppUpdate.checkAppUpdate();

    return () => {
      isFocus = false;
    };
  }, []);

  return (
    <SafeAreaView style={HelperStyles.screenContainer(Theme.background)}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.black} />
      <Provider store={Store}>
        <NavigationContainer
          fallback={DeepLinking.handleFallBack()}
          linking={DeepLinking.linking}
          ref={HelperNavigation.navigationRef}
          theme={themeScheme == 'dark' ? customDarkTheme : customLightTheme}>
          <RootNavigation />
        </NavigationContainer>
      </Provider>

      {/* Custom Plugin Provider */}
      <FlashMessage duration={2000} floating={true} position="top" />
    </SafeAreaView>
  );
};

export default Security(App);

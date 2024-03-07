import React from 'react';
import {AppState, Platform, View} from 'react-native';

const SecurityIOS = Wrapped => {
  return class Security extends React.Component {
    state = {
      showSecurityScreen: ['background', 'inactive'].includes(
        AppState.currentState,
      ),
    };

    componentDidMount() {
      AppState.addEventListener('change', this.onChangeAppState);
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this.onChangeAppState);
    }

    onChangeAppState = appState => {
      const showSecurityScreen = ['background', 'inactive'].includes(appState);

      this.setState({showSecurityScreen});
    };

    render() {
      return this.state.showSecurityScreen ? (
        <View />
      ) : (
        <Wrapped {...this.props} />
      );
    }
  };
};

const SecurityAndroid = Wrapped => Wrapped;

export const Security = Platform.OS === 'ios' ? SecurityIOS : SecurityAndroid;

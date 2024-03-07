import {clearReduxStates, loadingStatus} from '../redux/Root.Actions';
import {CommonActions} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Crashlytics from '@react-native-firebase/crashlytics';
import Labels from '../utils/Strings';
import Store from '../redux/Store';
import * as Endpoints from './Endpoints';
import * as ENV from '../../env';
import * as HelperNavigation from '../utils/HelperNavigation';

class HandleFetchRequest {
  handleFetchRequest = (endPoint, headers, onResponse, showFlashMessage) => {
    ENV.currentEnvironment == Labels.development &&
      console.log('REQUEST ENDPOINT::: ', endPoint);

    fetch(endPoint, headers)
      .then(res => handleResponse(res, endPoint))
      .then(resJson => {
        Store.dispatch(loadingStatus(false));

        ENV.currentEnvironment == Labels.development &&
          console.log('RESJSON:::: ', resJson);

        handleSuccessResponse(resJson, onResponse, showFlashMessage);
      })
      .catch(errorResponse => {
        Store.dispatch(loadingStatus(false));

        ENV.currentEnvironment == Labels.development &&3
          console.log('ERROR RESPONSE DATA:::: ', errorResponse);

        handleErrorResponse(endPoint, errorResponse);
      });
  };
}

const handleResponse = async (response, endPoint) => {
  const statusCode = response.status;
  const resJson = response.json();

  if (!endPoint.includes(Endpoints.signIn) && statusCode == 401) {
    backToOnboard();

    return true;
  } else {
    return Promise.all([statusCode, resJson]).then(res => ({
      statusCode: res[0],
      resJson: res[1],
    }));
  }
};

const backToOnboard = async () => {
  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{name: 'Onboard'}],
  });

  await AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys));

  Store.dispatch(clearReduxStates());

  HelperNavigation.navigateDispatch(resetAction);
};

const handleSuccessResponse = (
  successResponse,
  onResponse,
  showFlashMessage,
) => {
  const response = successResponse.resJson;

  if (successResponse.statusCode == 200 || successResponse.statusCode == 201) {
    showFlashMessage &&
      showMessage({
        description: response.message,
        icon: 'auto',
        message: Labels.success,
        type: 'success',
      });

    Boolean(response.data) && onResponse(successResponse);
  } else {
    Boolean(response) &&
      response.hasOwnProperty('message') &&
      Boolean(response.message) &&
      showMessage({
        description: response.message,
        duration: 30000,
        icon: 'auto',
        message: Labels.error,
        type: 'danger',
      });
  }
};

handleErrorResponse = (endPoint, errorResponse) => {
  ENV.currentEnvironment != Labels.production &&
    Crashlytics().setAttributes({
      endPoint: endPoint,
      error: JSON.stringify(errorResponse),
      label: Labels.apiRequest,
      type: 'catch',
    });

  showMessage({
    description: errorResponse.toString().split(': ')[1],
    duration: 30000,
    icon: 'auto',
    message: Labels.error,
    type: 'danger',
  });
};

const FetchRequest = new HandleFetchRequest();

export default FetchRequest;

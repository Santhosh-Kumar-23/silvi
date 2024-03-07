import AsyncStorage from '@react-native-async-storage/async-storage';
import Fetch from './Fetch';
import Labels from '../utils/Strings';
import * as ENV from '../../env';

class HandleRequestService {
  delete = (endPoint, onResponse, showFlashMessage = true) => {
    handleRequestHeaders(
      'DELETE',
      endPoint,
      null,
      onResponse,
      showFlashMessage,
    );
  };

  patch = (endPoint, requestData, onResponse, showFlashMessage = true) => {
    handleRequestHeaders(
      'DELETE',
      endPoint,
      requestData,
      onResponse,
      showFlashMessage,
    );
  };

  get = (endPoint, requestData, onResponse, showFlashMessage = true) => {
    handleRequestHeaders(
      'GET',
      endPoint,
      requestData,
      onResponse,
      showFlashMessage,
    );
  };

  patch = (endPoint, requestData, onResponse, showFlashMessage = true) => {
    handleRequestHeaders(
      'PATCH',
      endPoint,
      requestData,
      onResponse,
      showFlashMessage,
    );
  };

  post = (endPoint, requestData, onResponse, showFlashMessage = true) => {
    handleRequestHeaders(
      'POST',
      endPoint,
      requestData,
      onResponse,
      showFlashMessage,
    );
  };

  put = (endPoint, requestData, onResponse, showFlashMessage = true) => {
    handleRequestHeaders(
      'PUT',
      endPoint,
      requestData,
      onResponse,
      showFlashMessage,
    );
  };
}

const handleRequestHeaders = async (
  methodType,
  endPoint,
  requestData,
  onResponse,
  showFlashMessage,
) => {
  const jwtToken = await AsyncStorage.getItem('token');

  ENV.currentEnvironment == Labels.development &&
    console.log('JWT Token::: ', jwtToken);

  let requestHeader = {
    method: methodType,
    headers: {
      Accept: '*/*',
      'Content-Type':
        requestData instanceof FormData
          ? 'multipart/form-data'
          : 'application/json',
      Authorization: 'Bearer' + ' ' + jwtToken,
    },
  };

  Boolean(requestData) && [
    (requestHeader = {
      ...requestHeader,
      body:
        requestData instanceof FormData
          ? requestData
          : JSON.stringify(requestData),
    }),
  ];

  Fetch.handleFetchRequest(
    `${ENV.baseURL}${endPoint}`,
    requestHeader,
    onResponse,
    showFlashMessage,
  );
};

const RequestService = new HandleRequestService();

export default RequestService;

import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';
import * as Types from '../../Root.Types';

// Loading Actions
export const loadingStatus = loadingStatus => {
  return {
    type: Types.LOADING_STATUS,
    payload: loadingStatus,
  };
};

// Push Notification Actions
export const storeFCMToken = token => {
  return {
    type: Types.FCM_TOKEN,
    payload: token,
  };
};

// Routing Actions
export const routingName = routingName => {
  return {
    type: Types.ROUTINGNAME,
    payload: routingName,
  };
};

// File Upload Actions
export const fileUpload = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.fileUpload, requestData, onResponse, false);
  };
};

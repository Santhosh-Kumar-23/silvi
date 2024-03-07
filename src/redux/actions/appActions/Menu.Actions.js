import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';
import * as Types from '../../Root.Types';

// Menu Actions
export const logout = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.logout, requestData, response => {
      onResponse(response);

      dispatch(clearReduxStates());
    });
  };
};

export const clearReduxStates = () => {
  return {
    type: Types.LOGOUT,
  };
};

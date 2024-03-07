import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';
import * as Types from '../../../redux/Root.Types';

// Claims Actions
export const storeClaimEditStatus = editStatus => {
  return {
    type: Types.CLAIM_EDIT_STATUS,
    payload: editStatus,
  };
};

export const claimsBank = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.claimsBank, null, onResponse, false);
  };
};

export const claimSettle = (claimId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.claimSettle}/${claimId}`,
      requestData,
      onResponse,
    );
  };
};

export const claimWriteOff = (claimId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.claimWriteOff}/${claimId}`,
      requestData,
      onResponse,
    );
  };
};

export const claimList = (requestData, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.claimList}${'?month='}${requestData.month}${'&year='}${
        requestData.year
      }`,
      null,
      response => {
        onResponse(response);

        const claimsList = response.resJson.data;

        const status =
          Boolean(claimsList) &&
          Array.isArray(claimsList) &&
          claimsList.length != 0
            ? true
            : false;

        dispatch(storeClaimsListStatus(status));
      },
      false,
    );
  };
};

export const storeClaimsListStatus = listStatus => {
  return {
    type: Types.CLAIM_LIST_STATUS,
    payload: listStatus,
  };
};

export const claimDelete = (claimId, onResponse) => {
  return dispatch => {
    RequestService.delete(`${Endpoints.claimDelete}/${claimId}`, onResponse);
  };
};

export const claimView = (claimId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.claimView}/${claimId}`,
      null,
      onResponse,
      false,
    );
  };
};

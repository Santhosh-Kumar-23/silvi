import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';
import * as Types from '../../Root.Types';

// Account Actions
export const storeAccountEditStatus = editStatus => {
  return {
    type: Types.ACCOUNT_EDIT_STATUS,
    payload: editStatus,
  };
};

export const accountCreate = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.accountCreate, requestData, response => {
      onResponse(response);
    });
  };
};

export const accountDelete = (accountId, onResponse) => {
  return dispatch => {
    RequestService.delete(
      `${Endpoints.accountDelete}/${accountId}`,
      onResponse,
    );
  };
};

export const accountList = (requestData, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.accountList}?limit=${requestData.limit}&page=${requestData.offset}`,
      null,
      onResponse,
      false,
    );
  };
};

export const accountUpdate = (accountId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.accountUpdate}/${accountId}`,
      requestData,
      onResponse,
    );
  };
};

export const accountView = (accountId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.accountView}/${accountId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const accountTransactionList = (requestData, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.accountList}?limit=${requestData.limit}&page=${requestData.offset}`,
      null,
      onResponse,
      false,
    );
  };
};

export const fetchBank = onResponse => {
  return dispatch => {
    RequestService.get(
      Endpoints.accountBank,
      null,
      response => {
        onResponse(response);
      },
      false,
    );
  };
};

export const storeAccountViewOffset = offset => {
  return {
    type: Types.ACCOUNT_VIEW_OFFSET,
    payload: offset,
  };
};

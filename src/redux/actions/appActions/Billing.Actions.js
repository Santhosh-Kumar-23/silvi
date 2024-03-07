import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';
import * as Types from '../../../redux/Root.Types';

// Billing Actions
export const storeBillingEditStatus = editStatus => {
  return {
    type: Types.BILLING_EDIT_STATUS,
    payload: editStatus,
  };
};

export const billingCategory = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.billingCategory, null, onResponse, false);
  };
};

export const billingCreateCategory = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(
      Endpoints.billingCreateCategory,
      requestData,
      onResponse,
    );
  };
};

export const billingSubCategory = (categoryId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.billingSubcategory}/${categoryId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const billingCreateSubCategory = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(
      Endpoints.billingCreateSubCategory,
      requestData,
      onResponse,
    );
  };
};

export const billingGroup = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.billingGroup, null, onResponse, false);
  };
};

export const billingCreateGroup = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.billingCreateGroup, requestData, onResponse);
  };
};

export const billingCreate = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.billingCreate, requestData, onResponse);
  };
};

export const billingList = (requestData, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.billingList}?month=${requestData.month}&year=${requestData.year}`,
      null,
      response => {
        onResponse(response);

        const billingList = response.resJson.data;

        const status =
          Boolean(billingList) &&
          Array.isArray(billingList) &&
          billingList.length != 0
            ? true
            : false;

        dispatch(storeBillingListStatus(status));
      },
      false,
    );
  };
};

export const storeBillingListStatus = listStatus => {
  return {
    type: Types.BILLING_LIST_STATUS,
    payload: listStatus,
  };
};

export const billingDelete = (billingId, onResponse) => {
  return dispatch => {
    RequestService.delete(
      `${Endpoints.billingDelete}/${billingId}`,
      onResponse,
    );
  };
};

export const billingView = (billingId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.billingView}/${billingId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const billingUpdate = (billingId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.billingUpdate}/${billingId}`,
      requestData,
      onResponse,
    );
  };
};

export const billingBank = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.billingBank, null, onResponse, false);
  };
};

export const billingSettle = (billingId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.billingSettle}/${billingId}`,
      requestData,
      onResponse,
    );
  };
};

export const billingStopRecurring = (billingId, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.billingStopRecurring}/${billingId}`,
      null,
      onResponse,
    );
  };
};

import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';

// Budget Actions
export const budgetCategory = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.budgetCategory, null, onResponse, false);
  };
};

export const budgetCreateCategory = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(
      Endpoints.budgetCreateCategory,
      requestData,
      onResponse,
    );
  };
};

export const budgetSubCategory = (categoryId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.budgetSubcategory}/${categoryId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const budgetCreateSubCategory = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(
      Endpoints.budgetCreateSubCategory,
      requestData,
      onResponse,
    );
  };
};

export const budgetGroup = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.budgetGroup, null, onResponse, false);
  };
};

export const budgetCreateGroup = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.budgetCreateGroup, requestData, onResponse);
  };
};

export const budgetCreate = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.budgetCreate, requestData, onResponse);
  };
};

export const budgetSummaryList = (requestData, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.budgetSummaryList}?month=${requestData.month}&year=${requestData.year}`,
      null,
      onResponse,
      false,
    );
  };
};

export const budgetList = (requestData, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.budgetList}?limit=${requestData.limit}&page=${requestData.offset}&month=${requestData.month}&year=${requestData.year}`,
      null,
      onResponse,
      false,
    );
  };
};

export const budgetDelete = (budgetId, onResponse) => {
  return dispatch => {
    RequestService.delete(`${Endpoints.budgetDelete}/${budgetId}`, onResponse);
  };
};

export const budgetView = (budgetId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.budgetView}/${budgetId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const budgetUpdate = (budgetId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.budgetUpdate}/${budgetId}`,
      requestData,
      onResponse,
    );
  };
};

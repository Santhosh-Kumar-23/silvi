import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';

// Expense Actions
export const expenseCategory = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.expenseCategory, null, onResponse, false);
  };
};

export const expenseSubCategory = (categoryId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.expenseSubcategory}/${categoryId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const expenseCreateSubCategory = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(
      Endpoints.expenseCreateSubCategory,
      requestData,
      onResponse,
    );
  };
};

export const expenseBank = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.expenseBank, null, onResponse, false);
  };
};

export const expenseCreateGroup = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.expenseCreateGroup, requestData, onResponse);
  };
};

export const expenseGroup = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.expenseGroup, null, onResponse, false);
  };
};

export const expenseCreate = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.expenseCreate, requestData, onResponse);
  };
};

export const expenseDelete = (expenseId, onResponse) => {
  return dispatch => {
    RequestService.delete(
      `${Endpoints.expenseDelete}/${expenseId}`,
      onResponse,
    );
  };
};

export const expenseView = (expenseId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.expenseView}/${expenseId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const expenseUpdate = (expenseId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.expenseUpdate}/${expenseId}`,
      requestData,
      onResponse,
    );
  };
};

import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';

// Income Actions
export const incomeCategory = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.incomeCategory, null, onResponse, false);
  };
};

export const incomeSubCategory = (categoryId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.incomeSubcategory}/${categoryId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const incomeCreateSubCategory = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(
      Endpoints.incomeCreateSubCategory,
      requestData,
      onResponse,
    );
  };
};

export const incomeBank = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.incomeBank, null, onResponse, false);
  };
};

export const incomeCreate = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.incomeCreate, requestData, onResponse);
  };
};

export const incomeView = (incomeId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.incomeView}/${incomeId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const incomeUpdate = (incomeId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.incomeUpdate}/${incomeId}`,
      requestData,
      onResponse,
    );
  };
};

export const incomeDelete = (incomeId, onResponse) => {
  return dispatch => {
    RequestService.delete(`${Endpoints.incomeDelete}/${incomeId}`, onResponse);
  };
};

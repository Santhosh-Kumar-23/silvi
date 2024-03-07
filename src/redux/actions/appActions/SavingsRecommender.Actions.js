import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';

//Savings Recommenders Actions
export const savingsRecommenderCategory = onResponse => {
  return dispatch => {
    RequestService.get(
      Endpoints.savingsRecommenderCategory,
      null,
      onResponse,
      false,
    );
  };
};

export const savingsRecommenderSubCategory = (categoryId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.savingsRecommenderSubCategory}/${categoryId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const savingsRecommenderCreateSubCategory = (
  requestData,
  onResponse,
) => {
  return dispatch => {
    RequestService.post(
      Endpoints.savingsRecommenderCreateSubCategory,
      requestData,
      onResponse,
    );
  };
};

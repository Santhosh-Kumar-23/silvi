import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';
import * as Types from '../../Root.Types';

// CreditCard Actions
export const storeCreditCardId = creditCardId => {
  return {
    type: Types.CREDITCARD_ID,
    payload: creditCardId,
  };
};

export const fetchCreditBank = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.creditBank, null, onResponse, false);
  };
};

export const fetchCardType = onResponse => {
  return dispatch => {
    RequestService.get(Endpoints.creditCardType, null, onResponse, false);
  };
};

export const creditCardCreate = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.creditCardCreate, requestData, onResponse);
  };
};

export const creditCardList = (requestData, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.creditCardList}?limit=${requestData.limit}&page=${requestData.offset}`,
      null,
      onResponse,
      false,
    );
  };
};

export const creditCardAmountPointsList = onResponse => {
  return dispatch => {
    RequestService.get(
      Endpoints.creditCardAmountPointsList,
      null,
      onResponse,
      false,
    );
  };
};

export const creditCardDelete = (creditCardId, onResponse) => {
  return dispatch => {
    RequestService.delete(
      `${Endpoints.creditCardDelete}/${creditCardId}`,
      onResponse,
    );
  };
};

export const creditCartView = (creditCardId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.creditCardView}/${creditCardId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const creditCardUpdate = (creditCardId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.creditCardUpdate}/${creditCardId}`,
      requestData,
      onResponse,
    );
  };
};

export const storeCreditCardExpiry = expiryDate => {
  return {
    type: Types.CREDITCARD_EXPIRY,
    payload: expiryDate,
  };
};

export const storeCreditCardViewOffset = offset => {
  return {
    type: Types.CREDITCARD_VIEW_OFFSET,
    payload: offset,
  };
};

// CreditCard Rewards Actions
export const storeCreditCardRewardsIndex = index => {
  return {
    type: Types.CREDITCARD_REWARDS_INDEX,
    payload: index,
  };
};

// CreditCard Points Actions
export const storeCreditCardPointsEditStatus = editStatus => {
  return {
    type: Types.CREDITCARD_POINTS_EDIT_STATUS,
    payload: editStatus,
  };
};

export const creditCardPointsList = (requestData, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.creditCardPointsList}?limit=${requestData.limit}&page=${requestData.offset}`,
      null,
      onResponse,
      false,
    );
  };
};

// Spending Actions
export const spendingCategory = onResponse => {
  return dispatch => {
    RequestService.get(
      Endpoints.creditSpendingCategory,
      null,
      onResponse,
      false,
    );
  };
};

export const spendingSubCategory = (categoryId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.creditSpendingSubCategory}/${categoryId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const spendingCreateSubCategory = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(
      Endpoints.creditSpendingCreateSubCategory,
      requestData,
      onResponse,
    );
  };
};

export const spendingCreate = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.spendingCreate, requestData, onResponse);
  };
};

export const spendingView = (spendingId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.spendingView}/${spendingId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const spendingUpdate = (spendingId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.spendingUpdate}/${spendingId}`,
      requestData,
      onResponse,
    );
  };
};

export const spendingDelete = (spendingId, onResponse) => {
  return dispatch => {
    RequestService.delete(
      `${Endpoints.spendingDelete}/${spendingId}`,
      onResponse,
    );
  };
};

// Earning Actions
export const earningCategory = onResponse => {
  return dispatch => {
    RequestService.get(
      Endpoints.creditEarningCategory,
      null,
      onResponse,
      false,
    );
  };
};

export const earningSubCategory = (categoryId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.creditEarningSubCategory}/${categoryId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const earningCreateSubCategory = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(
      Endpoints.creditEarningCreateSubCategory,
      requestData,
      onResponse,
    );
  };
};

export const earningCreate = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.earningCreate, requestData, onResponse);
  };
};

export const earningView = (earningId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.earningView}/${earningId}`,
      null,
      onResponse,
      false,
    );
  };
};

export const earningUpdate = (earningId, requestData, onResponse) => {
  return dispatch => {
    RequestService.patch(
      `${Endpoints.earningUpdate}/${earningId}`,
      requestData,
      onResponse,
    );
  };
};

export const earningDelete = (earningId, onResponse) => {
  return dispatch => {
    RequestService.delete(
      `${Endpoints.earningDelete}/${earningId}`,
      onResponse,
    );
  };
};

import * as Types from '../../Root.Types';

const initialState = {billingEditStatus: false, billingListStatus: false};

const billingReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.BILLING_EDIT_STATUS:
      return {...state, billingEditStatus: action.payload};

    case Types.BILLING_LIST_STATUS:
      return {...state, billingListStatus: action.payload};

    default:
      return state;
  }
};

export default billingReducer;

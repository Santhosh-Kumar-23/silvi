import * as Types from '../../Root.Types';

const initialState = {
  creditCardExpiry: null,
  creditCardId: null,
  creditCardPointsEditStatus: false,
  creditCardRewardsIndex: null,
  creditCardViewOffset: null,
};

const creditCardReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.CREDITCARD_EXPIRY:
      return {...state, creditCardExpiry: action.payload};

    case Types.CREDITCARD_ID:
      return {...state, creditCardId: action.payload};

    case Types.CREDITCARD_POINTS_EDIT_STATUS:
      return {...state, creditCardPointsEditStatus: action.payload};

    case Types.CREDITCARD_REWARDS_INDEX:
      return {...state, creditCardRewardsIndex: action.payload};

    case Types.CREDITCARD_VIEW_OFFSET:
      return {...state, creditCardViewOffset: action.payload};

    default:
      return state;
  }
};

export default creditCardReducer;

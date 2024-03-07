import * as Types from '../../Root.Types';

const initialState = {claimEditStatus: false, claimListStatus: false};

const claimReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.CLAIM_EDIT_STATUS:
      return {...state, claimEditStatus: action.payload};

    case Types.CLAIM_LIST_STATUS:
      return {...state, claimListStatus: action.payload};

    default:
      return state;
  }
};

export default claimReducer;

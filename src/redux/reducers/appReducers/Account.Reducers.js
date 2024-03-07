import * as Types from '../../Root.Types';

const initialState = {
  accountEditStatus: false,
  accountViewOffset: null,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.ACCOUNT_EDIT_STATUS:
      return {...state, accountEditStatus: action.payload};

    case Types.ACCOUNT_VIEW_OFFSET:
      return {...state, accountViewOffset: action.payload};

    default:
      return state;
  }
};

export default accountReducer;

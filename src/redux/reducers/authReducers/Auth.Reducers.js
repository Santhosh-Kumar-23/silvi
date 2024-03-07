import * as Types from '../../Root.Types';

const initialState = {userDetails: null};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.USER_DETAILS:
      return {...state, userDetails: action.payload};

    default:
      return state;
  }
};

export default authReducer;

import * as Types from '../../Root.Types';

const initialState = {
  fcmToken: null,
  loadingStatus: false,
  routingName: null,
};

const otherReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.FCM_TOKEN:
      return {...state, fcmToken: action.payload};

    case Types.LOADING_STATUS:
      return {...state, loadingStatus: action.payload};

    case Types.ROUTINGNAME:
      return {...state, routingName: action.payload};

    default:
      return state;
  }
};

export default otherReducer;

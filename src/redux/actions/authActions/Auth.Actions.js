import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestService from '../../../api/Service';
import * as Endpoints from '../../../api/Endpoints';
import * as Types from '../../Root.Types';

// Forgot Password Actions
export const forgotPassword = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.forgotPassword, requestData, response => {
      onResponse(response);
    });
  };
};

// OTP Actions
export const otpVerify = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.otpVerify, requestData, response => {
      onResponse(response);
    });
  };
};

export const resendOTP = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.resendOTP, requestData, response => {
      onResponse(response);
    });
  };
};

// Reset Password Actions
export const resetPassword = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.resetPassword, requestData, response => {
      onResponse(response);
    });
  };
};

// SignIn Actions
export const signIn = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.signIn, requestData, response => {
      onResponse(response);

      dispatch(storeUserDetails(response.resJson.data));
    });
  };
};

// SignUp Actions
export const signUp = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.signUp, requestData, response => {
      onResponse(response);
    });
  };
};

export const emailVerify = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(
      Endpoints.emailVerify,
      requestData,
      response => {
        onResponse(response);
      },
      false,
    );
  };
};

export const accountVerify = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.accountVerify, requestData, response => {
      onResponse(response);

      dispatch(storeUserDetails(response.resJson.data));
    });
  };
};

// Social SignIn Actions
export const socialSignIn = (requestData, onResponse) => {
  return dispatch => {
    RequestService.post(Endpoints.socialSignIn, requestData, response => {
      onResponse(response);

      dispatch(storeUserDetails(response.resJson.data));
    });
  };
};

// Splash Actions
export const fetchUser = (userId, onResponse) => {
  return dispatch => {
    RequestService.get(
      `${Endpoints.fetchUser}/${userId}`,
      null,
      async response => {
        onResponse(response);

        const token = await AsyncStorage.getItem('token');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        const userDetails = {
          tokens: {
            access: {expires: null, token: token},
            refresh: {expires: null, token: refreshToken},
          },
          user: response.resJson.data,
        };

        dispatch(storeUserDetails(userDetails));
      },
      false,
    );
  };
};

// User Details Actions
export const storeUserDetails = userData => {
  return {
    type: Types.USER_DETAILS,
    payload: userData,
  };
};

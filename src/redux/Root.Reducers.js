import {combineReducers} from 'redux';
import AuthReducer from './reducers/authReducers/Auth.Reducers';
import AccountReducer from './reducers/appReducers/Account.Reducers';
import BillingReducer from './reducers/appReducers/Billing.Reducers';
import ClaimReducer from './reducers/appReducers/Claims.Reducers';
import CreditCardReducer from './reducers/appReducers/CreditCard.Reducers';
import DashboardReducer from './reducers/appReducers/Dashboard.Reducers';
import OtherReducer from './reducers/otherReducers/Other.Reducers';
import * as Types from './Root.Types';

const appReducer = combineReducers({
  auth: AuthReducer,
  app: combineReducers({
    account: AccountReducer,
    billing: BillingReducer,
    claims: ClaimReducer,
    creditCard: CreditCardReducer,
    dashboard: DashboardReducer,
  }),
  other: OtherReducer,
});

const rootReducer = (state, action) => {
  Types.LOGOUT === action.type && [(state = undefined)];

  return appReducer(state, action);
};

export default rootReducer;

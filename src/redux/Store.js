import {createStore, compose, applyMiddleware} from 'redux';
import Labels from '../utils/Strings';
import logger from 'redux-logger';
import rootReducer from './Root.Reducers';
import thunk from 'redux-thunk';
import * as ENV from '../../env';

const enhancerList = [];
const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

let composedEnhancer;

if (typeof devToolsExtension === 'function') {
  enhancerList.push(devToolsExtension());
}

if (ENV.currentEnvironment == Labels.development) {
  composedEnhancer = compose(applyMiddleware(logger, thunk), ...enhancerList);
} else {
  composedEnhancer = compose(applyMiddleware(thunk), ...enhancerList);
}

export const initStore = () => createStore(rootReducer, {}, composedEnhancer);

const store = initStore();

export default store;

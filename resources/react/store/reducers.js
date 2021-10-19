import { combineReducers  } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import Layout from './layout/reducer';
import Breadcrumb from "./Breadcrumb/reducer";
import userState from './auth/reducer';

const persistConfig = {
    key: 'opcd',
    storage,
    whitelist: ['userState', 'layout']
}

const rootReducer = combineReducers({
    Layout,
    Breadcrumb,
    userState
});

export default persistReducer(persistConfig, rootReducer);
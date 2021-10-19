import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

import { CHECK_USER } from './constants';
import {  updateUser, deleteUser } from './actions';

import { CheckUser } from './api';
import { setAccessToken, setUserRole } from '../../helpers/authority';

function* checkUser() {
    try {
        const res = yield call(CheckUser);
        if(res && res.data.user){
            setAccessToken(res.data.token);
            setUserRole(res.data.user.role);
            yield put(updateUser({...res.data.user, access_token: res.data.token}));
        }else{
            yield put(deleteUser());
        }
    } catch (error) {
        yield put(deleteUser());
    }
}

export function* watchUserTest() {
    yield takeEvery(CHECK_USER, checkUser)
}

function* authSaga() {
    yield all([fork(watchUserTest)]);
}

export default authSaga;
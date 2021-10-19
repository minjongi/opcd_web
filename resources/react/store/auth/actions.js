import { 
    UPDATE_USER,
    DELETE_USER,
    CHECK_USER
} from './constants';

export const checkUser = () => {
    return {
        type: CHECK_USER
    }
}

export const updateUser = (payload) => {
    return {
        type: UPDATE_USER,
        payload
    }
}

export const deleteUser = () => {
    return {
        type: DELETE_USER
    }
}
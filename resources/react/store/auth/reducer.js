import { 
    UPDATE_USER,
    DELETE_USER
} from './constants';

const initialState = {};

const userState = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER:
            state = {
                ...state,
                ...action.payload
            }
            break;
        case DELETE_USER:
            state = {};
            break;
        default:
            break;
    }
    return state;
}

export default userState;
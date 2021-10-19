import {
    TOGGLE_MOBILE_MENU
} from './actionTypes';

const initialState={
    mobileMenuShow: false
}

const layout = (state=initialState,action) => {
    switch(action.type){
        case TOGGLE_MOBILE_MENU:
            return {
                mobileMenuShow: !state.mobileMenuShow
            };
        default:
            break;
    }
    return state;
}

export default layout;
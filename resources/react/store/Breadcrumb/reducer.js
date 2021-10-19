import {
    SET_BREADCRUMB_ITEMS
} from './actionTypes';

const initialState={
    title : "Dashboard",
    breadcrumbItems : [
        { title : "Home", link : "#" },
        { title : "dashboard", link : "#" },
        { title : "dashboard", link : "#" },
    ],
    toolbars: null
}

const layout = (state=initialState,action) => {
    switch(action.type){
        case SET_BREADCRUMB_ITEMS:
            return {
              ...state,
              title: action.payload.title,
              breadcrumbItems: action.payload.items,
              toolbars: action.payload.toolbars
            };

        default:
            state = {...state};
            break;
    }
    return state;
}

export default layout;
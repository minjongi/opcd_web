import {
    SET_BREADCRUMB_ITEMS
} from './actionTypes';

export const setBreadcrumbItems = (title, items, toolbars = null) => ({
    type: SET_BREADCRUMB_ITEMS,
    payload: {
        title : title,
        items : items,
        toolbars: toolbars
    }
});
// taken from https://medium.com/@DjamelH/ducks-redux-reducer-bundles-44267f080d22
import { combineReducers } from 'redux';
import * as info from './board/info';
import * as widgets from './board/widgets';
import * as comments from './github/comments';

export const rootReducer = combineReducers({
    [info.STORE_MOUNT_POINT]: info.reducer,
    [widgets.STORE_MOUNT_POINT]: widgets.reducer,
    [comments.STORE_MOUNT_POINT]: comments.reducer,
});

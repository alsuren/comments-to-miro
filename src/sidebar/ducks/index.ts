// taken from https://medium.com/@DjamelH/ducks-redux-reducer-bundles-44267f080d22
import { combineReducers } from 'redux';
import * as info from './board/info';

export const rootReducer = combineReducers({
    [info.STORE_MOUNT_POINT]: info.reducer,
});

import {createSelector} from 'reselect';


export const STORE_MOUNT_POINT = 'info';

const defaultState = {
    loading: false,
    err: null,
    info: null,
};

// Action Types
const GET_INFO_REQUEST = 'info/GET_INFO_REQUEST';
const GET_INFO_FAILURE = 'info/GET_INFO_FAILURE';
const GET_INFO_SUCCESS = 'info/GET_INFO_SUCCESS';

interface GetInfoRequestAction {
    readonly type: typeof GET_INFO_REQUEST;
}
interface GetInfoFailureAction {
    readonly type: typeof GET_INFO_FAILURE;
    readonly err: {};
}
interface GetInfoSuccessAction {
    readonly type: typeof GET_INFO_SUCCESS;
    readonly info: {};
}
type Action = GetInfoRequestAction | GetInfoFailureAction | GetInfoSuccessAction;
// Reducer
export function reducer(state = defaultState, action: Action) {
    switch (action.type) {
        case GET_INFO_REQUEST: {
            return {
                ...state,
                loading: true,
                err: null,
            };
        }
        case GET_INFO_FAILURE: {
            return {
                ...state,
                loading: false,
                err: action.err,
            };
        }
        case GET_INFO_SUCCESS: {
            return {
                ...state,
                loading: false,
                info: action.info,
            };
        }

        default: {
            return state;
        }
    }
}

// Action Creators

export function loadInfoRequest() {
    return { type: GET_INFO_REQUEST };
}

export function loadInfoFailure(err) {
    return {
        type: GET_INFO_FAILURE,
        err,
    };
}

export function loadInfoSuccess(info) {
    return {
        type: GET_INFO_SUCCESS,
        info,
    };
}

// Thunks

export const loadInfo = () => async dispatch =>  {
    try {
        let info = await rtb.board.info.get();
    } catch (err) {
        dispatch(loadInfoFailure(err))
    }
    dispatch(loadInfoSuccess);
}

// Selectors

export const selectTitle = createSelector(
    state => state[STORE_MOUNT_POINT].info.title,
    title => title
)

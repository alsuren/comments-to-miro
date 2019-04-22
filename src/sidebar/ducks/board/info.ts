import {createSelector} from 'reselect';


export const STORE_MOUNT_POINT = 'board/info';

const defaultState = {
    loading: false,
    err: null,
    info: null,
};

// Action Types
const GET_INFO_REQUEST = 'board/info/GET_INFO_REQUEST';
const GET_INFO_FAILURE = 'board/info/GET_INFO_FAILURE';
const GET_INFO_SUCCESS = 'board/info/GET_INFO_SUCCESS';

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

export function loadInfoRequest(): Action {
    return { type: GET_INFO_REQUEST };
}

export function loadInfoFailure(err: String): Action {
    return {
        type: GET_INFO_FAILURE,
        err,
    };
}

export function loadInfoSuccess(info): Action {
    return {
        type: GET_INFO_SUCCESS,
        info,
    };
}

// Thunks

export const loadInfo = () => async dispatch =>  {
    dispatch(loadInfoRequest());
    let info;
    try {
        info = await rtb.board.info.get();
    } catch (err) {
        dispatch(loadInfoFailure(err.toString()));
        throw err;
    }
    dispatch(loadInfoSuccess(info));
}

// Selectors

export const selectTitle = createSelector(
    state => state[STORE_MOUNT_POINT],
    here => {
        const title = here.info ? here.info.title : '';
        const loading = here.loading ? 'Loading...' : '';
        const err = here.err ? here.err : '';
        return title + loading + err;
    }
)

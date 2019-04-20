import {createSelector} from 'reselect';


export const STORE_MOUNT_POINT = 'github/comments';

const defaultState = {
    loading: false,
    err: null,
    info: null,
};

// Action Types
const GET_COMMENTS_REQUEST = 'github/comments/GET_COMMENTS_REQUEST';
const GET_COMMENTS_FAILURE = 'github/comments/GET_COMMENTS_FAILURE';
const GET_COMMENTS_SUCCESS = 'github/comments/GET_COMMENTS_SUCCESS';

interface GetCommentsRequestAction {
    readonly type: typeof GET_COMMENTS_REQUEST;
}
interface GetCommentsFailureAction {
    readonly type: typeof GET_COMMENTS_FAILURE;
    readonly err: {};
}
interface GetCommentsSuccessAction {
    readonly type: typeof GET_COMMENTS_SUCCESS;
    readonly info: {};
}
type Action = GetCommentsRequestAction | GetCommentsFailureAction | GetCommentsSuccessAction;
// Reducer
export function reducer(state = defaultState, action: Action) {
    switch (action.type) {
        case GET_COMMENTS_REQUEST: {
            return {
                ...state,
                loading: true,
                err: null,
            };
        }
        case GET_COMMENTS_FAILURE: {
            return {
                ...state,
                loading: false,
                err: action.err,
            };
        }
        case GET_COMMENTS_SUCCESS: {
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

export function loadCommentsRequest(): Action {
    return { type: GET_COMMENTS_REQUEST };
}

export function loadCommentsFailure(err): Action {
    return {
        type: GET_COMMENTS_FAILURE,
        err,
    };
}

export function loadCommentsSuccess(info): Action {
    return {
        type: GET_COMMENTS_SUCCESS,
        info,
    };
}

// Thunks

export const loadComments = () => async dispatch =>  {
    dispatch(loadCommentsRequest());
    let info;
    try {
        info = await rtb.board.info.get();
    } catch (err) {
        dispatch(loadCommentsFailure(err));
        throw err;
    }
    dispatch(loadCommentsSuccess(info));
}

// Selectors

export const selectTitle = createSelector(
    state => state[STORE_MOUNT_POINT],
    here => {
        const title = here.info ? here.info.title : '';
        const loading = here.loading ? 'Loading...' : '';
        const err = here.err ? here.err.toString() : '';
        return title + loading + err;
    }
)

import {createSelector} from 'reselect';


export const STORE_MOUNT_POINT = 'github/comments';

const defaultState = {
    loading: false,
    err: null,
    comments: null,
};

// Action Types
const GET_COMMENTS_REQUEST = 'github/comments/GET_COMMENTS_REQUEST';
const GET_COMMENTS_FAILURE = 'github/comments/GET_COMMENTS_FAILURE';
const GET_COMMENTS_SUCCESS = 'github/comments/GET_COMMENTS_SUCCESS';

interface GetCommentsRequestAction {
    readonly type: typeof GET_COMMENTS_REQUEST;
    readonly issue: String;
}
interface GetCommentsFailureAction {
    readonly type: typeof GET_COMMENTS_FAILURE;
    readonly err: {};
}
interface GetCommentsSuccessAction {
    readonly type: typeof GET_COMMENTS_SUCCESS;
    readonly comments: {};
}
type Action = GetCommentsRequestAction | GetCommentsFailureAction | GetCommentsSuccessAction;
// Reducer
export function reducer(state = defaultState, action: Action) {
    switch (action.type) {
        case GET_COMMENTS_REQUEST: {
            return {
                ...state,
                loading: action.issue,
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
                comments: action.comments,
            };
        }

        default: {
            return state;
        }
    }
}

// Action Creators

export function loadCommentsRequest(issue): Action {
    return {
        type: GET_COMMENTS_REQUEST,
        issue,
    };
}

export function loadCommentsFailure(err): Action {
    return {
        type: GET_COMMENTS_FAILURE,
        err,
    };
}

export function loadCommentsSuccess(comments): Action {
    return {
        type: GET_COMMENTS_SUCCESS,
        comments,
    };
}

// Thunks

export const loadComments = () => async dispatch =>  {
    // TODO: allow users to put this into a form somewhere.
    const issue = new URL('https://github.com/rust-lang/rfcs/pull/243')
    const [_slash, owner, repo, _pull, issue_number] = issue.pathname.split('/')
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`
    dispatch(loadCommentsRequest(issue));
    let comments;
    try {
        const response = await fetch(apiUrl);
        console.log(response.headers)
        comments = await response.json();
    } catch (err) {
        dispatch(loadCommentsFailure(err));
        throw err;
    }
    dispatch(loadCommentsSuccess(comments));
}

// Selectors

export const selectCommentCount = createSelector(
    state => state[STORE_MOUNT_POINT],
    here => {
        const comments = here.comments ? here.comments.length : '';
        const loading = here.loading ? 'Loading ' + here.loading : '';
        const err = here.err ? here.err.toString() : '';
        return comments + loading + err;
    }
)

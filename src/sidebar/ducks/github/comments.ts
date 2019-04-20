import {createSelector} from 'reselect';
import parseLinkHeader from 'parse-link-header';

export const STORE_MOUNT_POINT = 'github/comments';

const defaultState = {
    loading: false,
    err: null,
    comments: null,
};

// Action Types
const GET_COMMENTS_REQUEST = 'github/comments/GET_COMMENTS_REQUEST';
const GET_COMMENTS_FAILURE = 'github/comments/GET_COMMENTS_FAILURE';
const GET_COMMENTS_PROGRESS = 'github/comments/GET_COMMENTS_PROGRESS';
const GET_COMMENTS_SUCCESS = 'github/comments/GET_COMMENTS_SUCCESS';

interface GetCommentsRequestAction {
    readonly type: typeof GET_COMMENTS_REQUEST;
    readonly issue: String;
}
interface GetCommentsFailureAction {
    readonly type: typeof GET_COMMENTS_FAILURE;
    readonly err: {};
}
interface GetCommentsProgressAction {
    readonly type: typeof GET_COMMENTS_PROGRESS;
    readonly comments: Array<{}>;
}
interface GetCommentsSuccessAction {
    readonly type: typeof GET_COMMENTS_SUCCESS;
}
type Action = (
    GetCommentsRequestAction |
    GetCommentsFailureAction |
    GetCommentsProgressAction |
    GetCommentsSuccessAction);
// Reducer
export function reducer(state = defaultState, action: Action) {
    switch (action.type) {
        case GET_COMMENTS_REQUEST: {
            return {
                ...state,
                comments: null,
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
        case GET_COMMENTS_PROGRESS: {
            return {
                ...state,
                comments: [...(state.comments || []), ...action.comments],
            };
        }
        case GET_COMMENTS_SUCCESS: {
            return {
                ...state,
                loading: false,
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

export function loadCommentsProgress(comments): Action {
    return {
        type: GET_COMMENTS_PROGRESS,
        comments,
    };
}

export function loadCommentsSuccess(): Action {
    return {
        type: GET_COMMENTS_SUCCESS,
    };
}

// Thunks

export const loadComments = () => async dispatch =>  {
    // TODO: allow users to put this into a form somewhere.
    const issue = new URL('https://github.com/rust-lang/rfcs/pull/243')
    const [, owner, repo, , issue_number] = issue.pathname.split('/')
    let nextUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`
    dispatch(loadCommentsRequest(issue));
    let comments;
    try {
        while (nextUrl) {
            const response = await fetch(nextUrl);
            comments = await response.json();
            dispatch(loadCommentsProgress(comments));
            const linkHeader = response.headers.get('Link');
            const parsed = parseLinkHeader(linkHeader);
            nextUrl = parsed && parsed.next ? parsed.next.url : null;
        }
    } catch (err) {
        dispatch(loadCommentsFailure(err));
        throw err;
    }
    dispatch(loadCommentsSuccess());
}

// Selectors

export const selectCommentCount = createSelector(
    state => state[STORE_MOUNT_POINT],
    here => {
        const comments = here.comments ? here.comments.length : '';
        const loading = here.loading ? ' Loading ' + here.loading : '';
        const err = here.err ? here.err.toString() : '';
        return comments + loading + err;
    }
)

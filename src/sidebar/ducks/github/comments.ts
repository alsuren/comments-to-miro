import {createSelector} from 'reselect';
import parseLinkHeader from 'parse-link-header';

export const STORE_MOUNT_POINT = 'github/comments';


// Action Types

const GET_COMMENTS_REQUEST = 'github/comments/GET_COMMENTS_REQUEST';
const GET_COMMENTS_FAILURE = 'github/comments/GET_COMMENTS_FAILURE';
const GET_COMMENTS_PROGRESS = 'github/comments/GET_COMMENTS_PROGRESS';
const GET_COMMENTS_SUCCESS = 'github/comments/GET_COMMENTS_SUCCESS';
const RECORD_SYNCED_COMMENT = 'github/comments/RECORD_SYNCED_COMMENT';

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
interface RecordSyncedComment {
    readonly type: typeof RECORD_SYNCED_COMMENT;
}
type Action = (
    GetCommentsRequestAction |
    GetCommentsFailureAction |
    GetCommentsProgressAction |
    GetCommentsSuccessAction |
    RecordSyncedComment);

// Action Creators

export function loadCommentsRequest(issue): Action {
    return {
        type: GET_COMMENTS_REQUEST,
        issue,
    };
}

export function loadCommentsFailure(err: String): Action {
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

// TODO: actually care about which comment you just synced.
export function recordSyncedComment(): Action {
    return {
        type: RECORD_SYNCED_COMMENT,
    };
}

// Reducer

const defaultState = {
    loading: false,
    err: null,
    comments: null,
    nextUnsyncedCommentIndex: 0,
};

export function reducer(state = defaultState, action: Action) {
    switch (action.type) {
        case GET_COMMENTS_REQUEST: {
            return {
                ...state,
                comments: null,
                nextUnsyncedCommentIndex: 0,
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
        case RECORD_SYNCED_COMMENT: {
            return {
                ...state,
                nextUnsyncedCommentIndex: state.nextUnsyncedCommentIndex + 1,
            };
        }

        default: {
            return state;
        }
    }
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
        dispatch(loadCommentsFailure(err.toString()));
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

export const selectUnsyncedCommentCount = createSelector(
    state => state[STORE_MOUNT_POINT],
    here => here.comments
        ? here.comments.length - here.nextUnsyncedCommentIndex
        : ''
)

export const selectNextUnsyncedComment = createSelector(
    state => state[STORE_MOUNT_POINT],
    here => here.comments[here.nextUnsyncedCommentIndex]
)

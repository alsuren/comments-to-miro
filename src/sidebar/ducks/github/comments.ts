import keyBy from 'lodash/keyBy';

import {createSelector} from 'reselect';
import parseLinkHeader from 'parse-link-header';
export const STORE_MOUNT_POINT = 'github/comments';


// Action Types

const GET_COMMENTS_REQUEST = 'github/comments/GET_COMMENTS_REQUEST';
const GET_COMMENTS_FAILURE = 'github/comments/GET_COMMENTS_FAILURE';
const GET_COMMENTS_PROGRESS = 'github/comments/GET_COMMENTS_PROGRESS';
const GET_COMMENTS_SUCCESS = 'github/comments/GET_COMMENTS_SUCCESS';
const RESET_SYNCED_COMMENTS = 'github/comments/RESET_SYNCED_COMMENTS';
const RECORD_SYNCED_COMMENTS = 'github/comments/RECORD_SYNCED_COMMENTS';

interface GetCommentsRequestAction {
    readonly type: typeof GET_COMMENTS_REQUEST;
    readonly issue: string;
}
interface GetCommentsFailureAction {
    readonly type: typeof GET_COMMENTS_FAILURE;
    readonly err: string;
}
interface GetCommentsProgressAction {
    readonly type: typeof GET_COMMENTS_PROGRESS;
    readonly comments: Array<GithubComment>;
}
interface GetCommentsSuccessAction {
    readonly type: typeof GET_COMMENTS_SUCCESS;
}
interface ResetSyncedComments {
    readonly type: typeof RESET_SYNCED_COMMENTS;
}
interface RecordSyncedComments {
    readonly type: typeof RECORD_SYNCED_COMMENTS;
    readonly count: number;
}
type Action = (
    GetCommentsRequestAction |
    GetCommentsFailureAction |
    GetCommentsProgressAction |
    GetCommentsSuccessAction |
    ResetSyncedComments |
    RecordSyncedComments);

// Action Creators

export function loadCommentsRequest(issue): Action {
    return {
        type: GET_COMMENTS_REQUEST,
        issue,
    };
}

export function loadCommentsFailure(err: string): Action {
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

export function resetSyncedComments(): Action {
    return {
        type: RESET_SYNCED_COMMENTS,
    };
}
// TODO: actually care about which comment you just synced.
export function recordSyncedComments(count): Action {
    return {
        type: RECORD_SYNCED_COMMENTS,
        count,
    };
}

interface GithubComment {
    id: number;

    reactions: {
        "total_count": number,
        "+1": number,
        "-1": number,
        "laugh": number,
        "confused": number,
        "heart": number,
        "hooray": number,
        "url": string,
    }
}

// Reducer
interface StoreState {
    loading: string,
    err: string,
    // TODO: get rid of this field.
    commentsById: { [id: string]: GithubComment},
    unsyncedCommentIds: Array<number>,
}

const defaultState : StoreState = {
    loading: '',
    err: '',
    // TODO: get rid of this field.
    commentsById: {},
    unsyncedCommentIds: [],
};

export function reducer(state: StoreState = defaultState, action: Action): StoreState {
    switch (action.type) {
        case GET_COMMENTS_REQUEST: {
            return {
                ...state,
                commentsById: {},
                unsyncedCommentIds: [],
                loading: action.issue,
                err: '',
            };
        }
        case GET_COMMENTS_FAILURE: {
            return {
                ...state,
                loading: '',
                err: action.err,
            };
        }
        case GET_COMMENTS_PROGRESS: {
            return {
                ...state,
                commentsById: {
                    ...state.commentsById,
                    ...keyBy(action.comments, 'id'),
                },
                unsyncedCommentIds: [
                    ...state.unsyncedCommentIds,
                    ...action.comments.map(c => c.id)
                ],
            };
        }
        case GET_COMMENTS_SUCCESS: {
            return {
                ...state,
                loading: '',
            };
        }
        case RESET_SYNCED_COMMENTS: {
            return {
                ...state,
                unsyncedCommentIds: [],
            };
        }
        case RECORD_SYNCED_COMMENTS: {
            return {
                ...state,
                unsyncedCommentIds: state.unsyncedCommentIds.slice(action.count),
            };
        }

        default: {
            return state;
        }
    }
}

// Thunks
const FETCH_OPTIONS = {
    headers: {
        Accept: 'application/vnd.github.squirrel-girl-preview'
    }
}

export const loadComments = () => async dispatch =>  {
    // TODO: allow users to put this into a form somewhere.
    const issue = new URL('https://github.com/rust-lang/rust/pull/59119')
    const [, owner, repo, , issue_number] = issue.pathname.split('/')
    let nextUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`
    dispatch(loadCommentsRequest(issue));
    let comments;
    try {
        while (nextUrl) {
            const response = await fetch(nextUrl, FETCH_OPTIONS);
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
        const comments = Object.keys(here.commentsById).length || '';
        const loading = here.loading ? ' Loading ' + here.loading : '';
        const err = here.err ? here.err.toString() : '';
        return comments + loading + err;
    }
)


export const selectReactionCount = createSelector(
    state => state[STORE_MOUNT_POINT],
    (here: StoreState) => {
        return Object.values(here.commentsById).map(
            (c: GithubComment) => (c.reactions || {}).total_count,
        ).reduce(
            (a, b) => a + b,
            0,
        )
    }
)

export const selectUnsyncedCommentCount = createSelector(
    state => state[STORE_MOUNT_POINT],
    (here: StoreState) => here.unsyncedCommentIds.length
)

export const selectNextUnsyncedComments = createSelector(
    [
        (state) => state[STORE_MOUNT_POINT],
        (_, {count}) => count,
    ],
    (here: StoreState, count: number) => {
        const ids = here.unsyncedCommentIds.slice(0, count);
        return ids.map(id => here.commentsById[id]);
    }
)

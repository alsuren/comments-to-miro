import keyBy from 'lodash/keyBy';

import {createSelector} from 'reselect';
import parseLinkHeader from 'parse-link-header';
import { userInfo } from 'os';
export const STORE_MOUNT_POINT = 'github/comments';


// Action Types



const LOAD_COMMENTS_REQUEST = 'github/comments/LOAD_COMMENTS_REQUEST';
interface LoadCommentsRequestAction {
    readonly type: typeof LOAD_COMMENTS_REQUEST;
    readonly issue: string;
}
const LOAD_COMMENTS_FAILURE = 'github/comments/LOAD_COMMENTS_FAILURE';
interface LoadCommentsFailureAction {
    readonly type: typeof LOAD_COMMENTS_FAILURE;
    readonly err: string;
}
const LOAD_COMMENTS_PROGRESS = 'github/comments/LOAD_COMMENTS_PROGRESS';
interface LoadCommentsProgressAction {
    readonly type: typeof LOAD_COMMENTS_PROGRESS;
    readonly comments: Array<GithubComment>;
}
const LOAD_COMMENTS_SUCCESS = 'github/comments/LOAD_COMMENTS_SUCCESS';
interface LoadCommentsSuccessAction {
    readonly type: typeof LOAD_COMMENTS_SUCCESS;
}


const LOAD_REACTIONS_REQUEST = 'github/comments/LOAD_REACTIONS_REQUEST';
interface LoadReactionsRequestAction {
    readonly type: typeof LOAD_REACTIONS_REQUEST;
}
const LOAD_REACTIONS_FAILURE = 'github/comments/LOAD_REACTIONS_FAILURE';
interface LoadReactionsFailureAction {
    readonly type: typeof LOAD_REACTIONS_FAILURE;
    readonly err: string;
}
const LOAD_REACTIONS_PROGRESS = 'github/comments/LOAD_REACTIONS_PROGRESS';
interface LoadReactionsProgressAction {
    readonly type: typeof LOAD_REACTIONS_PROGRESS;
    readonly commentId: number;
    readonly reactions: Array<Reaction>;
}
const LOAD_REACTIONS_SUCCESS = 'github/comments/LOAD_REACTIONS_SUCCESS';
interface LoadReactionsSuccessAction {
    readonly type: typeof LOAD_REACTIONS_SUCCESS;
}


const RESET_SYNCED_COMMENTS = 'github/comments/RESET_SYNCED_COMMENTS';
interface ResetSyncedComments {
    readonly type: typeof RESET_SYNCED_COMMENTS;
}
const RECORD_SYNCED_COMMENTS = 'github/comments/RECORD_SYNCED_COMMENTS';
interface RecordSyncedComments {
    readonly type: typeof RECORD_SYNCED_COMMENTS;
    readonly count: number;
}

type Action = (
    LoadCommentsRequestAction |
    LoadCommentsFailureAction |
    LoadCommentsProgressAction |
    LoadCommentsSuccessAction |
    LoadReactionsRequestAction |
    LoadReactionsFailureAction |
    LoadReactionsProgressAction |
    LoadReactionsSuccessAction |
    ResetSyncedComments |
    RecordSyncedComments);

// Action Creators

export function loadCommentsRequest(issue): Action {
    return {
        type: LOAD_COMMENTS_REQUEST,
        issue,
    };
}

export function loadCommentsFailure(err: string): Action {
    return {
        type: LOAD_COMMENTS_FAILURE,
        err,
    };
}

export function loadCommentsProgress(comments): Action {
    return {
        type: LOAD_COMMENTS_PROGRESS,
        comments,
    };
}

export function loadCommentsSuccess(): Action {
    return {
        type: LOAD_COMMENTS_SUCCESS,
    };
}

export function loadReactionsRequest(): Action {
    return {
        type: LOAD_REACTIONS_REQUEST,
    };
}

export function loadReactionsFailure(err: string): Action {
    return {
        type: LOAD_REACTIONS_FAILURE,
        err,
    };
}

export function loadReactionsProgress(commentId, reactions): Action {
    return {
        type: LOAD_REACTIONS_PROGRESS,
        commentId,
        reactions,
    };
}

export function loadReactionsSuccess(): Action {
    return {
        type: LOAD_REACTIONS_SUCCESS,
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

interface User {
    login: string
    type: "User"
}

interface Reaction {
    id: number,
    user: User
    content: "+1" | "-1" | "laugh" | "confused" | "heart" | "hooray",
}

interface GithubComment {
    id: number;
    user: User

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
    commentsById: { [id: string]: GithubComment},
    unsyncedCommentIds: Array<number>,
    // TODO: add specific interface for reaction here.
    reactionsByCommentId: {[id: string]: Array<Reaction>},
}

const defaultState : StoreState = {
    loading: '',
    err: '',
    // TODO: get rid of this field.
    commentsById: {},
    unsyncedCommentIds: [],
    reactionsByCommentId: {},
};

export function reducer(state: StoreState = defaultState, action: Action): StoreState {
    switch (action.type) {
        case LOAD_COMMENTS_REQUEST: {
            return {
                ...state,
                commentsById: {},
                unsyncedCommentIds: [],
                loading: action.issue,
                err: '',
            };
        }
        case LOAD_COMMENTS_FAILURE: {
            return {
                ...state,
                loading: '',
                err: action.err,
            };
        }
        case LOAD_COMMENTS_PROGRESS: {
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
        case LOAD_COMMENTS_SUCCESS: {
            return {
                ...state,
                loading: '',
            };
        }
        case LOAD_REACTIONS_REQUEST: {
            return {
                ...state,
                loading: 'Reactions',
                err: '',
            };
        }
        case LOAD_REACTIONS_FAILURE: {
            return {
                ...state,
                loading: '',
                err: action.err,
            };
        }
        case LOAD_REACTIONS_PROGRESS: {
            return {
                ...state,
                reactionsByCommentId: {
                    ...state.reactionsByCommentId,
                    [action.commentId]:
                        [
                            ...(state.reactionsByCommentId[action.commentId] || []),
                            ...action.reactions,
                        ]
                },
            };
        }
        case LOAD_REACTIONS_SUCCESS: {
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

const  fetchPages = async (url: string, pageCallback: Function) => {
    let nextUrl = url;
    while (nextUrl) {
        const response = await fetch(nextUrl, FETCH_OPTIONS);
        let page = await response.json();
        pageCallback(page);
        const linkHeader = response.headers.get('Link');
        const parsed = parseLinkHeader(linkHeader);
        nextUrl = parsed && parsed.next ? parsed.next.url : null;
    }
}

export const loadComments = () => async dispatch =>  {
    // TODO: allow users to put this into a form somewhere.
    const issue = new URL('https://github.com/rust-lang/rust/pull/59119')
    const [, owner, repo, , issue_number] = issue.pathname.split('/')
    let url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`
    dispatch(loadCommentsRequest(issue));
    try {
        await fetchPages(
            url,
            (comments) => dispatch(loadCommentsProgress(comments))
        );
    } catch (err) {
        dispatch(loadCommentsFailure(err.toString()));
        throw err;
    }
    dispatch(loadCommentsSuccess());
}

const loadReactionsForComment = (
    {id, reactions: {url}}: GithubComment
) => async (dispatch) =>  {
    await fetchPages(
        url,
        (comments) => dispatch(loadReactionsProgress(id, comments))
    );
}

export const loadReactions = () => async (dispatch, getState) =>  {
    dispatch(loadReactionsRequest());
    try {
        for (const comment of selectCommentsWithUnsyncedReactions(getState())) {
            await dispatch(loadReactionsForComment(comment));
        }   
    } catch (err) {
        dispatch(loadReactionsFailure(err.toString()));
        throw err;
    }
    dispatch(loadReactionsSuccess());
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

export const selectComment = createSelector(
    [
        (state) => state[STORE_MOUNT_POINT],
        (_, {id}) => id,
    ],
    (here: StoreState, id: number) => here.commentsById[id]
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

const selectCommentsWithUnsyncedReactions = createSelector(
    state => state[STORE_MOUNT_POINT],
    (here: StoreState): Array<GithubComment> => {
        return Object.values(here.commentsById).filter(
            (c: GithubComment) => (
                c.reactions.total_count != (
                    here.reactionsByCommentId[c.id] || []
                ).length
            )
        )
    }
)

export const selectCommentCountWithUnsyncedReactions = createSelector(
    state => selectCommentsWithUnsyncedReactions(state),
    comments => comments.length,
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

export const selectUserConnectionMatrix = createSelector(
    (state) => state[STORE_MOUNT_POINT],
    (here: StoreState) => {
        let connectionMatrix : {
            [user: string]: {[user: string]: number}
        } = {};
        for (const commentId in here.reactionsByCommentId) {
            const comment = here.commentsById[commentId];
            let commentAuthorRow = connectionMatrix[comment.user.login] || {};
            for (const reaction of here.reactionsByCommentId[commentId]) {
                commentAuthorRow[reaction.user.login] = (
                    commentAuthorRow[reaction.user.login] || 0
                ) + 1;
            }
            connectionMatrix[comment.user.login] = commentAuthorRow;
        }
    }

)

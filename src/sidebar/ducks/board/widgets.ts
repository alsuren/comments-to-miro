import {createSelector} from 'reselect';


export const STORE_MOUNT_POINT = 'board/widgets';

// Action Types
const CREATE_STICKERS_REQUEST = 'board/widgets/CREATE_STICKERS_REQUEST';
const CREATE_STICKERS_FAILURE = 'board/widgets/CREATE_STICKERS_FAILURE';
const CREATE_STICKERS_SUCCESS = 'board/widgets/CREATE_STICKERS_SUCCESS';

interface CreateStickersRequestAction {
    readonly type: typeof CREATE_STICKERS_REQUEST;
    readonly stickersToCreate: Array<{}>;
}
interface CreateStickersFailureAction {
    readonly type: typeof CREATE_STICKERS_FAILURE;
    readonly err: {};
}
interface CreateStickersSuccessAction {
    readonly type: typeof CREATE_STICKERS_SUCCESS;
    readonly widgets: Array<{}>;
}
type Action = CreateStickersRequestAction | CreateStickersFailureAction | CreateStickersSuccessAction;

// Action Creators

export function createStickersRequest(stickersToCreate: Array<{}>): Action {
    return {
        type: CREATE_STICKERS_REQUEST,
        stickersToCreate,
    };
}

export function createStickersFailure(err: String): Action {
    return {
        type: CREATE_STICKERS_FAILURE,
        err,
    };
}

export function createStickersSuccess(widgets): Action {
    return {
        type: CREATE_STICKERS_SUCCESS,
        widgets,
    };
}

// Reducer

const defaultState = {
    loading: false,
    err: null,
    info: null,
};

export function reducer(state = defaultState, action: Action) {
    switch (action.type) {
        case CREATE_STICKERS_REQUEST: {
            return {
                ...state,
                stickersToCreate: action.stickersToCreate,
                err: null,
            };
        }
        case CREATE_STICKERS_FAILURE: {
            return {
                ...state,
                stickersToCreate: null,
                err: action.err,
            };
        }
        case CREATE_STICKERS_SUCCESS: {
            return {
                ...state,
                stickersToCreate: null,
                widgets: action.widgets,
            };
        }

        default: {
            return state;
        }
    }
}

// Thunks
const SCALE = 100

export const createStickers = (comments) => async dispatch =>  {
    dispatch(createStickersRequest(comments));
    let widgets: SDK.IBaseWidget[];
    try {
        const translated = comments.map(comment => ({
            type: 'STICKER',
            text: comment.body,
            x: SCALE * (comment.reactions['+1']),
            y: SCALE * (comment.reactions.total_count - comment.reactions['+1']),
        }))
        widgets = await rtb.board.widgets.create(translated);
    } catch (err) {
        dispatch(createStickersFailure(err.toString()));
        throw err;
    }
    dispatch(createStickersSuccess(widgets));
}

// Selectors

export const selectProgress = createSelector(
    state => state[STORE_MOUNT_POINT],
    here => {
        const added = here.widgets
            ? `Added ${here.widgets.length} stickers.`
            : '';
        const loading = here.stickersToCreate
            ? `Adding ${here.stickersToCreate.length} stickers...`
            : '';
        const err = here.err ? here.err : '';
        return added + loading + err;
    }
)

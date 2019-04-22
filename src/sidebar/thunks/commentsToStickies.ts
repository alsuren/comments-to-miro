import {createStickers} from "../ducks/board/widgets"
import {selectNextUnsyncedComments, recordSyncedComments} from "../ducks/github/comments"

export const _syncCommentsToSticky = (count) => async (dispatch, getState) =>  {
    const comments = selectNextUnsyncedComments(getState(), {count})
    await dispatch(createStickers(comments));
    dispatch(recordSyncedComments(comments.length))
    return !!comments.length
}

export const syncCommentsToSticky = (count) => async (dispatch, getState) =>  {
    let progress = true;
    while (progress) {
        progress = await dispatch(_syncCommentsToSticky(count))
    }
}

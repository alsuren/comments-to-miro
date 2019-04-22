import {createStickers} from "../ducks/board/widgets"
import {selectNextUnsyncedComments, recordSyncedComments} from "../ducks/github/comments"

export const syncCommentsToSticky = (count) => async (dispatch, getState) =>  {
    const comments = selectNextUnsyncedComments(getState(), {count})
    await dispatch(createStickers(comments));
    dispatch(recordSyncedComments(comments.length))
}

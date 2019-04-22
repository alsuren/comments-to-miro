import {createStickers} from "../ducks/board/widgets"
import {selectNextUnsyncedComment, recordSyncedComment} from "../ducks/github/comments"

export const syncCommentToSticky = () => async (dispatch, getState) =>  {
    const next = {
        text: selectNextUnsyncedComment(getState()).body
    }
    await dispatch(createStickers([next]));
    dispatch(recordSyncedComment)
}

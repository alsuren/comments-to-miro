require('./styles.less')
import * as React from 'react'
import { connect } from 'react-redux';
import { loadInfo, selectTitle } from './ducks/board/info';
import { selectProgress } from './ducks/board/widgets';
import {
	loadComments, selectCommentCount, selectReactionCount,
	selectUnsyncedCommentCount, resetSyncedComments
} from './ducks/github/comments';
import { syncCommentsToSticky } from './thunks/commentsToStickies';

export const Sidebar = ({
	title, loadInfo, commentCount, unsyncedCommentCount, loadComments, syncCommentsToSticky,
	progress, resetSyncedComments, reactionCount,
}) => {
	return (
		<div className="container">
			<button onClick={loadInfo}>Get board title</button>
			<br />
			<div>Board title is: {title}</div>
			<br />
			<br />
			<button onClick={loadComments}>Get comments</button>
			<br />
			<div>Number of comments: {commentCount}</div>
			<br />
			<div>Number of reactions: {reactionCount}</div>
			<br />
			<button onClick={() => syncCommentsToSticky(10)}>Sync Comment to Sticky</button>
			<button onClick={resetSyncedComments}>Start again</button>
			<br />
			<div>Number of comments remaining: {unsyncedCommentCount} ({progress})</div>
		</div>
	)
}

export function mapStateToProps(state) {
	return {
		title: selectTitle(state),
		commentCount: selectCommentCount(state),
		reactionCount: selectReactionCount(state),
		unsyncedCommentCount: selectUnsyncedCommentCount(state),
		progress: selectProgress(state),
	};
}

export default connect(
	mapStateToProps,
	{
		loadInfo,
		loadComments,
		syncCommentsToSticky,
		resetSyncedComments,
	}
)(Sidebar);

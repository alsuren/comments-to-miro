require('./styles.less')
import * as React from 'react'
import { connect } from 'react-redux';
import { loadInfo, selectTitle } from './ducks/board/info';
import { selectProgress } from './ducks/board/widgets';
import {
	loadComments, selectCommentCount, selectReactionCount,
	selectUnsyncedCommentCount, resetSyncedComments,
	selectCommentCountWithUnsyncedReactions, loadReactions,
} from './ducks/github/comments';
import { syncCommentsToSticky } from './thunks/commentsToStickies';

export const Sidebar = ({
	title, loadInfo, commentCount, unsyncedCommentCount, loadComments, syncCommentsToSticky,
	progress, resetSyncedComments, reactionCount, commentCountWithUnsyncedReactions, loadReactions,
}) => {
	return (
		<div className="container">
			<button onClick={loadInfo}>Get board title</button>
			<br />
			<div>Board title is: {title}</div>
			<br />
			<br />
			<button onClick={loadComments}>Load comments</button>
			<br />
			<div>Number of comments: {commentCount}</div>
			<br />
			<div>Number of reactions: {reactionCount}</div>
			<br />
			<div>Number of comments to sync reactions for: {commentCountWithUnsyncedReactions}</div>
			<br />
			<button onClick={loadReactions}>Load reactions</button>
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
		commentCountWithUnsyncedReactions: selectCommentCountWithUnsyncedReactions(state),
		unsyncedCommentCount: selectUnsyncedCommentCount(state),
		progress: selectProgress(state),
	};
}

export default connect(
	mapStateToProps,
	{
		loadInfo,
		loadComments,
		loadReactions,
		syncCommentsToSticky,
		resetSyncedComments,
	}
)(Sidebar);

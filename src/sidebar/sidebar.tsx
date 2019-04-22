require('./styles.less')
import * as React from 'react'
import { connect } from 'react-redux';
import { loadInfo, selectTitle } from './ducks/board/info';
import { selectProgress } from './ducks/board/widgets';
import { loadComments, selectCommentCount, selectUnsyncedCommentCount } from './ducks/github/comments';
import { syncCommentToSticky } from './thunks/commentsToStickies';

export const Sidebar = ({
	title, loadInfo, commentCount, unsyncedCommentCount, loadComments, syncCommentToSticky,
	progress,
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
			<button onClick={syncCommentToSticky}>Sync Comment to Sticky</button>
			<br />
			<div>Number of comments remaining: {unsyncedCommentCount} ({progress})</div>
		</div>
	)
}

export function mapStateToProps(state) {
	return {
		title: selectTitle(state),
		commentCount: selectCommentCount(state),
		unsyncedCommentCount: selectUnsyncedCommentCount(state),
		progress: selectProgress(state),
	};
}

export default connect(
	mapStateToProps,
	{
		loadInfo,
		loadComments,
		syncCommentToSticky,
	}
)(Sidebar);

require('./styles.less')
import * as React from 'react'
import { connect } from 'react-redux';
import { loadInfo, selectTitle } from './ducks/board/info';
import { loadComments, selectCommentCount } from './ducks/github/comments';

export const Sidebar = ({title, loadInfo, commentCount, loadComments}) => {
	return (
		<div className="container">
			<button onClick={loadInfo}>Get board title</button>
			<br />
			<div>Board title is: {title}</div>
			<br />
			<br />
			<button onClick={loadComments}>Get comments</button>
			<br />
			<div>Number of comments: {commentCount}</div>		</div>
	)
}

export function mapStateToProps(state) {
	return {
		title: selectTitle(state),
		commentCount: selectCommentCount(state),
	};
}

export default connect(
	mapStateToProps,
	{
		loadInfo,
		loadComments,
	}
)(Sidebar);

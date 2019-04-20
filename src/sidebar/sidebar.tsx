require('./styles.less')
import * as React from 'react'
import { connect } from 'react-redux';
import { loadInfo, selectTitle } from './ducks/board/info';

export const Sidebar = ({title, loadInfo}) => {
	return (
		<div className="container">
			<button onClick={loadInfo}>Get board title</button>
			<br />
			<div>Board title is: {title}</div>
			<br />
			<br />
			<button onClick={() => this.deleteAllContent()}>Delete all content</button>
		</div>
	)
}

export function mapStateToProps(state) {
	return {
		title: selectTitle(state),
	};
}

export default connect(
	mapStateToProps,
	{
		loadInfo,
	}
)(Sidebar);

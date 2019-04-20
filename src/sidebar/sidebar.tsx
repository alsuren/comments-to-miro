require('./styles.less')
import * as React from 'react'
import { connect } from 'react-redux';
import { loadInfo, selectTitle } from './ducks/board/info';

// async deleteAllContent() {
// 	let allObjects = await rtb.board.widgets.get()
// 	await rtb.board.widgets.deleteById(allObjects.map(object => object.id))
// 	await rtb.showNotification('Content has been deleted')
// }


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
  
  export function mapDispatchToProps(dispatch) {
	return {
	  loadInfo: () => dispatch(loadInfo()),
	};
  }

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

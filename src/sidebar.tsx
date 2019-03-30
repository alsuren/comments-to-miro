require('./styles.less')
import * as React from 'react'
import * as ReactDOM from 'react-dom'

export class Root extends React.Component {

	state = {
		boardTitle: ''
	}

	async getBoardTitle() {
		let boardInfo = await rtb.board.info.get()
		this.setState({boardTitle: boardInfo.title})
	}

	async deleteAllContent() {
		let allObjects = await rtb.board.widgets.get()
		await rtb.board.widgets.deleteById(allObjects.map(object => object.id))
		await rtb.showNotification('Content has been deleted')
	}

	render() {
		return (
			<div className="container">
				<button onClick={() => this.getBoardTitle()}>Get board title</button>
				<br/>
				<div>Board title is: {this.state.boardTitle}</div>
				<br/>
				<br/>
				<button onClick={() => this.deleteAllContent()}>Delete all content</button>
			</div>
		)
	}
}


let el = document.getElementById('react-app');
if (el) {
	ReactDOM.render(
		<Root/>,
		el
	)
}

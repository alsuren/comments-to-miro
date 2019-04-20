require('./styles.less')
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Sidebar } from './sidebar';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './ducks/index';

const store = createStore(rootReducer, applyMiddleware(thunk));

let el = document.getElementById('react-app');
if (el) {
	ReactDOM.render(
		<Provider store={store}>
			<Sidebar />
		</Provider>,
		el
	)
}

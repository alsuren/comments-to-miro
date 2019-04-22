require('./styles.less')
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Sidebar from './sidebar';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage'
import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from './ducks/index';

// @ts-ignore
const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	// @ts-ignore
	? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
		name: "Import Comments",
	})
	: compose);

const store = createStore(
	rootReducer,
	composeEnhancers(
		applyMiddleware(thunk),
		persistState()
	),
);

let el = document.getElementById('react-app');
if (el) {
	ReactDOM.render(
		<Provider store={store}>
			<Sidebar />
		</Provider>,
		el
	)
}

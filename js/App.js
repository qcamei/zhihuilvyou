'use strict';
import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

let store;

import Root from './root';
import * as WS from './Net/webSocket'


export default class App extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			isLoading: true,
			store: configureStore(() => { this.setState({ isLoading: false }) })
		}
	}
	render()
	{
		
		if (this.state.isLoading)
		{
			return null;
		}
		else
		{
			WS.setStore(this.state.store);
			this.props;
		}
		return (
			<Provider store={this.state.store}>
				<Root />
			</Provider>
		)
	}
}


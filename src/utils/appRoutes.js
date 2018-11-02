import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import axios from 'axios';

import CommonReducer from './CommonReducer';

import Base from './Base';

export default class AppRoutes extends React.Component {
    constructor() {
        super();
        this.store = createStore(CommonReducer);
    }

    componentWillMount() {
        // var current = window.location.href

        // if(current.includes('patients') || current.includes('graphs')) {

        // }
        // else {
        //     browserHistory.push('/login')
        // }

    }

    render() {
        return (
            <Provider store={this.store}>
               <Base />
            </Provider >
        );
    }
}
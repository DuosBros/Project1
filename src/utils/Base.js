import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { Grid } from 'semantic-ui-react'

import Header from './Header';
import Login from '../pages/Login/Login';
import Orders from '../pages/Orders/Orders';

import { authenticateAction, authenticationStartedAction, authenticateEndedAction, authenticateOKAction, authenticationFailedAction } from './actions';
import { LOCALSTORAGE_NAME } from '../appConfig'

class Base extends React.Component {

    constructor(props) {
        super(props)

        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem(LOCALSTORAGE_NAME) ? localStorage.getItem(LOCALSTORAGE_NAME) : '';
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/:entityType?/:entityId?" component={Header} />
                    <div id="bodyWrapper">
                        <Switch>
                            <Redirect exact from='/' to='/orders' />
                            <Route exact path='/login' component={Login} />
                            <Route exact path='/orders' component={Orders} />
                            {/* both /roster and /roster/:number begin with /roster */}
                            {/* <Route path='/roster' component={Roster}/>
        <Route path='/schedule' component={Schedule}/> */}
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

function mapStateToProps(state) {
    return {
        baseStore: state.BaseReducer,
        loginPageStore: state.LoginReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        authenticateAction: authenticateAction,
        authenticationStartedAction: authenticationStartedAction,
        authenticateEndedAction: authenticateEndedAction,
        authenticateOKAction: authenticateOKAction,
        authenticationFailedAction: authenticationFailedAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Base);
import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import {Grid} from 'semantic-ui-react'

import Header from './Header';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';

import { authenticateAction, authenticationStartedAction, authenticateEndedAction, authenticateOKAction, authenticationFailedAction } from './actions';
import {localStorageName} from '../appConfig'

class Base extends React.Component {

    constructor(props) {
        super(props)

        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem(localStorageName) ? localStorage.getItem(localStorageName) : '';
        
        
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/:entityType?/:entityId?" component={Header} />
                    <Grid container>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route exact path='/login' component={Login} />
                            {/* both /roster and /roster/:number begin with /roster */}
                            {/* <Route path='/roster' component={Roster}/>
        <Route path='/schedule' component={Schedule}/> */}
                        </Switch>
                    </Grid>
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
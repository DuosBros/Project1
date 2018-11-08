import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { Container } from 'semantic-ui-react'

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

        window.addEventListener('resize', this.handleWindowSizeChange);

        this.state = {
            width: window.innerWidth
        }
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    render() {

        const { width } = this.state;
        const isMobile = width <= 766;

        var body;

        if (isMobile) {
            body = (
                <Container style={{ paddingTop: '0.5em' }}>
                    <Switch>
                        <Redirect exact from='/' to='/orders' />
                        <Route
                            path='/login'
                            render={(props) => <Login {...props} isMobile={isMobile} />}
                        />
                        <Route exact path='/orders' render={(props) => <Orders {...props} isMobile={isMobile} />} />
                    </Switch>
                </Container>
            )
        }
        else {
            body = (
                <div style={{ paddingTop: '2em', marginLeft:'1em', marginRight:'1em' }}>
                    <Switch>
                        <Redirect exact from='/' to='/orders' />
                        <Route
                            path='/login'
                            render={(props) => <Login {...props} isMobile={isMobile} />}
                        />
                        <Route exact path='/orders' render={(props) => <Orders {...props} isMobile={isMobile} />} />
                    </Switch>
                </div>
            )
        }
        return (
            <BrowserRouter>
                <div>
                    <Route
                        path='/:entityType?/:entityId?'
                        render={(props) => <Header {...props} isMobile={isMobile} />}
                    />
                    {body}
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
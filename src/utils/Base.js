import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Header from './Header';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';

export default class Base extends React.Component {
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
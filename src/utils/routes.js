import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Layout from './Layout';
import Header from './Header';

const routes = (
    <Switch>
        <Route exact path='/' component={Layout}/>
        <Route exact path='/test' component={Header}/>
        {/* both /roster and /roster/:number begin with /roster */}
        {/* <Route path='/roster' component={Roster}/>
        <Route path='/schedule' component={Schedule}/> */}
    </Switch>
);

export default routes;
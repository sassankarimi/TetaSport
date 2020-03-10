import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom"
import { IndexLayout } from './layouts/indexLayout';
import { Home } from './components/Home';
import NotFound from './components/NotFound';
import { NotFoundLayout } from './layouts/notFoundLayoutjs';


const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout>
            <Component {...props} />
        </Layout>
    )} />
)

export default class TetaSportApp extends Component {
    static displayName = TetaSportApp.name;

    render() {
        return (
            <Switch>
                <AppRoute exact path="/" layout={IndexLayout} component={Home} />
                <AppRoute layout={NotFoundLayout} component={NotFound} />
            </Switch>
        );
    }
}

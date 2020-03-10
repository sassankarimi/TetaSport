import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom"
import NotFound from './components/NotFound';
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import { CreateTeam } from './components/user/createTeam/CreateTeam';
import { CreateTeamLayout } from './layouts/createTeamLayout';
import { NewTeam } from './components/user/createTeam/NewTeam';
import { NewTeamLayout } from './layouts/newTeamLayout';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout {...props} >
            <Component {...props} />
        </Layout>
    )} />
)

export default class CreateNewTeam extends Component {
    static displayName = CreateNewTeam.name;

    render() {
        return (
            <Switch>
                <AppRoute exact path="/createTeam" layout={CreateTeamLayout} component={CreateTeam} />
                <AppRoute exact path="/newTeam" layout={NewTeamLayout} component={NewTeam} />
                <AppRoute layout={NotFoundLayout} component={NotFound} />
            </Switch>
        );
    }
}

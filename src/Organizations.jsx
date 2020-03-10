import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom"
import NotFound from './components/NotFound';
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import { SortOrganizationLayout } from './layouts/sortOrganizationLayout';
import { SortOrganizations } from './components/user/organizations/SortOrganizations';


const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout {...props} >
            <Component {...props} />
        </Layout>
    )} />
)

export default class Organizations extends Component {
    static displayName = Organizations.name;

    render() {
        return (
            <Switch>
                <AppRoute exact path={`/organizations/:id1/`} component={SortOrganizations} layout={SortOrganizationLayout} />
                <AppRoute exact path="/organizations" component={SortOrganizations} layout={SortOrganizationLayout} />
                <AppRoute layout={NotFoundLayout} component={NotFound} />
            </Switch>
        );
    }
}

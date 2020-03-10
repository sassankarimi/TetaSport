import React, { Component, Fragment } from 'react';
import { Route, Switch } from "react-router-dom"
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import NotFound from './components/NotFound';
import { LeagueaPackagesLayout } from './layouts/leaguePackagesLayout';
import { LeaguePackagePanel } from './components/user/LeaguePackages/LeaguePackagePanel';

// متغییر های سراسری
const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout {...props}>
            <Component {...props} />
        </Layout>
    )} />
)

export default class LeaguePackages extends Component {
    static displayName = LeaguePackages.name;

    render() {
        return (
            <Fragment>
                <Switch>
                    <AppRoute exact path={`/leaguePackages`} layout={LeagueaPackagesLayout} component={LeaguePackagePanel} />
                    <AppRoute layout={NotFoundLayout} component={NotFound} />
                </Switch>
            </Fragment>
        );
    }
}

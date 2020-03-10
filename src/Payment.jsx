import React, { Component, Fragment } from 'react';
import { Route, Switch } from "react-router-dom"
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import NotFound from './components/NotFound';
import { PaymentLayout } from './layouts/paymentLayout';
import { PaymentLeaguePackage } from './components/user/payment/PaymentLeaguePackage';

// متغییر های سراسری
const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout {...props}>
            <Component {...props} />
        </Layout>
    )} />
)

export default class Payment extends Component {
    static displayName = Payment.name;

    render() {
        return (
            <Fragment>
                <Switch>
                    <AppRoute exact path={`/payment/:payID`} layout={PaymentLayout} component={PaymentLeaguePackage} />
                    <AppRoute layout={NotFoundLayout} component={NotFound} />
                </Switch>
            </Fragment>
        );
    }
}

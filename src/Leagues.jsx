import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom"
import NotFound from './components/NotFound';
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import { SortLeagueLayout } from './layouts/sortLeagueLayout';
import { SortLeagues } from './components/user/leagues/SortLeagues';


const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout {...props} >
            <Component {...props} />
        </Layout>
    )} />
)

export default class Leagues extends Component {
    static displayName = Leagues.name;

    render() {
        return (
            <Switch>
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/:id4/:id5/:id6/:id7/:id8/:id9/:id10/:id11/:id12/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/:id4/:id5/:id6/:id7/:id8/:id9/:id10/:id11/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/:id4/:id5/:id6/:id7/:id8/:id9/:id10/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/:id4/:id5/:id6/:id7/:id8/:id9/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/:id4/:id5/:id6/:id7/:id8/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/:id4/:id5/:id6/:id7/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/:id4/:id5/:id6/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/:id4/:id5/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/:id4/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/:id3/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/:id2/`} component={SortLeagues} layout={SortLeagueLayout} />
                <AppRoute exact path={`/leagues/:id1/`} component={SortLeagues} layout={SortLeagueLayout} />
                <Route exact path="/leagues" render={() => { return <Redirect to='/leagues/popular/' /> }} />
                <AppRoute layout={NotFoundLayout} component={NotFound} />
            </Switch>
        );
    }
}

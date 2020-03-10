import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from "react-router-dom"
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import NotFound from './components/NotFound';
import { PlayerProfileLayout } from './layouts/playerProfileLayout';
import PlayerProfileLeagues from './components/user/playerProfile/PlayerProfileLeagues';
import PlayerProfileTeams from './components/user/playerProfile/PlayerProfileTeams';
import PlayerProfileSports from './components/user/playerProfile/PlayerProfileSports';
import { TrafficLayout } from './layouts/trafficLayout';
import Traffic from './components/Traffic';
import configPort from './configPort.json';
import configUrl from './configUrl.json';



// متغییر های سراسری
let urlUsername = '';
let urlArray = [];
const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout {...props}>
            <Component {...props} />
        </Layout>
    )} />
)
const defaultRoutes = <Switch>
    <AppRoute exact path={`/player/leagues/:username/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/player/teams/:username/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/player/sports/:username/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/player/aboutMe/:username/`} layout={NotFoundLayout} component={NotFound} />

    <AppRoute layout={NotFoundLayout} component={NotFound} />
</Switch>;
const trafficRoutes = <Switch>
    <AppRoute exact path={`/player/leagues/:username/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/player/teams/:username/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/player/sports/:username/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/player/aboutMe/:username/`} layout={TrafficLayout} component={Traffic} />
    <Route exact path={`/player/:username/`} render={() => { return <Redirect to={`/player/leagues/${urlUsername}`} /> }} />

    <AppRoute layout={TrafficLayout} component={Traffic} />
</Switch>;


export default class Player extends Component {
    static displayName = Player.name;

    constructor(props) {
        super(props);
        this.state = ({
            whatShouldRender: '',
        });
        //Url پیمایش
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
            case 2:
                if (splitStr[2] !== '') {
                    urlUsername = splitStr[2];
                }
                break;
            case 3:
                if (splitStr[3] !== '') {
                    urlUsername = splitStr[3];
                }
                break;
            case 4:
                if (splitStr[3] !== '') {
                    urlUsername = splitStr[3];
                }
                break;
            default:
        }
    }

     componentDidMount() {
        if (urlUsername !== '') {
            let form = new FormData();
            form.append('Username', urlUsername);
            form.append('UserID', localStorage.getItem('exID'));
             fetch(`${configPort.TetaSport}${configUrl.IsTetaSportUser}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                },
                body: form
            }).then(response => {
                let code = response.status;
                switch (code) {
                    case 200:
                        return response.json();
                    case 420:
                        return 'out';
                    case 500:
                        this.setState({ whatShouldRender: trafficRoutes });
                        break;
                    default:
                        this.setState({ whatShouldRender: defaultRoutes });
                        return false;
                }
            }).then(
                data => {
                    if (data) {
                        if (data.UserID) {
                            localStorage.setItem('view_profile', data.UserID);
                            this.setState({
                                whatShouldRender: <Switch>
                                    <AppRoute exact path={`/player/leagues/:username/`} layout={PlayerProfileLayout} component={PlayerProfileLeagues} />
                                    <AppRoute exact path={`/player/teams/:username/`} layout={PlayerProfileLayout} component={PlayerProfileTeams} />
                                    <AppRoute exact path={`/player/sports/:username/`} layout={PlayerProfileLayout} component={PlayerProfileSports} />
                                    <AppRoute exact path={`/player/aboutMe/:username/`} layout={PlayerProfileLayout} component={PlayerProfileSports} />
                                    <Route exact path={`/player/:username/`} render={() => { return <Redirect to={`/player/leagues/${urlUsername}`} /> }} />

                                    <AppRoute layout={NotFoundLayout} component={NotFound} />
                                </Switch>,
                            });
                        } else {
                            //کامپوننت 404
                            this.setState({ whatShouldRender: defaultRoutes });
                        }

                    } else {
                        if (data === false) {
                            //کامپوننت 404
                            this.setState({ whatShouldRender: defaultRoutes });
                        }
                        if (data === undefined) {
                            //کامپوننت 500
                            this.setState({ whatShouldRender: trafficRoutes });
                        }
                        if (data === 'out') {

                        }
                    }
                });
        }
    }

    render() {
        let renderRoute = this.state.whatShouldRender;
        if (urlUsername !== '') {
            return (
                <Fragment>
                    {renderRoute}
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    {defaultRoutes}
                </Fragment >
            );
        }

    }
}

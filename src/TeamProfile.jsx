import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import NotFound from './components/NotFound';
import Hashids from 'hashids';
import { TrafficLayout } from './layouts/trafficLayout';
import Traffic from './components/Traffic';
import { LogoutSoft } from './components/user/logout/UserLogout';
import configPort from './configPort.json';
import configUrl from './configUrl.json';
import { PublicTeamLayout } from './layouts/publicTeamLayout';
import { PublicTeamPlayers } from './components/user/publicTeam/PublicTeamPlayers';
import { PublicTeamAddPlayer } from './components/user/publicTeam/PublicTeamAddPlayer';
import { PublicTeamAbout } from './components/user/publicTeam/PublicTeamAbout';
import { PublicTeamLeagues } from './components/user/publicTeam/PublicTeamLeagues';
import { TeamEditLayout } from './layouts/teamEditLayout';
import { TeamEdit } from './components/user/teamEdit/TeamEdit';
import { PublicTeamShirt } from './components/user/publicTeam/PublicTeamShirt';


// متغییر های سراسری
let hashid = new Hashids('', 7);
let teamId = '';
let urlArray = [];
let lgId = '';
const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout {...props}>
            <Component {...props} />
        </Layout>
    )} />
)
const defaultRoutes = <Switch>
    {/* قدیمی */}
    <AppRoute exact path={`/teamProfile/:seoTxt/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/teamProfile/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/teamProfile/addplayer/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    {/* جدید */}
    <AppRoute exact path={`/teamProfile/about/:seotext/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/teamProfile/players/:seotext/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/teamProfile/leagues/:seotext/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/teamProfile/shirt/:seotext/:teamId/`} layout={NotFoundLayout} component={NotFound} />

    <AppRoute exact path={`/teamProfile/about/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/teamProfile/players/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/teamProfile/leagues/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/teamProfile/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/teamProfile/shirt/:teamId/`} layout={NotFoundLayout} component={NotFound} />

    <AppRoute exact path={`/teamEdit/:teamId/`} layout={NotFoundLayout} component={NotFound} />

    <AppRoute layout={NotFoundLayout} component={NotFound} />
</Switch>;
const trafficRoutes = <Switch>
    {/* قدیمی */}
    <AppRoute exact path={`/teamProfile/:seoTxt/:teamId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/teamProfile/:teamId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/team/addplayer/:teamId/`} layout={TrafficLayout} component={Traffic} />
    {/* جدید */}
    <AppRoute exact path={`/teamProfile/about/:seotext/:teamId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/teamProfile/players/:seotext/:teamId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/teamProfile/leagues/:seotext/:teamId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/teamProfile/shirt/:seotext/:teamId/`} layout={TrafficLayout} component={Traffic} />


    <AppRoute exact path={`/teamProfile/about/:teamId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/teamProfile/players/:teamId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/teamProfile/leagues/:teamId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/teamProfile/:teamId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/teamProfile/shirt/:teamId/`} layout={TrafficLayout} component={Traffic} />

    <AppRoute exact path={`/teamEdit/:teamId/`} layout={TrafficLayout} component={TrafficLayout} />

    <AppRoute layout={TrafficLayout} component={Traffic} />
</Switch>;



export default class TeamProfile extends Component {
    static displayName = TeamProfile.name;

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
                    lgId = hashid.decode(splitStr[2]);
                    teamId = lgId;
                }
                break;
            case 3:
                if (splitStr[3] !== '') {
                    lgId = hashid.decode(splitStr[3]);
                    teamId = lgId;
                }
                break;
            case 4:
                if (splitStr[4] === '') {
                    lgId = hashid.decode(splitStr[3]);
                    teamId = lgId;
                }
                break;
            default:
        }
    }

    async componentDidMount() {
        if (teamId !== '') {
            let form = new FormData();
            form.append('TeamID', teamId);
            form.append('UserID', localStorage.getItem('exID'));
            await fetch(`${configPort.TetaSport}${configUrl.ExistTeam}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                },
                body: form
            }).then(response => {
                let code = response.status;
                switch (code) {
                    case 204:
                        return true;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
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
                        this.setState({
                            whatShouldRender: <Switch>
                                <AppRoute exact path={`/teamProfile/about/:seotext/:teamId/`} layout={PublicTeamLayout} component={PublicTeamAbout} />
                                <AppRoute exact path={`/teamProfile/players/:seotext/:teamId/`} layout={PublicTeamLayout} component={PublicTeamPlayers} />
                                <AppRoute exact path={`/teamProfile/leagues/:seotext/:teamId/`} layout={PublicTeamLayout} component={PublicTeamPlayers} />
                                <AppRoute exact path={`/teamProfile/shirt/:seotext/:teamId/`} layout={PublicTeamLayout} component={PublicTeamShirt} />

                                <AppRoute exact path={`/teamProfile/about/:teamId/`} layout={PublicTeamLayout} component={PublicTeamAbout} />
                                <AppRoute exact path={`/teamProfile/players/:teamId/`} layout={PublicTeamLayout} component={PublicTeamPlayers} />
                                <AppRoute exact path={`/teamProfile/leagues/:teamId/`} layout={PublicTeamLayout} component={PublicTeamLeagues} />
                                <AppRoute exact path={`/teamProfile/shirt/:teamId/`} layout={PublicTeamLayout} component={PublicTeamShirt} />
                                <Route exact path={`/teamProfile/:teamId/`} render={
                                    () => {
                                        return (
                                            <Redirect to={`/teamProfile/players/${hashid.encode(teamId)}/`}/>
                                            )
                                    }
                                } />

                                <AppRoute exact path={`/team/addplayer/:teamId/`} layout={PublicTeamLayout} component={PublicTeamAddPlayer} />
                                <AppRoute exact path={`/teamEdit/:teamId/`} layout={TeamEditLayout} component={TeamEdit} />

                                <AppRoute layout={NotFoundLayout} component={NotFound} />
                            </Switch>
                        });
                    } else {
                        if (data === false) {
                            //کامپوننت 404
                            this.setState({ whatShouldRender: defaultRoutes });
                        }
                        if (data === undefined) {
                            //کامپوننت 500
                            this.setState({ whatShouldRender: trafficRoutes });
                        }
                    }
                });
        }
    }

    render() {
        let renderRoute = this.state.whatShouldRender;
        if (teamId !== '') {
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

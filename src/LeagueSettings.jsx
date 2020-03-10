import React, { Component, Fragment } from 'react';
import { Route, Switch } from "react-router-dom"
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import NotFound from './components/NotFound';
import Hashids from 'hashids';
import { LeagueSettingsLayout } from './layouts/leagueSettingsLayout';
import { LeagueSettingsPanel } from './components/user/leagueSettings/LeagueStettingPanel';
import { LeagueSettingsManageTeams } from './components/user/leagueSettings/LeagueSettingsManageTeams';
import { LeagueSettingsPlan } from './components/user/leagueSettings/LeagueSettingsPlan';
import { LeagueSettingsMatchesResult } from './components/user/leagueSettings/LeagueSettingsMatchesResults';
import { TrafficLayout } from './layouts/trafficLayout';
import Traffic from './components/Traffic';
import { LogoutSoft } from './components/user/logout/UserLogout';
import configPort from './configPort.json';
import configUrl from './configUrl.json';
import LeagueSettingPlayerList from './components/user/leagueSettings/LeagueSettingPlayersList';
import { LeagueSettingEditMyTeam } from './components/user/leagueSettings/LeagueSettingEditMyTeam';


// متغییر های سراسری
let hashid = new Hashids('', 7);
let urlLeagueId = '';
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

    <AppRoute exact path={`/leagueSettings/manageTeams/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueSettings/plan/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueSettings/matchesResults/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueSettings/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueSettings/playersList/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueSettings/editMyTeams/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute layout={NotFoundLayout} component={NotFound} />
</Switch>;
const trafficRoutes = <Switch>
    <AppRoute exact path={`/leagueSettings/manageTeams/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueSettings/plan/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueSettings/matchesResults/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueSettings/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueSettings/playersList/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueSettings/editMyTeam/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute layout={TrafficLayout} component={Traffic} />
</Switch>;


export default class LeagueSettings extends Component {
    static displayName = LeagueSettings.name;

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
                lgId = hashid.decode(splitStr[2]);
                urlLeagueId = lgId;
                break;
            case 3:
                lgId = hashid.decode(splitStr[3]);
                urlLeagueId = lgId;
                break;
            default:
        }
    }

    async componentDidMount() {
        if (urlLeagueId !== '') {

            let form = new FormData();
            form.append('LeagueID', urlLeagueId);
            form.append('UserID', localStorage.getItem('exID'));
            await fetch(`${configPort.TetaSport}${configUrl.ExistsThisLeague}`, {
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
                                <AppRoute exact path={`/leagueSettings/manageTeams/:leagueId/`} layout={LeagueSettingsLayout} component={LeagueSettingsManageTeams} />
                                <AppRoute exact path={`/leagueSettings/plan/:leagueId/`} layout={LeagueSettingsLayout} component={LeagueSettingsPlan} />
                                <AppRoute exact path={`/leagueSettings/matchesResults/:leagueId/`} layout={LeagueSettingsLayout} component={LeagueSettingsMatchesResult} />
                                <AppRoute exact path={`/leagueSettings/:leagueId/`} layout={LeagueSettingsLayout} component={LeagueSettingsPanel} />
                                <AppRoute exact path={`/leagueSettings/playersList/:leagueId/`} layout={LeagueSettingsLayout} component={LeagueSettingPlayerList} />
                                <AppRoute exact path={`/leagueSettings/editMyTeams/:leagueId/`} layout={LeagueSettingsLayout} component={LeagueSettingEditMyTeam} />

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
        if (urlLeagueId !== '') {
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

import React, { Component, Fragment } from 'react';
import { Route, Switch } from "react-router-dom"
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import NotFound from './components/NotFound';
import Hashids from 'hashids';
import { TeamSettingsLayout } from './layouts/teamSettingLayout';
import { TeamSettingAddPlayer } from './components/user/teamSettings/TeamSettingAddPlayer';
import { TrafficLayout } from './layouts/trafficLayout';
import Traffic from './components/Traffic';
import { LogoutSoft } from './components/user/logout/UserLogout';
import configPort from './configPort.json';
import configUrl from './configUrl.json';

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

    <AppRoute exact path={`/teamSetting/addPlayer/:teamId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute layout={NotFoundLayout} component={NotFound} />
</Switch>;
const trafficRoutes = <Switch>
    <AppRoute exact path={`/teamSetting/addPlayer/:teamId/`} layout={TrafficLayout} component={TrafficLayout} />

    <AppRoute layout={TrafficLayout} component={Traffic} />
</Switch>;



export default class TeamSetting extends Component {
    static displayName = TeamSetting.name;

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
            case 3:
                lgId = hashid.decode(splitStr[3]);
                teamId = lgId;
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
                                <AppRoute exact path={`/teamSetting/addPlayer/:teamId/`} layout={TeamSettingsLayout} component={TeamSettingAddPlayer} />

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

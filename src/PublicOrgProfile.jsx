import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from "react-router-dom"
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import NotFound from './components/NotFound';
import Hashids from 'hashids';
import { PublicOrgProfileLayout } from './layouts/publicOrgProfileLayout';
import { PublicOrgProfileGallery } from './components/user/publicOrgProfile/PublicOrgProfileGallery';
import { PublicOrgProfileVideos } from './components/user/publicOrgProfile/PublicOrgProfileVideos';
import PublicOrgProfileLeagues from './components/user/publicOrgProfile/PublicOrgProfileLeagues';
import { TrafficLayout } from './layouts/trafficLayout';
import Traffic from './components/Traffic';
import { LogoutSoft } from './components/user/logout/UserLogout';
import configPort from './configPort.json';
import configUrl from './configUrl.json';


// متغییر های سراسری
let hashid = new Hashids('', 7);
let urlArray = [];
let orgId = '';
const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout {...props}>
            <Component {...props} />
        </Layout>
    )} />
)
const defaultRoutes = <Switch>
    <AppRoute exact path={`/organization/:orgId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/organization/videos/:orgId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/organization/media/:orgId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/organization/gallery/:orgId/`} layout={NotFoundLayout} component={NotFound} />

    <AppRoute layout={NotFoundLayout} component={NotFound} />
</Switch>;
const trafficRoutes = <Switch>
    <AppRoute exact path={`/organization/:orgId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/organization/videos/:orgId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/organization/media/:orgId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/organization/gallery/:orgId/`} layout={TrafficLayout} component={Traffic} />

    <AppRoute layout={TrafficLayout} component={Traffic} />
</Switch>;



export default class PublicOrgProfile extends Component {
    static displayName = PublicOrgProfile.name;

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
                    orgId = hashid.decode(splitStr[2]);
                }
                break;
            case 3:
                if (splitStr[3] !== '') {
                    orgId = hashid.decode(splitStr[3]);
                }
                break;
            case 4:
                if (splitStr[4] === '') {
                    orgId = hashid.decode(splitStr[3]);
                }
                break;
            default:
        }
    }

    componentDidMount() {
        if (orgId !== '') {
            let form = new FormData();
            form.append('OrgID', orgId);
            form.append('UserID', localStorage.getItem('exID'));
            fetch(`${configPort.TetaSport}${configUrl.ExistOrg}`, {
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
                                <Route exact path={`/organization/:orgId/`} render={() => {
                                    return (
                                        <Redirect to={`/organization/leagues/${hashid.encode(orgId)}`} />
                                        )
                                }} />
                                <AppRoute exact path={`/organization/gallery/:orgId/`} layout={PublicOrgProfileLayout} component={PublicOrgProfileGallery} />
                                <AppRoute exact path={`/organization/videos/:orgId/`} layout={PublicOrgProfileLayout} component={PublicOrgProfileVideos} />
                                <AppRoute exact path={`/organization/leagues/:orgId/`} layout={PublicOrgProfileLayout} component={PublicOrgProfileLeagues} />

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
        if (orgId !== '') {
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

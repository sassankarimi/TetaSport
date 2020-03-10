import React, { Component, Fragment } from 'react';
import { Route, Switch } from "react-router-dom"
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import NotFound from './components/NotFound';
import Hashids from 'hashids';
import { UserOrgProfileLayout } from './layouts/userOrgProfileLayout';
import { UserOrgProfileGallery } from './components/user/userOrgProfile/UserOrgProfileGallery';
import { UserOrgProfileVideos } from './components/user/userOrgProfile/UserOrgProfileVideos';
import { UserOrgProfileAddMedia } from './components/user/userOrgProfile/UserOrgProfileAddMedia';
import { TrafficLayout } from './layouts/trafficLayout';
import Traffic from './components/Traffic';
import Logout from './components/user/logout/UserLogout';
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
    <AppRoute exact path={`/pro/organization/:orgId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/pro/organization/videos/:orgId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/pro/organization/media/:orgId/`} layout={NotFoundLayout} component={NotFound} />

    <AppRoute layout={NotFoundLayout} component={NotFound} />
</Switch>;
const trafficRoutes = <Switch>
    <AppRoute exact path={`/pro/organization/:orgId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/pro/organization/videos/:orgId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/pro/organization/media/:orgId/`} layout={TrafficLayout} component={Traffic} />

    <AppRoute layout={TrafficLayout} component={Traffic} />
</Switch>;



export default class UserOrgProfile extends Component {
    static displayName = UserOrgProfile.name;

    constructor(props) {
        super(props);
        this.state = ({
            whatShouldRender: '',
            isOrgAdmin: false,
        });
        //Url پیمایش
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
            case 3:
                if (splitStr[3] !== '') {
                    orgId = hashid.decode(splitStr[3]);
                }
                break;
            case 4:
                if (splitStr[4] !== '') {
                    orgId = hashid.decode(splitStr[4]);
                }
                break;
            case 5:
                if (splitStr[5] === '') {
                    orgId = hashid.decode(splitStr[4]);
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
                        // اگر ادمین است
                        let form = new FormData();
                        form.append('UserID', localStorage.getItem('exID'));
                        form.append('OrgID', orgId);
                        fetch(`${configPort.TetaSport}${configUrl.ThisUserIsOrganizationAdmin}`, {
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
                                case 401:
                                    Logout({ ...this.props }); 
                                    return false;
                                case 420:
                                    LogoutSoft({ ...this.props });
                                    return false;
                                default:
                                    this.setState({ whatShouldRender: defaultRoutes });
                                    return false;
                            }
                        }).then(
                            data => {
                                if (data) {
                                    if (data.Result === 'True') {
                                        this.setState({
                                            isOrgAdmin: true,
                                        })
                                    } else {
                                        this.setState({
                                            isOrgAdmin: false,
                                        })
                                    }
                                    if (this.state.isOrgAdmin) {
                                        this.setState({
                                            whatShouldRender: <Switch>
                                                <AppRoute exact path={`/pro/organization/:orgId/`} layout={UserOrgProfileLayout} component={UserOrgProfileGallery} />
                                                <AppRoute exact path={`/pro/organization/videos/:orgId/`} layout={UserOrgProfileLayout} component={UserOrgProfileVideos} />
                                                <AppRoute exact path={`/pro/organization/media/:orgId/`} layout={UserOrgProfileLayout} component={UserOrgProfileAddMedia} />

                                                <AppRoute layout={NotFoundLayout} component={NotFound} />
                                            </Switch>
                                        });
                                    } else {
                                        this.setState({ whatShouldRender: defaultRoutes });
                                    }
                                } else {
                                    this.setState({ whatShouldRender: defaultRoutes });
                                }
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

import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from "react-router-dom"
import NotFound from './components/NotFound';
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import { ProfileLayout } from './layouts/profileLayout';
import ProfileNotifications from './components/user/userProfile/ProfileNotifications';
import ProfileLeagues from './components/user/userProfile/ProfileLeagues';
import ProfileTeams from './components/user/userProfile/ProfileTeams';
import ProfileSports from './components/user/userProfile/ProfileSports';
import { TrafficLayout } from './layouts/trafficLayout';
import Traffic from './components/Traffic';
import configPort from './configPort.json';
import configUrl from './configUrl.json';
import ProfileOrgs from './components/user/userProfile/ProfileOrgs';
import { ProfileTeamPayment } from './components/user/userProfile/ProfileTeamPayment';


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
    <AppRoute exact path={`/profile/notifications/:username/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/profile/notifications/:username/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/profile/myLeagues/:username/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/profile/myTeams/:username/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/profile/aboutMe/:username/`} layout={NotFoundLayout} component={NotFound} />
    <Route exact path="/profile" render={() => { return <Redirect to={`/profile/myLeagues/${urlUsername}`} /> }} />


    <AppRoute layout={NotFoundLayout} component={NotFound} />
</Switch>;
const trafficRoutes = <Switch>
    <AppRoute exact path={`/profile/notifications/:username/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/profile/myLeagues/:username/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/profile/myTeams/:username/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/profile/aboutMe/:username/`} layout={TrafficLayout} component={Traffic} />
    <Route exact path="/profile" render={() => { return <Redirect to={`/profile/myLeagues/${urlUsername}`} /> }} />


    <AppRoute layout={TrafficLayout} component={Traffic} />
</Switch>;

export default class UserProfile extends Component {
    static displayName = UserProfile.name;

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
            case 1:
                if (splitStr[1] !== '') {
                    urlUsername = localStorage.getItem('Username')
                }
                break;
            case 2:
                if (splitStr[2] !== '') {
                    urlUsername = splitStr[2];
                } else {
                    urlUsername = localStorage.getItem('Username')
                }
                break;
            case 3:
                if (splitStr[3] !== '') {
                    urlUsername = splitStr[3];
                } else {
                    urlUsername = splitStr[2];
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
                            localStorage.setItem('view_profile', data.UserID)
                            this.setState({
                                whatShouldRender: <Switch>
                                    <AppRoute exact path={`/profile/notifications/:username/`} layout={ProfileLayout} component={ProfileNotifications} />
                                    <AppRoute exact path={`/profile/myLeagues/:username/`} layout={ProfileLayout} component={ProfileLeagues} />
                                    <AppRoute exact path={`/profile/myTeams/:username/`} layout={ProfileLayout} component={ProfileTeams} />
                                    <AppRoute exact path={`/profile/myOrgs/:username/`} layout={ProfileLayout} component={ProfileOrgs} />
                                    <AppRoute exact path={`/profile/aboutMe/:username/`} layout={ProfileLayout} component={ProfileSports} />
                                    <AppRoute exact path={`/profile/payments/:username/`} layout={ProfileLayout} component={ProfileTeamPayment} />
                                    <Route exact path={`/profile/:username/`} render={() => { return <Redirect to={`/profile/myLeagues/${urlUsername}`} /> }} />
                                    <Route exact path={`/profile`} render={() => { return <Redirect to={`/profile/myLeagues/${localStorage.getItem('Username')}`} /> }} />

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
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت`;
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

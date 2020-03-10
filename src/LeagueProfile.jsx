import React, { Component, Fragment } from 'react';
import { Route, Switch } from "react-router-dom";
import { LeagueProfileLayout } from './layouts/leagueProfileLayout';
import { LeagueProfileMatchInformations } from './components/user/leagueProfile/LeagueProfileMatchInformations';
import { LeagueProfileLeagueTable } from './components/user/leagueProfile/LeagueProfileLeagueTable';
import { LeagueProfileLeagueGallery } from './components/user/leagueProfile/LeagueProfileLeagueGallery';
import { LeagueProfileLeagueGraph } from './components/user/leagueProfile/LeagueProfileLeagueGraph';
import { LeagueProfileMatchLists } from './components/user/leagueProfile/LeagueProfileMatchLists';
import { LeagueProfileMediaUpload } from './components/user/leagueProfile/LeagueProfileMediaUpload';
import { LeagueProfileVideos } from './components/user/leagueProfile/LeagueProfileVideos';
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import NotFound from './components/NotFound';
import { TrafficLayout } from './layouts/trafficLayout';
import Traffic from './components/Traffic';
import Hashids from 'hashids';
import { LogoutSoft } from './components/user/logout/UserLogout';
import configPort from './configPort.json';
import configUrl from './configUrl.json';
import { LeagueProfileEditMyTeam } from './components/user/leagueProfile/LeagueProfileEditMyTeam';
import LeagueProfilePlayersList from './components/user/leagueProfile/LeagueProfilePlayersList';


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
    <AppRoute exact path={`/leagueProfile/matchInfo/L/:seoTxt/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/leagueGraph/L/:seoTxt/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/matchLists/L/:seoTxt/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/gallery/L/:seoTxt/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/videos/L/:seoTxt/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/leagueTable/L/:seoTxt/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/uploadmedia/L/:seoTxt/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/editMyteam/L/:seoTxt/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/playersList/L/:seoTxt/:leagueId/`} layout={NotFoundLayout} component={NotFoundLayout} />

    <AppRoute exact path={`/leagueProfile/matchInfo/L/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/leagueGraph/L/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/matchLists/L/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/gallery/L/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/videos/L/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/uploadmedia/L/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/editMyteam/L/:leagueId/`} layout={NotFoundLayout} component={NotFound} />
    <AppRoute exact path={`/leagueProfile/playersList/L/:leagueId/`} layout={NotFoundLayout} component={NotFoundLayout} />

    <AppRoute layout={NotFoundLayout} component={NotFound} />
</Switch>;
const trafficRoutes = <Switch>
    <AppRoute exact path={`/leagueProfile/matchInfo/L/:seoTxt/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/leagueGraph/L/:seoTxt/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/matchLists/L/:seoTxt/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/gallery/L/:seoTxt/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/videos/L/:seoTxt/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/leagueTable/L/:seoTxt/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/uploadmedia/L/:seoTxt/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/editMyteam/L/:seoTxt/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/playersList/L/:seoTxt/:leagueId/`} layout={TrafficLayout} component={TrafficLayout} />

    <AppRoute exact path={`/leagueProfile/matchInfo/L/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/leagueGraph/L/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/matchLists/L/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/gallery/L/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/videos/L/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/uploadmedia/L/:leagueId/`} layout={TrafficLayout} component={Traffic} />
    <AppRoute exact path={`/leagueProfile/editMyteam/L/:leagueId/`} layout={TrafficLayout} component={TrafficLayout} />
    <AppRoute exact path={`/leagueProfile/playersList/L/:leagueId/`} layout={TrafficLayout} component={TrafficLayout} />

    <AppRoute layout={TrafficLayout} component={Traffic} />
</Switch>;



export default class LeagueProfile extends Component {
    static displayName = LeagueProfile.name;

    constructor(props) {
        super(props);
        this.state = ({
            whatShouldRender: '',
            isLeagueAdmin: false
        });
        //Url پیمایش
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
            case 4:
                lgId = hashid.decode(splitStr[4]);
                urlLeagueId = lgId;
                break;
            case 5:
                lgId = hashid.decode(splitStr[5]);
                urlLeagueId = lgId;
                break;
            default:
        }
    }

    async componentDidMount() {
        if (urlLeagueId !== '') {
            //آیا ادمین لیگ است
            var form = new FormData();
            form.append('UserID', localStorage.getItem('exID'));
            form.append('LeagueID', urlLeagueId);

            await fetch(`${configPort.TetaSport}${configUrl.IsLeagueAdmin}`, {
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
                        break;
                    case 500:
                        this.setState({ whatShouldRender: trafficRoutes });
                        break;
                    default:
                        return false;
                }
            }).then(data => {
                if (data) {
                    if (data.Result === 'True') {
                        this.setState({
                            isLeagueAdmin: true,
                        })
                    } else {
                        this.setState({
                            isLeagueAdmin: false,
                        })
                    }
                } else {
                    if (data === undefined) {
                        //کامپوننت 500
                        this.setState({ whatShouldRender: trafficRoutes });
                    }
                }
            });

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
                    default:
                        this.setState({ whatShouldRender: defaultRoutes });
                        return false;
                }
            }).then(
                data => {
                    if (data) {
                        if (this.state.isLeagueAdmin) {
                            this.setState({
                                whatShouldRender: <Switch>
                                    <AppRoute exact path={`/leagueProfile/matchInfo/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMatchInformations} />
                                    <AppRoute exact path={`/leagueProfile/leagueGraph/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueGraph} />
                                    <AppRoute exact path={`/leagueProfile/matchLists/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMatchLists} />
                                    <AppRoute exact path={`/leagueProfile/gallery/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueGallery} />
                                    <AppRoute exact path={`/leagueProfile/videos/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileVideos} />
                                    <AppRoute exact path={`/leagueProfile/leagueTable/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueTable} />
                                    <AppRoute exact path={`/leagueProfile/uploadmedia/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMediaUpload} />
                                    <AppRoute exact path={`/leagueProfile/editMyteam/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileEditMyTeam} />
                                    <AppRoute exact path={`/leagueProfile/playersList/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfilePlayersList} />

                                    <AppRoute exact path={`/leagueProfile/matchInfo/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMatchInformations} />
                                    <AppRoute exact path={`/leagueProfile/leagueGraph/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueGraph} />
                                    <AppRoute exact path={`/leagueProfile/matchLists/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMatchLists} />
                                    <AppRoute exact path={`/leagueProfile/gallery/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueGallery} />
                                    <AppRoute exact path={`/leagueProfile/videos/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileVideos} />
                                    <AppRoute exact path={`/leagueProfile/leagueTable/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueTable} />
                                    <AppRoute exact path={`/leagueProfile/uploadmedia/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMediaUpload} />
                                    <AppRoute exact path={`/leagueProfile/editMyteam/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileEditMyTeam} />
                                    <AppRoute exact path={`/leagueProfile/playersList/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfilePlayersList} />
                                    <AppRoute layout={NotFoundLayout} component={NotFound} />
                                </Switch>
                            });
                        } else {
                            this.setState({
                                whatShouldRender: <Switch>
                                    <AppRoute exact path={`/leagueProfile/matchInfo/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMatchInformations} />
                                    <AppRoute exact path={`/leagueProfile/leagueGraph/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueGraph} />
                                    <AppRoute exact path={`/leagueProfile/matchLists/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMatchLists} />
                                    <AppRoute exact path={`/leagueProfile/gallery/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueGallery} />
                                    <AppRoute exact path={`/leagueProfile/videos/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileVideos} />
                                    <AppRoute exact path={`/leagueProfile/leagueTable/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueTable} />
                                    <AppRoute exact path={`/leagueProfile/editMyteam/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileEditMyTeam} />
                                    <AppRoute exact path={`/leagueProfile/playersList/L/:seoTxt/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfilePlayersList} />

                                    <AppRoute exact path={`/leagueProfile/matchInfo/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMatchInformations} />
                                    <AppRoute exact path={`/leagueProfile/leagueGraph/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueGraph} />
                                    <AppRoute exact path={`/leagueProfile/matchLists/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileMatchLists} />
                                    <AppRoute exact path={`/leagueProfile/gallery/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueGallery} />
                                    <AppRoute exact path={`/leagueProfile/videos/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileVideos} />
                                    <AppRoute exact path={`/leagueProfile/leagueTable/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileLeagueTable} />
                                    <AppRoute exact path={`/leagueProfile/editMyteam/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfileEditMyTeam} />
                                    <AppRoute exact path={`/leagueProfile/playersList/L/:leagueId/`} layout={LeagueProfileLayout} component={LeagueProfilePlayersList} />
                                    <AppRoute layout={NotFoundLayout} component={NotFound} />
                                </Switch>
                            });
                        }

                    } else {
                        //صفحه 404
                        this.setState({ whatShouldRender: defaultRoutes });
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

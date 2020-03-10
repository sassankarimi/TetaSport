import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import LoginLayout from './layouts/loginLayout';
import NotFound  from './components/NotFound';
import { NotFoundLayout } from './layouts/notFoundLayoutjs';
import StaticPagesLayout from './layouts/staticPagesLayout';
import './css/animate-custom.css';
import './css/site.css';
import './css/w3.css';
import './css/idx.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'izitoast/dist/css/iziToast.css';
import LeaguePackages from './LeaguePackages';
import Payment from './Payment';

const TetaSportApp = lazy(() => import('./TetaSportApp'));
const UserProfile = lazy(() => import('./UserProfile'));
const Leagues = lazy(() => import('./Leagues'));
const UserLogin = lazy(() => import('./components/user/login/UserLogin'));
const LeagueProfile = lazy(() => import('./LeagueProfile'));
const LeagueSettings = lazy(() => import('./LeagueSettings'));
const TeamProfile = lazy(() => import('./TeamProfile'));
const TeamSetting = lazy(() => import('./TeamSetting'));
const CreateNewTeam = lazy(() => import('./CreateNewTeam'));
const UserOrgProfile = lazy(() => import('./UserOrgProfile'));
const PublicOrgProfile = lazy(() => import('./PublicOrgProfile'));
const Organizations = lazy(() => import('./Organizations'));
const HelpLeagueStructure = lazy(() => import('./components/user/statics/HelpLeagueStructue'));
const Terms = lazy(() => import('./components/user/statics/Terms'));
const AboutUs = lazy(() => import('./components/user/statics/AboutUs'));

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout {...props}>
            <Component {...props} />
        </Layout>
    )} />
)

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('TetaSport-app');

if (localStorage.getItem('theme') === 'dark') {
    document.body.style.background = '#26262b';
} else {
    document.body.style.background = '#fff';
}

ReactDOM.render(
    <BrowserRouter basename={baseUrl}>
        <Switch>
            <AppRoute exact path="/404" layout={NotFoundLayout} component={NotFound} />
            <Suspense fallback={<></>}>
                <AppRoute exact path="/terms" layout={StaticPagesLayout} component={Terms} />
                <AppRoute exact path="/about" layout={StaticPagesLayout} component={AboutUs} />
                <AppRoute exact path="/leagueStructure" layout={StaticPagesLayout} component={HelpLeagueStructure} />
                <Route exact path="/login" render={
                    () => {
                        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== '0' && localStorage.getItem('Token') && localStorage.getItem('Token') !== '') {
                            return (
                                <Redirect to='/' />
                            )
                        } else {
                            return (
                                <AppRoute exact path="/login" layout={LoginLayout} component={UserLogin} />
                            )
                        }
                    }
                } />
                <Route path="/organization" component={PublicOrgProfile} />
                <Route path="/pro/organization" component={UserOrgProfile} />
                <Route exact path="/newTeam" component={CreateNewTeam} />
                <Route path="/team" component={TeamProfile} />
                <Route path="/teamEdit" component={TeamProfile} />
                <Route path="/organizations" component={Organizations} />
                <Route path="/player" component={UserProfile} />
                <Route path="/leagues" component={Leagues} />
                <Route path="/leagueSettings" component={LeagueSettings} />
                <Route path="/leaguePackages" component={LeaguePackages} />
                <Route path="/payment" component={Payment} />
                <Route path="/teamProfile" component={TeamProfile} />
                <Route path="/teamSetting" component={TeamSetting} />
                <Route path="/leagueProfile" component={LeagueProfile} />
                <Route path="/profile" component={UserProfile} />
                <Route exact path='/' component={TetaSportApp} />
            </Suspense>
            <AppRoute layout={NotFoundLayout} component={NotFound} />
        </Switch>
    </BrowserRouter>,
    rootElement);


registerServiceWorker();

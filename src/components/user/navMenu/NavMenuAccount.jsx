import React, { Component, Fragment } from 'react';
import { Collapse, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../../../css/NavMenu.css';
import { toast } from 'react-toastify';
import Switch from "react-switch";
import { CreateLeagueStepperModal } from '../createLeague/CreateLeague';
import CreateOrganizationModal from '../createOrganization/CreateOrganization';
import { LogoutSoft } from '../logout/UserLogout';
import { whichTheme } from '../../../jsFunctions/all';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';
import { setTimeout } from 'timers';
import Logout from '../logout/UserLogout';

//استایل ها
const navStyles = {
    'dir': 'rtl',

}
export const moon = (
    <i className='moon-switch' />
);
export const sun = (
    <i className='sun-switch' />
);

export class NavMenuAccount extends Component {
    static displayName = NavMenuAccount.name;

    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
            userSmallAvatar: '',
            switchChecked: (localStorage.getItem('theme') === 'dark') ? true : false,
            isOnceSwitch: false,
        };
    }

    componentDidMount() {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', localStorage.getItem('exID'));
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0) {
            fetch(`${configPort.TetaSport}${configUrl.GetUserAvatar}`, {
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
                    case 400:
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    case 500:
                        return false;
                    default:
                }
            }).then(
                data => {
                    if (data) {
                        localStorage.setItem('userAvatar', data.Avatar);
                        this.setState({ userSmallAvatar: data.Avatar });
                    }
                });
        }
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    ComingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
    }

    goLogIn = () => {
        this.props.history.push('/login');
    }

    handleSwitchChange = () => {
        document.getElementById('tetasport-switch').style.border = 'none';
        this.setState({ switchChecked: !this.state.switchChecked, isOnceSwitch: true });
        if (!this.state.switchChecked) {
            document.getElementById('tetasport-switch').childNodes[0].className += 'switch-one-once';
        }
        setTimeout(function () {
            whichTheme((this.state.switchChecked) ? 2 : 1);
        }.bind(this), 1000)
    }

    handleShowDetailProfileOnHover = () => {
        document.getElementById('profile-detailed-container').style.visibility = 'visible';
        document.getElementById('profile-detailed-container').style.opacity = '1';
        document.getElementById('profile-detailed-container').style.zIndex = '1000000';
    }

    handleHideDetailProfileOnHover = () => {
        document.getElementById('profile-detailed-container').style.visibility = 'hidden';
        document.getElementById('profile-detailed-container').style.opacity = '0';
        document.getElementById('profile-detailed-container').style.zIndex = '-1';
    }

    render() {
        let myProfileName = 'پروفایل من';
        if (localStorage.getItem('Username')) {
            myProfileName = localStorage.getItem('Username');
        }
        let profilePic = 'src/icon/defaultAvatar.png';

        if (this.state.userSmallAvatar !== '' && this.state.userSmallAvatar !== null && this.state.userSmallAvatar !== undefined) {
            profilePic = this.state.userSmallAvatar;
        }

        let isUserLogin = false;
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== '0') {
            isUserLogin = true;
        }
        return (
            <header style={{ background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : '#EFF5F0', height: 69 }}>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white " light>
                    <div id='tetasport-switch' className={`${localStorage.getItem('theme') === 'dark' ? 'switch-container-teta-sport-theame--dark' : 'switch-container-teta-sport-theame'}`} title={`${localStorage.getItem('theme') === 'dark' ? 'تم مشکی: فعال' : 'تم مشکی: غیر فعال'}`}><Switch disabled={this.state.isOnceSwitch} uncheckedIcon={sun} checkedIcon={moon} height={20} width={40} onColor='#7982da' onChange={this.handleSwitchChange} checked={this.state.switchChecked} /></div>
                    <div className='theme-selector theme-selector-white' title='تم سفید' onClick={() => { whichTheme(1) }}></div>
                    <div className='theme-selector theme-selector-dark' title='تم مشکی' onClick={() => { whichTheme(2) }}></div>
                    <div className='container-fluid'>
                        <div className='row' style={{ width: '100%', direction: 'rtl' }}>
                            <div className='col-md-6' style={{ paddingTop: 5 }}>
                                <Collapse className="font-fam-irsans txt-size " isOpen={this.state.collapsed} navbar onMouseLeave={this.handleHideDetailProfileOnHover}>
                                    <ul className="navbar-nav flex-grow font-fam-irsans myNav" style={{ direction: navStyles.dir }}>
                                        {
                                            (isUserLogin) ?
                                                <NavItem className='' style={{ position: 'relative' }}>
                                                    <a style={{ padding: 0 }} className="left-margin-first-li nav-link" href={`/profile/${localStorage.getItem('Username')}`}>
                                                        <div id='userImgNavAvatar' className='profilePic' style={{ backgroundImage: 'url(' + profilePic + ')', backgroundSize: 'cover', borderRadius: '50%' }}></div>
                                                    </a>
                                                    <a style={{ padding: 0 }} className="left-margin-first-li nav-link" href={`/profile/notifications/${localStorage.getItem('Username')}`}>
                                                        <span className={`${localStorage.getItem('theme') === 'dark' ? 'notif-profile-icon--dark' : 'notif-profile-icon'}`} title='اعلانات شما'></span>
                                                        <span className='notif-count-profile-avatar' title='اعلانات شما'>11</span>
                                                    </a>
                                                </NavItem>
                                                :
                                                null
                                        }
                                        {
                                            (isUserLogin) ?
                                                <NavItem className='' onMouseEnter={this.handleShowDetailProfileOnHover} style={{ position: 'relative' }}>
                                                    <a id='myProfileNavUsername' className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items-profile--dark' : 'txt-color-nav-items-profile'} txt-color-nav-items-profile-active left-margin-first-li nav-link`} href={`/profile/${localStorage.getItem('Username')}`} style={{ color: '#09A603' }}>{myProfileName}</a>
                                                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'profile-details-container--dark' : 'profile-details-container'}`} id='profile-detailed-container'>
                                                        <span className={`${localStorage.getItem('theme') === 'dark' ? 'profile-details-item--dark' : 'profile-details-item'}`}><a className='noDecore' href={`/profile/${localStorage.getItem('Username')}`}>پروفایل من</a></span>
                                                        <span className={`${localStorage.getItem('theme') === 'dark' ? 'profile-details-item--dark' : 'profile-details-item'}`}><a className='noDecore' href={`/profile/payments/${localStorage.getItem('Username')}`}>صورت حساب</a></span>
                                                        <span className={`${localStorage.getItem('theme') === 'dark' ? 'profile-details-item--dark' : 'profile-details-item'}`} onClick={() => { Logout({ ...this.props }) }}>خروج</span>
                                                    </div>
                                                </NavItem>
                                                :
                                                <NavItem className=''>
                                                    <NavLink id='myProfileNavUsername' tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items-profile--dark' : 'txt-color-nav-items-profile'} txt-color-nav-items-profile-active left-margin-first-li`} to="/login" style={{ color: '#09A603' }}>ورود / ثبت نام</NavLink>
                                                </NavItem>
                                        }
                                        <NavItem>
                                            <span className="nav-link left-border-1-5"></span>
                                        </NavItem>
                                        <NavItem className='right-left-margin-third-li-profile'>
                                            <NavLink tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items-profile--dark' : 'txt-color-nav-items-profile'}`} to="/leagues/">لیـگ ها</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <span className="nav-link left-border-1-5"></span>
                                        </NavItem>
                                        <NavItem className='right-left-margin-third-li-profile'>
                                            <NavLink tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items-profile--dark' : 'txt-color-nav-items-profile'}`} to="/organizations/">سازمان ها</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <span className="nav-link left-border-1-5"></span>
                                        </NavItem>
                                        {
                                            (isUserLogin) ?
                                                <NavItem className='right-left-margin-third-li-profile'>
                                                    <NavLink tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items-profile--dark' : 'txt-color-nav-items-profile'}`} to="/leaguePackages">خرید بسته</NavLink>
                                                </NavItem>
                                                :
                                                <NavItem className='right-left-margin-third-li-profile'>
                                                    <NavLink tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items-profile--dark' : 'txt-color-nav-items-profile'}`} to="/login">خرید بسته</NavLink>
                                                </NavItem>
                                        }
                                    </ul>
                                </Collapse>
                            </div>
                            <div className='col-md-6'>
                                {
                                    (isUserLogin) ?
                                        <Fragment>
                                            <NavbarBrand href='/newTeam' className='' target='newTeam'>

                                                <button className={`btn ${localStorage.getItem('theme') === 'dark' ? 'createTeambtnCm--dark' : 'createTeambtnCm'}`} style={{ fontFamily: 'IRANYekanBold', background: 'rgb(13, 106, 18)', color: '#fff', marginTop: 5, direction: 'rtl' }}>
                                                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'createTeambtnCm-icon-container--dark' : 'createTeambtnCm-icon-container'}`}>
                                                        <span className='add-new-plus-icon'></span>
                                                    </div>
                                                    <span className='createTeambtnCm-txt'>ساخت تیم</span>
                                                </button>

                                            </NavbarBrand>
                                            <NavbarBrand className='' >
                                                <CreateOrganizationModal {...this.props} />
                                            </NavbarBrand>
                                            <NavbarBrand className='' >
                                                <CreateLeagueStepperModal {...this.props} />
                                            </NavbarBrand>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <NavbarBrand className='' >
                                                <button onClick={this.goLogIn} className='btn createTeambtnCm' style={{ fontFamily: 'IRANYekanBold', background: (localStorage.getItem('theme') === 'dark') ? '#000' : 'rgb(13, 106, 18)', color: '#fff', marginTop: 5, direction: 'rtl' }}>
                                                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'createTeambtnCm-icon-container--dark' : 'createTeambtnCm-icon-container'}`}>
                                                        <span className='add-new-plus-icon'></span>
                                                    </div>
                                                    <span className='createTeambtnCm-txt'>ساخت لیگ</span>
                                                </button>
                                            </NavbarBrand>
                                        </Fragment>
                                }
                                <NavbarBrand className={`logo-margin-top-left-profile ${localStorage.getItem('theme') === 'dark' ? 'teta-logo-profile--dark' : 'teta-logo-profile'}`} tag={Link} to="/" ></NavbarBrand>
                            </div>
                        </div>
                    </div>
                </Navbar>
            </header>
        );
    }
}

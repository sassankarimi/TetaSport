import React, { Component, Fragment } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../css/NavMenu.css';
import { LoginModal } from './user/login/Modals';
import Logout from './user/logout/UserLogout';
import { toast } from 'react-toastify';
import { whichTheme } from '../jsFunctions/all';
import Switch from "react-switch";
import AnchorLink from 'react-anchor-link-smooth-scroll';


const navStyles = {
    'dir': 'rtl',

}

export const moon = (
    <i className='moon-switch ' />
);
export const sun = (
    <i className='sun-switch ' />
);

// برای صفحه اصلی navbar
export class NavMenuIndex extends Component {
    static displayName = NavMenuIndex.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            switchChecked: (localStorage.getItem('theme') === 'dark') ? true : false,
            isOnceSwitch: false,
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    ComingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
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

        let isUserLogin = false;
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== '0') {
            isUserLogin = true;
        }

        return (
            <header className='main-header'>
                <div id='tetasport-switch' className={`${localStorage.getItem('theme') === 'dark' ? 'switch-container-teta-sport-theame-home--dark' : 'switch-container-teta-sport-theame-home'}`} title={`${localStorage.getItem('theme') === 'dark' ? 'تم مشکی: فعال' : 'تم مشکی: غیر فعال'}`}><Switch disabled={this.state.isOnceSwitch} uncheckedIcon={sun} checkedIcon={moon} height={20} width={40} onColor='#7982da' onChange={this.handleSwitchChange} checked={this.state.switchChecked} /></div>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white mb-3" light>
                    <div className='container-fluid'>
                        <NavbarToggler onClick={this.toggleNavbar} className={`${localStorage.getItem('theme') === 'dark' ? 'navbar-toggler--dark' : ''} mr-2`} />
                        <div className='logo-container'>
                            <NavbarBrand className={`logo-margin-top-left ${localStorage.getItem('theme') === 'dark' ? 'teta-logo--dark' : 'teta-logo'}`} tag={Link} to="/"></NavbarBrand>
                        </div>
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse font-fam-irsans txt-size nav-margin-top-right" isOpen={!this.state.collapsed} navbar onMouseLeave={this.handleHideDetailProfileOnHover}>
                            <ul className="navbar-nav flex-grow font-fam-irsans home-nav" style={{ direction: navStyles.dir }}>

                                {
                                    (isUserLogin)
                                        ?
                                        <Fragment>
                                            <NavItem className={`right-left-margin-third-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`} onMouseEnter={this.handleShowDetailProfileOnHover} style={{ position: 'relative' }}>
                                                <a className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items--dark' : 'txt-color-nav-items'} left-margin-first-li nav-link`} href={`/profile/${localStorage.getItem('Username')}`}>پروفایل من</a>
                                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'profile-details-container--dark' : 'profile-details-container'}`} id='profile-detailed-container'>
                                                    <span className={`${localStorage.getItem('theme') === 'dark' ? 'profile-details-item--dark' : 'profile-details-item'}`}><a className='noDecore' href={`/profile/${localStorage.getItem('Username')}`}>پروفایل من</a></span>
                                                    <span className={`${localStorage.getItem('theme') === 'dark' ? 'profile-details-item--dark' : 'profile-details-item'}`}><a className='noDecore' href={`/profile/payments/${localStorage.getItem('Username')}`}>صورت حساب</a></span>
                                                    <span className={`${localStorage.getItem('theme') === 'dark' ? 'profile-details-item--dark' : 'profile-details-item'}`} onClick={() => { Logout({ ...this.props }) }}>خروج</span>
                                                </div>
                                            </NavItem>
                                        </Fragment>
                                        :
                                        <NavItem className={`right-left-margin-third-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                            <NavLink tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items--dark' : 'txt-color-nav-items'} left-margin-first-li`} to="/login">ورود/ثبت نــام</NavLink>
                                        </NavItem>
                                }


                                <NavItem id='nav-spliter'>
                                    <span className={`nav-link ${localStorage.getItem('theme') === 'dark' ? 'left-border-1-5--dark' : 'left-border-1-5'}`}></span>
                                </NavItem>
                                <NavItem className={`right-left-margin-third-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items--dark' : 'txt-color-nav-items'}`} to="/leagues/" >لیـگ ها</NavLink>
                                </NavItem>
                                <NavItem className={`left-margin-forth-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items--dark' : 'txt-color-nav-items'}`} to="/organizations/" >سازمان ها</NavLink>
                                </NavItem>
                                <NavItem className={`left-margin-forth-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <AnchorLink className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items--dark' : 'txt-color-nav-items'} nav-link noDecore`} href='#leaguePackages'>خرید بسته</AnchorLink>
                                </NavItem>
                                <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <AnchorLink className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items--dark' : 'txt-color-nav-items'} nav-link noDecore`} href='#contactUs' >ارتباط با ما</AnchorLink>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </div>
                </Navbar>
            </header>
        );
    }
}

// برای صفحه لاگین navbar
export class NavMenuLogin extends Component {
    static displayName = NavMenuLogin.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    ComingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
    }

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white mb-3" light>
                    <div className='container-fluid'>
                        <NavbarBrand className={`logo-margin-top-left ${localStorage.getItem('theme') === 'dark' ? 'teta-logo--dark' : 'teta-logo'}`} tag={Link} to="/"></NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse font-fam-irsans txt-size nav-margin-top-right" isOpen={!this.state.collapsed} navbar>
                            <ul className="navbar-nav flex-grow font-fam-irsans" style={{ direction: navStyles.dir }}>
                                <LoginModal {...this.props} />
                                <NavItem>
                                    <span className={`${localStorage.getItem('theme') === 'dark' ? 'nav-link left-border-1-5--dark' : 'nav-link left-border-1-5'}`}></span>
                                </NavItem>
                                <NavItem className={`right-left-margin-third-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className="txt-color-nav-items" to="/league">لیـگ ها</NavLink>
                                </NavItem>
                                <NavItem className={`left-margin-forth-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className="txt-color-nav-items" to="/">سازمان ها</NavLink>
                                </NavItem>
                                <NavItem className={`left-margin-forth-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items--dark' : 'txt-color-nav-items'}`} to="/">خرید بسته</NavLink>
                                </NavItem>
                                <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className="txt-color-nav-items" to="/">ارتباط با ما</NavLink>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </div>
                </Navbar>
            </header>
        );
    }
}

// برای صفحهات غیر اصلی navbar
export class NavMenuPages extends Component {
    static displayName = NavMenuPages.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    ComingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
    }

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white mb-3" light>
                    <div className='container-fluid'>
                        <NavbarBrand className={`logo-margin-top-left ${localStorage.getItem('theme') === 'dark' ? 'teta-logo--dark' : 'teta-logo'}`} tag={Link} to="/"></NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse font-fam-irsans txt-size nav-margin-top-right" isOpen={!this.state.collapsed} navbar>
                            <ul className="navbar-nav flex-grow font-fam-irsans" style={{ direction: navStyles.dir }}>
                                <NavItem className={`right-left-margin-third-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className="txt-color-nav-items left-margin-first-li" to="/login">ورود/ثبت نــام</NavLink>
                                </NavItem>
                                <NavItem>
                                    <span className={`${localStorage.getItem('theme') === 'dark' ? 'nav-link left-border-1-5--dark' : 'nav-link left-border-1-5'}`}></span>
                                </NavItem>
                                <NavItem className={`right-left-margin-third-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className="txt-color-nav-items" to="/league">لیـگ ها</NavLink>
                                </NavItem>
                                <NavItem className={`left-margin-forth-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className="txt-color-nav-items" to="/">سازمان ها</NavLink>
                                </NavItem>
                                <NavItem className={`left-margin-forth-li ${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className={`${localStorage.getItem('theme') === 'dark' ? 'txt-color-nav-items--dark' : 'txt-color-nav-items'}`} to="/">خرید بسته</NavLink>
                                </NavItem>
                                <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'navITEM-dark-home--dark' : ''}`}>
                                    <NavLink tag={Link} className="txt-color-nav-items" to="/" >ارتباط با ما</NavLink>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </div>
                </Navbar>
            </header>
        );
    }
}

import React, { Component, Fragment } from 'react';
import '../../../css/NavMenu.css';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import Hashids from 'hashids';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

// عکس بنر تیم Fetch کامپوننت برای
export class TeamBanner extends Component {
    static displayName = TeamBanner.name;
    constructor(props) {
        super(props);
        this.state = {
            coverPhoto: '',
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

    async componentDidMount() {
        let teamID = this.props.children.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        await fetch(`${configPort.TetaSport}${configUrl.GetTeamCoverPhotoID}`, {
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
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({ coverPhoto: data.TeamCoverPhotoID });
                }
            });

    }

    render() {
        let photoCover = 'src/icon/profBanner.png';
        if (this.state.coverPhoto && this.state.coverPhoto !== 'null' && this.state.coverPhoto !== '') {
            photoCover = this.state.coverPhoto;
        }
        return (
            <div id='orgBgCover' className='profileBanner' style={{
                backgroundImage: `url(/src/backgrounds/teamBgs/teamBg${photoCover}.jpg)`,
                width: '100%', backgroundSize: 'cover', backgroundPosition: 'center center',
            }}>
            </div>
        );
    }
}

// کامپوننت برای بخش اطلاعات تیم
export class TeamInfo extends Component {
    static displayName = TeamInfo.name;
    constructor(props) {
        super(props);
        this.state = {
            info: [],
        }
    }

    async componentDidMount() {
        let teamID = this.props.children.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        await fetch(`${configPort.TetaSport}${configUrl.GetTeamInfo}`, {
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
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({ info: data });
                }
            });

    }

    render() {
        let info = this.state.info;
        let firstnameFa = info.TeamName;
        let teamCreator = '';
        if (info.TeamAdminName !== null && info.TeamAdminName !== undefined && info.TeamAdminName !== '' && info.TeamAdminName !== 'null' && info.TeamAdminName !== 'undefined') {
            teamCreator = `سازنده تیم : ${info.TeamAdminName}`;
        }
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت | تیم ${(info.TeamName !== '' && info.TeamName !== undefined && info.TeamName !== null) ? info.TeamName : ''} `;

        return (
            <div className='orgProfileInfo' style={{ height: 90, width: '100%', background: '#fff' }}>
                <div>
                    <h3 className={`col-12 ${localStorage.getItem('theme') === 'dark' ? 'orgProfileInfo-playerName--dark' : 'orgProfileInfo-playerName'}`} style={{ fontFamily: 'IRANYekanBold' }}><span id='InfoOrgName'>{firstnameFa}</span> </h3>
                    <br />
                    <p id='InfoOrgDescription' className='orgProfileInfo-AdminName' style={{ direction: 'rtl' }}><a className='link-hover-defaultStyle' href={`/profile/${info.TeamAdminUsername}`} target={info.TeamAdminUsername}>{teamCreator}</a></p>
                </div>
            </div>
        );
    }
}

// کامپوننت برای بخش اطلاعات تیم
export class TeamLeftBoxInfo extends Component {
    static displayName = TeamLeftBoxInfo.name;

    constructor(props) {
        super(props);
        this.state = {
            info: [],
        }
    }

    async componentDidMount() {
        let teamID = this.props.children.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        await fetch(`${configPort.TetaSport}${configUrl.GetTeamInfo}`, {
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
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({ info: data });
                }
            });

    }

    render() {
        let info = this.state.info;
        return (
            <div className='orgProfileLeftBox-Info' style={{ fontSize: 10, paddingTop: 5 }}>
                <div className='orgProfileLeftBox-Info-topLeft'></div>
                <div className='orgProfileLeftBox-Info-topRight'></div>
                <div className='orgProfileLeftBox-Info-bottomRight'></div>
                <div className='orgProfileLeftBox-Info-bottomLeft'></div>
                <div className='row'>
                    <div className='col-md-12'>
                        <span className='orgProfileLeftBox-Info-txts'>{info.SportFieldTitle}</span>
                    </div>
                    <div className='col-md-12'>
                        <span className='orgProfileLeftBox-Info-txts'>{info.GenderTitle}</span>
                    </div>
                    <div className='col-md-12'>
                        <span className='orgProfileLeftBox-Info-txts'>{info.AgeCategoryTitle}</span>
                    </div>
                </div>
            </div>
        );
    }
}

// Avatars کردن Fetch کامپوننت برای
export class TeamAvatar extends Component {
    static displayName = TeamAvatar.name;

    constructor(props) {
        super(props);
        this.state = {
            Avatar: '',
        }
    }

    async componentDidMount() {
        let teamID = this.props.children.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        await fetch(`${configPort.TetaSport}${configUrl.GetTeamAvatar}`, {
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
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({ Avatar: data.TeamAvatar });
                }
            });

    }

    render() {

        if (this.state.Avatar !== '' && this.state.Avatar !== null) {
            return (
                <Fragment>
                    <div id='orgImgAvatar' className={`${localStorage.getItem('theme') === 'dark' ? 'orgProfileAvatar--dark' : 'orgProfileAvatar'}`} style={{ backgroundImage: 'url(' + this.state.Avatar + ')', backgroundSize: 'cover' }}></div>
                </Fragment>
            );
        } else {
            return (
                <div id='orgImgAvatar' className={`${localStorage.getItem('theme') === 'dark' ? 'orgProfileAvatar--dark' : 'orgProfileAvatar'}`} style={{ backgroundImage: 'url(src/icon/leagueProfileAvatarDefault.png)', backgroundSize: 'cover' }}></div>
            );
        }

    }
}

// Categories کامپوننت بخش
export class TeamCategories extends Component {
    static displayName = TeamCategories.name;

    constructor(props) {
        super(props);
        this.state = {
            notificationNum: 1,
            myLeaguesNum: 0,
            myTeamsNum: 0,
            mySportsNum: 0,
            isHamOpen: false,
            isTeamAdmin: false,
        }
    }

    componentDidMount() {
        let teamID = this.props.children.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        let form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        // ادمین ؟
        fetch(`${configPort.TetaSport}${configUrl.ThisUserIsTeamAdmin}`, {
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
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Result === 'True') {
                        this.setState({
                            isTeamAdmin: true,
                        })
                    } else {
                        this.setState({
                            isTeamAdmin: false,
                        })
                    }
                }
            });
    }

    logOut = () => {
        localStorage.removeItem('exID');
        localStorage.removeItem('Intrest');
        localStorage.removeItem('CoverPhoto');
        localStorage.removeItem('Day');
        localStorage.removeItem('Family');
        localStorage.removeItem('Gn');
        localStorage.removeItem('Month');
        localStorage.removeItem('Name');
        localStorage.removeItem('OrderingID');
        localStorage.removeItem('Username');
        localStorage.removeItem('Year');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('league-gallery');
        localStorage.removeItem('view_profile');
        this.props.history.push('/');
    }

    ComingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
    }

    handdleburger = () => {
        this.setState({
            isHamOpen: !this.state.isHamOpen,
        });
        if (!this.state.isHamOpen) {
            document.getElementById('categories-icon').style.backgroundImage = 'url(/src/icon/closeSideBar.png)';
            document.getElementById('contentItems').style.display = 'none';
            document.getElementById('categoryItems').style.display = 'block';
        } else {
            document.getElementById('categories-icon').style.backgroundImage = 'url(/src/icon/sideBarMenuButton.png)';
            document.getElementById('categoryItems').style.display = 'none';
            document.getElementById('contentItems').style.display = 'block';
        }
    }

    categoryClicked = () => {
        this.setState({
            isHamOpen: false,
        });
        document.getElementById('categories-icon').style.backgroundImage = 'url(/src/icon/sideBarMenuButton.png)';
        document.getElementById('categoryItems').style.display = 'none';
        document.getElementById('contentItems').style.display = 'block';
    }

    render() {
        let teamID = this.props.children.props.match.params.teamId;
        if (this.state.isTeamAdmin) {
            return (
                null
            )
        } else {
            return (
                <Fragment>
                    <span className='ham-categories-icon' id='categories-icon' onClick={this.handdleburger}></span>
                    <div className='profileContent-right-border-left orgProfileContent-right-padding-top' id='categoryItems'>
                        <Nav className="list-group list-group-padingRight-Customize" style={{ paddingRight: '5%', paddingLeft: '5%', paddingTop: 15 }}>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/pro/organization/${teamID}`}>افزودن بازیکن</NavLink>
                            </NavItem>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom imHoverd' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/pro/organization/videos/${teamID}`}>ثبت قوانین</NavLink>
                            </NavItem>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/pro/organization/media/${teamID}`}>درباره تیم</NavLink>
                            </NavItem>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/pro/organization/media/${teamID}`}>لیگ های تیم</NavLink>
                            </NavItem>
                            <div className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom'>
                                <span id='edit' className='list-group-item-link-padding-display ' style={{ cursor: 'pointer' }}>ویرایش پروفایل</span>
                            </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom list-group-item-logOut' onClick={() => { Logout({ ...this.props }) }}>
                                <span className='list-group-item-link-padding-display'>خروج از حساب</span>
                            </NavItem>
                        </Nav>
                    </div>
                </Fragment>
            );
        }
    }
} 

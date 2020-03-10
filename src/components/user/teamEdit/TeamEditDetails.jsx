import React, { Component, Fragment } from 'react';
import '../../../css/NavMenu.css';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

// عکس بنر تیم Fetch کامپوننت برای
export class TeamEditBanner extends Component {
    static displayName = TeamEditBanner.name;

    constructor(props) {
        super(props);
        this.state = {
            coverPhoto: 'src/backgrounds/orgProfileDefaultBanner.png',
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

    componentDidMount() {
        let orgID = this.props.children.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        var form = new FormData();
        form.append('OrgID', orgIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0 && localStorage.getItem('exID') !== null && localStorage.getItem('exID') !== '' && localStorage.getItem('exID') !== '0') {
            fetch(`${configPort.TetaSport}${configUrl.GetOrganizationCoverPhoto}`, {
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
                        this.setState({ coverPhoto: data.CoverPhoto });
                    }
                });
        }
    }

    render() {

        return (
            <div id='orgBgCover' className='profileBanner' style={{
                backgroundImage: 'url(' + this.state.coverPhoto + ')',
                width: '100%', backgroundSize: 'cover', backgroundPosition: 'center center',
            }}></div>
        );
    }
}

// کامپوننت برای بخش اطلاعات تیم
export class TeamEditInfo extends Component {
    static displayName = TeamEditInfo.name;
    constructor(props) {
        super(props);
        this.state = {
            orgName: '',
            orgDescription: '',
        }
    }
    componentDidMount() {
        let orgID = this.props.children.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        var form = new FormData();
        form.append('OrgID', orgIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0 && localStorage.getItem('exID') !== null && localStorage.getItem('exID') !== '' && localStorage.getItem('exID') !== '0') {
            //توضیحات سازمان
            fetch(`${configPort.TetaSport}${configUrl.GetOrganizationDescription}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: form
            }).then(response => {
                let code = response.status;
                switch (code) {
                    case 200:
                        return response.json();
                    default:
                        return false;
                }
            }).then(
                data => {
                    if (data) {
                        if (data.Description && data.Description !== '' && data.Description !== null) {
                            this.setState({
                                orgDescription: data.Description
                            })
                        }
                    }
                });
            //نام سازمان
            fetch(`${configPort.TetaSport}${configUrl.GetOrganizationName}`, {
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
                        if (data.Name && data.Name !== '' && data.Name !== null) {
                            this.setState({
                                orgName: data.Name
                            })
                        }
                    }
                });
        }
    }

    render() {
        let firstnameFa = this.state.orgName;
        let intrest = this.state.orgDescription;

        document.getElementsByTagName("title")[0].innerHTML = `سازمان | تتا اسپرت`;

        return (
            <div className='orgProfileInfo' style={{ height: 90, width: '100%', background: '#fff' }}>
                <div>
                    <h3 className={`col-12 ${localStorage.getItem('theme') === 'dark' ? 'orgProfileInfo-playerName--dark' : 'orgProfileInfo-playerName'}`} style={{ fontFamily: 'IRANYekanBold' }}><span id='InfoOrgName'>{firstnameFa}</span> </h3>
                    <br />
                    <p id='InfoOrgDescription' className='orgProfileInfo-playerText' style={{ direction: 'rtl' }}>{intrest}</p>
                </div>
            </div>
        );
    }
}

// کامپوننت برای بخش اطلاعات تیم
export class TeamEditLeftBoxInfo extends Component {
    static displayName = TeamEditLeftBoxInfo.name;

    constructor(props) {
        super(props);
        this.state = {
            orgLeagueNumber: 0,
        }

    }

    componentDidMount() {
        let orgID = this.props.children.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        var form = new FormData();
        form.append('OrgID', orgIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0 && localStorage.getItem('exID') !== null && localStorage.getItem('exID') !== '' && localStorage.getItem('exID') !== '0') {
            //توضیحات سازمان
            fetch(`${configPort.TetaSport}${configUrl.GetOrganizationLeaguesNumber}`, {
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
                        if (data.NumberOfLeagues && data.NumberOfLeagues !== '' && data.NumberOfLeagues !== null) {
                            if (data.NumberOfLeagues !== 0 && data.NumberOfLeagues !== '0') {
                                this.setState({
                                    orgLeagueNumber: `${data.NumberOfLeagues} عدد`
                                })
                            } else {
                                this.setState({
                                    orgLeagueNumber: '0'
                                })
                            }
                        }
                    }
                });
        }
    }

    render() {
        const { orgLeagueNumber } = this.state;
        return (
            <div className='orgProfileLeftBox-Info'>
                <div className='orgProfileLeftBox-Info-topLeft'></div>
                <div className='orgProfileLeftBox-Info-topRight'></div>
                <div className='orgProfileLeftBox-Info-bottomRight'></div>
                <div className='orgProfileLeftBox-Info-bottomLeft'></div>
                <div className='row'>
                    <div className='col-md-12'>
                        <span className='orgProfileLeftBox-Info-txts'>تعداد لیگ ها {orgLeagueNumber}</span>
                    </div>
                </div>
            </div>
        );
    }
}

// Avatars کردن Fetch کامپوننت برای
export class TeamEditAvatar extends Component {
    static displayName = TeamEditAvatar.name;

    constructor(props) {
        super(props);
        this.state = {
            Avatar: '',
        }
    }

    componentDidMount() {
        let orgID = this.props.children.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        var form = new FormData();
        form.append('OrgID', orgIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0) {
            fetch(`${configPort.TetaSport}${configUrl.GetOrganizationAvatar}`, {
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
                        this.setState({ Avatar: data.Avatar });
                    }
                });
        }
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
                <div id='orgImgAvatar' className={`${localStorage.getItem('theme') === 'dark' ? 'orgProfileAvatar--dark' : 'orgProfileAvatar'}`} style={{ backgroundImage: 'url(src/icon/orgProfileDefaultAvatar.png)', backgroundSize: 'cover' }}></div>
            );
        }

    }
}

// Categories کامپوننت بخش
export class TeamEditCategories extends Component {
    static displayName = TeamEditCategories.name;

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
                <Fragment>
                    <span className='ham-categories-icon' id='categories-icon' onClick={this.handdleburger}></span>
                    <div className='profileContent-right-border-left orgProfileContent-right-padding-top' id='categoryItems'>
                        <Nav className="list-group list-group-padingRight-Customize" style={{ paddingRight: '5%', paddingLeft: '5%', paddingTop: 15 }}>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/teamProfile/players/${teamID}`}>لیست بازیکنان تیم</NavLink>
                            </NavItem>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/team/addplayer/${teamID}`}>ویرایش بازیکن</NavLink>
                            </NavItem>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/teamProfile/leagues/${teamID}`}>لیگ های تیم</NavLink>
                            </NavItem>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/teamProfile/about/${teamID}`}>درباره تیم</NavLink>
                            </NavItem>
                            <div className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom'>
                                <span id='edit' className='list-group-item-link-padding-display ' style={{ cursor: 'pointer' }}>ویرایش پروفایل تیم</span>
                            </div>
                        </Nav>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <span className='ham-categories-icon' id='categories-icon' onClick={this.handdleburger}></span>
                    <div className='profileContent-right-border-left orgProfileContent-right-padding-top' id='categoryItems'>
                        <Nav className="list-group list-group-padingRight-Customize" style={{ paddingRight: '5%', paddingLeft: '5%', paddingTop: 15 }}>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/teamProfile/players/${teamID}`}>لیست بازیکنان تیم</NavLink>
                            </NavItem>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/teamProfile/leagues/${teamID}`}>لیگ های تیم</NavLink>
                            </NavItem>
                            <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                                <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/teamProfile/about/${teamID}`}>درباره تیم</NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                </Fragment>
            );
        }
    }
} 

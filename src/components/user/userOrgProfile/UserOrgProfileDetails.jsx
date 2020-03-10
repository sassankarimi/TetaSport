import React, { Component, Fragment } from 'react';
import '../../../css/NavMenu.css';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import { LogoutSoft } from '../logout/UserLogout';
import EditUserOrgProfileModal from './EditUserOrgProfileModal';
import Hashids from 'hashids';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

// عکس بنر یوزر Fetch کامپوننت برای
export class UserOrgProfileBanner extends Component {
    static displayName = UserOrgProfileBanner.name;

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

    render() {
        let photoCover = 'src/backgrounds/orgProfileDefaultBanner.png';
        if (this.state.coverPhoto && this.state.coverPhoto !== 'null' && this.state.coverPhoto !== null && this.state.coverPhoto !== undefined && this.state.coverPhoto !== '') {
            photoCover = this.state.coverPhoto;
        }
        return (
            <div id='orgBgCover' className='profileBanner' style={{
                backgroundImage: 'url(' + photoCover + ')',
                width: '100%', backgroundSize: 'cover', backgroundPosition: 'center center',
            }}></div>
        );
    }
}

// کامپوننت برای بخش اطلاعات یوزر
export class UserOrgProfileInfo extends Component {
    static displayName = UserOrgProfileInfo.name;
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

        //توضیحات سازمان
        fetch(`${configPort.TetaSport}${configUrl.GetOrganizationDescription}`, {
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

    render() {
        let firstnameFa = this.state.orgName;
        let intrest = this.state.orgDescription;

        document.getElementsByTagName("title")[0].innerHTML = `سازمان | تتا اسپرت`;

        return (
            <div className={`${localStorage.getItem('theme') === 'dark' ? 'orgProfileInfo--dark' : 'orgProfileInfo'}`} style={{ height: 90, width: '100%' }}>
                <div>
                    <h3 className={`col-12 ${localStorage.getItem('theme') === 'dark' ? 'orgProfileInfo-playerName--dark' : 'orgProfileInfo-playerName'}`} style={{ fontFamily: 'IRANYekanBold' }}><span id='InfoOrgName'>{firstnameFa}</span> </h3>
                    <br />
                    <p id='InfoOrgDescription' className='orgProfileInfo-playerText' style={{ direction: 'rtl' }}>{intrest}</p>
                </div>
            </div>
        );
    }
}

// کامپوننت برای بخش اطلاعات یوزر
export class UserOrgProfileLeftBoxInfo extends Component {
    static displayName = UserOrgProfileLeftBoxInfo.name;

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
export class UserOrgProfileAvatar extends Component {
    static displayName = UserOrgProfileAvatar.name;

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
export class UserOrgProfileCategories extends Component {
    static displayName = UserOrgProfileCategories.name;

    constructor(props) {
        super(props);
        this.state = {
            notificationNum: 1,
            myLeaguesNum: 0,
            myTeamsNum: 0,
            mySportsNum: 0,
            isHamOpen: false,
        }
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
        let orgID = this.props.children.props.match.params.orgId;
        return (
            <Fragment>
                <span className={`${localStorage.getItem('theme') === 'dark' ? 'ham-categories-icon--dark' : 'ham-categories-icon'}`} id='categories-icon' onClick={this.handdleburger}></span>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-right-border-left--dark' : 'profileContent-right-border-left'} profileContent-right-padding-top`} id='categoryItems'>
                    <Nav className="list-group list-group-padingRight-Customize" style={{ paddingRight: '5%', paddingLeft: '5%', paddingTop: 15 }}>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/pro/organization/${orgID}`}>تصاویر</NavLink>
                        </NavItem>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/pro/organization/videos/${orgID}`}>ویدیو ها</NavLink>
                        </NavItem>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/pro/organization/media/${orgID}`}>اضافه کردن عکس و ویدیو</NavLink>
                        </NavItem>
                        <EditUserOrgProfileModal {...this.props} />
                    </Nav>
                </div>
            </Fragment>
        );
    }
} 

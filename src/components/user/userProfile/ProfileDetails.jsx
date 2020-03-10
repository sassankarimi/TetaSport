import React, { Component, Fragment } from 'react';
import '../../../css/NavMenu.css';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import EditMyProfileModal from './EditMyProfileModal';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';


// متغییر های سراسری
let urlUsername = '';
let urlArray = [];

// عکس بنر یوزر Fetch کامپوننت برای
export class ProfileBanner extends Component {
    static displayName = ProfileBanner.name;

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

    componentDidMount() {
        var form = new FormData();

        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', localStorage.getItem('view_profile'));
        if (localStorage.getItem('view_profile') && localStorage.getItem('view_profile') !== 0) {
            fetch(`${configPort.TetaSport}${configUrl.GetUserCoverPhoto}`, {
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
                        return 'out';
                    case 500:
                        return false;
                    default:
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

        let photoCover = 'src/icon/profBanner.png';
        if (this.state.coverPhoto && this.state.coverPhoto !== 'null') {
            let photoCoverBase64 = this.state.coverPhoto;
            photoCover = photoCoverBase64;
        }

        return (
            <div id='userBgCover' className='profileBanner' style={{
                width: '100%', backgroundImage: `url(${photoCover})`, backgroundSize: 'cover', backgroundPosition: 'center center',
            }}></div>
        );
    }
}

// کامپوننت برای بخش اطلاعات یوزر
export class ProfileInfo extends Component {
    static displayName = ProfileInfo.name;

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            family: '',
            userName: '',
            intrest: '',
            countOfFav: 0,
        }
    }

    componentDidMount() {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', localStorage.getItem('view_profile'));
        if (localStorage.getItem('view_profile') && localStorage.getItem('view_profile') !== 0) {
            form.append('MyProfile', false);
            fetch(`${configPort.TetaSport}${configUrl.GetUserProfileItems}`, {
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
                        this.setState({
                            name: data.Name,
                            userName: data.Username,
                            intrest: data.Status,
                            countOfFav: data.UserFavoriteSports3.length,
                        });
                    }
                });
        }
    }

    render() {
        let firstnameFa = '';
        let username = '';
        let intrest = '';
        let usernameInWebTitle = '';
        if (this.state.name && this.state.name !== '') {
            firstnameFa = this.state.name;
        }
        if (this.state.userName && this.state.userName !== '') {
            username = `(${this.state.userName})`;
            usernameInWebTitle = `${this.state.userName}`;
            // تایتل صفحه
            document.getElementsByTagName("title")[0].innerHTML = `پروفایل ${usernameInWebTitle} | تتا اسپرت`;
        } else {
            document.getElementsByTagName("title")[0].innerHTML = `پروفایل شما | تتا اسپرت`;
        }
        if (this.state.intrest && this.state.intrest !== '') {
            intrest = this.state.intrest;
        }

        return (
            <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileInfo--dark' : 'profileInfo'}`} style={{ height: 55, width: '100%', background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : '#fff' }}>
                <ProfileAvatar {...this.props} />
                <div className='profileInfo-spliter'>
                    <h3 className={`col-12 ${localStorage.getItem('theme') === 'dark' ? 'profileInfo-playerName--dark' : 'profileInfo-playerName'}`} style={{ fontFamily: 'IRANYekanBold' }}><span id='userUsernameSpan' className={`${localStorage.getItem('theme') === 'dark' ? 'profileInfo-userName--dark' : 'profileInfo-userName'}`}>{username}</span> <span id='userNameAndFamilySpan'>{firstnameFa}</span> </h3>
                    <br />
                    <span id='userIntrestSpan' className='profileInfo-playerText' style={{ direction: 'rtl' }}>{intrest}</span>
                </div>
            </div>
        );
    }
}

//  ورزش های مورد علاقه Fetch کامپوننت برای
export class ProfileSports extends Component {
    static displayName = ProfileSports.name;

    constructor(props) {
        super(props)
        this.state = {
            ThreeSports: '',
        }
    }

    getMoreSports = () => {
        // نمایش ورزش های بیشتر
        let sports = document.getElementsByClassName('noShowSport');
        for (var i = 0, len = sports.length; i < len; i++) {
            sports[i].style.display = 'inline-block';
        }
        //  حذف آیکون ورزش ها بیشتر
        document.getElementById('getMoreSports').style.display = 'none';
        //  نمایش آیکون ورزش ها کمتر
        document.getElementById('getLessSports').style.display = 'inline-block';

    }

    getLessSports = () => {
        // حذف ورزش های اضافه شده
        let sports = document.getElementsByClassName('noShowSport');
        for (var i = 0, len = sports.length; i < len; i++) {
            sports[i].style.display = 'none';
        }
        //  حذف آیکون ورزش ها کمتر
        document.getElementById('getLessSports').style.display = 'none';
        //  نمایش آیکون ورزش ها بیشتر
        document.getElementById('getMoreSports').style.display = 'inline-block';

    }

    async componentDidMount() {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', localStorage.getItem('exID'));


        await fetch(`${configPort.TetaSport}${configUrl.GetUserProfileItems}`, {
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
                    this.setState({ ThreeSports: JSON.stringify(data.UserFavoriteSports3) });
                }
            });

    }

    render() {
        if (this.state.ThreeSports.length) {

            let sportItem = JSON.parse(this.state.ThreeSports);

            return (
                <div className='profileSports'>

                    {
                        sportItem.map((value, index) => {
                            return <div key={index} className='profileSports-items profileSports-items-All-Sports'><img src={`src/icon/${value.SportID}.png`} alt={`${value.SportTitle}`} /></div>
                        })
                    }
                    <div id='getMoreSports' className='profileSports-items profileSports-items-more'>
                        <img src={require('../../../css/assets/icon/more.png')} alt='more' />
                    </div>
                    <div id='getLessSports' className='profileSports-items profileSports-items-more' onClick={this.getLessSports} style={{ display: 'none' }}>
                        <img src={require('../../../css/assets/icon/less.png')} alt='less' />
                    </div>
                </div>)
        } else {
            return (
                null
            )
        }
    }
}

// Avatars کردن Fetch کامپوننت برای
export class ProfileAvatar extends Component {
    static displayName = ProfileAvatar.name;

    constructor(props) {
        super(props);
        this.state = {
            Avatar: '',
        }
    }

    async componentDidMount() {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', localStorage.getItem('view_profile'));
        form.append('MyProfile', false);
        if (localStorage.getItem('view_profile') && localStorage.getItem('view_profile') !== 0) {
            await fetch(`${configPort.TetaSport}${configUrl.GetUserAvatar}`, {
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
                        this.setState({ Avatar: data.Avatar });
                    }
                });
        }
    }

    render() {

        if (this.state.Avatar !== '' && this.state.Avatar !== null) {
            return (
                <Fragment>
                    <div id='userImgAvatar' className={`${localStorage.getItem('theme') === 'dark' ? 'profileAvatarUser--dark' : 'profileAvatarUser'}`} style={{ backgroundImage: 'url(' + this.state.Avatar + ')', backgroundSize: 'cover' }}></div>
                </Fragment>
            );
        } else {
            return (
                <div id='userImgAvatar' className={`${localStorage.getItem('theme') === 'dark' ? 'profileAvatarUser--dark' : 'profileAvatarUser'}`} style={{ backgroundImage: 'url(src/icon/defaultAvatar.png)', backgroundSize: 'cover' }}></div>
            );
        }


    }
}

// Categories کامپوننت بخش
export class ProfileCategories extends Component {
    static displayName = ProfileCategories.name;

    constructor(props) {
        super(props);
        this.state = {
            notificationNum: 0,
            myLeaguesNum: 0,
            myTeamsNum: 0,
            mySportsNum: 0,
            isHamOpen: false,
            auth: false,
            remainingCredit:null,
        }
        //Url پیمایش
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
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
        //آیا پروفایل خودش است
        let form = new FormData();
        form.append('PlayerID', localStorage.getItem('view_profile'));
        form.append('UserID', localStorage.getItem('exID'));
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0) {
            fetch(`${configPort.TetaSport}${configUrl.IsMe}`, {
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
                        LogoutSoft({ ...this.props });
                        return false;
                    case 420:
                        return false;
                    default:
                        return false;
                }
            }).then(data => {
                if (data) {
                    if (data.Result === 'true') {
                        this.setState({
                            auth: true,
                        })
                    }
                }
            })
        } else {
            this.setState({
                auth: false,
            })
        }

        //تعداد لیگ های باقی مانده کاربر
        let form1 = new FormData();
        form1.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetRemainingUserCredit}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('Token')
            },
            body: form1
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
                    if (data.RemainingCredit) {
                        this.setState({
                            remainingCredit: data.RemainingCredit
                        });
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

    handdleburger = () => {
        this.setState({
            isHamOpen: !this.state.isHamOpen,
        });
        if (localStorage.getItem('theme') === 'dark') {
            if (!this.state.isHamOpen) {
                document.getElementById('categories-icon').style.backgroundImage = 'url(/src-dark/icon/closeSideBar.png)';
                document.getElementById('contentItems').style.display = 'none';
                document.getElementById('categoryItems').style.display = 'block';
            } else {
                document.getElementById('categories-icon').style.backgroundImage = 'url(/src-dark/icon/sideBarMenuButton.png)';
                document.getElementById('categoryItems').style.display = 'none';
                document.getElementById('contentItems').style.display = 'block';
            }
        } else {
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
        const { remainingCredit } = this.state;
        return (
            <Fragment>
                <span className={`${localStorage.getItem('theme') === 'dark' ? 'ham-categories-icon--dark' : 'ham-categories-icon'}`} id='categories-icon' onClick={this.handdleburger}></span>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-right-border-left--dark' : 'profileContent-right-border-left'} profileContent-right-padding-top`} id='categoryItems'>
                    <Nav className="list-group list-group-padingRight-Customize" style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                        {this.state.auth && <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/profile/notifications/${urlUsername}`}>اعلانات<span className="badge badge-pill badge-success categories-badge-customize">{(this.state.notificationNum !== 0) ? this.state.notificationNum : null}</span></NavLink >
                        </NavItem>}
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/profile/myLeagues/${urlUsername}`}>لیگ های من<span className="badge badge-pill badge-success categories-badge-customize">{(this.state.myLeaguesNum !== 0) ? this.state.myLeaguesNum : null}</span></NavLink >
                        </NavItem>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/profile/myTeams/${urlUsername}`}>تیم های من<span className="badge badge-pill badge-success categories-badge-customize">{(this.state.myTeamsNum !== 0) ? this.state.myTeamsNum : null}</span></NavLink >
                        </NavItem>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/profile/myOrgs/${urlUsername}`}>سازمان های من<span className="badge badge-pill badge-success categories-badge-customize">{(this.state.myTeamsNum !== 0) ? this.state.myTeamsNum : null}</span></NavLink >
                        </NavItem>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/profile/aboutMe/${urlUsername}`}>درباره من<span className="badge badge-pill badge-success categories-badge-customize">{(this.state.mySportsNum !== 0) ? this.state.mySportsNum : null}</span></NavLink >
                        </NavItem>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/profile/payments/${urlUsername}`}>صورت حساب<span className="badge badge-pill badge-success categories-badge-customize">{(this.state.mySportsNum !== 0) ? this.state.mySportsNum : null}</span></NavLink >
                        </NavItem>
                        {this.state.auth && remainingCredit !== null && <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark list-group-item-fontFam--dark' : 'list-group-item-hover list-group-item-fontFam'} list-group-item list-group-item-no-border list-group-item-no-padding  list-group-item-border-top-and-buttom list-group-item-logOut`} style={{ cursor: 'default' }}>
                            <span className='list-group-item-link-padding-display'>مانده اعتبار : <span className='badge-remainingCount-profile' title={`شما مجاز به ساخت ${remainingCredit} لیگ می باشید`}>{remainingCredit}</span></span>
                        </NavItem>}
                        {this.state.auth && <EditMyProfileModal {...this.props} />}
                        <br />
                        {this.state.auth && <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark list-group-item-fontFam--dark' : 'list-group-item-hover list-group-item-fontFam'} list-group-item list-group-item-no-border list-group-item-no-padding  list-group-item-border-top-and-buttom list-group-item-logOut`} onClick={() => { Logout({ ...this.props }) }}>
                            <span className='list-group-item-link-padding-display'>خروج از حساب</span>
                        </NavItem>}
                    </Nav>
                </div>
            </Fragment >
        );
    }
} 

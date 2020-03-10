import React, { Component, Fragment } from 'react';
import '../../../css/NavMenu.css';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let urlUsername = '';
let urlArray = [];

// عکس بنر یوزر Fetch کامپوننت برای
export class PlayerProfileBanner extends Component {
    static displayName = PlayerProfileBanner.name;

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
export class PlayerProfileInfo extends Component {
    static displayName = PlayerProfileInfo.name;

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
                            intrest: data.UserAboutMe,
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
        if (this.state.name && this.state.name !== '') {
            firstnameFa = this.state.name;
        }
        if (this.state.userName && this.state.userName !== '') {
            username = this.state.userName;
            // تایتل صفحه
            document.getElementsByTagName("title")[0].innerHTML = `پروفایل ${username} | تتا اسپرت`;
        } else {
            document.getElementsByTagName("title")[0].innerHTML = `پروفایل شما | تتا اسپرت`;
        }
        if (this.state.intrest && this.state.intrest !== '') {
            intrest = this.state.intrest;
        }

        return (
            <div className='profileInfo' style={{ height: 55, width: '100%', background: '#fff' }}>
                <PlayerProfileAvatar {...this.props} />
                <div className='profileInfo-spliter'>
                    <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'profileInfo-playerName--dark' : 'profileInfo-playerName'} col-12`} style={{ fontFamily: 'IRANYekanBold' }}>(<span id='userUsernameSpan' className={`${localStorage.getItem('theme') === 'dark' ? 'profileInfo-userName--dark' : 'profileInfo-userName'}`}>{username}</span>) <span id='userNameAndFamilySpan'>{firstnameFa}</span> </h3>
                    <br />
                    <span id='userIntrestSpan' className='profileInfo-playerText' style={{ direction: 'rtl' }}>{intrest}</span>
                </div>
            </div>
        );
    }
}

//  ورزش های مورد علاقه Fetch کامپوننت برای
export class PlayerProfileSmallSports extends Component {
    static displayName = PlayerProfileSmallSports.name;

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

        form.append('PlayerID', localStorage.getItem('view_profile'));
        form.append('UserID', localStorage.getItem('exID'));
        form.append('MyProfile', false);
        if (localStorage.getItem('view_profile') && localStorage.getItem('view_profile') !== 0) {
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

                </div>)
        } else {
            return (
                null
            )
        }
    }
}

// Avatars کردن Fetch کامپوننت برای
export class PlayerProfileAvatar extends Component {
    static displayName = PlayerProfileAvatar.name;

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
export class PlayerProfileCategories extends Component {
    static displayName = PlayerProfileCategories.name;

    constructor(props) {
        super(props);
        this.state = {
            isHamOpen: false,
        }
        //split url and save values to array
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
            case 3:
                urlUsername = splitStr[3];
                break;
            case 4:
                urlUsername = splitStr[3];
                break;
            default:
        }
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
        return (
            <Fragment>
                <span className='ham-categories-icon' id='categories-icon' onClick={this.handdleburger}></span>
                <div className='profileContent-right-border-left profileContent-right-padding-top' id='categoryItems'>
                    <Nav className="list-group list-group-padingRight-Customize" style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                        <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                            <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/player/myLeagues/${urlUsername}`}>لیگ های من</NavLink >
                        </NavItem>
                        <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                            <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/player/myTeams/${urlUsername}`}>تیم های من</NavLink >
                        </NavItem>
                        <NavItem className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom' onClick={this.categoryClicked}>
                            <NavLink className='list-group-item-link-padding-display' activeClassName='list-group-item-active' to={`/player/aboutMe/${urlUsername}`}>درباره من</NavLink >
                        </NavItem>
                        <br />
                        <br />
                        <br />
                    </Nav>
                </div>
            </Fragment>
        );
    }
} 

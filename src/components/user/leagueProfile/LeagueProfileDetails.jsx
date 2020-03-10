import React, { Component, Fragment } from 'react';
import '../../../css/NavMenu.css';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);

// عکس بنر لیگ Fetch کامپوننت برای
export class LeagueProfileBanner extends Component {
    static displayName = LeagueProfileBanner.name;

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
        let leagueID = this.props.children.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueCoverPhotoID}`, {
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
                    this.setState({ coverPhoto: data.CoverPhotoID });
                }
            });
    }

    render() {
        let photoCover = '';
        if (this.state.coverPhoto && this.state.coverPhoto !== 'null') {
            photoCover = this.state.coverPhoto;
        }
        return (
            <div
                id='leagueBgCover'
                className='leagueProfileBanner'
                style={{ height: 252, width: '100%', backgroundImage: `url(/src/backgrounds/leagueDefaultBackground${photoCover}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center center', }}
            >
                <LeagueProfileAllInformations {...this.props} />
            </div>
        );
    }
}

// اطلاعات کلی لیگ موجود در بخش بنر لیگ Fetch کامپوننت برای
export class LeagueProfileAllInformations extends Component {
    static displayName = LeagueProfileAllInformations.name;

    constructor(props) {
        super(props);
        this.state = ({
            LeagueAllInfo: [],
        });
    }

    async componentDidMount() {
        let leagueID = this.props.children.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        let form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        await fetch(`${configPort.TetaSport}${configUrl.GetLeagueInfoOnCoverPhoto}`, {
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
                    if (data.MSG) {

                    } else {
                        this.setState({
                            LeagueAllInfo: data,
                        });

                    }
                }
            });
    }

    render() {
        let allInfo = this.state.LeagueAllInfo;
        if (allInfo.length !== 0) {
            let english = /^[A-Za-z][A-Za-z0-9]*$/;
            if (english.test(allInfo.LeagueTitle)) {
                document.getElementsByTagName("title")[0].innerHTML = `${allInfo.SportTitle}|${allInfo.City}|تتا اسپرت|${allInfo.LeagueTitle}`;
            } else {
                document.getElementsByTagName("title")[0].innerHTML = `${allInfo.LeagueTitle}|${allInfo.SportTitle}|${allInfo.City}|تتا اسپرت`;
            }

        }
        return (
            <Fragment>
                <div className='leagueAllInfoInOne'>
                    <h3 style={{ fontSize: 20 }}>{allInfo.SportTitle}</h3>
                    <p>وضعیت اجرا: {allInfo.LeagueStatus}</p>
                    <p>تاریخ شروع: {allInfo.StartDate}</p>
                    <p>تاریخ پایان: {allInfo.EndDate}</p>
                    <p>شهر: {allInfo.City}</p>
                    <p>جنسیت: {allInfo.GenderCategory}</p>
                    <p>رده سنی: {allInfo.AgeCategory}</p>
                    <p>تعداد تیم: {allInfo.TeamsCount}</p>
                </div>
            </Fragment>
        );

    }

}

// لیگ Avatar کردن Fetch کامپوننت برای
export class LeagueProfileAvatar extends Component {
    static displayName = LeagueProfileAvatar.name;

    constructor(props) {
        super(props);
        this.state = {
            Avatar: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            isloading: true,
        }
    }

    componentDidMount() {
        let leagueID = this.props.children.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueAvatar}`, {
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
                    this.setState({ isloading: false });
                    return response.json();
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    this.setState({ isloading: false });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Avatar !== null) {
                        this.setState({ Avatar: data.Avatar });
                    } else {
                        this.setState({ Avatar: 'src/profilePic/leagueProfileAvatarDefault.png' });
                    }
                }
            });

    }

    render() {
        return (
            <Fragment>
                <div id='leagueImgAvatar' className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileAvatar--dark' : 'leagueProfileAvatar'}`} style={{ backgroundImage: 'url(' + this.state.Avatar + ')', backgroundSize: 'cover' }}></div>
            </Fragment>
        );
    }
}

// کامپوننت برای بخش اطلاعات لیگ
export class LeagueProfileInfo extends Component {
    static displayName = LeagueProfileInfo.name;

    constructor(props) {
        super(props);
        this.state = {
            info: [],
        }
    }

    async componentDidMount() {
        let leagueID = this.props.children.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        await fetch(`${configPort.TetaSport}${configUrl.GetLeagueAdminInfo}`, {
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
            <Fragment>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileInfo--dark' : 'leagueProfileInfo'}`} style={{ height: 72, width: '100%' }}>
                    <div>
                        <h3 id='sc-league-name' className={`col-12 ${localStorage.getItem('theme') === 'dark' ? 'leagueProfileInfo-LeagueName--dark' : 'leagueProfileInfo-LeagueName'}`} style={{ fontFamily: 'IRANYekanBold', direction: 'rtl' }}>لیگ {info.LeagueTitle}</h3>
                        <br />
                        <p id='userIntrestSpan' className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileInfo-LeagueText--dark' : 'leagueProfileInfo-LeagueText'}`} style={{ direction: 'rtl' }}>سازنده لیگ: <a style={{ color: `${localStorage.getItem('theme') === 'dark' ? '#7982da' : '#12a60f'}` }} className='link-hover-defaultStyle' href={`/profile/${info.AdminUsername}`} target={info.AdminUsername}>{info.AdminName}</a></p>
                    </div>
                </div>
            </Fragment>
        );
    }
}

// Categories کامپوننت بخش
export class LeagueProfileCategories extends Component {
    static displayName = LeagueProfileCategories.name;

    constructor(props) {
        super(props);
        this.state = {
            leagueStructure: 0,
            isLeagueAdmin: false,
            isHamOpen: false,
        }
    }

    componentDidMount() {
        //آیا ادمین لیگ است
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', leagueIdDecoded);
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== '' && localStorage.getItem('exID') !== null && localStorage.getItem('exID') !== undefined) {
            fetch(`${configPort.TetaSport}${configUrl.IsLeagueAdmin}`, {
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
                }
            });

        } else {
            this.setState({
                isLeagueAdmin: false,
            })
        }


        form.append('LeagueID', leagueIdDecoded);
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueStructure}`, {
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
                    this.setState({ leagueStructure: data.StructID });
                }
            });
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
        let categoriesLinkUrI = '';
        if (this.props.match.params.seoTxt !== undefined) {
            categoriesLinkUrI = this.props.match.params.seoTxt + '/' + this.props.match.params.leagueId;
        } else {
            categoriesLinkUrI = this.props.match.params.leagueId;
        }
        return (
            <Fragment>
                <span className={`${localStorage.getItem('theme') === 'dark' ? 'ham-categories-icon--dark' : 'ham-categories-icon'}`} id='categories-icon' onClick={this.handdleburger}></span>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-right-border-left--dark' : 'profileContent-right-border-left'} profileContent-right-padding-top`} id='categoryItems'>
                    <Nav className="list-group list-group-padingRight-Customize" style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/leagueProfile/matchInfo/L/${categoriesLinkUrI}`}>
                                اطلاعات مسابقات
                         <span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueCategorieActiveArrow--dark' : 'leagueCategorieActiveArrow'}`}></span>
                            </NavLink >
                        </NavItem>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/leagueProfile/matchLists/L/${categoriesLinkUrI}`}>
                                لیست بازیها
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueCategorieActiveArrow--dark' : 'leagueCategorieActiveArrow'}`}></span>
                            </NavLink >
                        </NavItem>
                        {
                            (this.state.leagueStructure === 1 || this.state.leagueStructure === '1')
                                ?
                                <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                                    <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/leagueProfile/leagueTable/L/${categoriesLinkUrI}`}>
                                        جدول لیگ/اطلاعات آماری
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueCategorieActiveArrow--dark' : 'leagueCategorieActiveArrow'}`}></span>
                                    </NavLink >
                                </NavItem>
                                :
                                <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                                    <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/leagueProfile/leagueTable/L/${categoriesLinkUrI}`}>
                                        جدول لیگ/اطلاعات آماری
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueCategorieActiveArrow--dark' : 'leagueCategorieActiveArrow'}`}></span>
                                    </NavLink >
                                </NavItem>
                        }

                        {
                            (this.state.leagueStructure === 2 || this.state.leagueStructure === '2')
                                ?
                                <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                                    <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/leagueProfile/leagueGraph/L/${categoriesLinkUrI}`}>
                                        گراف حذفی
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueCategorieActiveArrow--dark' : 'leagueCategorieActiveArrow'}`}></span>
                                    </NavLink >
                                </NavItem>
                                :
                                null
                        }


                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/leagueProfile/gallery/L/${categoriesLinkUrI}`}>
                                عکس ها
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueCategorieActiveArrow--dark' : 'leagueCategorieActiveArrow'}`}></span>
                            </NavLink >
                        </NavItem>
                        <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                            <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/leagueProfile/videos/L/${categoriesLinkUrI}`}>
                                ویدیوها
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueCategorieActiveArrow--dark' : 'leagueCategorieActiveArrow'}`}></span>
                            </NavLink >
                        </NavItem>
                        {
                            this.state.isLeagueAdmin &&
                            <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark' : 'list-group-item-hover'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom`} onClick={this.categoryClicked}>
                                <NavLink className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-link-padding-display--dark' : 'list-group-item-link-padding-display'}`} activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item-active--dark' : 'list-group-item-active'}`} to={`/leagueProfile/uploadmedia/L/${categoriesLinkUrI}`}>
                                    افزودن عکس و ویدیو
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueCategorieActiveArrow--dark' : 'leagueCategorieActiveArrow'}`}></span>
                                </NavLink>
                            </NavItem>
                        }
                    </Nav>
                </div>
            </Fragment>
        );
    }
} 

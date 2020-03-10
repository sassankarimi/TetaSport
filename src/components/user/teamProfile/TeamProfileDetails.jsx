import React, { Component, Fragment } from 'react';
import '../../../css/NavMenu.css';
import { toast } from 'react-toastify';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

// عکس بنر یوزر Fetch کامپوننت برای
export class TeamProfileBanner extends Component {
    static displayName = TeamProfileBanner.name;

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
        if (this.state.coverPhoto && this.state.coverPhoto !== 'null') {
            photoCover = this.state.coverPhoto;
        }

        return (
            <div id='userBgCover' className='profileBanner' style={{
                width: '100%', backgroundImage: `url(/src/backgrounds/teamBgs/teamBg${photoCover}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center center',
            }}></div>
        );
    }
}

// کامپوننت برای بخش اطلاعات یوزر
export class TeamProfileInfo extends Component {
    static displayName = TeamProfileInfo.name;

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
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت | تیم ${(info.TeamName !== '' && info.TeamName !== undefined && info.TeamName !== null) ? info.TeamName : ''} `;
        return (
            <Fragment>
                <div className='teamProfileInfo' style={{width: '100%', background: '#EFF5F5' }}>
                    <div>
                        <span className={`col-12 ${localStorage.getItem('theme') === 'dark' ? 'leagueProfileInfo-LeagueName--dark' : 'leagueProfileInfo-LeagueName'}`} style={{ fontFamily: 'IRANYekanBold', direction: 'rtl' }}>تیم {info.TeamName}</span>
                        <br />
                        <span id='userIntrestSpan' className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileInfo-LeagueText--dark' : 'leagueProfileInfo-LeagueText'}`} style={{ direction: 'rtl' }}>سازنده تیم: <a style={{ color: `${localStorage.getItem('theme') === 'dark' ? '#7982da' : '#0D6A12'}` }} href={`profile/${info.TeamAdminUsername}`} className='link-hover-defaultStyle' target={info.TeamAdminUsername}>{info.TeamAdminName}</a></span>

                        <span className='teamProfileInfo-leftDetails'>{info.SportFieldTitle}/{info.GenderTitle}/{info.AgeCategoryTitle}</span>
                    </div>
                </div>
            </Fragment>
        );
    }
}

// Avatars کردن Fetch کامپوننت برای
export class TeamProfileAvatar extends Component {
    static displayName = TeamProfileAvatar.name;

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
                    <div id='userImgAvatar' className='profileAvatar-e' style={{ backgroundImage: 'url(' + this.state.Avatar + ')', backgroundSize: 'cover' }}></div>
                </Fragment>
            );
        } else {
            return (
                <div id='userImgAvatar' className='profileAvatar-e' style={{ backgroundImage: 'url(src/icon/leagueProfileAvatarDefault.png)', backgroundSize: 'cover' }}></div>
            );
        }


    }
}

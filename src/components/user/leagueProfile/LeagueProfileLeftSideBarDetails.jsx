import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import Hashids from 'hashids';
import IziToast from 'izitoast';
import 'react-leaflet-fullscreen/dist/styles.css'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import FullscreenControl from 'react-leaflet-fullscreen';
import {
    TwitterShareButton,
    TelegramShareButton,
    FacebookShareButton,
    LinkedinShareButton,
} from 'react-share';
import { handleMSG } from '../../../jsFunctions/all.js';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';


// متغییر های سراسری
let lgId = '';
let urlArray = [];
let hashid = new Hashids('', 7);


// کامپوننت تنظیمات لیگ
export class LeagueSettingShortcut extends Component {
    static displayName = LeagueSettingShortcut.name;

    constructor(props) {
        super(props);
        this.state = {
            isLeagueAdmin: false,
        }
        //پیمایش در Url
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
            case 4:
                if (splitStr[4] !== '') {
                    lgId = splitStr[4];
                }
                break;
            case 5:
                if (splitStr[5] !== '') {
                    lgId = splitStr[5];
                }
                break;
            default:
        }
    }

    componentDidMount() {
        let leagueID = this.props.children.props.match.params.leagueId;
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

    }

    goTosettings = () => {
        this.props.history.push(`/leagueSettings/${lgId}`);
    }

    render() {
        const { isLeagueAdmin } = this.state;
        if (isLeagueAdmin) {
            return (
                <div className='leagueProfileContent-left-toolsBar'>
                    <p className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-settingText--dark' : 'leagueProfileContent-left-toolsBar-settingText'}`}>تنظیمات لیگ</p>
                    <div className='leagueProfileContent-left-toolsBar-setting'>
                        <a href={`/leagueSettings/${lgId}`} target={`leagueSetting-${lgId}`}><div className='leagueProfileContent-left-toolsBar-settingIcon-container'><span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-settingIcon--dark' : 'leagueProfileContent-left-toolsBar-settingIcon'}`}></span></div></a>
                    </div>
                </div>
            )
        } else {
            return null
        }

    }

}

// کامپوننت مشاهده شرکت کنندگان لیگ
export class LeagueSettingPlayersListShortcut extends Component {
    static displayName = LeagueSettingPlayersListShortcut.name;

    constructor(props) {
        super(props);
        this.state = {
            isLeagueAdmin: false,
        }
        //پیمایش در Url
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
            case 4:
                if (splitStr[4] !== '') {
                    lgId = splitStr[4];
                }
                break;
            case 5:
                if (splitStr[5] !== '') {
                    lgId = splitStr[5];
                }
                break;
            default:
        }
    }

    goTosettings = () => {
        this.props.history.push(`/leagueSettings/playersList/${lgId}`);
    }

    render() {
        return (
            <div className='leagueProfileContent-left-toolsBar'>
                <p className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-settingText--dark' : 'leagueProfileContent-left-toolsBar-settingText'}`}>بازیکنان</p>
                <div className='leagueProfileContent-left-toolsBar-setting'>
                    <a href={`/leagueSettings/playersList/${lgId}`} target={lgId}><div className='leagueProfileContent-left-toolsBar-settingIcon-container'><span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-playersList-settingIcon--dark' : 'leagueProfileContent-left-toolsBar-playersList-settingIcon'}`}></span></div></a>
                </div>
            </div>
        )
    }

}

// کامپوننت مشاهده شرکت کنندگان لیگ
export class LeagueSettingEditMyTeamsShortcut extends Component {
    static displayName = LeagueSettingEditMyTeamsShortcut.name;

    constructor(props) {
        super(props);
        this.state = {
            isLeagueAdmin: false,
            isLeagueTeamAdmin: false,
        }
        //پیمایش در Url
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
            case 4:
                if (splitStr[4] !== '') {
                    lgId = splitStr[4];
                }
                break;
            case 5:
                if (splitStr[5] !== '') {
                    lgId = splitStr[5];
                }
                break;
            default:
        }
    }


    componentDidMount() {
        let leagueID = this.props.children.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', leagueIdDecoded);
        fetch(`${configPort.TetaSport}${configUrl.IsLeagueTeamAdmin}`, {
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
                        isLeagueTeamAdmin: true,
                    })
                } else {
                    this.setState({
                        isLeagueTeamAdmin: false,
                    })
                }
            }
        });
    }

    goTosettings = () => {
        this.props.history.push(`/leagueSettings/playersList/${lgId}`);
    }

    render() {
        if (this.state.isLeagueTeamAdmin) {
            return (
                <div className='leagueProfileContent-left-toolsBar'>
                    <p className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-settingText--dark' : 'leagueProfileContent-left-toolsBar-settingText'}`}>ویرایش تیم های من در لیگ</p>
                    <div className='leagueProfileContent-left-toolsBar-setting'>
                        <a href={`/leagueSettings/editMyTeams/${lgId}`} target={lgId}><div className='leagueProfileContent-left-toolsBar-settingIcon-container'><span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-playersArrange-settingIcon--dark' : 'leagueProfileContent-left-toolsBar-playersArrange-settingIcon'}`}></span></div></a>
                    </div>
                </div>
            )
        } else {
            return (
                null
            )
        }
    }
}

// کامپوننت نتایج آخرین بازی برگذار شده
export class LeagueLastMatchDetails extends Component {
    static displayName = LeagueLastMatchDetails.name;

    constructor(props) {
        super(props);
        this.state = {
            lastMatchInfo: [],
            notDone: false,
            defaultTeamAvatar: '',
        }
    }

    componentDidMount() {
        let leagueID = this.props.children.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLatestFinishedMatch}`, {
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
                    this.setState({ defaultTeamAvatar: '/src/profilePic/leagueProfileAvatarDefault.png', });
                    return false;
            }
        }).then(data => {
            if (data) {
                if (data.MSG) {
                    this.setState({
                        notDone: true,
                        lastMatchInfo: data.MSG,
                    });
                } else {
                    this.setState({
                        notDone: false,
                        lastMatchInfo: data,
                        defaultTeamAvatar: '/src/profilePic/leagueProfileAvatarDefault.png',
                    });
                }

            }
        });
    }


    render() {
        let lastMatchInfo = this.state.lastMatchInfo;
        let teamIsWinner = this.state.lastMatchInfo.Winner;
        let team1Win = false;
        let team2Win = false;
        switch (teamIsWinner) {
            case 'Team1':
                team1Win = true;
                break;
            case 'Team2':
                team2Win = true;
                break;
            case 'Draw':
            case 'draw':
                team1Win = false;
                team2Win = false;
                break;
            default:
        }
        if (this.state.notDone) {
            return (
                null
            )
        } else {
            let defaultAvatar = this.state.defaultTeamAvatar;
            let team1Avatar = '';
            let team2Avatar = '';
            if (lastMatchInfo.Team1Avatar && lastMatchInfo.Team1Avatar !== null) {
                team1Avatar = `${lastMatchInfo.Team1Avatar}`;
            } else {
                team1Avatar = defaultAvatar;
            }
            if (lastMatchInfo.Team2Avatar && lastMatchInfo.Team2Avatar !== null) {
                team2Avatar = `${lastMatchInfo.Team2Avatar}`;
            } else {
                team2Avatar = defaultAvatar;
            }
            let team1ID = hashid.encode(lastMatchInfo.Team1ID)
            let team2ID = hashid.encode(lastMatchInfo.Team2ID)

            if (lastMatchInfo.length !== 0) {
                return (
                    <div className='leagueProfileContent-left-toolsBar'>
                        <p className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-settingText--dark' : 'leagueProfileContent-left-toolsBar-settingText'}`}>نتیجه آخرین بازی برگزارشده</p>
                        <div className='row'>
                            <div className='col' style={{ marginBottom: 20 }}>
                                <span className='lastMatchResult-winnerTeam-right' style={{ display: (team1Win) ? '' : 'none' }}></span>
                                <a className='LastMatchTeamWonTeam-name-hover' href={`teamProfile/${team1ID}`} target={team1ID}><img className='LastMatchTeamWonTeam-avatar' src={team1Avatar} alt={lastMatchInfo.Team1Name} /></a>
                                <a className='LastMatchTeamWonTeam-name-hover' href={`teamProfile/${team1ID}`} target={team1ID}><span className='LastMatchTeamWonTeamName'>{lastMatchInfo.Team1Name}</span></a>
                                <span className='LastMatchTeamWonTeamGoalCount'>{lastMatchInfo.Team1Goals}</span>
                            </div>
                            <div className='col'>
                                <a className='LastMatchTeamWonTeam-name-hover' href={`teamProfile/${team2ID}`} target={team2ID}><img className='LastMatchTeamWonTeam-avatar' src={team2Avatar} alt={lastMatchInfo.Team2Name} /></a>
                                <span className='lastMatchResult-winnerTeam-left ' style={{ display: (team2Win) ? '' : 'none' }}></span>
                                <a className='LastMatchTeamWonTeam-name-hover' href={`teamProfile/${team2ID}`} target={team2ID}><span className='LastMatchTeamWonTeamName'>{lastMatchInfo.Team2Name}</span></a>
                                <span className='LastMatchTeamWonTeamGoalCount'>{lastMatchInfo.Team2Goals}</span>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    null
                )
            }

        }

    }

}

// کامپوننت آدرس محل برگذاری
export class LeagueLocation extends Component {
    static displayName = LeagueLocation.name;

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            lat: 0,
            lng: 0,
        }
    }

    componentDidMount() {
        let leagueID = this.props.children.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        let form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueLocationInfo}`, {
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
                this.setState({
                    address: data.Address,
                    lat: data.Latitude,
                    lng: data.Longitude,
                });
            }
        })
    }

    //آیکون نقشه
    suitcasePoint = new L.Icon({
        iconUrl: `${localStorage.getItem('theme') === 'dark' ? `/src-dark/icon/marker-icon-1.png` : `/src/icon/marker-icon-1.png`}`,
        iconRetinaUrl: `${localStorage.getItem('theme') === 'dark' ? `/src-dark/icon/marker-icon-1.png` : `/src/icon/marker-icon-1.png`}`,
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [40, 40],
        shadowSize: [29, 40],
        shadowAnchor: [7, 40],
    })

    render() {
        const position = [this.state.lat, this.state.lng];
        return (
            <div className='myLeafletContainer' style={{ height: 180, width: '100%' }}>
                <Map center={position} maxZoom={18} zoom={13} zoomOffset={1}
                >
                    <TileLayer
                        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    <Marker position={position} icon={this.suitcasePoint}
                    >
                        <Popup>
                            {this.state.address}
                        </Popup>
                    </Marker>
                    <FullscreenControl position="topleft" />
                </Map>
            </div>
        )

    }

}

// کامپوننت دوستان خود را به این لیگ دعوت کنید
export class LeagueTellYourFriend extends Component {
    static displayName = LeagueTellYourFriend.name;
    constructor(props) {
        super(props);
        this.state = {
            lid: this.props.children.props.match.params.leagueId,
            isMoreShareBtn: false,
        }
    }

    copyToclipBoard = () => {
        let copyText = document.getElementById("CopyMyValue");
        copyText.select();
        document.execCommand("copy");
    }

    showMoreShare = () => {
        document.getElementById('more-ShareBtns').style.opacity = 1;
        document.getElementById('more-ShareBtns').style.visibility = 'visible';
        document.getElementById('more-ShareBtns').style.display = 'block';
    }
    hideMoreShare = () => {
        document.getElementById('more-ShareBtns').style.opacity = 0;
        document.getElementById('more-ShareBtns').style.visibility = 'hideen';
        document.getElementById('more-ShareBtns').style.display = 'none';
    }

    handleMoreShare = () => {
        this.setState({ isMoreShareBtn: !this.state.isMoreShareBtn });
        if (!this.state.isMoreShareBtn) {
            document.getElementById('more-ShareBtns').style.display = 'block';
            document.getElementById('more-ShareBtns').style.opacity = 1;
            document.getElementById('more-ShareBtns').style.visibility = 'visible';
        } else {
            document.getElementById('more-ShareBtns').style.display = 'none';
            document.getElementById('more-ShareBtns').style.opacity = 0;
            document.getElementById('more-ShareBtns').style.visibility = 'hideen';
        }
    }


    render() {

        return (
            <Fragment>
                <div className='row'>
                    <div className='col-md-8 col-sm-12'>
                        <input className={`${localStorage.getItem('theme') === 'dark' ? 'recuritAFriendText--dark' : 'recuritAFriendText'}`} id='CopyMyValue' value={`https://tetasport.ir/leagueProfile/matchInfo/L/${this.state.lid}`} onChange={(e) => e.preventDefault} readOnly />
                    </div>
                    <div className='col-md-4 col-sm-12' style={{ paddingRight: 0 }}>
                        <button className={`${localStorage.getItem('theme') === 'dark' ? 'recuritAFriendButton--dark' : 'recuritAFriendButton'}`} onClick={this.copyToclipBoard} title='کپی کردن لینک'>
                            <span className='recuritAFriendButton-copy-icon' id='recuit-copy'></span>
                        </button>
                    </div>
                </div>

                <div className='row' style={{ marginTop: 20, marginBottom: 5 }}>
                    <div className='col' style={{ paddingLeft: 0 }}>
                        <TelegramShareButton url={`${configPort.TetaSport}/leagueProfile/matchInfo/L/${this.state.lid}`}>
                            <span className='shareLeagueIcon' style={{ background: `${localStorage.getItem('theme') === 'dark' ? `url('/src-dark/icon/leagueTelegramShare.png')` : `url('/src/icon/leagueTelegramShare.png')`}` }} title='تلگرام'></span>
                        </TelegramShareButton>
                    </div>
                    <div className='col' style={{ padding: 0 }}>
                        <span id='shareLeagueIcon-all' className='shareLeagueIcon' style={{ background: `${localStorage.getItem('theme') === 'dark' ? `url('/src-dark/icon/leagueShare.png')` : `url('/src/icon/leagueShare.png')`}` }} onClick={this.handleMoreShare}></span>
                    </div>
                    <div className='col' style={{ paddingRight: 0 }}>
                        <TwitterShareButton url={`${configPort.TetaSport}/leagueProfile/matchInfo/L/${this.state.lid}`}>
                            <span className='shareLeagueIcon' style={{ background: `${localStorage.getItem('theme') === 'dark' ? `url('/src-dark/icon/leagueTwShare.png')` : `url('/src/icon/leagueTwShare.png')`}` }} title='تویتر'></span>
                        </TwitterShareButton>
                    </div>
                </div>

                <div className='row more-ShareBtns-container' id='more-ShareBtns-container'>
                    <div className='col-md-12'>
                        <div className='more-ShareBtns' id='more-ShareBtns'>
                            <FacebookShareButton url={`${configPort.TetaSport}/leagueProfile/matchInfo/L/${this.state.lid}`}>
                                <span className='shareLeagueIcon' style={{ background: `${localStorage.getItem('theme') === 'dark' ? `url('/src-dark/icon/social-fb.png')` : `url('/src/icon/social-fb.png')`}` }} title='فیسبوک'></span>
                            </FacebookShareButton>
                            <LinkedinShareButton url={`${configPort.TetaSport}/leagueProfile/matchInfo/L/${this.state.lid}`}>
                                <span className='shareLeagueIcon' style={{ background: `${localStorage.getItem('theme') === 'dark' ? `url('/src-dark/icon/social-in.png')` : `url('/src/icon/social-in.png')`}` }} title='لینکدین'></span>
                            </LinkedinShareButton>
                        </div>
                    </div>
                </div>
            </Fragment>
        )

    }

}

// کامپوننت گذارش تخلف
export class LeagueReport extends Component {
    static displayName = LeagueReport.name;

    constructor(props) {
        super(props);
        this.state = {
            report: '',
        }
    }

    sendReport = () => {
        if (this.state.report !== '') {
            if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0) {
                let leagueID = this.props.children.props.match.params.leagueId;
                let leagueIdDecoded = hashid.decode(leagueID);
                var form = new FormData();
                form.append('LeagueID', leagueIdDecoded);
                form.append('UserID', localStorage.getItem('exID'));
                form.append('Report', this.state.report);
                fetch(`${configPort.TetaSport}${configUrl.AddInfReport}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('Token')
                    },
                    body: form
                }).then(response => {
                    let code = response.status;
                    switch (code) {
                        case 201:
                            this.setState({ report: '' });
                            IziToast.success({
                                close: false,
                                closeOnEscape: true,
                                timeout: 1500,
                                position: 'center'
                            });
                            return true;
                        case 420:
                            LogoutSoft({ ...this.props });
                            return false;
                        default:
                            handleMSG(code, response.json());
                            return false;
                    }
                });
            } else {
                toast.info(" برای ارسال گزارش تخلف باید ثبت نام کنید", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            toast.error("لطفا متن گزارش را وارد کنید", { position: toast.POSITION.TOP_CENTER });
        }
    }

    render() {
        return (
            <Fragment>
                <textarea className={`${localStorage.getItem('theme') === 'dark' ? 'LeagueReportTxt--dark' : 'LeagueReportTxt'}`} value={this.state.report} onChange={(e) => { this.setState({ report: e.target.value }) }}></textarea>
                <button className={`btn btn-success ${localStorage.getItem('theme') === 'dark' ? 'LeagueReportBtn--dark' : 'LeagueReportBtn'}`} onClick={this.sendReport}>
                    ارسال
                </button>
            </Fragment>
        )

    }

}

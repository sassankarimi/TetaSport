import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import IziToast from 'izitoast';
import { toast } from 'react-toastify';
import { handleMSG } from '../../../jsFunctions/all.js';
import { LogoutSoft } from '../logout/UserLogout';
import Logout from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);


export class LeagueProfileEditMyTeam extends Component {
    static displayName = LeagueProfileEditMyTeam.name;

    constructor(props) {
        super(props);
        this.state = {
            timeOut: 0,
            searchValue: '',
            searchPrevValue: '',
            loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            searchPlayers: [],
            exceptThesePlayers: [],
            TshirtNumber: '',
            whoIsCaptain: '',
            isLoading: false,
            myTeam: 0,
            teams: [],
        }
    }

    componentDidMount() {
        //دریافت تیم
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetMyLeagueTeams}`, {
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
                case 500:
                    this.setState({ isLoading: false, noResultTxt: 'خطای سرور' })
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    this.setState({ isLoading: false, })
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({
                        teams: data.Teams,
                        isLoading: false,
                    });
                }
            });
    }

    // توابع بخش سرچ
    handleSearchBox = (e) => {
        let searchTxt = e.target.value;
        this.setState({
            searchValue: e.target.value,
        })
        if (e.target.value !== '') {
            document.getElementById('createTeam-search-result').style.opacity = 1;
            document.getElementById('createTeam-search-result').style.visibility = 'visible';
            document.getElementById('createTeam-search-result').style.zIndex = 10000;
        } else {
            document.getElementById('createTeam-search-result').style.opacity = 0;
            document.getElementById('createTeam-search-result').style.visibility = 'hidden';
            document.getElementById('createTeam-search-result').style.zIndex = -1;
        }

        if (e.target.value !== '') {
            if (this.state.timeOut) clearTimeout(this.state.timeOut);
            this.setState({
                searchPlayers: [],
                loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
                timeOut: setTimeout(() => { this.getSearchPlayers(searchTxt) }, 1300),
            })
            //تابع سرچ
        } else {
            this.setState({
                searchPlayers: [],
                loadingOrNoResult: null
            })
        }
    }

    getSearchPlayers = (txt) => {
        this.setState({
            loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        });
        //دریافت بازیکنان
        var form = new FormData();
        form.append('SearchText', txt);
        for (let i = 0; i < this.state.exceptThesePlayers.length; i++) {
            let EceptArray = [];
            EceptArray.push(this.state.exceptThesePlayers[i].PlayerID);
            form.append('ExceptTheseIDs[]', EceptArray);
        }
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.SearchAmongAllPlayersButList}`, {
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
                case 210:
                    return response.json();
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    handleMSG(code, response.json());
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Players) {
                        if (data.Players.length !== 0) {
                            this.setState({
                                searchPlayers: data.Players,
                                loadingOrNoResult: null,
                            });
                        } else {
                            this.setState({
                                loadingOrNoResult: 'چیزی برای نمایش موجود نیست',
                                searchPlayers: [],
                            });
                        }
                    }
                    if (data.MSG210) {
                        this.setState({
                            loadingOrNoResult: data.MSG210,
                        });
                    }
                }
            });
    }

    addNewPlayerToTeam = (playerID, playerName, playerUserName, avatar) => {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', playerID);
        form.append('TeamID', teamIdDecoded);
        form.append('LeagueID', leagueIdDecoded);
        fetch(`${configPort.TetaSport}${configUrl.AddPlayerToLeagueTeam}`, {
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
                    IziToast.success({
                        close: false,
                        closeOnEscape: true,
                        timeout: 1500,
                        position: 'center'
                    });
                    return response.json();
                case 401:
                    Logout({ ...this.props });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    handleMSG(code, response.json());
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    let obj = { 'PlayerID': playerID, 'Name': playerName, 'Username': playerUserName, 'Avatar': avatar, 'KitNumber': data.KitNumber };
                    this.setState({
                        searchPlayers: [...this.state.searchPlayers, obj],
                        exceptThesePlayers: [...this.state.exceptThesePlayers, obj],
                    })
                }
            });

        document.getElementById('createTeam-search-result').style.opacity = 0;
        document.getElementById('createTeam-search-result').style.visibility = 'hidden';
        document.getElementById('createTeam-search-result').style.zIndex = -1;



    }

    deleteTeamFromLeague = (playerId) => {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        let allPlayer = this.state.exceptThesePlayers;
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);

        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', playerId);
        form.append('TeamID', teamIdDecoded);
        form.append('LeagueID', leagueIdDecoded);

        let strToInt = parseInt(this.state.captainIs)
        if (playerId !== this.state.captainIs && playerId !== strToInt) {
            fetch(`${configPort.TetaSport}${configUrl.RemovePlayerFromLeagueTeam}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                },
                body: form
            }).then(response => {
                let code = response.status;
                switch (code) {
                    case 204:
                        IziToast.success({
                            close: false,
                            closeOnEscape: true,
                            timeout: 1500,
                            position: 'center'
                        });
                        return true;
                    case 401:
                        Logout({ ...this.props });
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    default:
                        handleMSG(code, response.json());
                        return false;
                }
            }).then(
                data => {
                    if (data) {
                        let filtered = allPlayer.filter((player) => {
                            return (
                                player.PlayerID !== playerId
                            )
                        })
                        let obj = filtered;
                        this.setState({
                            exceptThesePlayers: obj,
                        })
                    }
                });
        } else {
            toast.error(
                <div className='toasty-div'>
                    <span className='toasty-header'>بازیکن انتخابی کاپیتان است</span>
                    <span className='toasty-body'>کاپیتان را تغییر داده و دوباره تلاش کنید</span>
                </div>
                , { position: toast.POSITION.TOP_CENTER }
            );
        }

    }

    handleSearchBtn = () => {
        this.setState({
            searchPlayers: [],
        })
        if (this.state.searchValue !== '') {
            this.getSearchPlayers(this.state.searchValue);
            document.getElementById('createTeam-search-result').style.opacity = 1;
            document.getElementById('createTeam-search-result').style.visibility = 'visible';
            document.getElementById('createTeam-search-result').style.zIndex = 10000;
        }
    }

    handleCaptain = (playerID, hashedID) => {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);

        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', playerID);
        form.append('TeamID', teamIdDecoded);
        form.append('LeagueID', leagueIdDecoded);

        fetch(`${configPort.TetaSport}${configUrl.UpdateLeagueTeamCaptain}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('Token')
            },
            body: form
        }).then(response => {
            let code = response.status;
            switch (code) {
                case 204:
                    return true;
                case 401:
                    Logout({ ...this.props });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    handleMSG(code, response.json());
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({ captainIs: playerID });
                    let allGreens = document.getElementsByClassName('cap-team');
                    for (let i = 0; i < allGreens.length; i++) {
                        allGreens[i].classList.remove('cap-team');
                    }
                    document.getElementById(hashedID).classList.add('cap-team');
                }
            });
    }

    //هندل شماره لباس
    handleTshirt = (playerID, value) => {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        let onlyNum = /^\d*$/;
        if (onlyNum.test(value) && value <= 99 && 1 <= value.length <= 2) {
            let teamID = this.props.match.params.teamId;
            let teamIdDecoded = hashid.decode(teamID);
            var form = new FormData();
            form.append('UserID', localStorage.getItem('exID'));
            form.append('PlayerID', playerID);
            form.append('TeamID', teamIdDecoded);
            form.append('KitNumber', value);
            form.append('LeagueID', leagueIdDecoded);

            fetch(`${configPort.TetaSport}${configUrl.UpdateLeaguePlayerKitNumber}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                },
                body: form
            }).then(response => {
                let code = response.status;
                switch (code) {
                    case 204:
                        this.setState({
                            TshirtNumber: playerID
                        })
                        return true;
                    case 401:
                        Logout({ ...this.props });
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    default:
                        handleMSG(code, response.json());
                        return false;
                }
            })
        }
    }

    //تابع دریافت تیم پس از تغییر مقدار 
    getNewFromTeam = () => {

    }


    //هندل تیم
    handleMyTeam = (e) => {
        this.setState({
            myTeam: e.target.value
        });
        this.getNewFromTeam();
    }

    render() {
        const { teams, exceptThesePlayers } = this.state;
        let isTeamZero = true;
        if (teams.length !== 0) {
            isTeamZero = false;
        }
        return (
            <Fragment>
                <div className='leagueProfileContent-center-container-matchLists'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h1 className='editMyTeamTitle'>ویرایش تیم های من</h1>
                        </div>
                        <div className='col-md-12'>
                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createTeamThreeSelectBoxStyle-new--dark' : 'createTeamThreeSelectBoxStyle-new'}`} id="createTeam-leagueSport" style={{ color: '#fff', fontFamily: 'iranyekanRegular', opacity: (isTeamZero) ? '0.5' : '1', cursor: (isTeamZero) ? 'not-allowed' : 'pointer' }} disabled={isTeamZero} value={this.state.myTeam} onChange={this.handleMyTeam} title='انتخاب تیم'>
                                <option className='createTeamThreeSelectBoxStyle-new-Options' value={0} style={{ display: 'none' }}>انتخاب تیم</option>
                                {
                                    teams.map((t, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <option className='createTeamThreeSelectBoxStyle-new-Options' value={t.TeamID} style={{ color: '#fff', fontSize: 10 }}>{t.TeamName}</option>
                                            </Fragment>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className='row'>
                        {
                            exceptThesePlayers.map((player, index) => {
                                let hashedPlayerID = hashid.encode(player.PlayerID)
                                let userName = player.Username;
                                let playerAvatar = '/src/profilePic/defaultAvatar.png';
                                if (player.Avatar !== null && player.Avatar !== undefined && player.Avatar !== '') {
                                    playerAvatar = player.Avatar;
                                }
                                let playerKit = '';
                                if (player.KitNumber !== null && player.KitNumber !== undefined) {
                                    playerKit = player.KitNumber;
                                }
                                return (
                                    <Fragment key={index}>
                                        <div className='col-md-6'>
                                            <div className='newTeam-playerList'>
                                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'newteam-playerCard-container--dark' : 'newteam-playerCard-container'}`}>
                                                    <a className='teamProfile-members-player-link' href={`profile/${userName}`} target={userName}><img className='newteam-playerCard-img' src={playerAvatar} title={player.PlayerName} alt={player.PlayerName} /></a>
                                                    <a className='teamProfile-members-player-link' href={`profile/${userName}`} target={userName}>
                                                        <span className='newteam-playerCard-playerName'>{player.Name}</span>
                                                    </a>
                                                    <div className={`teamProf-playerCard-cap newProf-playerCard-cap ${(player.Captain) ? 'cap-team' : 'no-cap-team'}`} id={hashedPlayerID} title='کاپیتان تیم' onClick={() => { this.handleCaptain(player.PlayerID, hashedPlayerID) }}></div>
                                                    <div className='newteam-playerCard-playerTshirt-container'>
                                                        <div className='newteam-playerCard-playerTshirt'>
                                                            <input type="text" className='newTeam-Tshirt-input form-control' placeholder='شماره پیراهن' defaultValue={playerKit} onChange={(e) => { this.handleTshirt(player.PlayerID, e.target.value) }} minLength={0} maxLength={2} />
                                                        </div>
                                                    </div>
                                                    <div className='newTeam-delete-player' onClick={() => { this.deleteTeamFromLeague(player.PlayerID) }} title='حذف' />
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            })
                        }
                    </div>
                </div>
            </Fragment>
        )

    }
}

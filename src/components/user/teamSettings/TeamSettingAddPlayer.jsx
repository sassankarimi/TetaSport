import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { toast } from 'react-toastify';
import IziToast from 'izitoast';
import { handleMSG } from '../../../jsFunctions/all.js';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);

export class TeamSettingAddPlayer extends Component {
    static displayName = TeamSettingAddPlayer.name;
    constructor(props) {
        super(props);
        this.state = {
            timeOut: 0,
            searchValue: '',
            searchPrevValue: '',
            loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            searchPlayers: [],
            exceptThesePlayers: [],
            captainIs: 0,
        }
    }

    componentDidMount() {
        //دریافت تیم
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetTeamMembers}`, {
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
                    handleMSG(code, response.json());
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({
                        exceptThesePlayers: data.TeamPlayers,
                    });
                    data.TeamPlayers.map((p) => {
                        if (p.Captain) {
                            this.setState({
                                captainIs: p.PlayerID,
                            });
                        }
                        return false;
                    })

                }
            });
    }

    handleSearchBox = (e) => {
        let searchTxt = e.target.value;
        this.setState({
            searchValue: e.target.value,
        })
        if (e.target.value !== '') {
            document.getElementById('teamSetting-search-result').style.opacity = 1;
            document.getElementById('teamSetting-search-result').style.visibility = 'visible';
            document.getElementById('teamSetting-search-result').style.zIndex = 10000;
        } else {
            document.getElementById('teamSetting-search-result').style.opacity = 0;
            document.getElementById('teamSetting-search-result').style.visibility = 'hidden';
            document.getElementById('teamSetting-search-result').style.zIndex = -1;
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
        let obj = { 'PlayerID': playerID, 'Name': playerName, 'Username': playerUserName, 'Avatar': avatar };
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);

        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', playerID);
        form.append('TeamID', teamIdDecoded);
        fetch(`${configPort.TetaSport}${configUrl.AddPlayerToTeam}`, {
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
                    this.setState({
                        searchPlayers: [...this.state.searchPlayers, obj],
                        exceptThesePlayers: [...this.state.exceptThesePlayers, obj],
                    })
                }
            });

        document.getElementById('teamSetting-search-result').style.opacity = 0;
        document.getElementById('teamSetting-search-result').style.visibility = 'hidden';
        document.getElementById('teamSetting-search-result').style.zIndex = -1;



    }

    handleSearchBtn = () => {
        this.setState({
            searchPlayers: [],
            searchPrevValue: this.state.searchValue,
        })
        if (this.state.searchValue !== '') {
            this.getSearchPlayers(this.state.searchValue);
            document.getElementById('teamSetting-search-result').style.opacity = 1;
            document.getElementById('teamSetting-search-result').style.visibility = 'visible';
            document.getElementById('teamSetting-search-result').style.zIndex = 10000;
        }

    }
    handleCaptain = (e) => {
        let playerID = e.target.value;
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);

        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', playerID);
        form.append('TeamID', teamIdDecoded);
        fetch(`${configPort.TetaSport}${configUrl.UpdateTeamCaptain}`, {
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
                }
            });
    }
    deleteTeamFromLeague = (playerId) => {
        let allPlayer = this.state.exceptThesePlayers;
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);

        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', playerId);
        form.append('TeamID', teamIdDecoded);

        let strToInt = parseInt(this.state.captainIs)
        if (playerId !== this.state.captainIs && playerId !== strToInt) {
            fetch(`${configPort.TetaSport}${configUrl.RemovePlayerFromTeam}`, {
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

    goToTeamProfile = () => {
        let teamID = this.props.match.params.teamId;
        this.props.history.push(`/teamProfile/${teamID}`)
    }

    render() {
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت | افزودن بازیکن به تیم `;
        const { searchPlayers, exceptThesePlayers } = this.state;

        return (
            <Fragment>
                <div className='teamSetting-container'>
                    <div className='row teamSetting-searchbox-and-results-container'>
                        {/* بخش سرچ باکس */}
                        <div className="input-group teamSetting-searchbox-styles" style={{ direction: 'ltr' }}>
                            <input className="form-control py-2 border" type="search" placeholder='بازیکن مورد نظر را به تیم اضافه کنید' style={{ height: 58, textAlign: 'right', fontFamily: 'iranyekanBold', background: '#F3F3F3' }} value={this.state.searchValue} onChange={this.handleSearchBox} />
                            <span className="input-group-append">
                                <button className="btn btn-outline-secondary border-left-0 border " type="button" style={{ background: '#F3F3F3', paddingBottom: 0, }} onClick={this.handleSearchBtn}>
                                    <span style={{ border: '1px solid #4A4A4A', height: 45, display: 'inline-block' }}></span>
                                    <span className='teamSetting-searchbox-btn'></span>
                                </button>
                            </span>
                        </div>
                        <div className='teamSetting-search-result' id='teamSetting-search-result'>

                            <div className='row'>
                                <div style={{ width: '100%', fontFamily: 'iranYekanBold', fontSize: 15 }}>
                                    {this.state.loadingOrNoResult}
                                </div>

                                {
                                    searchPlayers.map((player, index) => {
                                        let playerAvatar = '/src/icon/defaultAvatar.png';

                                        if (player.PlayerAvatar !== null && player.PlayerAvatar !== undefined && player.PlayerAvatar !== '') {
                                            playerAvatar = player.PlayerAvatar;
                                        }
                                        let userName = `(${player.PlayerUsername})`

                                        return (
                                            <Fragment key={index}>
                                                <div className='col-md-12'>
                                                    <div className='createTeam-search-result-contain'>
                                                        <div className='createTeam-search-result-contain-contain' onClick={() => { this.addNewPlayerToTeam(player.PlayerID, player.PlayerName, player.PlayerUsername, player.PlayerAvatar) }}>
                                                            <div className='createTeam-search-result-contain-avatar'>
                                                                <img src={playerAvatar} className='createTeam-search-result-contain-avatar-img' alt={player.PlayerName} />
                                                            </div>

                                                            <div className='createTeam-search-result-contain-txt'>
                                                                <span className='createTeam-search-result-contain-text-spn'>{player.PlayerName} {userName}</span>
                                                            </div>

                                                            <div className='createTeam-search-result-contain-plus'></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                }

                            </div>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='addplayer-header'>
                            <img className='addplayer-header-img' src='/src/icon/addplayerInteamSet-dark.png' alt='add player' />
                            <span className='addplayer-header-txt'>افزودن بازیکن</span>
                        </div>
                    </div>
                    <div className='row' style={{ paddingTop: 15, marginTop: 40 }}>
                        <div className='addplayer-playerList-header'>
                            <span className='addplayer-playerList-header-txt'>لیست بازیکن </span>
                            <div className='addplayer-select-container'>
                                <select value={this.state.captainIs} onChange={this.handleCaptain} className="form-control addplayer-select" style={{ fontFamily: 'iranYekanRegular', fontSize: 12 }}>
                                    <option value='0' style={{ color: '#000', fontFamily: 'iranYekanRegular', fontSize: 12, display: 'none' }}>
                                        انتخاب کنید
                                    </option>
                                    {
                                        exceptThesePlayers.map((player, index) => {

                                            return (
                                                <Fragment key={index}>
                                                    <option value={player.PlayerID} style={{ color: '#000', fontFamily: 'iranYekanRegular', fontSize: 12 }}>
                                                        {player.Name}
                                                    </option>
                                                </Fragment>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='row' style={{ paddingTop: 15, marginTop: 25 }}>
                        <div className='addplayer-playerList'>

                            {
                                exceptThesePlayers.map((player, index) => {

                                    return (
                                        <Fragment key={index}>
                                            <div className='addplayer-playerList-items'>
                                                <div className='addplayer-playerList-items-contain'>
                                                    <span className='addplayer-playerList-items-txt'>{player.Name} ({player.Username})</span>
                                                    <img className='addplayer-playerList-items-delete' src='/src/icon/delete-item.png' alt='delete' onClick={() => { this.deleteTeamFromLeague(player.PlayerID) }} />
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                })
                            }

                        </div>
                    </div>
                    <div className='row' style={{ textAlign: 'left' }}>
                        <div className='addplayer-btn-container'>
                            <div className='addplayer-btn' onClick={this.goToTeamProfile}>
                                <span className='addplayer-btn-txt'>پروفایل تیم</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

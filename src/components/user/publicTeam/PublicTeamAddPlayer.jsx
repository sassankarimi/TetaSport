import React, { Component, Fragment } from 'react';
import { LogoutSoft } from '../logout/UserLogout';
import Hashids from 'hashids';
import { toast } from 'react-toastify';
import IziToast from 'izitoast';
import { handleMSG } from '../../../jsFunctions/all.js';
import Logout from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);

export class PublicTeamAddPlayer extends Component {
    static displayName = PublicTeamAddPlayer.name;

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
        }
    }

    componentDidMount() {
        //دریافت تیم
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetTeamPlayers}`, {
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
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', playerID);
        form.append('TeamID', teamIdDecoded);
        fetch(`${configPort.TetaSport}${configUrl.AddPlayerToTeamNew}`, {
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
                    let obj = { 'PlayerID': playerID, 'Name': playerName, 'Username': playerUserName, 'Avatar': avatar, 'KitNumber': data.KitNumber};
                    this.setState({
                        searchPlayers: [],
                        exceptThesePlayers: [...this.state.exceptThesePlayers, obj],
                    })
                }
            });

        document.getElementById('createTeam-search-result').style.opacity = 0;
        document.getElementById('createTeam-search-result').style.visibility = 'hidden';
        document.getElementById('createTeam-search-result').style.zIndex = -1;



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
        let onlyNum = /^\d*$/;
        if (onlyNum.test(value) && value <= 99 && 1 <= value.length <= 2) {
            let teamID = this.props.match.params.teamId;
            let teamIdDecoded = hashid.decode(teamID);
            var form = new FormData();
            form.append('UserID', localStorage.getItem('exID'));
            form.append('PlayerID', playerID);
            form.append('TeamID', teamIdDecoded);
            form.append('KitNumber', value);
            fetch(`${configPort.TetaSport}${configUrl.UpdatePlayerKitNumber}`, {
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

    render() {
        const { searchPlayers, exceptThesePlayers } = this.state;
        return (
            <Fragment>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='row createTeam-searchbox-and-results-container createTeam-searchbox-and-results-container-addplayer'>
                            {/* بخش سرچ باکس */}
                            <div className="input-group newTeam-searchbox-styles" style={{ direction: 'ltr' }}>
                                <span className="input-group-append newTeamSearch-input-btn-container newTeamSearch-input-btn-container-addPlayer">
                                    <button className="btn" type="button" style={{ paddingBottom: 0 }}>
                                        <span className='newTeam-searchbox-btn' onClick={this.handleSearchBtn}></span>
                                    </button>
                                </span>
                                <input className="form-control py-2 newTeamSearch-input" type="search" placeholder='بازیکن مورد نظر را به تیم اضافه کنید' style={{ height: 50, textAlign: 'right', fontFamily: 'iranyekanBold', background: '#F3F3F3', color: (this.state.searchValue !== '') ? '#000' : '#D6D6D6', border: 'none' }} value={this.state.searchValue} onChange={this.handleSearchBox} />
                            </div>
                            <div className='newTeam-search-result' id='createTeam-search-result'>

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
            </Fragment>
        );
    }
}

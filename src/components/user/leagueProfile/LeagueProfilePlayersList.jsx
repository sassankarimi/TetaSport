import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

export default class LeagueProfilePlayersList extends Component {
    static displayName = LeagueProfilePlayersList.name;

    constructor(props) {
        super(props)
        this.state = {
            joinedTeams: true,
            exceptThesePlayers: [],
            TeamsTypeMember: [],
            TeamsReLoad: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            isLoading: false,
            teams: [],
            whichTeam: 0,
        }
    }

    componentDidMount() {
        //دریافت تیم
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form1 = new FormData();
        form1.append('UserID', localStorage.getItem('exID'));
        form1.append('LeagueID', leagueIdDecoded);
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueTeams}`, {
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

        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('TeamID', this.state.whichTeam);
        form.append('LeagueID', leagueIdDecoded);

        fetch(`${configPort.TetaSport}${configUrl.GetLeagueTeamPlayers}`, {
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
                    this.setState({ TeamsReLoad: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
                case 404:
                    this.setState({ TeamsReLoad: '' });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({ TeamsReLoad: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
                default:
                    this.setState({ TeamsReLoad: '' });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({
                        TeamsTypeCaptain: JSON.parse(JSON.stringify(data.TeamsTypeAdmin.Teams)),
                        TeamsTypeMember: JSON.parse(JSON.stringify(data.TeamsTypeMember.Teams)),
                    });

                    if (data.TeamsTypeAdmin.Teams.length === 0 && data.TeamsTypeMember.Teams.length === 0) {
                        this.setState({
                            TeamsReLoad: 'تیمی برای نمایش یافت نشد',
                        });
                    }
                }
            });

    }

    //تابع دریافت تیم پس از تغییر مقدار 
    getNewFromTeam = (teamID) => {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('TeamID', teamID);
        form.append('LeagueID', leagueIdDecoded);

        fetch(`${configPort.TetaSport}${configUrl.GetLeagueTeamPlayers}`, {
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
                    this.setState({ TeamsReLoad: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
                case 404:
                    this.setState({ TeamsReLoad: 'تیمی برای نمایش یافت نشد' });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({ TeamsReLoad: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
                default:
                    this.setState({ TeamsReLoad: '' });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.TeamPlayers) {
                        this.setState({
                            exceptThesePlayers: data.TeamPlayers,
                        })
                    } else {

                    }
                }
            });
    }

    //هندل تیم
    handleWhichTeam = (e) => {
        this.setState({
            whichTeam: e.target.value
        });
        this.getNewFromTeam(e.target.value);
    }

    render() {
        const { exceptThesePlayers, teams, TeamsReLoad } = this.state;
        if (exceptThesePlayers.length !== 0) {
            return (
                <Fragment>
                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-container-joinedTeam--dark' : 'profileContent-left-container-joinedTeam'}`} style={{ padding: 60, direction: 'rtl' }}>

                        <div className='row'>
                            <div className='col-md-12'>
                                <h1 className='profileContent-left-fontFam-favSports' style={{ marginBottom: 35, display: 'block' }}>شرکت کنندگان در لیگ</h1>
                                <select className={`${localStorage.getItem('theme') === 'dark' ? 'createTeamThreeSelectBoxStyle-new--dark' : 'createTeamThreeSelectBoxStyle-new'}`} id="createTeam-leagueSport" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.whichTeam} onChange={this.handleWhichTeam} title='تیم'>
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
                                            <div className='col-md-4'>
                                                <div className='newTeam-playerList'>
                                                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'newteam-playerCard-container--dark' : 'newteam-playerCard-container'}`}>
                                                        <a className='teamProfile-members-player-link' href={`profile/${userName}`} target={userName}><img className='newteam-playerCard-img' src={playerAvatar} title={player.PlayerName} alt={player.PlayerName} /></a>
                                                        <a className='teamProfile-members-player-link' href={`profile/${userName}`} target={userName}>
                                                            <span className='newteam-playerCard-playerName'>{player.Name}</span>
                                                        </a>
                                                        {(player.Captain) ? <div style={{ cursor: 'default' }} className={`teamProf-playerCard-cap newProf-playerCard-cap ${(player.Captain) ? 'cap-team' : 'no-cap-team'}`} id={hashedPlayerID} title='کاپیتان تیم'></div> : null}
                                                        <div className='newteam-playerCard-playerTshirt-container'>
                                                            <div className='newteam-playerCard-playerTshirt'>
                                                                <input type="text" className='newTeam-Tshirt-input form-control' placeholder='شماره پیراهن' defaultValue={playerKit} minLength={0} maxLength={2} readOnly style={{ cursor: 'default' }} />
                                                            </div>
                                                        </div>
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
        } else {
            return (
                <Fragment>
                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-container-joinedTeam--dark' : 'profileContent-left-container-joinedTeam'}`} style={{ padding: 60, direction: 'rtl' }}>

                        <div className='row'>
                            <div className='col-md-12'>
                                <h1 className='profileContent-left-fontFam-favSports' style={{ marginBottom: 35, display: 'block' }}>شرکت کنندگان در لیگ</h1>
                                <select className={`${localStorage.getItem('theme') === 'dark' ? 'createTeamThreeSelectBoxStyle-new--dark' : 'createTeamThreeSelectBoxStyle-new'}`} id="createTeam-leagueSport" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.whichTeam} onChange={this.handleWhichTeam} title='تیم'>
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
                            <div className='col-md-12' style={{ fontFamily: 'iranYekanBold', textAlign: 'center' }}>
                                {TeamsReLoad}
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }

    }
}
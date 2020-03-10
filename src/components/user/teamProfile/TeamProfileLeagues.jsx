import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { toast } from 'react-toastify';
import IziToast from 'izitoast';
import { handleMSG } from '../../../jsFunctions/all.js';
import TeamProfileEdit from './TeamProfileEdit';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);

export class TeamProfileLeagues extends Component {
    static displayName = TeamProfileLeagues.name;

    constructor(props) {
        super(props);
        this.state = {
            leagues: [],
            hasLeagues: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            isTeamPlayer: false,
            isTeamAdmin: false,
        }
    }

    componentDidMount() {
        //تیم
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        let form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetTeamLeagues}`, {
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
                case 404:
                    this.setState({
                        hasLeagues: <span style={{ fontFamily: 'iranYekanBold', fontSize: 14, textAlign: 'center' }}>موردی یافت نشد</span>
                    });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({
                        hasLeagues: <span style={{ fontFamily: 'iranYekanBold', fontSize: 14, textAlign: 'center' }}>خطای سرور</span>
                    });
                    return false;
                default:
            }
        }).then(
            data => {
                if (data) {
                    this.setState({
                        leagues: data.Leagues,
                    });
                    if (data.Leagues) {
                        if (data.Leagues.length === 0) {
                            this.setState({
                                hasLeagues: <span style={{ fontFamily: 'iranYekanBold', fontSize: 14, textAlign: 'center' }}>لیگی یافت نشد</span>,
                            });
                        } else {
                            this.setState({
                                hasLeagues: '',
                            });
                        }
                    }
                }
            });

        // کاربر لاگین شده؟
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));

        fetch(`${configPort.TetaSport}${configUrl.ThisUserIsTeamMember}`, {
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
                    if (data.Result === 'True') {
                        this.setState({
                            isTeamPlayer: true,
                        })
                    } else {
                        this.setState({
                            isTeamPlayer: false,
                        })
                    }
                }
            });
        // ادمین ؟
        fetch(`${configPort.TetaSport}${configUrl.ThisUserIsTeamAdmin}`, {
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
                    if (data.Result === 'True') {
                        this.setState({
                            isTeamAdmin: true,
                        })
                    } else {
                        this.setState({
                            isTeamAdmin: false,
                        })
                    }
                }
            });


    }

    removeMeFromThisTeam = (pID) => {
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);

        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', pID);
        form.append('TeamID', teamIdDecoded);

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
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
                }
            });
    }

    ComingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
    }

    render() {
        const { leagues } = this.state;

        const teamID = this.props.match.params.teamId;
        return (
            <Fragment>
                <div className='col-md-4' style={{ marginBottom: 20 }}>
                    <h3 className='teamProfile-leagues-title'>لیگ های عضو</h3>

                    <div className='teamProfile-leagues-container'>

                        {this.state.hasLeagues}

                        {
                            leagues.map((league, index) => {
                                let leagueAvatar = '/src/icon/leagueProfileAvatarDefault.png';
                                if (league.LeagueAvatar !== null && league.LeagueAvatar !== undefined && league.LeagueAvatar !== '') {
                                    leagueAvatar = league.LeagueAvatar;
                                }
                                let leagueId = hashid.encode(league.LeagueID);
                                return (
                                    <Fragment key={index}>
                                        <div className='teamProfile-leagues-player'>
                                            <div className='teamProfile-leagues-player-box'>
                                                <a className='teamProfile-leagues-player-link' href={`leagueProfile/matchInfo/L/${leagueId}`} target={leagueId}>
                                                    <img className='teamProfile-leagues-player-img' src={leagueAvatar} alt={league.LeagueTitle} />
                                                </a>
                                                <a className='teamProfile-leagues-player-link' href={`leagueProfile/matchInfo/L/${leagueId}`} target={leagueId}>
                                                    <span className='teamProfile-leagues-player-txt'>{league.LeagueTitle}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            })
                        }

                    </div>

                    {
                        (this.state.isTeamAdmin)
                            ?
                            <div className='row' style={{ marginBottom: 25 }}>
                                <div className='col-md-6' style={{ marginBottom: 8 }}>
                                    <TeamProfileEdit {...this.props} />
                                </div>
                                <div className='col-md-6' style={{ marginBottom: 8 }}>
                                    <a className='teamProfile-leagues-setting-btn-Link' href={`teamSetting/addPlayer/${teamID}`} target={teamID}>
                                        <div className='teamProfile-leagues-setting-btn-icon'>
                                            <img className='teamProfile-leagues-setting-btn-icon-setImg' src='/src/icon/addplayerInteamSet.png' alt='setting' />
                                        </div>
                                    </a>
                                    <a className='teamProfile-leagues-setting-btn-Link' href={`teamSetting/addPlayer/${teamID}`} target={teamID}>
                                        <div className='teamProfile-leagues-setting-btn'>
                                            <span className='teamProfile-leagues-setting-btn-txt'>ویرایش بازیکنان</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            :
                            null
                    }


                    {
                        (this.state.isTeamPlayer)
                            ?
                            <div className='row' style={{ textAlign: 'center', marginBottom: 25, }}>
                                <div className='col-md-12' style={{ marginBottom: 8 }}>
                                    <div className='teamProfile-leagues-setting-btn-icon' onClick={() => { this.removeMeFromThisTeam(localStorage.getItem('exID')) }} style={{ cursor:'pointer' }}>
                                        <img className='teamProfile-leagues-setting-btn-icon-setImg' src='/src/icon/removePlayerIcon.png' alt='setting' />
                                    </div>
                                    <div className='teamProfile-leagues-setting-btn-last' onClick={() => { this.removeMeFromThisTeam(localStorage.getItem('exID')) }}>
                                        <span className='teamProfile-leagues-setting-btn-txt'>لغو عضویت در تیم</span>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }


                </div>
            </Fragment>
        );
    }
}

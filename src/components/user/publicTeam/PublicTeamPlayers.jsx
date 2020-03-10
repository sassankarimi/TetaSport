import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import IziToast from 'izitoast';
import Logout from '../logout/UserLogout';
import { handleMSG } from '../../../jsFunctions/all.js';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';


//متغییر های سراسری
let hashid = new Hashids('', 7);

export class PublicTeamPlayers extends Component {
    static displayName = PublicTeamPlayers.name;
    constructor(props) {
        super(props)
        this.state = {
            joinedLeague: false,
            teamMembers: [],
            isTeamPlayer: false,
            isTeamAdmin: false,
            hasMember: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
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
                    this.setState({
                        hasMember: 'بازیکنی برای نمایش موجود نیست',
                        teamMembers:[],
                    })
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.TeamPlayers) {
                        this.setState({
                            teamMembers: data.TeamPlayers,
                            hasMember: null,
                        });
                    } else {
                        this.setState({
                            teamMembers: [],
                            hasMember: 'بازیکنی برای نمایش موجود نیست',
                        });
                    }                 
                }
            });
        // بازیکن تیم ؟
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

    render() {
        const { teamMembers } = this.state;

        if (teamMembers.length !== 0) {
            return (
                <Fragment>
                    <div className='teamProf-players-list-container'>
                        <div className='row'>
                            <div className='col-md-12'>
                                <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'teamProf-title-txt--dark' : 'teamProf-title-txt'}`}>لیست بازیکنان تیم</h4>
                            </div>
                            {this.state.isTeamPlayer &&
                                <div className='col-md-12' style={{ textAlign: 'left' }}>
                                <button className={`${localStorage.getItem('theme') === 'dark' ? 'teamProf-btn--dark' : 'teamProf-btn'}`} onClick={() => { this.removeMeFromThisTeam(localStorage.getItem('exID')) }}>
                                        <span>لغو عضویت در تیم</span>
                                    </button>
                                </div>
                            }
                        </div>
                        <div className='row'>
                            {
                                teamMembers.map((member, index) => {
                                    let isKitEven = false;
                                    if (member.KitNumber > 9) {
                                        isKitEven = true;
                                    }
                                    let memeberAvatar = '/src/icon/U-default.png';
                                    let isCaptain = null;
                                    if (member.Captain) {
                                        isCaptain = <div className='teamProf-playerCard-cap teamProf-playerCard-cap-isCap' title='کاپیتان تیم'></div>;
                                    }
                                    if (member.Avatar !== null && member.Avatar !== undefined && member.Avatar !== '') {
                                        memeberAvatar = member.Avatar;
                                    }
                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6'>
                                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'teamProf-playerCard-container--dark' : 'teamProf-playerCard-container'}`}>
                                                    <a className='teamProfile-members-player-link' href={`profile/${member.Username}`} target={member.Username}><img className='teamProf-playerCard-img' src={memeberAvatar} title={member.Name} alt={member.Name} /></a>
                                                    <a className='teamProfile-members-player-link' href={`profile/${member.Username}`} target={member.Username}>
                                                        <span className='teamProf-playerCard-playerName'>{member.Name}</span>
                                                    </a>
                                                    {isCaptain}
                                                    <div className='teamProf-playerCard-playerTshirt-container'>
                                                        <div className='teamProf-playerCard-playerTshirt'>
                                                            <span className='teamProf-playerCard-playerTshirt-txt' style={{ right: (isKitEven) ? '9px' : '12px' }} title='شماره پیراهن'>{member.KitNumber}</span>
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
                    <div className='profileContent-left-container'>
                        <h4 className='profileContent-left-fontFam'>
                            {this.state.hasMember}
                        </h4>
                    </div>
                </Fragment>
            )
        }    
    }
}
import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);

export class TeamProfileMembers extends Component {
    static displayName = TeamProfileMembers.name;

    constructor(props) {
        super(props);
        this.state = {
            teamMembers: [],
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
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({
                        teamMembers: data.TeamPlayers,
                    });
                }
            });
    }

    render() {
        const { teamMembers } = this.state;
        return (
            <Fragment>
                <div className='col-md-8' style={{ marginBottom: 80 }}>
                    <h3 className='teamProfile-members-title'>لیست اعضای تیم</h3>

                    <div className='teamProfile-members-container'>



                        {

                            teamMembers.map((member, index) => {
                                let memeberAvatar = '/src/icon/U-default.png';
                                let memeberUsername = '';
                                if (member.Avatar !== null && member.Avatar !== undefined && member.Avatar !== '') {
                                    memeberAvatar = member.Avatar;
                                }
                                if (member.Username !== null && member.Username !== undefined && member.Username !== '') {
                                    memeberUsername = `(${member.Username})`;
                                }
                                return (
                                    <Fragment key={index}>
                                        <div className='teamProfile-members-player'>
                                            <div className='teamProfile-members-player-box'>
                                                <a className='teamProfile-members-player-link' href={`profile/${member.Username}`} target={member.Username}>
                                                    <img className='teamProfile-members-player-img' src={`${memeberAvatar}`} alt={`${member.Name}`} />
                                                </a>
                                                <a className='teamProfile-members-player-link' href={`profile/${member.Username}`} target={member.Username}>
                                                    <span className='teamProfile-members-player-txt'>{`${member.Name}`} {memeberUsername}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            })

                        }

                    </div>

                </div>
            </Fragment>
        );
    }
}

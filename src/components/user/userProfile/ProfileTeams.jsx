import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

export default class ProfileTeams extends Component {
    static displayName = ProfileTeams.name;

    constructor(props) {
        super(props)
        this.state = {
            joinedTeams: true,
            TeamsTypeCaptain: [],
            TeamsTypeMember: [],
            Teams: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }

    }

    async componentDidMount() {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', localStorage.getItem('view_profile'));


        await fetch(`${configPort.TetaSport}${configUrl.GetUserTeams}`, {
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
                    this.setState({ Teams: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({ Teams: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
                default:
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
                            Teams: 'تیمی برای نمایش یافت نشد',
                        });
                    }
                }
            });

    }


    static renderMyTeamAndJoinedTeams(TeamsImMember, TeamsImCaptain) {

        //هم عضو تیم و هم سرپرست تیم
        if (TeamsImMember.length && TeamsImCaptain.length) {
            return (
                <Fragment>
                    <div className='profileContent-left-container-joinedTeam'>

                        <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-favSports--dark' : 'profileContent-left-fontFam-favSports'}`}>تیم های من</h4>
                        <div className='row'>

                            {
                                TeamsImCaptain.map((value, index) => {
                                    let counter = 0;
                                    let TID = value.TeamID;
                                    let teamID = hashid.encode(TID);

                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'joinedTeam-box-header--dark' : 'joinedTeam-box-header'}`}>
                                                    <div className='row'>
                                                        <div className='cold-md-3'>
                                                            <a href={`teamProfile/${teamID}`} target={teamID}><img style={{ borderRadius: '50%' }} className='joinedTeam-box-logo'
                                                                src={
                                                                    (value.TeamAvatar) ?
                                                                        value.TeamAvatar
                                                                        :
                                                                        'src/icon/default-logo.png'
                                                                }
                                                                alt='Logo Team'
                                                            /></a>
                                                        </div>
                                                        <div className='col-md-9'>
                                                            <a href={`teamProfile/${teamID}`} target={teamID}><span className='joinedTeam-box-title'>تیم {value.TeamName}</span></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='joinedTeam-box-body'>
                                                    <div className='row' style={{ padding: '4%', paddingLeft: 10, paddingRight: '5%' }}>
                                                        <div className='col-md-4' style={{ textAlign: 'center' }}>
                                                            <a className='link-hover-defaultStyle-profCaptain' href={`profile/${value.AdminUsername}`} target={value.AdminUsername}><img style={{ borderRadius: '50%' }} className='team-headMan-img'
                                                                src={
                                                                    (value.AdminAvatar) ?
                                                                        value.AdminAvatar
                                                                        :
                                                                        'src/icon/defaultAvatar.png'
                                                                }
                                                                alt='team leader'
                                                            /></a>
                                                            <a className='link-hover-defaultStyle-profCaptain' href={`profile/${value.AdminUsername}`} target={value.AdminUsername}><span className='sports-image-xl-caption-player-name'>{value.AdminName}</span></a>
                                                            <span className='sports-image-xl-caption-player-role'>سرپرست تیم</span>
                                                        </div>
                                                        <div className='col-md-8' style={{ textAlign: 'center' }}>
                                                            <div className='row'>
                                                                {

                                                                    (value.Members.length) ?
                                                                        value.Members.map((v, index) => {
                                                                            counter++
                                                                            let isFirst = null;
                                                                            if (counter === 1) {
                                                                                isFirst = <span className='teamCap-in-Card' title='کاپیتان'></span>;
                                                                            }
                                                                            return (
                                                                                <div key={index} className='teamPlayerAvatar-box' style={{ padding: 0, marginTop: 5 }}>
                                                                                    <div className='playerInTeam-avatar'>
                                                                                        <a className='link-hover-defaultStyle-profCaptain' href={`profile/${v.PlayerUsername}`} target={v.PlayerUsername}><img style={{ borderRadius: '50%' }}
                                                                                            src={
                                                                                                (v.PlayerAvatar) ?
                                                                                                    v.PlayerAvatar
                                                                                                    :
                                                                                                    'src/icon/defaultAvatar.png'
                                                                                            }
                                                                                            alt='Player'
                                                                                            className='teamPlayerAvatar-ig'
                                                                                        />
                                                                                            {isFirst}
                                                                                        </a>
                                                                                        <a className='link-hover-defaultStyle-profCaptain' href={`profile/${v.PlayerUsername}`} target={v.PlayerUsername}><span className='sports-image-xl-caption-player-name'>{v.PlayerName}</span></a>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        )
                                                                        :
                                                                        <span className='no-result-team-players'>برای این تیم بازیکنی یافت نشد</span>


                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    );
                                })
                            }

                        </div>
                    </div>
                    <div className='profileContent-left-container-joinedTeam'>
                        <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-favSports--dark' : 'profileContent-left-fontFam-favSports'}`}>تیم های عضو</h4>
                        <div className='row'>

                            {
                                TeamsImMember.map((value, index) => {
                                    let counter = 0;
                                    let TID = value.TeamID;
                                    let teamID = hashid.encode(TID);
                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'joinedTeam-box-header--dark' : 'joinedTeam-box-header'}`}>
                                                    <div className='row'>
                                                        <div className='cold-md-3'>
                                                            <a href={`teamProfile/${teamID}`} target={teamID}><img style={{ borderRadius: '50%' }} className='joinedTeam-box-logo'
                                                                src={
                                                                    (value.TeamAvatar) ?
                                                                        value.TeamAvatar
                                                                        :
                                                                        'src/icon/default-logo.png'
                                                                }
                                                                alt='Logo Team'
                                                            /></a>
                                                        </div>
                                                        <div className='col-md-9'>
                                                            <a href={`teamProfile/${teamID}`} target={teamID}><span className='joinedTeam-box-title'>تیم {value.TeamName}</span></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='joinedTeam-box-body'>
                                                    <div className='row' style={{ padding: '4%', paddingLeft: 10, paddingRight: '5%' }}>
                                                        <div className='col-md-4' style={{ textAlign: 'center' }}>
                                                            <a className='link-hover-defaultStyle-profCaptain' href={`profile/${value.AdminUsername}`} target={value.AdminUsername}><img style={{ borderRadius: '50%' }} className='team-headMan-img'
                                                                src={
                                                                    (value.AdminAvatar) ?
                                                                        value.AdminAvatar
                                                                        :
                                                                        'src/icon/defaultAvatar.png'
                                                                }
                                                                alt='team leader'
                                                            /></a>
                                                            <a className='link-hover-defaultStyle-profCaptain' href={`profile/${value.AdminUsername}`} target={value.AdminUsername}><span className='sports-image-xl-caption-player-name'>{value.AdminName}</span></a>
                                                            <span className='sports-image-xl-caption-player-role'>سرپرست تیم</span>
                                                        </div>
                                                        <div className='col-md-8' style={{ textAlign: 'center' }}>
                                                            <div className='row'>
                                                                {
                                                                    (value.Members.length) ?
                                                                        value.Members.map((v, index) => {
                                                                            counter++
                                                                            let isFirst = null;
                                                                            if (counter === 1) {
                                                                                isFirst = <span className='teamCap-in-Card' title='کاپیتان'></span>;
                                                                            }
                                                                            return (
                                                                                <div key={index} className='teamPlayerAvatar-box' style={{ padding: 0, marginTop: 5 }}>
                                                                                    <div className='playerInTeam-avatar'>
                                                                                        <a className='link-hover-defaultStyle-profCaptain' href={`profile/${v.PlayerUsername}`} target={v.PlayerUsername}><img style={{ borderRadius: '50%' }}
                                                                                            src={
                                                                                                (v.PlayerAvatar) ?
                                                                                                    v.PlayerAvatar
                                                                                                    :
                                                                                                    'src/icon/defaultAvatar.png'
                                                                                            }
                                                                                            alt='Player'
                                                                                            className='teamPlayerAvatar-ig'
                                                                                        />
                                                                                            {isFirst}
                                                                                        </a>
                                                                                        <a className='link-hover-defaultStyle-profCaptain' href={`profile/${v.PlayerUsername}`} target={v.PlayerUsername}><span className='sports-image-xl-caption-player-name'>{v.PlayerName}</span></a>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        )
                                                                        :
                                                                        <span className='no-result-team-players'>برای این تیم بازیکنی یافت نشد</span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    );
                                })
                            }
                        </div>
                    </div>

                </Fragment >
            )
        }
        //فقط عضو تیم
        if (TeamsImMember.length && !TeamsImCaptain.length) {
            return (
                <Fragment>
                    <div className='profileContent-left-container-joinedTeam'>


                        <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-favSports--dark' : 'profileContent-left-fontFam-favSports'}`}>تیم های عضو</h4>
                        <div className='row'>

                            {
                                TeamsImMember.map((value, index) => {
                                    let counter = 0;
                                    let TID = value.TeamID;
                                    let teamID = hashid.encode(TID);
                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'joinedTeam-box-header--dark' : 'joinedTeam-box-header'}`}>
                                                    <div className='row'>
                                                        <div className='cold-md-3'>
                                                            <a href={`teamProfile/${teamID}`} target={teamID}><img style={{ borderRadius: '50%' }} className='joinedTeam-box-logo'
                                                                src={
                                                                    (value.TeamAvatar) ?
                                                                        value.TeamAvatar
                                                                        :
                                                                        'src/icon/default-logo.png'
                                                                }
                                                                alt='Logo Team'
                                                            /></a>
                                                        </div>
                                                        <div className='col-md-9'>
                                                            <a href={`teamProfile/${teamID}`} target={teamID}><span className='joinedTeam-box-title'>تیم {value.TeamName}</span></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='joinedTeam-box-body'>
                                                    <div className='row' style={{ padding: '4%', paddingLeft: 10, paddingRight: '5%' }}>
                                                        <div className='col-md-4' style={{ textAlign: 'center' }}>
                                                            <a className='link-hover-defaultStyle-profCaptain' href={`profile/${value.AdminUsername}`} target={value.AdminUsername}><img style={{ borderRadius: '50%' }} className='team-headMan-img'
                                                                src={
                                                                    (value.AdminAvatar) ?
                                                                        value.AdminAvatar
                                                                        :
                                                                        'src/icon/defaultAvatar.png'
                                                                }
                                                                alt='team leader'
                                                            /></a>
                                                            <a className='link-hover-defaultStyle-profCaptain' href={`profile/${value.AdminUsername}`} target={value.AdminUsername}><span className='sports-image-xl-caption-player-name'>{value.AdminName}</span></a>
                                                            <span className='sports-image-xl-caption-player-role'>سرپرست تیم</span>
                                                        </div>
                                                        <div className='col-md-8' style={{ textAlign: 'center' }}>
                                                            <div className='row'>
                                                                {
                                                                    (value.Members.length) ?
                                                                        value.Members.map((v, index) => {
                                                                            counter++
                                                                            let isFirst = null;
                                                                            if (counter === 1) {
                                                                                isFirst = <span className='teamCap-in-Card' title='کاپیتان'></span>;
                                                                            }
                                                                            return (
                                                                                <div key={index} className='teamPlayerAvatar-box' style={{ padding: 0, marginTop: 5 }}>
                                                                                    <div className='playerInTeam-avatar'>
                                                                                        <a className='link-hover-defaultStyle-profCaptain' href={`profile/${v.PlayerUsername}`} target={v.PlayerUsername}><img style={{ borderRadius: '50%' }}
                                                                                            src={
                                                                                                (v.PlayerAvatar) ?
                                                                                                    v.PlayerAvatar
                                                                                                    :
                                                                                                    'src/icon/defaultAvatar.png'
                                                                                            }
                                                                                            alt='Player'
                                                                                            className='teamPlayerAvatar-ig'
                                                                                        />
                                                                                            {isFirst}
                                                                                        </a>
                                                                                        <a className='link-hover-defaultStyle-profCaptain' href={`profile/${v.PlayerUsername}`} target={v.PlayerUsername}><span className='sports-image-xl-caption-player-name'>{v.PlayerName}</span></a>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        )
                                                                        :
                                                                        <span className='no-result-team-players'>برای این تیم بازیکنی یافت نشد</span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    );
                                })
                            }
                        </div>
                    </div>
                </Fragment>
            )
        }
        //فقط سرپرست تیم
        if (!TeamsImMember.length && TeamsImCaptain.length) {
            return (
                <Fragment>
                    <div className='profileContent-left-container-joinedTeam'>

                        <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-favSports--dark' : 'profileContent-left-fontFam-favSports'}`}>تیم های من</h4>
                        <div className='row'>

                            {
                                TeamsImCaptain.map((value, index) => {
                                    let counter = 0;
                                    let TID = value.TeamID;
                                    let teamID = hashid.encode(TID);
                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'joinedTeam-box-header--dark' : 'joinedTeam-box-header'}`}>
                                                    <div className='row'>
                                                        <div className='cold-md-3'>
                                                            <a href={`teamProfile/${teamID}`} target={teamID}><img style={{ borderRadius: '50%' }} className='joinedTeam-box-logo'
                                                                src={
                                                                    (value.TeamAvatar) ?
                                                                        value.TeamAvatar
                                                                        :
                                                                        'src/icon/default-logo.png'
                                                                }
                                                                alt='Logo Team'
                                                            /></a>
                                                        </div>
                                                        <div className='col-md-9'>
                                                            <a href={`teamProfile/${teamID}`} target={teamID}><span className='joinedTeam-box-title'>تیم {value.TeamName}</span></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='joinedTeam-box-body'>
                                                    <div className='row' style={{ padding: '4%', paddingLeft: 10, paddingRight: '5%' }}>
                                                        <div className='col-md-4' style={{ textAlign: 'center' }}>
                                                            <a className='link-hover-defaultStyle-profCaptain' href={`profile/${value.AdminUsername}`} target={value.AdminUsername}><img style={{ borderRadius: '50%' }} className='team-headMan-img'
                                                                src={
                                                                    (value.AdminAvatar) ?
                                                                        value.AdminAvatar
                                                                        :
                                                                        'src/icon/defaultAvatar.png'
                                                                }
                                                                alt='team leader'
                                                            /></a>
                                                            <a className='link-hover-defaultStyle-profCaptain' href={`profile/${value.AdminUsername}`} target={value.AdminUsername}><span className='sports-image-xl-caption-player-name'>{value.AdminName}</span></a>
                                                            <span className='sports-image-xl-caption-player-role'>سرپرست تیم</span>
                                                        </div>
                                                        <div className='col-md-8' style={{ textAlign: 'center' }}>
                                                            <div className='row'>
                                                                {
                                                                    (value.Members.length) ?
                                                                        value.Members.map((v, index) => {
                                                                            counter++
                                                                            let isFirst = null;
                                                                            if (counter === 1) {
                                                                                isFirst = <span className='teamCap-in-Card' title='کاپیتان'></span>;
                                                                            }
                                                                            return (
                                                                                <div key={index} className='teamPlayerAvatar-box' style={{ padding: 0, marginTop: 5 }}>
                                                                                    <div className='playerInTeam-avatar'>
                                                                                        <a className='link-hover-defaultStyle-profCaptain' href={`profile/${v.PlayerUsername}`} target={v.PlayerUsername}><img style={{ borderRadius: '50%' }}
                                                                                            src={
                                                                                                (v.PlayerAvatar) ?
                                                                                                    v.PlayerAvatar
                                                                                                    :
                                                                                                    'src/icon/defaultAvatar.png'
                                                                                            }
                                                                                            alt='Player'
                                                                                            className='teamPlayerAvatar-ig'
                                                                                        />
                                                                                            {isFirst}
                                                                                        </a>
                                                                                        <a className='link-hover-defaultStyle-profCaptain' href={`profile/${v.PlayerUsername}`} target={v.PlayerUsername}><span className='sports-image-xl-caption-player-name'>{v.PlayerName}</span></a>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        )
                                                                        :
                                                                        <span className='no-result-team-players'>برای این تیم بازیکنی یافت نشد</span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    );
                                })
                            }

                        </div>
                    </div>
                </Fragment>
            )
        }

        return (
            <Fragment>
                <div className='profileContent-left-container'>
                    <h4 className='profileContent-left-fontFam'>
                        <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />
                    </h4>
                </div>
            </Fragment>
        )



    }


    render() {
        if (this.state.TeamsTypeCaptain.length || this.state.TeamsTypeMember.length) {
            let TeamsImCaptain = this.state.TeamsTypeCaptain;
            let TeamsImMember = this.state.TeamsTypeMember;
            return (
                ProfileTeams.renderMyTeamAndJoinedTeams(TeamsImMember, TeamsImCaptain)
            )
        } else {
            return (
                <Fragment>
                    <div className='profileContent-left-container' style={{ marginBottom: 15 }}>
                        <h4 className='profileContent-left-fontFam'>
                            {this.state.Teams}
                        </h4>
                    </div>
                </Fragment>
            )
        }
    }
}
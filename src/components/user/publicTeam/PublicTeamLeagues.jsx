import React, { Component, Fragment } from 'react';
import { LogoutSoft } from '../logout/UserLogout';
import Hashids from 'hashids';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

export class PublicTeamLeagues extends Component {
    static displayName = PublicTeamLeagues.name;

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
                        hasLeagues: <span style={{ fontFamily: 'iranYekanBold', fontSize: 14, textAlign: 'center' }}>لیگی برای نمایش موجود نیست</span>
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
                    this.setState({
                        hasLeagues: <span style={{ fontFamily: 'iranYekanBold', fontSize: 14, textAlign: 'center' }}>لیگی برای نمایش موجود نیست</span>
                    });
                    return false;
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
                                hasLeagues: <span style={{ fontFamily: 'iranYekanBold', fontSize: 14, textAlign: 'center' }}>لیگی برای نمایش موجود نیست</span>,
                            });
                        } else {
                            this.setState({
                                hasLeagues: '',
                            });
                        }
                    }
                }
            });
    }

    render() {
        const { leagues } = this.state;
        if (leagues.length !== 0) {
            return (
                <Fragment>
                    <div className='row'>
                        <div className='profileContent-left-container-joinedLeague' style={{ padding: 10, width:'100%' }}>
                            <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-myLeague--dark' : 'profileContent-left-fontFam-myLeague'}`}>لیگ های عضو</h4>
                            <div className='row'>
                                {
                                    leagues.map((value, index) => {
                                        //hash league id
                                        let lgId = hashid.encode(value.LeagueID);
                                        //replace space in words with dash
                                        let lgTitle = value.LeagueTitle.replace(' ', '-');
                                        let lgCity = value.City.replace(' ', '-');
                                        let lgSport = value.Sport.replace(' ', '-');
                                        let lgAdminName = value.AdminName.replace(' ', '-');

                                        return (
                                            <Fragment key={index}>
                                                <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                    <a className='joinedLeagu-box-Link' href={`/leagueProfile/matchInfo/L/${lgTitle}-${lgAdminName}-${lgSport}-${lgCity}-تتااسپرت/${lgId}`} target={lgId}>
                                                        <div className='myLeagues-box myLeagues-box-height' style={{ background: `url(/src/backgrounds/leagueDefaultBackground${value.LeagueCoverPhotoID}.jpg)` }}>
                                                            <div className='myLeagues-box-header'></div>

                                                            <div className='myLeagues-box-content'>
                                                                <div className='myLeagues-box-content-txt'>
                                                                    <h2 className='myLeagues-box-content-league-title'>{value.LeagueTitle}</h2>
                                                                    <h5 className='myLeagues-box-content-league-player-name'>({value.AdminUsername}) {value.AdminName}</h5>
                                                                </div>
                                                                <div className='myLeagues-box-player-avatar myLeagues-box-player-avatar-mm'>
                                                                    <img className='myLeagues-box-player-avatar-img'
                                                                        src={value.LeagueAvatar}
                                                                        alt='league avatar' />
                                                                </div>
                                                            </div>

                                                            <div className='myLeagues-box-footer'>
                                                                <div className='myLeagues-box-footer-location'>
                                                                    <div className='myLeagues-box-footer-location-map'>
                                                                        <span className='myLeagues-box-footer-location-map-icon'></span>
                                                                        <span className='myLeagues-box-footer-location-map-txt'>{value.City}</span>
                                                                    </div>
                                                                </div>
                                                                <div className='myLeagues-box-footer-tags'>
                                                                    <p className='myLeagues-box-footer-tags-txt'>{value.Sport} / {value.GenderCategory} / {value.AgeCategory} / {value.Award}</p>
                                                                </div>
                                                                <div className='myLeagues-box-footer-description'>
                                                                    <p className='myLeagues-box-footer-description-txt'>{value.LeagueStatus} ، {value.TeamCount} تیم</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>

                                                </div>
                                            </Fragment>
                                        )
                                    }
                                    )
                                }

                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <div className='profileContent-left-container'>
                        <h4 className='profileContent-left-fontFam'>
                            {this.state.hasLeagues}
                        </h4>
                    </div>
                </Fragment>
            )

        }

    }
}
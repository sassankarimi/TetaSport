import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

export default class ProfileLeagues extends Component {
    static displayName = ProfileLeagues.name;
    constructor(props) {
        super(props)
        this.state = {
            joinedLeague: true,
            LeaguesTypeMember: [],
            LeaguesTypeForMe: [],
            Leagues: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
    }

    async componentDidMount() {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', localStorage.getItem('view_profile'));



        await fetch(`${configPort.TetaSport}${configUrl.GetUserLeagues}`, {
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
                    this.setState({ Leagues: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({ Leagues: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
                default:
                    this.setState({ Leagues: 'خطایی رخ داده دوباره تلاش کنید' });
            }
        }).then(
            data => {
                if (data) {
                    this.setState({
                        LeaguesTypeMember: JSON.parse(JSON.stringify(data.LeaguesTypeMember.Leagues)),
                        LeaguesTypeForMe: JSON.parse(JSON.stringify(data.LeaguesTypeForMe.Leagues))
                    });
                    if (data.LeaguesTypeMember.Leagues.length === 0 && data.LeaguesTypeForMe.Leagues.length === 0) {
                        this.setState({
                            Leagues: 'لیگی برای نمایش یافت نشد',
                        });
                    }
                }
            });

    }



    static renderMyLeaguesAndJoinedLeagues(LeaguesImMember, LeaguesForMe) {
        //هم عضو لیگ و هم سرپرست لیگ
        if (LeaguesImMember.length && LeaguesForMe.length) {
            return (
                <Fragment>
                    <div className='profileContent-left-container-joinedLeague'>
                        <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-myLeague--dark' : 'profileContent-left-fontFam-myLeague'}`}>لیگ های من</h4>
                        <div className='row'>
                            {
                                LeaguesForMe.map((value, index) => {

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
                    <div className='profileContent-left-container-joinedLeague'>
                        <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-myLeague--dark' : 'profileContent-left-fontFam-myLeague'}`}>لیگ های عضو</h4>
                        <div className='row'>
                            {
                                LeaguesImMember.map((value, index) => {

                                    //آیدی لیگ
                                    let lgId = hashid.encode(value.LeagueID);
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
                </Fragment >
            )
        }
        //فقط عضو لیگ
        if (LeaguesImMember.length && !LeaguesForMe.length) {
            return (
                <Fragment>
                    <div className='profileContent-left-container-joinedLeague'>
                        <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-myLeague--dark' : 'profileContent-left-fontFam-myLeague'}`}>لیگ های عضو</h4>
                        <div className='row'>
                            {
                                LeaguesImMember.map((value, index) => {

                                    //آیدی لیگ
                                    let lgId = hashid.encode(value.LeagueID);
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
                </Fragment>
            )
        }
        //فقط سرپرست لیگ
        if (!LeaguesImMember.length && LeaguesForMe.length) {
            return (
                <Fragment>
                    <div className='profileContent-left-container-joinedLeague'>
                        <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-myLeague--dark' : 'profileContent-left-fontFam-myLeague'}`}>لیگ های من</h4>
                        <div className='row'>
                            {
                                LeaguesForMe.map((value, index) => {

                                    //آیدی لیگ
                                    let lgId = hashid.encode(value.LeagueID);
                                    let lgTitle = value.LeagueTitle.replace(' ', '-');
                                    let lgCity = value.City.replace(' ', '-');
                                    let lgSport = value.Sport.replace(' ', '-');
                                    let lgAdminName = value.AdminName.replace(' ', '-');

                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                <a className='joinedLeagu-box-Link' href={`/leagueProfile/matchInfo/L/${lgTitle}-${lgAdminName}-${lgSport}-${lgCity}-تتااسپرت/${lgId}`} target={lgId}>
                                                    <div className='myLeagues-box myLeagues-box-height' style={{ background: `url(/src/backgrounds/leagueDefaultBackground${value.LeagueCoverPhotoID}.jpg)`, height: 'auto' }}>
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

                </Fragment >
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
        if (this.state.LeaguesTypeForMe.length || this.state.LeaguesTypeMember.length) {
            let LeaguesForMe = this.state.LeaguesTypeForMe;
            let LeaguesImMember = this.state.LeaguesTypeMember;

            return (
                ProfileLeagues.renderMyLeaguesAndJoinedLeagues(LeaguesImMember, LeaguesForMe)
            )

        } else {
            return (
                <Fragment>
                    <div className='profileContent-left-container'>
                        <h4 className='profileContent-left-fontFam'>
                            {this.state.Leagues}
                        </h4>
                    </div>
                </Fragment>
            )
        }

    }
}
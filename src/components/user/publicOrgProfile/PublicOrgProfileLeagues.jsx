import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

export default class PublicOrgProfileLeagues extends Component {
    static displayName = PublicOrgProfileLeagues.name;
    constructor(props) {
        super(props)
        this.state = {
            joinedLeague: true,
            doneLeagues: [],
            progressLeagues: [],
            Leagues: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
    }

    componentDidMount() {
        let orgID = this.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        var form = new FormData();
        form.append('OrgID', orgIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        //لیگ های درحال اجرا
        fetch(`${configPort.TetaSport}${configUrl.GetOrganizationLeaguesOnPerforming}`, {
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
                    this.setState({ Leagues: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.MSG210) {
                        this.setState({ Leagues: data.MSG210 });
                    } else {
                        this.setState({
                            progressLeagues: JSON.parse(JSON.stringify(data.Leagues)),
                        });
                        if (data.Leagues.length === 0 && data.Leagues.length === 0) {
                            this.setState({
                                Leagues: 'لیگی موجود نیست',
                            });
                        }
                    }
                }
            });

        //لیگ پایان یافته
        fetch(`${configPort.TetaSport}${configUrl.GetOrganizationAllLeaguesExceptOnPerforming}`, {
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
                    this.setState({ Leagues: 'خطایی رخ داده دوباره تلاش کنید' });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.MSG210) {
                        this.setState({ Leagues: data.MSG210 });
                    } else {
                        this.setState({
                            doneLeagues: JSON.parse(JSON.stringify(data.Leagues)),
                        });
                        if (data.Leagues.length === 0 && data.Leagues.length === 0) {
                            this.setState({
                                Leagues: 'لیگی موجود نیست',
                            });
                        }
                    }
                }
            });

    }



    static renderMyLeaguesAndJoinedLeagues(progressLeagues, doneLeagues) {

        const moreLeagues = () => {
            document.getElementById('org-more-leagues').style.display = 'block';
            document.getElementById('org-more-leagues-btn').style.display = 'none';
        }

        //لیگ درحال اجرا و تمام شده
        if (progressLeagues.length && doneLeagues.length) {
            return (
                <Fragment>
                    <div className='profileContent-left-container-joinedLeague'>
                        <h4 className={`    ${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-myLeague--dark' : 'profileContent-left-fontFam-myLeague'}`}>لیگ های در حال اجرا</h4>
                        <div className='row'>
                            {
                                progressLeagues.map((value, index) => {
                                    //آیدی لیگ
                                    let lgId = hashid.encode(value.LeagueID);
                                    let lgTitle = value.LeagueTitle.replace(' ', '-');
                                    let lgCity = value.City.replace(' ', '-');
                                    let lgSport = value.Sport.replace(' ', '-');
                                    let lgAdminName = value.AdminName.replace(' ', '-');

                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                <a className='joinedLeagu-box-Link' href={`/leagueProfile/matchInfo/L/${lgTitle}-${lgAdminName}-${lgSport}-${lgCity}-تتااسپرت/${lgId}`}>
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
                        <div className='row'>
                            <div className='col-md-12'>
                                <span id='org-more-leagues-btn' className='org-leagues-see-more' onClick={moreLeagues}>همه لیگ ها</span>
                            </div>
                        </div>
                        <div id='org-more-leagues'>

                            <h4 className={`    ${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-myLeague--dark' : 'profileContent-left-fontFam-myLeague'}`}>لیگ های پایان یافته</h4>
                            <div className='row'>
                                {
                                    doneLeagues.map((value, index) => {
                                        //آیدی لیگ
                                        let lgId = hashid.encode(value.LeagueID);
                                        let lgTitle = value.LeagueTitle.replace(' ', '-');
                                        let lgCity = value.City.replace(' ', '-');
                                        let lgSport = value.Sport.replace(' ', '-');
                                        let lgAdminName = value.AdminName.replace(' ', '-');

                                        return (
                                            <Fragment key={index}>
                                                <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                    <a className='joinedLeagu-box-Link' href={`/leagueProfile/matchInfo/L/${lgTitle}-${lgAdminName}-${lgSport}-${lgCity}-تتااسپرت/${lgId}`}>
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
                </Fragment >
            )
        }
        //فقط عضو درحال اجرا
        if (progressLeagues.length && !doneLeagues.length) {
            return (
                <Fragment>
                    <div className='profileContent-left-container-joinedLeague'>
                        <h4 className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-myLeague--dark' : 'profileContent-left-fontFam-myLeague'}profileContent-left-fontFam-myLeague`}>لیگ های در حال اجرا</h4>
                        <div className='row'>
                            {
                                progressLeagues.map((value, index) => {
                                    //آیدی لیگ
                                    let lgId = hashid.encode(value.LeagueID);
                                    let lgTitle = value.LeagueTitle.replace(' ', '-');
                                    let lgCity = value.City.replace(' ', '-');
                                    let lgSport = value.Sport.replace(' ', '-');
                                    let lgAdminName = value.AdminName.replace(' ', '-');

                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                <a className='joinedLeagu-box-Link' href={`/leagueProfile/matchInfo/L/${lgTitle}-${lgAdminName}-${lgSport}-${lgCity}-تتااسپرت/${lgId}`}>
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
        //فقط تمام شده
        if (!progressLeagues.length && doneLeagues.length) {
            return (
                <Fragment>
                    <div className='profileContent-left-container-joinedLeague'>
                        <h4 className={`    ${localStorage.getItem('theme') === 'dark' ? 'profileContent-left-fontFam-myLeague--dark' : 'profileContent-left-fontFam-myLeague'}`}>لیگ های پایان یافته</h4>
                        <div className='row'>
                            {
                                doneLeagues.map((value, index) => {
                                    //آیدی لیگ
                                    let lgId = hashid.encode(value.LeagueID);
                                    let lgTitle = value.LeagueTitle.replace(' ', '-');
                                    let lgCity = value.City.replace(' ', '-');
                                    let lgSport = value.Sport.replace(' ', '-');
                                    let lgAdminName = value.AdminName.replace(' ', '-');

                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6 col-sm-12 joinedTeam-box'>
                                                <a className='joinedLeagu-box-Link' href={`/leagueProfile/matchInfo/L/${lgTitle}-${lgAdminName}-${lgSport}-${lgCity}-تتااسپرت/${lgId}`}>
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
        if (this.state.progressLeagues.length || this.state.doneLeagues.length) {
            let doneLeagues = this.state.doneLeagues;
            let progressLeagues = this.state.progressLeagues;

            return (
                PublicOrgProfileLeagues.renderMyLeaguesAndJoinedLeagues(progressLeagues, doneLeagues)
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
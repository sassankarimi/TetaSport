import React, { Component, Fragment } from 'react';
import Modal from 'react-responsive-modal';
import Hashids from 'hashids';
import { handleMSG } from '../../../jsFunctions/all.js';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);


export class LeagueProfileMatchLists extends Component {
    static displayName = LeagueProfileMatchLists.name;

    constructor(props) {
        super(props);
        this.state = {
            matchStates: [],
            matchStatesTextForUser: <div id='Listleague-loading'>
                <div className='Listleague-loading-container'>
                    <img src='/src/icon/teta-logo.png' className='Listleague-loading-icon' alt='loading' />
                    <div className='Listleague-loading-gif'></div>
                </div>
            </div>,
            openEventsModal: false,
            eventsForModal: [],
        }
    }

    componentDidMount() {
        let form = new FormData();
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueMatchesList}`, {
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
                    this.setState({ matchStates: [], matchStatesTextForUser: 'خطای سرور' });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Matches.length !== 0) {
                        this.setState({
                            matchStates: data,
                        });
                    } else {
                        this.setState({
                            matchStates: [],
                            matchStatesTextForUser: 'در حال حاضر بازی ای موجود نیست'
                        });
                    }
                }
            });
    }

    onOpenModal = () => {
        this.setState({
            openEventsModal: true,
        });
    };

    onCloseModal = () => {
        this.setState({ openEventsModal: false });
    };

    getEventsForModal = (matchID) => {
        let form = new FormData();
        form.append('MatchId', matchID);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetMatchEvents}`, {
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
                        eventsForModal: data.Teams,
                        openEventsModal: true,
                    })
                }
            });
    }

    render() {
        let matchStates = this.state.matchStates;
        let count = 0;
        const { openEventsModal, eventsForModal } = this.state;
        if (matchStates.length !== 0) {

            let matches = matchStates.Matches;
            let teamAvatars = matchStates.TeamAvatars;
            return (
                <Fragment>
                    <div className='leagueProfileContent-center-container-matchLists'>
                        {
                            matches.map((match, index) => {
                                let avatar1ID = match.Team1ID.toString();
                                let avatar2ID = match.Team2ID.toString();

                                let defaultAvatar = '/src/profilePic/leagueProfileAvatarDefault.png';
                                // بررسی آواتار تیم ۱
                                let team1Avatar = '';
                                if (avatar1ID && avatar1ID !== null) {
                                    team1Avatar = teamAvatars[avatar1ID];
                                } else {
                                    team1Avatar = defaultAvatar
                                }
                                // بررسی آواتار تیم ۲
                                let team2Avatar = '';
                                if (avatar2ID && avatar2ID !== null) {
                                    team2Avatar = teamAvatars[avatar2ID];
                                } else {
                                    team2Avatar = defaultAvatar
                                }

                                let team1Win = false;
                                let team2Win = false;
                                // بررسی برنده
                                switch (match.Winner) {
                                    case 'Team1':
                                        team1Win = true;
                                        break;
                                    case 'Team2':
                                        team2Win = true;
                                        break;
                                    case 'Draw':
                                        team1Win = false;
                                        team2Win = false;
                                        break;
                                    default:
                                }

                                // بررسی رنگ مسابقه
                                let StateColor = '';
                                switch (match.MatchStatusID) {
                                    case 0:
                                        StateColor = '#5450ff';
                                        break;
                                    case 1:
                                        StateColor = '#0d6a12';
                                        break;
                                    case 2:
                                        StateColor = '#949494';
                                        break;
                                    case 5:
                                        StateColor = '#ff0000';
                                        break;
                                    case 7:
                                        StateColor = '#ff8f00';
                                        break;
                                    default:
                                }

                                let team1URL = hashid.encode(match.Team1ID);
                                let team2URL = hashid.encode(match.Team2ID);


                                return (
                                    <Fragment key={index}>
                                        <div className='leagueProfile-matchContainer'>
                                            <div className='row'>
                                                <div className='col leagueProfile-matchTeam'>
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <a className='leagueProfile-matchTeamName-link' href={`teamProfile/${team1URL}`} target={team1URL}><img className='leagueProfile-matchTeamAvatar' src={`${team1Avatar}`} alt={match.Team1Name} /></a>
                                                            <span className='leagueProfile-winnerTeam' style={{ display: (team1Win) ? '' : 'none' }}></span>
                                                        </div>
                                                        <div className='col-md-12'>
                                                            <a className='leagueProfile-matchTeamName-link' href={`teamProfile/${team1URL}`} target={team1URL}><span className='leagueProfile-matchTeamName'>{match.Team1Name}</span></a>
                                                            <span className='leagueProfile-matchTeamGoalCount'>{match.Team1Goals}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col EventColInMobile leagueProfile-matchInfo'>
                                                    <p className='leagueProfile-matchInfoTxt'>
                                                        روز {match.Weekday} {match.Date} <br /> ساعت {match.Time}
                                                    </p>
                                                    <p className='leagueProfile-matchInfoTxt' style={{ color: StateColor, fontSize: 12 }}>
                                                        {match.MatchStatus}
                                                    </p>
                                                    <p className='leagueProfile-matchInfoTxt link-hover-defaultStyle' style={{ fontSize: 12 }} onClick={() => { this.getEventsForModal(match.MatchID) }}>
                                                        لیست رویداد ها
                                                    </p>
                                                </div>
                                                <div className='col leagueProfile-matchTeam'>
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <a className='leagueProfile-matchTeamName-link' href={`teamProfile/${team2URL}`} target={team2URL}><img className='leagueProfile-matchTeamAvatar' src={`${team2Avatar}`} alt={match.Team2Name} /></a>
                                                            <span className='leagueProfile-winnerTeam' style={{ display: (team2Win) ? '' : 'none' }}></span>
                                                        </div>
                                                        <div className='col-md-12'>
                                                            <a className='leagueProfile-matchTeamName-link' href={`teamProfile/${team2URL}`} target={team2URL}><span className='leagueProfile-matchTeamName'>{match.Team2Name}</span></a>
                                                            <span className='leagueProfile-matchTeamGoalCount'>{match.Team2Goals}</span>
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

                    {/* لیست رویداد ها */}
                    <Modal classNames={{ overlay: 'areUsureModal', modal: 'areUsureModal-bg', closeButton: 'areUsureModal-closeBtn' }} open={openEventsModal} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={true} center>
                        <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                            style={{ maxWidth: 790, paddingBottom: 60, paddingTop: "1%", borderRadius: 3, textAlign: 'center', background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : '#EFF5F5', cursor: 'default' }}>
                            <div className="w3-section" style={{ textAlign: 'right', direction: 'rtl' }}>
                                <div className="input-group mb-3">
                                    <div className="row" style={{ width: "100%", textAlign: 'right' }}>
                                        <div className="col-md-12" style={{ textAlign: 'center' }}>
                                            {/* متن مدال */}
                                            <div className='row' style={{ marginBottom: 25 }}>
                                                <div className='col-md-12'>
                                                    <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'event-modal-title--dark' : 'event-modal-title'}`}>رویداد ها</h3>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                {
                                                    eventsForModal.map((team, index) => {
                                                        count++
                                                        let isLastRow = false;
                                                        let hasBorderLeft = 'hasBorderLeft';
                                                        let eventIconClassName = 'event-modal-event-icon-right ';
                                                        let eventtxtClassName = 'event-modal-event-txt-right';
                                                        if (count === 2) {
                                                            isLastRow = true;
                                                            hasBorderLeft = '';
                                                            eventIconClassName = 'event-modal-event-icon-left ';
                                                            eventtxtClassName = 'event-modal-event-txt-left';
                                                        }
                                                        let teamEvents = team.Events.TeamEvents;
                                                        let teamEventsLn = teamEvents.length;
                                                        let teamAvatar = '/src/profilePic/leagueProfileAvatarDefault.png';
                                                        if (team.TeamAvatar && team.TeamAvatar !== null && team.TeamAvatar !== undefined && team.TeamAvatar !== '') {
                                                            teamAvatar = team.TeamAvatar;
                                                        }
                                                        let teamID = hashid.encode(team.TeamID);

                                                        return (
                                                            <Fragment key={index}>
                                                                <div className={`col-md-6 ${hasBorderLeft}`} style={{ marginBottom: 15 }}>
                                                                    <div className='row'>
                                                                        <div className='col-md-12 mb-4'>
                                                                            <img alt={team.TeamName} src={teamAvatar} className='event-modal-teamAvatar-img'></img>
                                                                            <a className='link-hover-defaultStyle' href={`/teamProfile/${teamID}`} target={teamID}><span className={`${localStorage.getItem('theme') === 'dark' ? 'event-modal-teamName--dark' : 'event-modal-teamName'}`}>{team.TeamName}</span></a>
                                                                        </div>
                                                                        {
                                                                            teamEvents.map((event, i) => {
                                                                                return (
                                                                                    <Fragment key={i}>
                                                                                        <div className='col-md-12' style={{ padding: '5px 30px', textAlign: 'right', verticalAlign: 'middle' }}>
                                                                                            <div className='row events-modal-teamEvents'>
                                                                                                <div className='col-md-12' style={{ textAlign: 'right' }}>
                                                                                                    <div className='events-modal-teamEvents event-modal-event--container-pos'>
                                                                                                        <div className={`event-modal-eventAvatar-img ${eventIconClassName} ${(localStorage.getItem('theme') === 'dark') ? `matchesResultsEvents-event-img-${event.ActID}--dark` : `matchesResultsEvents-event-img-${event.ActID}`}`} title={event.ActTitle}></div>
                                                                                                        <a className={`link-hover-defaultStyle ${eventtxtClassName}`} href={`/player/${event.PlayerUsername}`} target={event.PlayerUsername}><span className={`${localStorage.getItem('theme') === 'dark' ? 'event-modal-playerName--dark' : 'event-modal-playerName'}`}>{event.PlayerName}</span></a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Fragment>
                                                                                )

                                                                            })
                                                                        }
                                                                        {
                                                                            (teamEventsLn) ?
                                                                                null
                                                                                :
                                                                                <Fragment>
                                                                                    <div className='col-md-12' style={{ padding: '0 85px' }}>
                                                                                        <span className='event-modal-no-event'>-</span>
                                                                                    </div>
                                                                                </Fragment>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <hr className='events-modal-teams-spliter' style={{ display: (isLastRow) ? 'none' : 'block' }} />
                                                            </Fragment>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                            <button style={{ width: 140, backgroundColor: (localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'), color: '#fff', fontFamily: 'iranyekanBold', fontSize: 22, marginTop: 30, marginleft: 25, height: 44, borderRadius: 5, paddingTop: 1, border: 'none', outline: 'none' }}
                                className="btn mt-3"
                                onClick={this.onCloseModal}
                            >بستن
                            </button>
                        </div>
                    </Modal>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <div className='leagueProfile-matchContainer'>
                        <div className='row'>
                            <div className='col leagueProfile-matchTeam'>
                                <div className='row'>
                                    <div className='col-md-12' style={{ paddingBottom: 20 }}>
                                        <span style={{ fontFamily: 'iranyekanBold', fontSize: 12, textAlign: 'center', display: 'block' }}>{this.state.matchStatesTextForUser}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }

    }
}

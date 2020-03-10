import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);


export class LeagueProfileLeagueGraph extends Component {
    static displayName = LeagueProfileLeagueGraph.name;

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            msg: '',
            hasRows: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
    }

    componentDidMount() {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        let form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetCupDiagram}`, {
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
                        hasRows:'چیزی برای نمایش موجود نیست',
                    })
                    return false;
            }
        }).then(data => {
            if (data) {
                if (data.MSG) {
                    this.setState({
                        msg: data.MSG,
                        hasRows:null,
                    });
                } else {
                    if (data.Levels !== 0) {
                        this.setState({
                            rows: data.Levels,
                            hasRows:null,
                        });
                    }
                }

            }
        });
    }

    addHighlightClass = (className) => {
        if (`${className}` !== '') {
            let el = document.querySelectorAll(`.${className}`);
            for (let i = 0; i < el.length; i++) {
                el[i].classList.add('highlight-team');
            }
        }

    }

    removeHighlightClass = (className) => {
        if (`${className}` !== '') {
            let el = document.querySelectorAll(`.${className}`);
            for (let i = 0; i < el.length; i++) {
                el[i].classList.remove('highlight-team');
            }
        }
    }

    render() {
        const { hasRows } = this.state;
        let rows = [];
        let isHazfi = false;
        if (this.state.rows.length !== 0) {
            rows = this.state.rows;
            isHazfi = true;
        }
        let counter = 0;
        if (rows.length !== 0) {
            return (
                <Fragment>
                    <div className='leagueProfileContent-center-container-leagueGraph'>
                        <h2 className='leagueGraph-title' style={{ color: (localStorage.getItem('theme') === 'dark' ? '#fff' : '#000') }}>{(isHazfi) ? 'نوع لیگ: حذفی' : ''}</h2>
                        <div className='leagueTable-Graph-border-radius-margBtm' >
                            <div className="" style={{ paddingRight: '3%' }}>

                                <table className="leagueTable-Graph">
                                    <tbody>
                                        {
                                            rows.map((row, index) => {

                                                counter++;
                                                let leftColor = '';
                                                let rightColor = '';
                                                switch (counter) {
                                                    case 1:
                                                        leftColor = '#00323F';
                                                        rightColor = '#00627C';
                                                        break;
                                                    case 2:
                                                        leftColor = '#277259';
                                                        rightColor = '#14392D';
                                                        break;
                                                    case 3:
                                                        leftColor = '#657D10';
                                                        rightColor = '#354109';
                                                        break;
                                                    case 4:
                                                        leftColor = '#0D6A12';
                                                        rightColor = '#073509';
                                                        break;
                                                    case 5:
                                                        leftColor = '#0C2144';
                                                        rightColor = '#4E6B50';
                                                        break;
                                                    case 6:
                                                        leftColor = '#442E0C';
                                                        rightColor = '#664E6B';
                                                        break;
                                                    case 7:
                                                        leftColor = '#829A20';
                                                        rightColor = '#CB2929';
                                                        break;
                                                    case 8:
                                                        leftColor = '#1B8237';
                                                        rightColor = '#4CA45B';
                                                        break;
                                                    default:
                                                        leftColor = '#4C83A4';
                                                        rightColor = '#1B4182';
                                                }

                                                return (
                                                    <tr key={index} className='tableR'>
                                                        <td className='tableDH tableDH-first-col-title border-and-radius-table-title' style={{ backgroundImage: `linear-gradient(${leftColor}, ${rightColor})` }}>
                                                            {row.Title}
                                                        </td>
                                                        {
                                                            row.Matches.map((col, i) => {

                                                                let matchState = col.State;
                                                                let team1WinOrLoseTxt = '';
                                                                let team2WinOrLoseTxt = '';
                                                                let team1Goal = (col.GoalTeam1 !== '' && col.GoalTeam1 !== null && col.GoalTeam1 !== undefined) ? col.GoalTeam1 : '';
                                                                let team2Goal = (col.GoalTeam2 !== '' && col.GoalTeam2 !== null && col.GoalTeam2 !== undefined) ? col.GoalTeam2 : '';
                                                                let team1Name = '';
                                                                let team2Name = '';
                                                                let team1QueueID = '';
                                                                let team2QueueID = '';
                                                                let matchDate = (col.Date !== undefined && col.Date !== null && col.Date !== '') ? col.Date : '';
                                                                let matchTime = (col.Time !== undefined && col.Time !== null && col.Time !== '') ? col.Time : '';
                                                                let isRestTeam = '';
                                                                let restTeamTitle = col.TeamName2;
                                                                let isBlink = '';
                                                                let isVisible = '';
                                                                switch (matchState) {
                                                                    case 0:
                                                                        matchDate = col.Date;
                                                                        team1Name = col.TeamName1;
                                                                        team2Name = col.TeamName2;
                                                                        break;
                                                                    case 1:
                                                                        isBlink = 'live-blink-top';
                                                                        team1Name = col.TeamName1;
                                                                        team2Name = col.TeamName2;
                                                                        matchDate = col.Date;
                                                                        break;
                                                                    case 2:
                                                                        matchDate = col.Date;
                                                                        team1Name = col.TeamName1;
                                                                        team2Name = col.TeamName2;
                                                                        break;
                                                                    case 3:
                                                                        break;
                                                                    case 4:
                                                                        isRestTeam = 'rest-team';
                                                                        restTeamTitle = 'استراحت';
                                                                        team1Name = (col.TeamName1 !== undefined && col.TeamName1 !== null) ? col.TeamName1 : '';
                                                                        matchDate = col.Date;
                                                                        break;
                                                                    case 5:
                                                                        matchDate = col.Date;
                                                                        team1Name = (col.TeamName1 !== undefined && col.TeamName1 !== null) ? col.TeamName1 : '';
                                                                        team2Name = (col.TeamName2 !== undefined && col.TeamName2 !== null) ? col.TeamName2 : '';
                                                                        break;
                                                                    case 6:
                                                                        matchDate = col.Date;
                                                                        team1Name = (col.TeamName1 !== undefined && col.TeamName1 !== null) ? col.TeamName1 : '';
                                                                        team2Name = (col.TeamName2 !== undefined && col.TeamName2 !== null) ? col.TeamName2 : '';
                                                                        break;
                                                                    case 7:
                                                                        matchDate = col.Date;
                                                                        team1Name = (col.TeamName1 !== undefined && col.TeamName1 !== null) ? col.TeamName1 : '';
                                                                        team2Name = (col.TeamName2 !== undefined && col.TeamName2 !== null) ? col.TeamName2 : '';
                                                                        break;
                                                                    case 8:
                                                                        isVisible = 'hidden';
                                                                        break;
                                                                    default:
                                                                }
                                                                if (col.WinnerID) {
                                                                    switch (col.WinnerID) {
                                                                        case col.TeamID1:
                                                                            team1WinOrLoseTxt = 'winner-txt';
                                                                            team2WinOrLoseTxt = 'loser-txt';
                                                                            break;
                                                                        case col.TeamID2:
                                                                            team2WinOrLoseTxt = 'winner-txt';
                                                                            team1WinOrLoseTxt = 'loser-txt';
                                                                            break;
                                                                        default:
                                                                    }
                                                                }
                                                                let Team1Champion = '';
                                                                let Team2Champion = '';
                                                                let Team1ChampionContainer = '';
                                                                let Team2ChampionContainer = '';
                                                                if (col.Team1Champion === true) {
                                                                    Team1Champion = 'team-win-all-match-top';
                                                                    Team1ChampionContainer = 'team-win-all-match-container';
                                                                }
                                                                if (col.Team2Champion === true) {
                                                                    Team2Champion = 'team-win-all-match-top';
                                                                    Team2ChampionContainer = 'team-win-all-match-container';
                                                                }

                                                                if (col.TeamID1 !== undefined && col.TeamID1 !== null) {
                                                                    team1QueueID = `queue-${col.TeamID1}`
                                                                }
                                                                if (col.TeamID2 !== undefined && col.TeamID2 !== null) {
                                                                    team2QueueID = `queue-${col.TeamID2}`
                                                                }

                                                                return (
                                                                    <Fragment key={i}>
                                                                        <td className='tableDH'>
                                                                            <div className='graphTableTeamsCointainer' style={{ visibility: `${isVisible}` }}>
                                                                                <div className='graphTable-header' style={{ backgroundImage: `linear-gradient(${leftColor}, ${rightColor})` }}>
                                                                                    <span className='graphTable-header-date'>{matchDate}</span>
                                                                                    <span className='graphTable-header-time'>{matchTime}</span>
                                                                                </div>

                                                                                <div className={`graphTable-margBtm graphTable-team graphTable-team1 ${team1QueueID}  ${Team1ChampionContainer}`} onMouseEnter={() => { this.addHighlightClass(`${team1QueueID}`) }} onMouseLeave={() => { this.removeHighlightClass(`${team1QueueID}`) }} title={`${team1Name}`}>

                                                                                    <div className='graphTable-team1-goal'>
                                                                                        <span className='graphTable-team1-goal-count'>
                                                                                            {team1Goal}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className='graphTable-team1-name'>
                                                                                        <span className={`graphTable-team2-name-txt ${team1WinOrLoseTxt}`}>{`${team1Name}`}</span>
                                                                                    </div>
                                                                                    <div className={`${isBlink} ${Team1Champion}`}></div>
                                                                                    <span className='graphTable-borderbtmSpn'></span>

                                                                                </div>
                                                                                <div className={`row graphTable-margBtm graphTable-team graphTable-team2 ${team2QueueID} ${Team2ChampionContainer}`} onMouseEnter={() => { this.addHighlightClass(`${team2QueueID}`) }} onMouseLeave={() => { this.removeHighlightClass(`${team2QueueID}`) }} title={`${team2Name}`}>
                                                                                    <div className={`${isRestTeam}`} title={restTeamTitle}>
                                                                                        <div className='graphTable-team2-goal'>
                                                                                            <span className='graphTable-team2-goal-count'>
                                                                                                {team2Goal}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className='graphTable-team2-name'>
                                                                                            <span className={`graphTable-team2-name-txt ${team2WinOrLoseTxt}`}>{`${team2Name}`}</span>
                                                                                        </div>
                                                                                        <div className={`${isBlink} ${Team2Champion}`}></div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </td>

                                                                    </Fragment>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }

                                    </tbody>

                                </table>

                            </div>
                        </div >
                    </div>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <div className='leagueProfileContent-center-container-leagueGraph'>
                        <h2 className='leagueGraph-title' style={{ color: (localStorage.getItem('theme') === 'dark' ? '#fff' : '#000') }}>{(isHazfi) ? 'نوع لیگ: حذفی' : ''}</h2>
                        <div className='leagueTable-Graph-border-radius-margBtm' style={{ overflow: 'hidden' }}>
                            <div className="" style={{ fontFamily: 'iranYekanBold', textAlign: 'center', color: (localStorage.getItem('theme') === 'dark' ? '#fff' : '#000') }}>
                                {hasRows}
                            </div>
                        </div >
                    </div>
                </Fragment>
            )
        }
    }
}
import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);


export class LeagueProfileLeagueTable extends Component {
    static displayName = LeagueProfileLeagueTable.name;

    constructor(props) {
        super(props);
        this.state = {
            leagueTable: [],
            goalManTable: [],
            passGoalManTable: [],
            goalPkManTable: [],
            defenceManTable: [],
            forwardTeamTable: [],
            kindTeamTable: [],
            yellowMan: [],
            leagueTableLoading: <div id='Listleague-loading'>
                <div className='Listleague-loading-container'>
                    <img src='/src/icon/teta-logo.png' className='Listleague-loading-icon' alt='loading' />
                    <div className='Listleague-loading-gif'></div>
                </div>
            </div>,
            goalManTableLoading: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            passGoalManLoading: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            goalPkManLoading: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            defenceManLoading: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            forwardTeamLoading: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            kindTeamLoading: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            yellowManLoading: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            leagueStructure: 0,
            hazfiOrLeague: 0,

        }
    }

    componentDidMount() {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));

        // 01 - Ranking جدول
        // حذفی یا لیگ
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueStructure}`, {
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
                    this.setState({ hazfiOrLeague: data.StructID });
                    if (this.state.hazfiOrLeague === '1' || this.state.hazfiOrLeague === 1) {
                        fetch(`${configPort.TetaSport}${configUrl.GetLeagueRankingTable}`, {
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
                        }).then(data => {
                            if (data) {
                                if (data.Rank.length !== 0) {
                                    this.setState({
                                        leagueTable: data.Rank,
                                    });
                                } else {
                                    this.setState({
                                        leagueTable: [],
                                        leagueTableLoading: 'هنوز تیمی به این لیگ افزوده نشده',
                                    });
                                }
                            }
                        });
                    } else {
                        this.setState({
                            leagueTable: [],
                            leagueTableLoading: null,
                        });
                    }
                } else {
                    this.setState({
                        leagueTable: [],
                        leagueTableLoading: 'چیزی برای نمایش موجود نیست',
                    });
                }

            });


        // 02 - GoalMan جدول
        fetch(`${configPort.TetaSport}${configUrl.GetLeaguePlayersRankingTableGoal}`, {
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
        }).then(data => {
            if (data) {
                if (data.Rank.length !== 0) {
                    this.setState({
                        goalManTable: data.Rank,
                    });
                } else {
                    this.setState({
                        goalManTable: [],
                        goalManTableLoading: '-',
                    });
                }

            }
        });

        // 03 - PassGoalMan جدول
        fetch(`${configPort.TetaSport}${configUrl.GetLeaguePlayersRankingTableAssist}`, {
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
        }).then(data => {
            if (data) {
                if (data.Rank.length !== 0) {
                    this.setState({
                        passGoalManTable: data.Rank,
                    });
                } else {
                    this.setState({
                        passGoalManTable: [],
                        passGoalManLoading: '-',
                    });
                }

            }
        });

        // 04 - goalPkMan جدول
        fetch(`${configPort.TetaSport}${configUrl.GetLeaguePlayersRankingTableSave}`, {
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
        }).then(data => {
            if (data) {
                if (data.Rank.length !== 0) {
                    this.setState({
                        goalPkManTable: data.Rank,
                    });
                } else {
                    this.setState({
                        goalPkManTable: [],
                        goalPkManLoading: '-',
                    });
                }

            }
        });

        // 05 - DefenceMan جدول
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueRankingTableGA}`, {
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
        }).then(data => {
            if (data) {
                if (data.Rank.length !== 0) {
                    this.setState({
                        defenceManTable: data.Rank,
                    });
                } else {
                    this.setState({
                        defenceManTable: [],
                        defenceManLoading: '-',
                    });
                }

            }
        });

        // 06 - ForwardTeam جدول
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueRankingTableGS}`, {
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
        }).then(data => {
            if (data) {
                if (data.Rank.length !== 0) {
                    this.setState({
                        forwardTeamTable: data.Rank,
                    });
                } else {
                    this.setState({
                        forwardTeamTable: [],
                        forwardTeamLoading: '-',
                    });
                }

            }
        });

        // 07 - KindTeam جدول
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueRankingTableCard}`, {
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
        }).then(data => {
            if (data) {
                if (data.Rank.length !== 0) {
                    this.setState({
                        kindTeamTable: data.Rank,
                    });
                } else {
                    this.setState({
                        kindTeamTable: [],
                        kindTeamLoading: '-',
                    });
                }

            }
        });

        // 08 - YellowPlayer جدول
        fetch(`${configPort.TetaSport}${configUrl.GetLeaguePlayersRankingTableCard}`, {
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
        }).then(data => {
            if (data) {
                if (data.Rank.length !== 0) {
                    this.setState({
                        yellowMan: data.Rank,
                    });
                } else {
                    this.setState({
                        yellowMan: [],
                        yellowManLoading: '-',
                    });
                }

            }
        });



    }


    render() {
        let isHazfi = false;
        if (this.state.hazfiOrLeague === '2' || this.state.hazfiOrLeague === 2) {
            isHazfi = true;
        }
        // 01 - Ranking جدول
        let rankTable = this.state.leagueTable;
        let rankTableStructure = '';
        if (rankTable.length !== 0) {

            // جدول اطلاعات کلی 
            rankTableStructure = <div className='leagueTable-border-radius-margBtm' >
                <div className="table-responsive" style={{ paddingRight: '8%' }}>
                    <table className={`table table-bordered ${localStorage.getItem('theme') === 'dark' ? 'leagueTable--dark' : 'leagueTable'} leagueTable-allInfo`}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>تیم</th>
                                <th>پرچم</th>
                                <th>بازیها</th>
                                <th>برد</th>
                                <th>مساوی</th>
                                <th>باخت</th>
                                <th>گل زده</th>
                                <th>گل خورده</th>
                                <th>تفاضل</th>
                                <th>امتیاز</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rankTable.map((team, index) => {
                                    let teamID = hashid.encode(team.TeamID);

                                    // آیا آواتار دارد
                                    let defaultTeamLogo = `/src/profilePic/leagueProfileAvatarDefault.png`;
                                    let teamLogo = '';
                                    if (team.TeamAvatar && team.TeamAvatar !== null) {
                                        teamLogo = team.TeamAvatar;
                                    } else {
                                        teamLogo = defaultTeamLogo;
                                    }

                                    return (
                                        <Fragment key={index}>
                                            <tr>
                                                <td>{team.Ranking}</td>
                                                <td><a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}>{team.TeamName}</a></td>
                                                <td style={{ padding: 0, paddingTop: 3 }}>
                                                    <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><img className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-teamFlag--dark' : 'leagueTable-teamFlag'}`} src={teamLogo} alt={team.TeamName} title={team.TeamName} /></a>
                                                </td>
                                                <td>{team.Matches}</td>
                                                <td>{team.Wins}</td>
                                                <td>{team.Draws}</td>
                                                <td>{team.Lose}</td>
                                                <td>{team.GS}</td>
                                                <td>{team.GA}</td>
                                                <td>{team.GD}</td>
                                                <td>{team.PTs}</td>
                                            </tr>
                                        </Fragment>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div >


        } else {
            rankTableStructure = <div className='leagueTable-border-radius-margBtm' >
                <div className="table-responsive" style={{ paddingRight: '8%', textAlign: 'center', overflow: 'hidden' }}>
                    <span style={{ textAlign: 'center', fontFamily: 'iranyekanBold' }}>{this.state.leagueTableLoading}</span>
                </div>
            </div >
        }

        // 02 - آقای گل
        let goalManTable = this.state.goalManTable;
        let goalManTableStructure = '';
        if (goalManTable.length !== 0) {

            // جدول آقای گل 
            goalManTableStructure = <div className='col-md-6' style={{ marginBottom: 40 }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> آقای گل</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>
                        {
                            goalManTable.map((mrGoal, index) => {
                                let pUserName = mrGoal.PlayerUsername;
                                let teamID = hashid.encode(mrGoal.TeamID);
                                //اگر آبجکت آخر بود
                                let isLastObject = false;
                                if (goalManTable.length === mrGoal.Ranking) {
                                    isLastObject = true;
                                }
                                //اگر بازیکن آواتار نداشت
                                let defaultPlayerAvatar = 'src/icon/defaultAvatar.png';
                                let playerAvatar = '';
                                if (mrGoal.PlayerAvatar && mrGoal.PlayerAvatar !== null) {
                                    playerAvatar = mrGoal.PlayerAvatar;
                                } else {
                                    playerAvatar = defaultPlayerAvatar;
                                }
                                //اگر تیم اواتار نداشت
                                let defaultTeamAvatar = '/src/profilePic/leagueProfileAvatarDefault.png';
                                let teamAvatar = '/src/icon/Tcolor2.png';
                                if (mrGoal.TeamAvatar && mrGoal.TeamAvatar !== null) {
                                    teamAvatar = mrGoal.TeamAvatar;
                                } else {
                                    teamAvatar = defaultTeamAvatar;
                                }

                                return (
                                    <Fragment key={index}>
                                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><img className='leagueTable-smallTable-teamFlag' src={teamAvatar} alt={mrGoal.TeamName} title={mrGoal.TeamName} /></a>
                                                        </div>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`profile/${pUserName}`} target={pUserName}><img className='leagueTable-smallTable-playerAvatar' src={playerAvatar} alt={mrGoal.PlayerName} title={mrGoal.PlayerName} /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-4'>
                                                    <a className='link-hover-defaultStyle' href={`profile/${pUserName}`} target={pUserName}><p>{mrGoal.PlayerName}</p></a>
                                                </div>
                                                <div className='col-md-4'>
                                                    {mrGoal.Count}
                                                </div>
                                            </div>
                                            <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} style={{ display: (isLastObject) ? 'none' : '' }} />
                                        </div>
                                    </Fragment>
                                )
                            })
                        }


                    </div>
                </div>
            </div >

        } else {
            goalManTableStructure = <div className='col-md-6' style={{ marginBottom: 40 }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> آقای گل</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>
                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <span style={{ textAlign: 'center', margin: '5px auto' }}>{this.state.goalManTableLoading}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        // 03 - آقای پاس گل
        let passGoalManTable = this.state.passGoalManTable;
        let passGoalManTableStructure = '';
        if (passGoalManTable.length !== 0) {

            // جدول آقای پاس گل 
            passGoalManTableStructure = <div className='col-md-6' style={{ marginBottom: 20 }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> آقای پاس گل</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>

                        {
                            passGoalManTable.map((passGoalMan, index) => {
                                let pUserName = passGoalMan.PlayerUsername;
                                let teamID = hashid.encode(passGoalMan.TeamID);
                                //اگر آبجکت آخر بود
                                let isLastObject = false;
                                if (passGoalManTable.length === passGoalMan.Ranking) {
                                    isLastObject = true;
                                }
                                //اگر بازیکن آواتار نداشت
                                let defaultPlayerAvatar = 'src/icon/defaultAvatar.png';
                                let playerAvatar = '';
                                if (passGoalMan.PlayerAvatar && passGoalMan.PlayerAvatar !== null) {
                                    playerAvatar = passGoalMan.PlayerAvatar;
                                } else {
                                    playerAvatar = defaultPlayerAvatar;
                                }
                                //اگر تیم آواتار نداشت
                                let defaultTeamAvatar = '/src/profilePic/leagueProfileAvatarDefault.png';
                                let teamAvatar = '/src/icon/Tcolor2.png';
                                if (passGoalMan.TeamAvatar && passGoalMan.TeamAvatar !== null) {
                                    teamAvatar = passGoalMan.TeamAvatar;
                                } else {
                                    teamAvatar = defaultTeamAvatar;
                                }
                                return (
                                    <Fragment key={index}>
                                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><img className='leagueTable-smallTable-teamFlag' src={teamAvatar} alt={passGoalMan.TeamName} title={passGoalMan.TeamName} /></a>
                                                        </div>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`profile/${pUserName}`} target={pUserName}><img className='leagueTable-smallTable-playerAvatar' src={playerAvatar} alt={passGoalMan.PlayerName} title={passGoalMan.PlayerName} /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-4'>
                                                    <a className='link-hover-defaultStyle' href={`profile/${pUserName}`} target={pUserName}><p>{passGoalMan.PlayerName}</p></a>
                                                </div>
                                                <div className='col-md-4'>
                                                    {passGoalMan.Count}
                                                </div>
                                            </div>
                                            <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} style={{ display: (isLastObject) ? 'none' : '' }} />
                                        </div>
                                    </Fragment>
                                )
                            })
                        }

                    </div>
                </div>
            </div>

        } else {
            passGoalManTableStructure = <div className='col-md-6' style={{ marginBottom: 40 }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> آقای پاس گل</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>
                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <span style={{ textAlign: 'center', margin: '5px auto' }}>{this.state.passGoalManLoading}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        // 04 - بهترین دروازه بان
        let goalPkManTable = this.state.goalPkManTable;
        let goalPkManTableStructure = '';
        if (goalPkManTable.length !== 0) {

            // جدول بهترین دروزاه بان 
            goalPkManTableStructure = <div className='col-md-6' style={{ marginBottom: 40 }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> بهترین دروزاه بان</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>

                        {
                            goalPkManTable.map((goalPkMan, index) => {
                                let pUserName = goalPkMan.PlayerUsername;
                                let teamID = hashid.encode(goalPkMan.TeamID);
                                //آیا آخرین آبجکت است
                                let isLastObject = false;
                                if (goalPkManTable.length === goalPkMan.Ranking) {
                                    isLastObject = true;
                                }
                                //آیا بازیکن آواتار دارد
                                let defaultPlayerAvatar = 'src/icon/defaultAvatar.png';
                                let playerAvatar = '';
                                if (goalPkMan.PlayerAvatar && goalPkMan.PlayerAvatar !== null) {
                                    playerAvatar = goalPkMan.PlayerAvatar;
                                } else {
                                    playerAvatar = defaultPlayerAvatar;
                                }
                                //آیا تیم آواتار دارد
                                let defaultTeamAvatar = '/src/profilePic/leagueProfileAvatarDefault.png';
                                let teamAvatar = '/src/icon/Tcolor2.png';
                                if (goalPkMan.TeamAvatar && goalPkMan.TeamAvatar !== null) {
                                    teamAvatar = goalPkMan.TeamAvatar;
                                } else {
                                    teamAvatar = defaultTeamAvatar;
                                }
                                return (
                                    <Fragment key={index}>
                                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><img className='leagueTable-smallTable-teamFlag' src={teamAvatar} alt={goalPkMan.TeamName} title={goalPkMan.TeamName} /></a>
                                                        </div>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`profile/${pUserName}`} target={pUserName}><img className='leagueTable-smallTable-playerAvatar' src={playerAvatar} alt={goalPkMan.PlayerName} title={goalPkMan.PlayerName} /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-4'>
                                                    <a className='link-hover-defaultStyle' href={`profile/${pUserName}`} target={pUserName}><p>{goalPkMan.PlayerName}</p></a>
                                                </div>
                                                <div className='col-md-4'>
                                                    {goalPkMan.Count}
                                                </div>
                                            </div>
                                            <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} style={{ display: (isLastObject) ? 'none' : '' }} />
                                        </div>
                                    </Fragment>
                                )
                            })
                        }

                    </div>
                </div>
            </div>

        } else {
            goalPkManTableStructure = <div className='col-md-6' style={{ marginBottom: 40 }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> بهترین دروزاه بان</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>
                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <span style={{ textAlign: 'center', margin: '5px auto' }}>{this.state.goalPkManLoading}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        // 05 - بهترین مدافع
        let defenceManTable = this.state.defenceManTable;
        let defenceManTableStructure = '';
        if (defenceManTable.length !== 0) {

            // جدول بهترین خط دفاع (گل خورده) 
            defenceManTableStructure = <div className='col-md-6' style={{ marginBottom: 40, display: (isHazfi) ? 'none' : 'block' }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> بهترین خط دفاع (گل خورده)</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>

                        {
                            defenceManTable.map((defenceMan, index) => {
                                let teamID = hashid.encode(defenceMan.TeamID);
                                //اگر آبجکت آخر بود
                                let isLastObject = false;
                                if (defenceManTable.length === defenceMan.Ranking) {
                                    isLastObject = true;
                                }
                                //اگر تیم آواتار نداشت
                                let defaultTeamAvatar = '/src/profilePic/leagueProfileAvatarDefault.png';
                                let teamAvatar = '/src/icon/Tcolor2.png';
                                if (defenceMan.TeamAvatar && defenceMan.TeamAvatar !== null) {
                                    teamAvatar = defenceMan.TeamAvatar;
                                } else {
                                    teamAvatar = defaultTeamAvatar;
                                }
                                return (
                                    <Fragment key={index}>
                                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><img className='leagueTable-smallTable-teamFlag' src={teamAvatar} alt={defenceMan.TeamName} title={defenceMan.TeamName} /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-4'>
                                                    <p><a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}>{defenceMan.TeamName}</a></p>
                                                </div>
                                                <div className='col-md-4'>
                                                    {defenceMan.Count}
                                                </div>
                                            </div>
                                            <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} style={{ display: (isLastObject) ? 'none' : '' }} />
                                        </div>
                                    </Fragment>
                                )
                            })
                        }


                    </div>
                </div>
            </div>

        } else {
            defenceManTableStructure = <div className='col-md-6' style={{ marginBottom: 40, display: (isHazfi) ? 'none' : 'block' }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> بهترین خط دفاع (گل خورده)</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>
                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <span style={{ textAlign: 'center', margin: '5px auto' }}>{this.state.defenceManLoading}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        // 06 - بهترین خط حمله
        let forwardTeamTable = this.state.forwardTeamTable;
        let forwardTeamTableStructure = '';
        if (forwardTeamTable.length !== 0) {

            // جدول بهترین خط حمله(گل زده) 
            forwardTeamTableStructure = <div className='col-md-6' style={{ marginBottom: 40, display: (isHazfi) ? 'none' : 'block' }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}>بهترین خط حمله(گل زده)</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>

                        {
                            forwardTeamTable.map((forwardTeam, index) => {
                                let teamID = hashid.encode(forwardTeam.TeamID);
                                //اگر آبجکت آخر بود
                                let isLastObject = false;
                                if (forwardTeamTable.length === forwardTeam.Ranking) {
                                    isLastObject = true;
                                }
                                //اگر تیم آواتار نداشت
                                let defaultTeamAvatar = '/src/profilePic/leagueProfileAvatarDefault.png';
                                let teamAvatar = '/src/icon/Tcolor2.png';
                                if (forwardTeam.TeamAvatar && forwardTeam.TeamAvatar !== null) {
                                    teamAvatar = forwardTeam.TeamAvatar;
                                } else {
                                    teamAvatar = defaultTeamAvatar;
                                }
                                return (
                                    <Fragment key={index}>
                                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><img className='leagueTable-smallTable-teamFlag' src={teamAvatar} alt={forwardTeam.TeamName} title={forwardTeam.TeamName} /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-4'>
                                                    <p><a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}>{forwardTeam.TeamName}</a></p>
                                                </div>
                                                <div className='col-md-4'>
                                                    {forwardTeam.Count}
                                                </div>
                                            </div>
                                            <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} style={{ display: (isLastObject) ? 'none' : '' }} />
                                        </div>
                                    </Fragment>
                                )
                            })
                        }


                    </div>
                </div>
            </div>

        } else {
            forwardTeamTableStructure = <div className='col-md-6' style={{ marginBottom: 40, display: (isHazfi) ? 'none' : 'block' }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}>بهترین خط حمله(گل زده)</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>
                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <span style={{ textAlign: 'center', margin: '5px auto' }}>{this.state.forwardTeamLoading}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        // 07 - بهترین
        let kindTeamTable = this.state.kindTeamTable;
        let kindTeamTableStructure = '';
        if (kindTeamTable.length !== 0) {

            // جدول تیم اخلاق (مجموع کارت) 
            kindTeamTableStructure = <div className='col-md-6' style={{ marginBottom: 40, display: (isHazfi) ? 'none' : 'block' }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> تیم اخلاق (مجموع کارت)</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>

                        {
                            kindTeamTable.map((kindTeam, index) => {
                                let teamID = hashid.encode(kindTeam.TeamID);
                                // اگر آبجکت آخر بود
                                let isLastObject = false;
                                if (kindTeamTable.length === kindTeam.Ranking) {
                                    isLastObject = true;
                                }
                                //اگر تیم آواتار نداشت
                                let defaultTeamAvatar = '/src/profilePic/leagueProfileAvatarDefault.png';
                                let teamAvatar = '/src/icon/Tcolor2.png';
                                if (kindTeam.TeamAvatar && kindTeam.TeamAvatar !== null) {
                                    teamAvatar = kindTeam.TeamAvatar;
                                } else {
                                    teamAvatar = defaultTeamAvatar;
                                }
                                return (
                                    <Fragment key={index}>
                                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><img className='leagueTable-smallTable-teamFlag' src={teamAvatar} alt={kindTeam.TeamName} title={kindTeam.TeamName} /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-4'>
                                                    <p><a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}>{kindTeam.TeamName}</a></p>
                                                </div>
                                                <div className='col-md-4'>
                                                    {kindTeam.Count}
                                                </div>
                                            </div>
                                            <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} style={{ display: (isLastObject) ? 'none' : '' }} />
                                        </div>
                                    </Fragment>
                                )
                            })
                        }



                    </div>
                </div>
            </div>

        } else {
            kindTeamTableStructure = <div className='col-md-6' style={{ marginBottom: 40, display: (isHazfi) ? 'none' : 'block' }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-mrPassGoal--dark' : 'leagueTable-mrPassGoal'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}> تیم اخلاق (مجموع کارت)</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>
                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <span style={{ textAlign: 'center', margin: '5px auto' }}>{this.state.kindTeamLoading}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        // 08 - بیشترین کارت زرد
        let yellowManTable = this.state.yellowMan;
        let yellowManTableStructure = '';
        if (yellowManTable.length !== 0) {

            // بیشترین کارت (زرد و قرمز)
            yellowManTableStructure = <div className='col-md-12' style={{ marginBottom: 40 }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-topYellow--dark' : 'leagueTable-topYellow'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}>بیشترین کارت (زرد و قرمز)</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>

                        {
                            yellowManTable.map((yellowMan, index) => {
                                let pUserName = yellowMan.PlayerUsername;
                                let teamID = hashid.encode(yellowMan.TeamID);
                                //اگی آبجکت آخر بود
                                let isLastObject = false;
                                if (yellowManTable.length === yellowMan.Ranking) {
                                    isLastObject = true;
                                }
                                //اگر بازیکن آواتار نداشت
                                let defaultPlayerAvatar = 'src/icon/defaultAvatar.png';
                                let playerAvatar = '';
                                if (yellowMan.PlayerAvatar && yellowMan.PlayerAvatar !== null) {
                                    playerAvatar = yellowMan.PlayerAvatar;
                                } else {
                                    playerAvatar = defaultPlayerAvatar;
                                }
                                //اگر تیم آواتار نداشت
                                let defaultTeamAvatar = '/src/profilePic/leagueProfileAvatarDefault.png';
                                let teamAvatar = '/src/icon/Tcolor2.png';
                                if (yellowMan.TeamAvatar && yellowMan.TeamAvatar !== null) {
                                    teamAvatar = yellowMan.TeamAvatar;
                                } else {
                                    teamAvatar = defaultTeamAvatar;
                                }

                                return (
                                    <Fragment key={index}>
                                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><img className='leagueTable-smallTable-teamFlag' src={teamAvatar} alt={yellowMan.TeamName} title={yellowMan.TeamName} /></a></div>
                                                        <div className='col'>
                                                            <a className='link-hover-defaultStyle' href={`profile/${pUserName}`} target={pUserName}><img className='leagueTable-smallTable-playerAvatar' src={playerAvatar} alt={yellowMan.PlayerName} title={yellowMan.PlayerName} /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-4'>
                                                    <a className='link-hover-defaultStyle' href={`profile/${pUserName}`} target={pUserName}><p>{yellowMan.PlayerName}</p></a>
                                                </div>
                                                <div className='col-md-4'>
                                                    {yellowMan.Count}
                                                </div>
                                            </div>
                                            <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} style={{ display: (isLastObject) ? 'none' : '' }} />
                                        </div>
                                    </Fragment>
                                )
                            })
                        }

                    </div>
                </div>
            </div>

        } else {
            yellowManTableStructure = <div className='col-md-12' style={{ marginBottom: 40 }}>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-topYellow--dark' : 'leagueTable-topYellow'}`}>
                    <div className='row'>

                        <div className='col-md-12'>
                            <div style={{ width: '100%', background: '#EFF5F0', paddingTop: 1 }}>
                                <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfile-tables-header--dark' : 'leagueProfile-tables-header'}`}>بیشترین کارت (زرد و قرمز)</h3>
                                <hr className={`${localStorage.getItem('theme') === 'dark' ? 'leagueTable-borderForRows--dark' : 'leagueTable-borderForRows'}`} />
                            </div>
                        </div>

                        <div className='col-md-12 leagueTable-mrPassGoal-borderButtom'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='row'>
                                        <div className='col'>
                                            <span style={{ textAlign: 'center', margin: '5px auto' }}>{this.state.yellowManLoading}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>;
        }


        return (
            <Fragment>
                <div className='leagueProfileContent-center-container-leagueTable'>

                    {/* جدول اطلاعات کلی */}
                    {rankTableStructure}

                    <div className='row' style={{ paddingRight: '5%' }}>
                        {/* جدول آقای گل */}
                        {goalManTableStructure}

                        {/* جدول آقای پاس گل */}
                        {passGoalManTableStructure}

                        {/* جدول بهترین دروزاه بان */}
                        {goalPkManTableStructure}

                        {/* جدول بهترین خط دفاع (گل خورده) */}
                        {defenceManTableStructure}

                        {/* جدول بهترین خط حمله(گل زده) */}
                        {forwardTeamTableStructure}

                        {/* جدول تیم اخلاق (مجموع کارت) */}
                        {kindTeamTableStructure}

                        {/* بیشترین کارت (زرد و قرمز)*/}
                        {yellowManTableStructure}
                    </div>

                </div>
            </Fragment>
        )
    }
}
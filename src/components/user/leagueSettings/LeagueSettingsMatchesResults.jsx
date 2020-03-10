import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-responsive-modal';
import Hashids from 'hashids';
import IziToast from 'izitoast';
import { handleMSG } from '../../../jsFunctions/all.js';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';



//متغییر سراسری
let hashid = new Hashids('', 7);
export class LeagueSettingsMatchesResult extends Component {
    static displayName = LeagueSettingsMatchesResult.name;

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            team1Player: 0,
            team2Player: 0,
            allMatches: [],
            team1AvatarModal: '',
            team2AvatarModal: '',
            team1NameModal: '',
            team2NameModal: '',
            team1PlayersModal: [],
            team2PlayersModal: [],
            matchId: 0,
            playerID: 0,
            eventsModal: [],
            teams: [],
            playerName: '',
            teamName: '',
            team1GoalCount: '',
            team2GoalCount: '',
            team1Name: '',
            team2Name: '',
            teamNames: [],
            teamIDs: [],
            leagueStructure: 0,
            hasMatch: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
        this.areYouSureClose = this.areYouSureClose.bind(this);
    };

    componentDidMount() {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('ShowWaitingMatchs', false);
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueListOfMatches}`, {
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
                    this.setState({ allMatches: [], hasMatch: null  });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.MatchList) {
                        if (data.MatchList.length !== 0) {
                            this.setState({ allMatches: data.MatchList, hasMatch: null });
                        } else {
                            this.setState({ allMatches: [], hasMatch: 'موردی یافت نشد' });
                        }
                    } else {
                        this.setState({ allMatches: [], hasMatch: 'موردی یافت نشد' });
                    }
                } else {
                    this.setState({ allMatches: [], hasMatch: 'خطایی رخ داده' });
                }
            });

        // ساختار لیگ
        var form2 = new FormData();
        form2.append('LeagueID', leagueIdDecoded);
        form2.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueStructure}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('Token')
            },
            body: form2
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
                    this.setState({ leagueStructure: data.StructID });
                }
            });

    }

    onOpenModal = (matchId) => {
        //دریافت نتیجه بازی
        this.GetMatchScore(matchId);
        //مدال اصلی
        let form1 = new FormData();
        form1.append('MatchId', matchId);
        form1.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetTeamsInfoOnSetScoresModal}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('Token')
            },
            body: form1
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
                    if (data.MSG) {
                        toast.error(`! ${data.MSG}`, { position: toast.POSITION.TOP_CENTER });
                    } else {
                        this.setState({
                            teams: data.Teams,
                            open: true,
                            matchId: matchId,
                            teamNames: data.Teams.map(n => (n.TeamName)),
                            teamIDs: data.Teams.map(n => (n.TeamID)),
                        })
                    }
                }
            });

        //رویداد
        var form = new FormData();
        form.append('MatchId', matchId);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.LoadMatchEvents}`, {
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
                    if (data.MSG) {
                    } else {
                        this.setState({
                            eventsModal: data.Events
                        })
                    }
                }
            });

    };

    onCloseModal = () => {
        this.setState({
            open: false,
            matchId: 0,
            playerID: 0,
            eventsModal: [],
            teams: [],
            team1Player: 0,
            team2Player: 0,
            team1GoalCount: '',
            team2GoalCount: '',
            team1Name: '',
            team2Name: '',
            teamNames: [],
            teamIDs: [],
        });
    };

    handleTeam1PlayerEvent = (value, teamID, playerName, teamName) => {
        this.setState({
            team1Player: value,
            team2Player: 0,
            playerID: value,
            teamID: teamID,
            playerName: playerName,
            teamName: teamName,
        });
    }

    handleTeam2PlayerEvent = (value, teamID, playerName, teamName) => {
        this.setState({
            team2Player: value,
            team1Player: 0,
            playerID: value,
            teamID: teamID,
            playerName: playerName,
            teamName: teamName,
        });
    }

    goBackToPanel = () => {
        let hashedLid = this.props.match.params.leagueId;
        this.props.history.push(`/leagueSettings/${hashedLid}`);
    }

    addNewEvent = (eventId) => {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('MatchID', this.state.matchId);
        form.append('TeamID', this.state.teamID);
        form.append('PlayerID', this.state.playerID);
        form.append('ActID', eventId);
        if (this.state.playerID !== 0) {
            fetch(`${configPort.TetaSport}${configUrl.AddNewEvent}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                },
                body: form
            }).then(response => {
                let code = response.status;
                switch (code) {
                    case 201:
                        this.GetMatchScore(this.state.matchId);
                        return response.json();
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
                        IziToast.success({
                            close: false,
                            closeOnEscape: true,
                            timeout: 1500,
                            position: 'center'
                        });
                        this.setState({
                            //اضاقه کردن آبحکت قبلی به آبجکت جدید برای اینکه آبجکت جدید در اول آرایه قرار بگیرد 
                            eventsModal: data.Events
                        })
                    }

                });
        } else {
            toast.error(`! بازیکن را انتخاب نکرده اید`, { position: toast.POSITION.TOP_CENTER });
        }
    }

    endTheMatch = (matchId) => {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('MatchId', matchId);
        fetch(`${configPort.TetaSport}${configUrl.FinishMatch}`, {
            method: 'POST',
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
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
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
                    if (data.MSG) {
                        toast.error(`! ${data.MSG}`, { position: toast.POSITION.TOP_CENTER });
                    }
                }
            });
        this.onCloseModal();
    }

    startTheMatch = (matchId) => {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('MatchId', matchId);
        fetch(`${configPort.TetaSport}${configUrl.StartMatch}`, {
            method: 'POST',
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
                    this.setState({
                        team1GoalCount: '0',
                        team2GoalCount: '0',
                    })
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
                    if (data.MSG) {
                        toast.error(`! ${data.MSG}`, { position: toast.POSITION.TOP_CENTER });
                    }
                }
            });
    }

    cancelTheMatch = (matchId, teamID) => {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('MatchId', matchId);
        form.append('CancellingTeamId', teamID);
        fetch(`${configPort.TetaSport}${configUrl.CancelGame}`, {
            method: 'POST',
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
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
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
                    if (data.MSG) {
                        toast.error(`! ${data.MSG}`, { position: toast.POSITION.TOP_CENTER });
                    }
                }
            });
        this.onCloseModal();
    }

    endPkTheMatch = (matchId, teamID) => {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('MatchId', matchId);
        form.append('WinnerTeamID', teamID);
        fetch(`${configPort.TetaSport}${configUrl.FinishMatchByPKs}`, {
            method: 'POST',
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
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
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
                    if (data.MSG) {
                        toast.error(`! ${data.MSG}`, { position: toast.POSITION.TOP_CENTER });
                    }
                }
            });
        this.onCloseModal();
    }

    deleteThisEvent = (eventId) => {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('MatchEventId', eventId);
        fetch(`${configPort.TetaSport}${configUrl.RemoveEvent}`, {
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
                    this.GetMatchScore(this.state.matchId);
                    return response.json();
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
                    if (data.MSG) {
                        toast.error(`! ${data.MSG}`, { position: toast.POSITION.TOP_CENTER });
                    } else {
                        IziToast.success({
                            close: false,
                            closeOnEscape: true,
                            timeout: 1500,
                            position: 'center'
                        });
                        let filteredEvent = this.state.eventsModal.filter((event) => {
                            return (
                                event.EventId !== eventId
                            )
                        })
                        let EventObj = filteredEvent;
                        this.setState({
                            eventsModal: EventObj,
                        })

                    }
                }
            });
    }

    GetMatchScore = (matchID) => {
        let form = new FormData();
        form.append('MatchId', matchID);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetMatchScore}`, {
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
                        team1GoalCount: (data.GoalScored1 !== null && data.GoalScored1 !== 'null' && data.GoalScored1 !== 'undefined' && data.GoalScored1 !== undefined && data.GoalScored1 !== '') ? data.GoalScored1 : 0,
                        team2GoalCount: (data.GoalScored2 !== null && data.GoalScored2 !== 'null' && data.GoalScored2 !== 'undefined' && data.GoalScored2 !== undefined && data.GoalScored2 !== '') ? data.GoalScored2 : 0,
                    })
                    if (data.MSG) {
                        toast.error(`! ${data.MSG}`, { position: toast.POSITION.TOP_CENTER });
                    }
                }
            });
    }

    goBackToLeague = () => {
        let hashedLid = this.props.match.params.leagueId;
        this.props.history.push(`/leagueProfile/matchInfo/L/${hashedLid}`);
    }
    //اطمینان بستن مدال
    areYouSureClose = () => {
        const closeResultModal = () => {
            this.onCloseModal();
        }
        IziToast.question({
            timeout: 20000000,
            close: false,
            drag: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 1000000,
            message: 'آیا از بستن ثبت نتایج اطمینان دارید',
            position: 'center',
            buttons: [
                ['<button><b>بله</b></button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    closeResultModal();

                }, true],
                ['<button>خیر</button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                }],
            ],
            onClosing: function (instance, toast, closedBy) {

            },
            onClosed: function (instance, toast, closedBy) {

            }
        });
    }
    //اطمینان پایان بازی
    areYouSureEndMatch = (matchId) => {
        const endMatch = () => {
            this.endTheMatch(matchId);
        }
        IziToast.question({
            timeout: 20000000,
            close: false,
            drag: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 1000000,
            message: 'آیا از پایان بازی اطمینان دارید',
            position: 'center',
            buttons: [
                ['<button><b>بله</b></button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    endMatch();

                }, true],
                ['<button>خیر</button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                }],
            ],
            onClosing: function (instance, toast, closedBy) {

            },
            onClosed: function (instance, toast, closedBy) {

            }
        });
    }
    //اطمینان شروع بازی
    areYouSureStartMatch = (matchId) => {
        const startMatch = () => {
            this.startTheMatch(matchId);
        }
        IziToast.question({
            timeout: 20000000,
            close: false,
            drag: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 1000000,
            message: 'آیا شروع بازی اطمینان دارید',
            position: 'center',
            buttons: [
                ['<button><b>بله</b></button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    startMatch();

                }, true],
                ['<button>خیر</button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                }],
            ],
            onClosing: function (instance, toast, closedBy) {

            },
            onClosed: function (instance, toast, closedBy) {

            }
        });
    }
    //اطمینان کنسل بازی
    areYouCancelMatch = (matchId, teamID, teamName) => {
        const cancelMatch = () => {
            this.cancelTheMatch(matchId, teamID);
        }
        IziToast.question({
            timeout: 20000000,
            close: false,
            drag: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 1000000,
            message: `آیا از انصراف ${teamName} اطمینان دارید`,
            position: 'center',
            buttons: [
                ['<button><b>بله</b></button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    cancelMatch();

                }, true],
                ['<button>خیر</button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                }],
            ],
            onClosing: function (instance, toast, closedBy) {

            },
            onClosed: function (instance, toast, closedBy) {

            }
        });
    }
    //اطمینان برد در پنالتی بازی
    areYouEndPkMatch = (matchId, teamID, teamName) => {
        const endPkMatch = () => {
            this.endPkTheMatch(matchId, teamID);
        }
        IziToast.question({
            timeout: 20000000,
            close: false,
            drag: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 1000000,
            message: `آیا از برد ${teamName} در ضربات پنالتی اطمینان دارید`,
            position: 'center',
            buttons: [
                ['<button><b>بله</b></button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    endPkMatch();

                }, true],
                ['<button>خیر</button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                }],
            ],
            onClosing: function (instance, toast, closedBy) {

            },
            onClosed: function (instance, toast, closedBy) {

            }
        });
    }

    render() {
        // تایتل صفحه
        document.getElementsByTagName("title")[0].innerHTML = `پنل تنظیمات لیگ|نتایج`;
        const { open, allMatches } = this.state;
        const events = this.state.eventsModal;
        const teams = this.state.teams;
        let count = 0;
        let playerCount = 0;
        let player2Count = 0;
        if (allMatches.length !== 0) {
            return (
                <Fragment>
                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-plan-cointainer--dark' : 'leagueSetting-plan-cointainer'}`}>
                        <div className='leagueSetting-plan-cointainer-contain'>
                            <div className='row'>
                                <div className='col-12' style={{ marginTop: 20, marginBottom: 10 }}>
                                    <div className='leagueSetting-matchesResults-icon'></div>
                                    <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-matchesResults-title--dark' : 'leagueSetting-matchesResults-title'}`}>وارد کردن نتایج بازی ها</h1>
                                </div>
                                <div className='col-12'>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.goBackToPanel}>بازگشت به پنل تنظیمات</button>
                                </div>
                                <div className='col-12'>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.goBackToLeague}>بازگشت به پروفایل لیگ</button>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='leagueSetting-matchesResults-table'>

                                        <div className='row leagueSetting-matchesResults-table-row'>

                                            <div className='col-md-12'>
                                                <div className='leagueSetting-matchesResults-table-row-heading-items-Container'>
                                                    <div className='row'>
                                                        <div className='col-md-12 col-sm-12'>
                                                            <span className='leagueSetting-matchesResults-heading'>بازی ها</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row leagueSetting-matchesResults-table-row'>
                                            <div className='col-md-12' style={{ paddingRight: 0, paddingLeft: 0, overflow: 'hidden' }}>
                                                <div className='leagueSetting-matchesResults-table-row-items-Container'>
                                                    <div className='row' style={{ marginTop: 13 }}>

                                                        {
                                                            allMatches.map((match, index) => {
                                                                count++
                                                                let isEven = false;
                                                                if (count % 2 === 0) {
                                                                    isEven = true;
                                                                }
                                                                let editResult = '';
                                                                let btnColor = '';
                                                                let btnBorder = '';
                                                                let isResultFinish = false;
                                                                switch (match.State) {
                                                                    case 0:
                                                                        editResult = 'وارد کردن نتایج';
                                                                        btnColor = `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`;
                                                                        btnBorder = `1px solid ${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`;
                                                                        break;
                                                                    case 1:
                                                                        editResult = 'درحال اجرا';
                                                                        btnColor = `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`;
                                                                        btnBorder = `1px solid ${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`;
                                                                        break;
                                                                    case 2:
                                                                        isResultFinish = true;
                                                                        editResult = 'پایان یافته';
                                                                        btnColor = '#BF0505';
                                                                        btnBorder = '1px solid #BF0505';
                                                                        break;
                                                                    default:
                                                                        editResult = 'وارد کردن نتایج';
                                                                        btnColor = `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`;
                                                                        btnBorder = `1px solid ${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`;
                                                                        break;
                                                                }
                                                                let MyPadding = 'leagueSetting-matchesResults-table-row-padd-odd';
                                                                if (isEven) {
                                                                    MyPadding = 'leagueSetting-matchesResults-table-row-padd-even';
                                                                }
                                                                let isEnd = false;
                                                                if (count === allMatches.length) {
                                                                    isEnd = true;
                                                                }
                                                                return (
                                                                    <Fragment key={index}>
                                                                        <div className={`col-md-6 leagueSetting-matchesResults-table-row-items ${MyPadding}`}>
                                                                            <div className='row'>
                                                                                <div className='col-md-12'>
                                                                                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-matchesResults-table-row-items-badge--dark' : 'leagueSetting-matchesResults-table-row-items-badge'}`}>
                                                                                        <span className='leagueSetting-matchesResults-table-row-items-teamCount'>{count}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-md-6'>
                                                                                    <span className='leagueSetting-matchesResults-table-row-items-teamsName'>{match.FirstTeamName} - {match.SecondTeamName}</span>
                                                                                    <span className='leagueSetting-matchesResults-table-row-items-date'>ساعت {match.Time} روز {match.Weekday} {match.Date}</span>
                                                                                </div>
                                                                                <div className='col-md-6'>
                                                                                    {
                                                                                        (isResultFinish) ?
                                                                                            <button className='leagueSetting-matchesResults-table-row-items-btn' style={{ backgroundColor: btnColor, border: btnBorder }}>{editResult}</button>
                                                                                            :
                                                                                            <button className='leagueSetting-matchesResults-table-row-items-btn' style={{ backgroundColor: btnColor, border: btnBorder }} onClick={() => { this.onOpenModal(match.MatchId) }}>{editResult}</button>
                                                                                    }

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='leagueSetting-matchesResults-table-row-spliter' style={{ display: (isEven && !isEnd) ? 'block' : 'none' }}>
                                                                            <hr className='leagueSetting-matchesResults-table-row-spliter-hr'></hr>
                                                                        </div>
                                                                    </Fragment>
                                                                )
                                                            })
                                                        }

                                                        {
                                                            (allMatches.length === 0) ?
                                                                <div className='col-md-12'>
                                                                    <span style={{ fontFamily: 'iranYekanBold', fontSize: 18 }}>موردی یافت نشد</span>
                                                                </div>
                                                                :
                                                                null
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* modal */}
                    <Modal classNames={{ overlay: 'matchesResultModal', modal: 'matchesResultModal-bg', closeButton: 'matchesResultModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={true} center>
                        <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                            style={{ minHeight: 260, paddingTop: 31, borderRadius: 5, boxShadow: 'none !important', direction: 'rtl', textAlign: 'right', paddingBottom: 100, cursor: 'default', background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : '#fff' }}>

                            <div className='row'>


                                {
                                    teams.map((team, index) => {

                                        let teamID = hashid.encode(team.TeamID);
                                        let teamAvatar = '/src/profilePic/defaultAvatar.png';
                                        if (team.TeamAvatar !== null && team.TeamAvatar !== '' && team.TeamAvatar !== undefined) {
                                            teamAvatar = team.TeamAvatar;
                                        }

                                        return (
                                            <Fragment key={index}>
                                                <div className='col-md-6 leagueSetting-matchesResults-team-avatar-Container'>
                                                    <div className='leagueSetting-matchesResults-team-avatar'>
                                                        <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><img className='leagueSetting-matchesResults-team-avatar-img' src={`${teamAvatar}`} alt={`${team.TeamName}`} /></a>
                                                    </div>
                                                    <div className='leagueSetting-matchesResults-team-name'>
                                                        <a className='link-hover-defaultStyle' href={`teamProfile/${teamID}`} target={teamID}><span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-matchesResults-team-name-txt--dark' : 'leagueSetting-matchesResults-team-name-txt'}`}>{team.TeamName}</span></a>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                }

                            </div>

                            <div className='row' style={{ textAlign: 'center', paddingBottom: 10 }}>
                                <div className='col-md-12'>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'matchResult-beginMatch-button--dark' : 'matchResult-beginMatch-button'}`} onClick={() => { this.areYouSureStartMatch(this.state.matchId) }}>شروع بازی</button>
                                </div>
                            </div>

                            <div className='row' style={{ textAlign: 'center' }}>
                                <div className='col-md-12'>
                                    <div className='r-container fe-pulse1' id='r-container'>
                                        <span className='team1-goal-counter'>{this.state.team1GoalCount}</span>
                                        <span className='goal-counter-split'>-</span>
                                        <span className='team2-goal-counter'>{this.state.team2GoalCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* team1 radio */}
                            <div className='row result-match-modal-padd'>
                                <div className='col-md-4'>
                                    <div className='matchResult-radio-container'>

                                        {
                                            teams.map((team, index) => {
                                                playerCount++
                                                let teamID = team.TeamID;
                                                let teamName = team.TeamName;
                                                if (playerCount === 1) {
                                                    if (team.TeamPlayers.length !== 0) {
                                                        return (
                                                            <Fragment key={index}>
                                                                {
                                                                    team.TeamPlayers.map((playerInfo, i) => {
                                                                        return (
                                                                            <Fragment key={i}>
                                                                                <div className='matchResult-radio-container-single'>
                                                                                    <div className="custom-control custom-radio event-handle-reaio-container">
                                                                                        <span className={`${localStorage.getItem('theme') === 'dark' ? 'kitNum-result--dark' : 'kitNum-result'}`}>{playerInfo.PlayerKitNumber}</span>
                                                                                        <input type="radio" className="custom-control-input" id={`radio${playerInfo.PlayerID}`} name="team1radio" value={playerInfo.PlayerID} checked={this.state.team1Player === playerInfo.PlayerID} onChange={() => this.handleTeam1PlayerEvent(playerInfo.PlayerID, teamID, playerInfo.PlayerName, teamName)} />
                                                                                        <label className="custom-control-label sc-player-label" htmlFor={`radio${playerInfo.PlayerID}`}>{playerInfo.PlayerName}</label>
                                                                                    </div>
                                                                                </div>
                                                                            </Fragment>
                                                                        )
                                                                    })
                                                                }

                                                            </Fragment>
                                                        )
                                                    } else {
                                                        return (
                                                            <Fragment key={index}>
                                                                <div className='matchResult-radio-container-single'>
                                                                    <span>بازیکنی یافت نشد</span>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    }
                                                } else {
                                                    return (
                                                        null
                                                    )
                                                }

                                            })

                                        }

                                    </div>
                                </div>

                                {/* events */}
                                <div className='col-md-4' style={{ textAlign: 'center' }}>


                                    <button className='matchResult-event-container' onClick={() => { this.addNewEvent(3) }}>
                                        <img className='matchResult-event-img' alt='goal keeper' src={`${localStorage.getItem('theme') === 'dark' ? 'src-dark/icon/goalkeeper.png' : 'src/icon/goalkeeper.png'}`} title='نجات دروازه' />
                                        <span className='matchResult-event-title' >نجات دروازه </span>
                                    </button>

                                    <button className='matchResult-event-container' onClick={() => { this.addNewEvent(2) }}>
                                        <img className='matchResult-event-img' alt='pass goal' src={`${localStorage.getItem('theme') === 'dark' ? 'src-dark/icon/passGoal.png' : 'src/icon/passGoal.png'}`} title='پاس گل' />
                                        <span className='matchResult-event-title' >پاس گل </span>
                                    </button>

                                    <button className='matchResult-event-container' onClick={() => { this.addNewEvent(1) }}>
                                        <img className='matchResult-event-img' alt='goal' src={`${localStorage.getItem('theme') === 'dark' ? 'src-dark/icon/goal.png' : 'src/icon/goal.png'}`} title='گل' />
                                        <span className='matchResult-event-title'>گل</span>
                                    </button>


                                    <button className='matchResult-event-container' onClick={() => { this.addNewEvent(14) }}>
                                        <img className='matchResult-event-img' alt='penalty' src={`${localStorage.getItem('theme') === 'dark' ? 'src-dark/icon/penaltyGoal.png' : 'src/icon/penaltyGoal.png'}`} title='گل پنالتی' />
                                        <span className='matchResult-event-title' >گل پنالتی</span>
                                    </button>

                                    <button className='matchResult-event-container' onClick={() => { this.addNewEvent(13) }}>
                                        <img className='matchResult-event-img' alt='goal' src={`${localStorage.getItem('theme') === 'dark' ? 'src-dark/icon/OGoal.png' : 'src/icon/OGoal.png'}`} title='گل به خودی' />
                                        <span className='matchResult-event-title'>گل به خودی</span>
                                    </button>

                                    <button className='matchResult-event-container' onClick={() => { this.addNewEvent(7) }}>
                                        <img className='matchResult-event-img' alt='Openalty' src={`${localStorage.getItem('theme') === 'dark' ? 'src-dark/icon/OPenaltyGoal.png' : 'src/icon/OPenaltyGoal.png'}`} title='از دست دادن پنالتی' />
                                        <span className='matchResult-event-title' style={{ fontSize: 12 }}>از دست دادن پنالتی</span>
                                    </button>

                                    <button className='matchResult-event-container' onClick={() => { this.addNewEvent(4) }}>
                                        <img className='matchResult-event-img' alt='yellow card' src={`${localStorage.getItem('theme') === 'dark' ? 'src-dark/icon/yellowCard.png' : 'src/icon/yellowCard.png'}`} title='کارت زرد' />
                                        <span className='matchResult-event-title' >کارت زرد </span>
                                    </button>

                                    <button className='matchResult-event-container' onClick={() => { this.addNewEvent(12) }}>
                                        <img className='matchResult-event-img' alt='second yellow card' src={`${localStorage.getItem('theme') === 'dark' ? 'src-dark/icon/redCard-two-times.png' : 'src/icon/redCard-two-times.png'}`} title='کارت زرد دوم' />
                                        <span className='matchResult-event-title' > کارت زرد دوم </span>
                                    </button>

                                    <button className='matchResult-event-container' onClick={() => { this.addNewEvent(5) }}>
                                        <img className='matchResult-event-img' alt='red card' src={`${localStorage.getItem('theme') === 'dark' ? 'src-dark/icon/redCard.png' : 'src/icon/redCard.png'}`} title='کارت قرمز' />
                                        <span className='matchResult-event-title' >کارت قرمز </span>
                                    </button>

                                </div>

                                {/* team2 radio */}
                                <div className='col-md-4'>
                                    <div className='matchResult-radio-container'>


                                        {
                                            teams.map((team, index) => {
                                                player2Count++
                                                let teamID = team.TeamID;
                                                let teamName = team.TeamName;
                                                if (player2Count === 2) {
                                                    if (team.TeamPlayers.length !== 0) {
                                                        return (
                                                            <Fragment key={index}>
                                                                {
                                                                    team.TeamPlayers.map((playerInfo, i) => {
                                                                        return (
                                                                            <Fragment key={i}>
                                                                                <div className='matchResult-radio-container-single'>
                                                                                    <div className="custom-control custom-radio event-handle-reaio-container">
                                                                                        <span className={`${localStorage.getItem('theme') === 'dark' ? 'kitNum-result--dark' : 'kitNum-result'}`}>{playerInfo.PlayerKitNumber}</span>
                                                                                        <input type="radio" className="custom-control-input" id={`radio${playerInfo.PlayerID}`} name="team2radio" value={playerInfo.PlayerID} checked={this.state.team2Player === playerInfo.PlayerID} onChange={() => this.handleTeam2PlayerEvent(playerInfo.PlayerID, teamID, playerInfo.PlayerName, teamName)} />
                                                                                        <label className="custom-control-label sc-player-label" htmlFor={`radio${playerInfo.PlayerID}`}>{playerInfo.PlayerName}</label>
                                                                                    </div>
                                                                                </div>
                                                                            </Fragment>
                                                                        )
                                                                    })
                                                                }

                                                            </Fragment>
                                                        )
                                                    } else {
                                                        return (
                                                            <Fragment key={index}>
                                                                <div className='matchResult-radio-container-single'>
                                                                    <span>بازیکنی یافت نشد</span>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    }
                                                } else {
                                                    return (
                                                        null
                                                    )
                                                }

                                            })

                                        }

                                    </div>
                                </div>


                            </div>

                            <div className='row' style={{ textAlign: 'center', paddingBottom: 10 }}>
                                <div className='col-md-12'>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'matchResult-endMatch-button--dark' : 'matchResult-endMatch-button'}`} onClick={() => { this.areYouSureEndMatch(this.state.matchId) }}>پایان بازی</button>
                                </div>
                                {
                                    (this.state.leagueStructure === 2 || this.state.leagueStructure === '2')
                                        ?
                                        <Fragment>
                                            <div className='col-md-12'>
                                                <button className={`${localStorage.getItem('theme') === 'dark' ? 'matchResult-endMatch-button--dark' : 'matchResult-endMatch-button'}`} onClick={() => { this.areYouEndPkMatch(this.state.matchId, this.state.teamIDs[0], this.state.teamNames[0]) }}>برد  {this.state.teamNames.length !== 0 && this.state.teamNames[0]} در پنالتی</button>
                                            </div>
                                            <div className='col-md-12'>
                                                <button className={`${localStorage.getItem('theme') === 'dark' ? 'matchResult-endMatch-button--dark' : 'matchResult-endMatch-button'}`} onClick={() => { this.areYouEndPkMatch(this.state.matchId, this.state.teamIDs[1], this.state.teamNames[1]) }}>برد  {this.state.teamNames.length !== 0 && this.state.teamNames[1]} در پنالتی</button>
                                            </div>
                                        </Fragment>
                                        :
                                        null
                                }
                                <div className='col-md-12'>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'matchResult-endMatch-button--dark' : 'matchResult-endMatch-button'}`} onClick={() => { this.areYouCancelMatch(this.state.matchId, this.state.teamIDs[0], this.state.teamNames[0]) }}>انصراف  {this.state.teamNames.length !== 0 && this.state.teamNames[0]}</button>
                                </div>
                                <div className='col-md-12'>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'matchResult-endMatch-button--dark' : 'matchResult-endMatch-button'}`} onClick={() => { this.areYouCancelMatch(this.state.matchId, this.state.teamIDs[1], this.state.teamNames[1]) }}>انصراف  {this.state.teamNames.length !== 0 && this.state.teamNames[1]}</button>
                                </div>
                                <div className='col-md-12'>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'matchResult-endMatch-button--dark' : 'matchResult-endMatch-button'}`} onClick={this.areYouSureClose}>بستن</button>
                                </div>
                            </div>

                            <div className='row' style={{ textAlign: 'right', paddingBottom: 10, paddingRight: 50, paddingLeft: 50 }}>
                                <div className='col-md-12'>
                                    <span className='matchesResultsEvents-title'>رویداد های رخ داده</span>
                                </div>

                                <hr className='matchesResultsEvents-spliter' />

                                <div className='matchesResultsEvents-event-container'>

                                    {/* events */}
                                    {
                                        events.map((event, index) => {
                                            let whatIsEvent = '';
                                            let whatIsTitle = '';
                                            let whatIsIcon = 1;
                                            switch (event.ActId) {
                                                case 1:
                                                    whatIsEvent = 'گل زد';
                                                    whatIsTitle = 'گل';
                                                    whatIsIcon = 1;
                                                    break;
                                                case 2:
                                                    whatIsEvent = 'پاس گل داد';
                                                    whatIsTitle = 'پاس گل';
                                                    whatIsIcon = 2;
                                                    break;
                                                case 3:
                                                    whatIsEvent = 'دروازه را نجات داد';
                                                    whatIsTitle = 'نجات دروازه';
                                                    whatIsIcon = 3;
                                                    break;
                                                case 4:
                                                    whatIsEvent = 'کارت زرد گرفت';
                                                    whatIsTitle = 'کارت زرد';
                                                    whatIsIcon = 4;
                                                    break;
                                                case 5:
                                                    whatIsEvent = 'کارت قرمز گرفت';
                                                    whatIsTitle = 'کارت قرمز';
                                                    whatIsIcon = 5;
                                                    break;
                                                case 7:
                                                    whatIsEvent = 'پنالتی را از دست داد';
                                                    whatIsTitle = 'از دست دادن پنالتی';
                                                    whatIsIcon = 7;
                                                    break;
                                                case 12:
                                                    whatIsEvent = 'دومین کارت زرد خود را گرفت';
                                                    whatIsTitle = 'کارت زرد دوم';
                                                    whatIsIcon = 12;
                                                    break;
                                                case 13:
                                                    whatIsEvent = 'گل به خودی زد';
                                                    whatIsTitle = 'گل به خوردی';
                                                    whatIsIcon = 13;
                                                    break;
                                                case 14:
                                                    whatIsEvent = 'گل پنالتی زد';
                                                    whatIsTitle = 'گل پنالتی';
                                                    whatIsIcon = 14;
                                                    break;
                                                default:
                                            }
                                            return (
                                                <Fragment key={index}>
                                                    <div className='row' style={{ position: 'relative' }}>
                                                        <div className='col-md-8'>
                                                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'matchesResultsEvents-event-text--dark' : 'matchesResultsEvents-event-text'}`}>{event.PlayerName} بازیکن تیم {event.TeamName} {whatIsEvent}</span>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <span className={`matchesResultsEvents-event-img ${localStorage.getItem('theme') === 'dark' ? `matchesResultsEvents-event-img-${whatIsIcon}--dark` : `matchesResultsEvents-event-img-${whatIsIcon}`}`} title={whatIsTitle}></span>
                                                            <span className='matchesResultsEvents-event-delete' onClick={() => { this.deleteThisEvent(event.EventId) }}></span>
                                                        </div>
                                                        <hr className='matchesResultsEvents-spliter' />
                                                    </div>
                                                </Fragment>
                                            )
                                        })
                                    }

                                </div>

                            </div>





                        </div>
                    </Modal>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-plan-cointainer--dark' : 'leagueSetting-plan-cointainer'}`}>
                        <div className='leagueSetting-plan-cointainer-contain'>
                            <div className='row'>
                                <div className='col-12' style={{ marginTop: 20, marginBottom: 10 }}>
                                    <div className='leagueSetting-matchesResults-icon'></div>
                                    <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-matchesResults-title--dark' : 'leagueSetting-matchesResults-title'}`}>وارد کردن نتایج بازی ها</h1>
                                </div>
                                <div className='col-12'>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.goBackToPanel}>بازگشت به پنل تنظیمات</button>
                                </div>
                                <div className='col-12'>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.goBackToLeague}>بازگشت به پروفایل لیگ</button>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='leagueSetting-matchesResults-table'>

                                        <div className='row leagueSetting-matchesResults-table-row'>

                                            <div className='col-md-12'>
                                                <div className='leagueSetting-matchesResults-table-row-heading-items-Container'>
                                                    <div className='row'>
                                                        <div className='col-md-12 col-sm-12'>
                                                            <span className='leagueSetting-matchesResults-heading'>بازی ها</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row leagueSetting-matchesResults-table-row'>
                                            <div className='col-md-12' style={{ paddingRight: 0, paddingLeft: 0, overflow: 'hidden' }}>
                                                <div className='leagueSetting-matchesResults-table-row-items-Container'>
                                                    <div className='row' style={{ marginTop: 13 }}>
                                                        <div className='col-md-12'>
                                                            <span style={{ fontFamily: 'iranYekanBold', fontSize: 18 }}>{this.state.hasMatch}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }

    }
}
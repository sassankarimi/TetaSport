import React, { Component, Fragment } from 'react';
import Modal from 'react-responsive-modal';
import Hashids from 'hashids';
import { handleMSG } from '../../../jsFunctions/all.js';
import IziToast from 'izitoast';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);

export class LeagueSettingsManageTeams extends Component {
    static displayName = LeagueSettingsManageTeams.name;

    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            searchTeams: [],
            isLoading: true,
            noResultTxt: 'شما هنوز هیچ تیمی را اضافه نکرده اید',
            searchValue: '',
            openSureModal: false,
            timeOut: 0,
            loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            teamId: 0,
            teamNameInModal: '',
            teamIdInModal: '',
            teamCreatorNameInModal: '',
            leagueID: hashid.decode(this.props.match.params.leagueId),
            openFinalSureModal: false,
            modalTxt: '',
            modalFunction: '',

        }
        this.getSearchTeams = this.getSearchTeams.bind(this);
    }

    componentDidMount() {
        //دریافت تیم
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueParticipatingTeams}`, {
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
                case 500:
                    this.setState({ isLoading: false, noResultTxt:'خطای سرور' })
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    this.setState({ isLoading: false, })
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({
                        teams: data.Teams,
                        isLoading: false,
                    });
                }
            });
    }

    onOpenModal = (teamId, teamName, teamCreatorName) => {
        this.setState({
            openSureModal: true,
            teamIdInModal: teamId,
            teamNameInModal: teamName,
            teamCreatorNameInModal: teamCreatorName,
        });
    };

    onCloseModal = () => {
        this.setState({ openSureModal: false });
    };

    onOpenFinalModal = () => {
        this.setState({
            openFinalSureModal: true,
        });
    };

    onCloseFinalModal = () => {
        this.setState({ openFinalSureModal: false });
    };

    goBackToPanel = () => {
        let hashedLid = this.props.match.params.leagueId;
        this.props.history.push(`/leagueSettings/${hashedLid}`);
    }

    addNewTeamToLeague = (teamId, teamName, teamMakerId, teamMakerName, teamMakerUserName, avatar) => {
        let obj = { 'TeamId': teamId, 'TeamName': teamName, 'CreatorId': teamMakerId, 'CreatorName': teamMakerName, 'CreatorUserName': teamMakerUserName, 'Avatar': avatar };
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', leagueIdDecoded);
        form.append('TeamId', teamId);
        fetch(`${configPort.TetaSport}${configUrl.AddTeamToLeague}`, {
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
                    this.setState({
                        teams: [...this.state.teams, obj]
                    })
                }
            });

        document.getElementById('LeagueSettings-search-result').style.opacity = 0;
        document.getElementById('LeagueSettings-search-result').style.visibility = 'hidden';
        document.getElementById('LeagueSettings-search-result').style.zIndex = -1;



    }

    handleSearchBox = (e) => {
        let searchTxt = e.target.value;
        this.setState({
            searchValue: e.target.value,
        })
        if (e.target.value !== '') {
            document.getElementById('LeagueSettings-search-result').style.opacity = 1;
            document.getElementById('LeagueSettings-search-result').style.visibility = 'visible';
            document.getElementById('LeagueSettings-search-result').style.zIndex = 10000;
        } else {
            document.getElementById('LeagueSettings-search-result').style.opacity = 0;
            document.getElementById('LeagueSettings-search-result').style.visibility = 'hidden';
            document.getElementById('LeagueSettings-search-result').style.zIndex = -1;
        }

        if (e.target.value !== '') {
            if (this.state.timeOut) clearTimeout(this.state.timeOut);
            this.setState({
                searchTeams: [],
                loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
                timeOut: setTimeout(() => { this.getSearchTeams(searchTxt) }, 500),
            })
            //تابع سرچ
        } else {
            this.setState({
                searchTeams: [],
                loadingOrNoResult: null
            })
        }
    }

    getSearchTeams = (txt) => {
        this.setState({
            loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        });
        //دریافت تیم
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('TeamName', txt);
        form.append('SortType', 1);
        form.append('ItemsPerPage', 10);
        form.append('RequestingPage', 1);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.SearchForNewLeagueConformingTeams}`, {
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
                        loadingOrNoResult: 'چیزی برای نمایش موجود نیست',
                    });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    this.setState({
                        loadingOrNoResult: 'خطایی رخ داده است',
                    });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Teams) {
                        if (data.Teams.length !== 0) {
                            this.setState({
                                searchTeams: data.Teams,
                                loadingOrNoResult: null,
                            });
                        } else {
                            this.setState({
                                loadingOrNoResult: 'چیزی برای نمایش موجود نیست',
                                searchTeams: [],
                            });
                        }
                    }
                }
            });
    }

    deleteTeamFromLeague = (teamId) => {
        let allTeams = this.state.teams;

        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', leagueIdDecoded);
        form.append('TeamId', teamId);
        fetch(`${configPort.TetaSport}${configUrl.RemoveTeamFromLeague}`, {
            method: 'Delete',
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
                    let filtered = allTeams.filter((team) => {
                        return (
                            team.TeamId !== teamId
                        )
                    })
                    let obj = filtered;
                    this.setState({
                        teams: obj,
                        openSureModal: false,
                    })
                }
            });

    }

    handleSearchBtn = () => {
        if (this.state.searchValue !== '') {
            document.getElementById('LeagueSettings-search-result').style.opacity = 1;
            document.getElementById('LeagueSettings-search-result').style.visibility = 'visible';
            document.getElementById('LeagueSettings-search-result').style.zIndex = 10000;
        }
        this.getSearchTeams(this.state.searchValue)
    }

    FinalizeLeagueTeamsModal = () => {
        this.setState({
            openFinalSureModal: true,
            modalTxt:
                <span className='areuSureModal-font'>
                    آیا از نهایی کردن تیم های لیگ اطمینان دارید ؟
                </span>,
            modalFunction:
                <button 
                    className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                    onClick={this.FinalizeLeagueTeams}
                >
                    بله
                </button>,
        })
    }

    FinalizeLeagueTeams = () => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', this.state.leagueID);
        fetch(`${configPort.TetaSport}${configUrl.FinalizeLeagueTeams}`, {
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
            }).then((data) => {
                if (data) {
                    let leagueID = this.props.match.params.leagueId;
                    setTimeout(function () {
                        this.props.history.push(`/leagueSettings/plan/${leagueID}`);
                    }.bind(this), 1500)
                }
            })
        this.setState({
            openFinalSureModal: false,
        })
    }


    render() {
        // تایتل پیج
        document.getElementsByTagName("title")[0].innerHTML = `پنل تنظیمات لیگ|مدیریت تیم های لیگ`;

        let haveResults = false;
        if (this.state.teams.length !== 0) {
            haveResults = true;
        }

        const teams = this.state.teams;
        const searchTeams = this.state.searchTeams;
        const { openSureModal, openFinalSureModal } = this.state;
        let counter = 0;

        if (!this.state.isLoading) {
            return (
                <Fragment>
                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-cointainer--dark' : 'leagueSetting-panel-cointainer'}`}>

                        <div className='row'>
                            {/* بخش سرچ باکس */}
                            <div className="input-group LeagueSettings-searchbox-styles" style={{ direction: 'ltr' }}>
                                <input className="form-control py-2 border sc-search-box-input" type="search" placeholder='تیم مورد نظر را به لیگ اضافه کنید' style={{ height: 58, textAlign: 'right', fontFamily: 'iranyekanBold', background: '#F3F3F3' }} value={this.state.searchValue} onChange={this.handleSearchBox} />
                                <span className="input-group-append">
                                    <button className="btn btn-outline-secondary border-left-0 border " type="button" style={{ background: '#F3F3F3', paddingBottom: 0, }} onClick={this.handleSearchBtn}>
                                        <span style={{ border: '1px solid #4A4A4A', height: 45, display: 'inline-block' }}></span>
                                        <span className='League-searchbox-btn'></span>
                                    </button>
                                </span>
                                <div className='LeagueSettings-search-result' id='LeagueSettings-search-result'>

                                    <div className='row'>
                                        <div style={{ width: '100%', fontFamily: 'iranYekanBold', fontSize: 15 }}>
                                            {this.state.loadingOrNoResult}
                                        </div>
                                        {
                                            searchTeams.map((team, index) => {
                                                let teamAvatar = '/src/icon/defaultAvatar.png';
                                                if (team.Avatar !== null && team.Avatar !== '' && team.Avatar !== undefined) {
                                                    teamAvatar = team.Avatar;
                                                }
                                                return (
                                                    <Fragment key={index}>
                                                        <div className='col-md-12'>
                                                            <div className='LeagueSettings-search-result-contain'>
                                                                <div className='LeagueSettings-search-result-contain-contain' onClick={() => { this.addNewTeamToLeague(team.TeamId, team.TeamName, team.CreatorId, team.CreatorName, team.CreatorUserName, team.Avatar) }}>
                                                                    <div className='LeagueSettings-search-result-contain-avatar'>
                                                                        <img src={`${teamAvatar}`} className='LeagueSettings-search-result-contain-avatar-img' alt={`${team.TeamName}`} />
                                                                    </div>

                                                                    <div className='LeagueSettings-search-result-contain-txt'>
                                                                        <span className='LeagueSettings-search-result-contain-text-spn'> تیم {team.TeamName} (سازنده تیم: {team.CreatorName}) ({team.CreatorUserName})</span>
                                                                    </div>

                                                                    <div className='LeagueSettings-search-result-contain-plus'>
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
                            </div>
                        </div>



                        <div className='row'>
                            <div className='col-12'>
                                <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-title--dark' : 'leagueSetting-manageTeams-title'}`}> تیم های عضو لیگ</h1>
                                <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.FinalizeLeagueTeamsModal}>نهایی کردن تیم ها</button>
                                <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.goBackToPanel}>بازگشت به پنل تنظیمات</button>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='leagueSetting-manageTeams-content'>

                                {/*------------------------تیمی یافت نشد-------------------------*/}
                                <div className='row' style={{ textAlign: 'center', display: (!haveResults) ? 'block' : 'none' }}>
                                    <div className='col-md-12'>
                                        <div className='leagueSetting-manageTeams-content-noResult-Container'>
                                            <span className='leagueSetting-manageTeams-content-noResult-Txt'>{this.state.noResultTxt}</span>
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <div className='leagueSetting-manageTeams-content-noResult'>
                                        </div>
                                    </div>
                                </div>
                                {/*---------------------------------------------------------------*/}

                                <div className='row' style={{ display: (haveResults) ? 'flex' : 'none' }}>

                                    {
                                        teams.map((team, index) => {
                                            let teamID = hashid.encode(team.TeamId);
                                            counter++
                                            let teamAvatar = '/src/profilePic/defaultAvatar.png';
                                            if (team.Avatar !== '' && team.Avatar !== null && team.Avatar !== undefined) {
                                                teamAvatar = team.Avatar;
                                            }
                                            return (
                                                <Fragment key={index}>
                                                    <div className='col-md-6'>
                                                        <div className='leagueSetting-manageTeams-content-Result'>
                                                            <div className='leagueSetting-manageTeams-content-Result-badge'>
                                                                <span className='leagueSetting-manageTeams-content-Result-badge-icon'>{counter}</span>
                                                            </div>
                                                            <div className='leagueSetting-manageTeams-content-Result-team'>
                                                                <div className='leagueSetting-manageTeams-content-Result-team-Avatar'>
                                                                    <a className='link-hover-defaultStyle' href={`/teamProfile/${teamID}`} target={teamID}><img className='leagueSetting-manageTeams-content-Result-team-Avatar-img' src={teamAvatar} alt={team.TeamName} /></a>
                                                                </div>
                                                                <div className='leagueSetting-manageTeams-content-Result-team-title'>
                                                                    <a className='link-hover-defaultStyle' href={`/teamProfile/${teamID}`} target={teamID}><span className='leagueSetting-manageTeams-content-Result-team-title-txt'> {`${team.TeamName}`}  (سازنده تیم : {team.CreatorName})({team.CreatorUserName})</span></a>
                                                                </div>
                                                                <div className='leagueSetting-manageTeams-content-Result-team-delete' onClick={() => { this.onOpenModal(team.TeamId, team.TeamName, team.CreatorName) }}>
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
                        </div>

                    </div>
                    {/* آیا اطمینان دارید؟ - delete */}
                    <Modal classNames={{ overlay: 'areUsureModal', modal: 'areUsureModal-bg', closeButton: 'areUsureModal-closeBtn' }} open={openSureModal} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={true} center>
                        <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                            style={{ maxWidth: 880, minHeight: 270, paddingTop: "8%", borderRadius: 3, textAlign: 'center', paddingBottom:10 }}>
                            <div className="w3-section px-5" style={{ textAlign: 'right', direction: 'rtl' }}>
                                <div className="input-group mb-3" style={{ paddingRight:30 }}>
                                    <div className="row" style={{ width: "100%", textAlign: 'center' }}>
                                        <div className="col-md-12">
                                            <span className='areuSureModal-font'>آیا از حذف کردن تیم {this.state.teamNameInModal} ({this.state.teamCreatorNameInModal}) اطمینان دارید ؟</span>
                                            <button 
                                                className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                                                onClick={() => { this.deleteTeamFromLeague(this.state.teamIdInModal) }}
                                            >
                                                بله
                                            </button>
                                            <button 
                                                className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                                                onClick={this.onCloseModal}
                                            >
                                                خیر
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    {/* آیا اطمینان دارید؟ */}
                    <Modal classNames={{ overlay: 'areUsureModal-1', modal: 'areUsureModal-bg', closeButton: 'areUsureModal-closeBtn' }} open={openFinalSureModal} onClose={this.onCloseFinalModal} closeOnEsc={true} closeOnOverlayClick={true} center>
                        <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                            style={{ maxWidth: 880, paddingBottom: 60, paddingTop: "8%", borderRadius: 3, textAlign: 'center' }}>
                            <div className="w3-section px-5" style={{ textAlign: 'right', direction: 'rtl' }}>
                                <div className="input-group mb-3" style={{ paddingRight: 30 }}>
                                    <div className="row" style={{ width: "100%", textAlign: 'center' }}>
                                        <div className="col-md-12">
                                            {/* متن مدال */}
                                            {this.state.modalTxt}

                                            {/* تابع */}
                                            {this.state.modalFunction}

                                            {/* لغو */}
                                            <button 
                                                className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                                                onClick={this.onCloseFinalModal}
                                            >
                                                خیر
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </Fragment>
            );
        } else {
            return (
                <div id='Listleague-loading'>
                    <div className='Listleague-loading-container'>
                        <img src='/src/icon/teta-logo.png' className='Listleague-loading-icon' alt='loading' />
                        <div className='Listleague-loading-gif'></div>
                    </div>
                </div>
            )
        }

    }
}

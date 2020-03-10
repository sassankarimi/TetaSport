import React, { Component, Fragment } from 'react';
import Modal from 'react-responsive-modal';
import Hashids from 'hashids';
import { toast } from 'react-toastify';
import { handleMSG } from '../../../jsFunctions/all.js';
import IziToast from 'izitoast';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

let hashid = new Hashids('', 7);
let urlArray = [];
let lgId = '';

export class LeagueSettingsPanel extends Component {
    static displayName = LeagueSettingsPanel.name;

    constructor(props) {
        super(props);
        this.state = {
            leagueID: hashid.decode(this.props.match.params.leagueId),
            openSureModal: false,
            modalTxt: '',
            modalFunction: '',
            canIAccess: [],
            leagueStatus: '',
            leagueStep: '',
        }
        //Url پیمایش
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
            case 2:
                lgId = splitStr[2];
                break;
            case 3:
                lgId = splitStr[3];
                break;
            default:

        }
    }

    componentDidMount() {
        this.getLeagueStatus();
    }

    onOpenModal = () => {
        this.setState({
            openSureModal: true,
        });
    };

    onCloseModal = () => {
        this.setState({ openSureModal: false });
    };

    startLeagueModal = () => {
        this.setState({
            openSureModal: true,
            modalTxt:
                <span className='areuSureModal-font'>
                    آیا از شروع کردن لیگ اطمینان دارید ؟
                </span>,
            modalFunction:
                <button
                    className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                    onClick={this.startLeague}
                >
                    بله
                </button>,
        })
    }

    startLeague = () => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', this.state.leagueID);
        fetch(`${configPort.TetaSport}${configUrl.StartLeague}`, {
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
                    this.getLeagueStatus();
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
        })
        this.setState({
            openSureModal: false,
        })
    }

    endLeagueModal = () => {
        this.setState({
            openSureModal: true,
            modalTxt:
                <span className='areuSureModal-font'>
                    آیا از پایان لیگ اطمینان دارید ؟
                </span>,
            modalFunction:
                <button
                    className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                    onClick={this.endLeague}
                >
                    بله
                </button>,

        })

    }

    endLeague = () => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', this.state.leagueID);
        fetch(`${configPort.TetaSport}${configUrl.EndLeague}`, {
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
                    this.getLeagueStatus();
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
        })
        this.setState({
            openSureModal: false,
        })
    }

    cancelLeagueModal = () => {
        this.setState({
            openSureModal: true,
            modalTxt:
                <span className='areuSureModal-font'>
                    آیا از لغو لیگ اطمینان دارید ؟
                </span>,
            modalFunction:
                <button
                    className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                    onClick={this.cancelLeague}
                >
                    بله
                </button>,
        })
    }

    cancelLeague = () => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', this.state.leagueID);
        fetch(`${configPort.TetaSport}${configUrl.CancelLeague}`, {
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
                    this.getLeagueStatus();
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
        })
        this.setState({
            openSureModal: false,
        })
    }

    FinalizeLeagueTeamPlayersModal = () => {
        this.setState({
            openSureModal: true,
            modalTxt:
                <span className='areuSureModal-font'>
                    آیا از نهایی کردن لیست بازیکنهای لیگ اطمینان دارید ؟
                </span>,
            modalFunction:
                <button
                    className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                    onClick={this.FinalizeLeagueTeamPlayers}
                >
                    بله
                </button>,
        })
    }

    FinalizeLeagueTeamPlayers = () => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', this.state.leagueID);
        fetch(`${configPort.TetaSport}${configUrl.FinalizeLeagueTeamPlayers}`, {
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
                    this.getLeagueStatus();
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
        })
        this.setState({
            openSureModal: false,
        })
    }

    goBackToLeague = () => {
        let hashedLid = this.props.match.params.leagueId;
        this.props.history.push(`/leagueProfile/matchInfo/L/${hashedLid}`);
    }

    getLeagueStatus = () => {
        let form = new FormData();
        form.append('LeagueID', this.state.leagueID);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLeagueStatusAndStep}`, {
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
        }).then((data) => {
            if (data) {
                this.setState({
                    leagueStatus: data.Status,
                    leagueStep: data.Step
                })
            }
        })
    }

    canIAccessToThisOption = (Route, n) => {
        // n = 1 : نتایج 
        // n = 2 : مدیریت تیم های لیگ
        // n = 3 : زمانبندی مسابقات
        switch (n) {
            case 1:
            case '1':
                if (this.state.leagueStatus === 2 || this.state.leagueStatus === '2' || this.state.leagueStatus === 3 || this.state.leagueStatus === '3') {
                    this.props.history.push(Route);
                } else {
                    toast.error("لیگ در حال اجرا نیست", { position: toast.POSITION.TOP_CENTER });
                }
                break;
            case 2:
            case '2':
                if (this.state.leagueStatus === 1 || this.state.leagueStatus === '1' || this.state.leagueStatus === 1 || this.state.leagueStatus === '1') {
                    if (this.state.leagueStep === 1 || this.state.leagueStep === '1') {
                        this.props.history.push(Route);
                    } else {
                        toast.error("لیگ در مرحله ی انتخاب تیم نیست", { position: toast.POSITION.TOP_CENTER });
                    }
                } else {
                    toast.error("لیگ در مرحله ی انتخاب تیم نیست", { position: toast.POSITION.TOP_CENTER });
                }
                break;
            case 3:
            case '3':
                if (this.state.leagueStatus === 1 || this.state.leagueStatus === '1' || this.state.leagueStatus === 1 || this.state.leagueStatus === '1') {
                    if (this.state.leagueStep === 2 || this.state.leagueStep === '2') {
                        this.props.history.push(Route);
                    } else {
                        toast.error("لیگ در مرحله ی زمانبندی مسابقات نیست", { position: toast.POSITION.TOP_CENTER });
                    }
                } else {
                    toast.error("لیگ در مرحله ی انتخاب تیم نیست", { position: toast.POSITION.TOP_CENTER });
                }
                break;
            default:
        }
    }

    comingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
    }


    render() {
        // تایتل صفحه
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت | پنل تنظیمات لیگ`;
        const { openSureModal } = this.state;
        return (
            <Fragment>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-cointainer--dark' : 'leagueSetting-panel-cointainer'}`}>
                    <div className='row' style={{ marginBottom: 20, marginTop: 20 }}>
                        <div className='col-12'>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-icon--dark' : 'leagueSetting-panel-icon'}`}></div>
                            <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-title--dark' : 'leagueSetting-panel-title'}`}>تنظیمات لیگ</h1>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.goBackToLeague}>بازگشت به پروفایل لیگ</button>
                        </div>
                    </div>

                    <div className='row'>
                        {/* نتایج 1*/}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-Results'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>نتایج</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'>شما میتوانید در این قسمت نتایج تیم های مختلف را در لیگ وارد کنید</span>
                                    </div>
                                    {/*<a href={`/leagueSettings/matchesResults/${lgId}`}>*/}
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`} onClick={() => { this.canIAccessToThisOption(`/leagueSettings/matchesResults/${lgId}`, 1) }}>
                                        <span className='leagueSetting-panel-btn-icon leagueSetting-panel-btn-icon-plus'></span>
                                        <span className='leagueSetting-panel-btn-txt'>افزودن نتایج بازی ها</span>
                                    </button>
                                    {/*</a>*/}
                                </div>
                            </div>
                        </div>
                        {/* مدیریت تیم های لیگ 2*/}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-Manage'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>مدیریت تیم های لیگ</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'>شما میتوانید در این قسمت تیم های دلخواه را در لیگ اضافه یا حذف کنید</span>
                                    </div>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`} onClick={() => { this.canIAccessToThisOption(`/leagueSettings/manageTeams/${lgId}`, 2) }}>
                                        <span className='leagueSetting-panel-btn-icon leagueSetting-panel-btn-icon-Manage'></span>
                                        <span className='leagueSetting-panel-btn-txt'>انتخاب تیم ها</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* زمانبندی مسابقات 3*/}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-Plan'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>برنامه ریزی زمانبندی مسابقات</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'>شما میتوانید در این قسمت زمان برگزاری بازیها را در لیگ تغییر دهید</span>
                                    </div>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`} onClick={() => { this.canIAccessToThisOption(`/leagueSettings/plan/${lgId}`, 3) }}>
                                        <span className='leagueSetting-panel-btn-txt'>زمان بندی مسابقات</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* نهایی کردن لیست بازیکنان */}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-final'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>نهایی کردن لیست بازیکنان</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'>قبل از شروع لیگ برای جلوگیری از هرگونه تغییر در تیم ها لیست بازیکنان را نهایی کنید</span>
                                    </div>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`} onClick={this.FinalizeLeagueTeamPlayersModal}>
                                        <span className='leagueSetting-panel-btn-txt'>نهایی کردن بازیکنان</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* شروع لیگ */}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-startLeague'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>شروع لیگ</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'>بعد از نهایی کردن تیم ها، بازیها و بازیکنان میتوانید لیگ را شروع کنید</span>
                                    </div>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`} onClick={this.startLeagueModal}>
                                        <span className='leagueSetting-panel-btn-txt'>شروع لیگ</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* پایان لیگ */}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-finnishLeague'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>پایان لیگ</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'>بعد از شروع لیگ میتوانید آن را پایان دهید</span>
                                    </div>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`} onClick={this.endLeagueModal}>
                                        <span className='leagueSetting-panel-btn-txt'>پایان لیگ</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* ویرایش */}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-Edit'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>ویرایش</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'> شما میتوانید در این قسمت مشخصات اصلی لیگ را ویرایش کنید</span>
                                    </div>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`} onClick={this.comingSoon}>
                                        <span className='leagueSetting-panel-btn-icon leagueSetting-panel-btn-icon-Pencil'></span>
                                        <span className='leagueSetting-panel-btn-txt'>ویرایش مشخصات لیگ</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* ارسال پیام به تیم ها */}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-mail'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>ارسال پیام به تیم ها</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'>در هر مرحله میتوانید با ارسال پیام به تیم ها آنها را از روند برگزاری مسابقات آگاه کنید</span>
                                    </div>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`} onClick={this.comingSoon}>
                                        <span className='leagueSetting-panel-btn-txt'>ارسال پیام به سرپرست تیم ها</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* لغو لیگ */}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-cancelLeague'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>لغو لیگ</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'>تا قبل از شروع لیگ میتوانید آن را لغو کنید</span>
                                    </div>
                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`} onClick={this.cancelLeagueModal}>
                                        <span className='leagueSetting-panel-btn-txt'>لغو لیگ</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* بازیکنان لیگ */}
                        <div className='col-md-4' style={{ paddingBottom: 50, paddingTop: 50 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item--dark' : 'leagueSetting-panel-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-item-header--dark' : 'leagueSetting-panel-item-header'}`}>
                                    <div className='leagueSetting-panel-item-header-icon leagueSetting-panel-item-header-icon-playersList'></div>
                                    <h2 className='leagueSetting-panel-item-header-title'>لیست شرکت کنندگان در لیگ</h2>
                                </div>
                                <div className='leagueSetting-panel-item-body'>
                                    <div className='leagueSetting-panel-text-container'>
                                        <span className='leagueSetting-panel-text'>در این قسمت لیست تمامی تیم ها و بازیکنان شرکت کننده در این لیگ را مشاهده کنید</span>
                                    </div>
                                    <a href={`/leagueSettings/playersList/${lgId}`} target={lgId} className=''>
                                        <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-panel-btn--dark' : 'leagueSetting-panel-btn'}`}>
                                            <span className='leagueSetting-panel-btn-txt'>نمایش لیست</span>
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* آیا اطمینان دارید؟ */}
                <Modal classNames={{ overlay: 'areUsureModal', modal: 'areUsureModal-bg', closeButton: 'areUsureModal-closeBtn' }} open={openSureModal} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={true} center>
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

            </Fragment>
        );
    }
}
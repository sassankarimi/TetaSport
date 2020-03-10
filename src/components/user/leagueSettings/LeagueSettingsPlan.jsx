import React, { Component, Fragment } from 'react';
import Modal from 'react-responsive-modal';
import { DatePicker } from "react-advance-jalaali-datepicker";
import Hashids from 'hashids';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { handleMSG } from '../../../jsFunctions/all.js';
import { toast } from 'react-toastify';
import IziToast from 'izitoast';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';


//متغییر سراسری
let hashid = new Hashids('', 7);
const showSecond = true;
const str = showSecond ? 'HH:mm:ss' : 'HH:mm';

export class LeagueSettingsPlan extends Component {
    static displayName = LeagueSettingsPlan.name;
    constructor(props) {
        super(props);
        this.state = {
            allMatches: [],
            leagueID: hashid.decode(this.props.match.params.leagueId),
            openSureModal: false,
            modalTxt: '',
            modalFunction: '',
            leagueStructure: 0,
        }
        this.handlePlanDateInput = this.handlePlanDateInput.bind(this);

    }

    componentDidMount() {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);

        var form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('ShowWaitingMatchs', true);
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
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({ allMatches: data.MatchList });
                }
            });

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

    onOpenModal = () => {
        this.setState({
            openSureModal: true,
        });
    };

    onCloseModal = () => {
        this.setState({ openSureModal: false });
    };

    FinalizeLeagueMatchesSchaduleModal = () => {
        this.setState({
            openSureModal: true,
            modalTxt:
                <span className='areuSureModal-font'>
                    آیا از نهایی کردن لیست بازیهای لیگ اطمینان دارید ؟
                </span>,
            modalFunction:
                <button 
                    className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                    onClick={this.FinalizeLeagueMatchesSchadule}
                >
                    بله
                </button>,
        })
    }

    FinalizeLeagueMatchesSchadule = () => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', this.state.leagueID);
        fetch(`${configPort.TetaSport}${configUrl.FinalizeLeagueMatchesSchadule}`, {
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
                let lId = hashid.encode(this.state.leagueID);
                setTimeout(function () {
                    this.props.history.replace(`/leagueSettings/${lId}`)
                }.bind(this), 1500)
            }
        })
        this.setState({
            openSureModal: false,
        })
    }


    // انتخاب تاریخ
    DatePickerInputMatchesPlan(props) {
        return <input {...props} className='form-control leagueSetting-plan-table-row-items-input' />;
    }


    handlePlanDateInput = (formated) => {
    }

    arrangeTeamInLeagueModal = () => {
        this.setState({
            openSureModal: true,
            modalTxt:
                <span className='areuSureModal-font'>
                    آیا از چیدن بازی ها در لیگ اطمینان دارید ؟
                </span>,
            modalFunction:
                <button 
                    className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                    onClick={this.arrangeTeamInLeague}
                >
                    بله
                </button>,
        })
    }

    arrangeTeamInLeague = () => {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', leagueIdDecoded);
        fetch(`${configPort.TetaSport}${configUrl.ArrangeMatches}`, {
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
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
                }
            });
        this.setState({
            openSureModal: false,
        });
    }

    setMatchTime = (id) => {
        //تاریخ
        let getdateInputValue = document.getElementById(`date-${id}`).value;
        // زمان
        let getTimeInputValue = document.getElementById(`time-${id}`).value;
        if (getdateInputValue !== '' && getTimeInputValue !== '') {
            document.getElementById(`date-${id}`).classList.add('dt-tm-input-done');
            document.getElementById(`time-${id}`).classList.add('dt-tm-input-done');
            document.getElementById(`send-${id}`).style.opacity = '0';
            document.getElementById(`send-${id}`).style.visibility = 'hidden';
        } else {
            toast.error("! مقادیر را وارد کنید", { position: toast.POSITION.TOP_CENTER });
        }


        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('MatchID', [id]);
        form.append('Date', getdateInputValue);
        form.append('Time', getTimeInputValue);

        fetch(`${configPort.TetaSport}${configUrl.UpdateMatchSchedule}`, {
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

    resetTimers = (id) => {
        //تاریخ
        document.getElementById(`date-${id}`).value = '';
        //زمان
        document.getElementById(`time-${id}`).value = '';

        document.getElementById(`date-${id}`).classList.remove('dt-tm-input-done');
        document.getElementById(`time-${id}`).classList.remove('dt-tm-input-done');

        document.getElementById(`send-${id}`).style.opacity = '1';
        document.getElementById(`send-${id}`).style.visibility = 'visible';

    }

    timeChanged = (id) => {
        document.getElementById(`send-${id}`).style.opacity = '1';
        document.getElementById(`send-${id}`).style.visibility = 'visible';
    }

    dateChanged = (id) => {
        document.getElementById(`send-${id}`).style.opacity = '1';
        document.getElementById(`send-${id}`).style.visibility = 'visible';
    }

    goBackToPanel = () => {
        let hashedLid = this.props.match.params.leagueId;
        this.props.history.push(`/leagueSettings/${hashedLid}`);
    }

    render() {
        // تایتل صفحه
        document.getElementsByTagName("title")[0].innerHTML = `پنل تنظیمات لیگ|برنامه ریزی زمانبندی مسابقات`;

        let matches = this.state.allMatches;
        let counter = 0;
        const { openSureModal } = this.state;
        let leagueID = this.props.match.params.leagueId;

        return (
            <Fragment>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-plan-cointainer--dark' : 'leagueSetting-plan-cointainer'}`}>
                    <div className='leagueSetting-plan-cointainer-contain'>
                        <div className='row'>
                            <div className='col-12' style={{ marginBottom:20 }}>
                                <div className='leagueSetting-Plan-icon'></div>
                                <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-Plan-title--dark' : 'leagueSetting-Plan-title'}`}>برنامه ریزی زمان بندی مسابقات</h1>
                            </div>
                            <div className='col-12'>
                                <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.FinalizeLeagueMatchesSchaduleModal}>نهایی کردن لیست بازیها</button>
                                <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.arrangeTeamInLeagueModal}>بازیها را در لیگ بچین</button>
                                <button className={`${localStorage.getItem('theme') === 'dark' ? 'leagueSetting-manageTeams-btn--dark' : 'leagueSetting-manageTeams-btn'}`} onClick={this.goBackToPanel}>بازگشت به پنل تنظیمات</button>
                            </div>

                        </div>

                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='leagueSetting-plan-table'>

                                    <div className='row leagueSetting-plan-table-row'>

                                        <div className='col-md-12'>
                                            <div className='leagueSetting-plan-table-row-heading-items-Container'>
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <span className='leagueSetting-plan-heading'>تیم</span>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <span className='leagueSetting-plan-heading'>ساعت</span>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <span className='leagueSetting-plan-heading'>تاریخ</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                    </div>

                                    {
                                        matches.map((match, index) => {
                                            counter++;
                                            return (
                                                <Fragment key={index}>
                                                    <div className='row leagueSetting-plan-table-row'>
                                                        <div className='col-md-12'>
                                                            <div className='leagueSetting-plan-table-row-items-Container'>
                                                                <div className='row team-time-date'>
                                                                    <div className='leagueSetting-plan-table-row-items-badge-container'>
                                                                        <span className='leagueSetting-plan-table-row-items-badge'>{counter}</span>
                                                                    </div>
                                                                    <div className='col-md-4'>
                                                                        <span className='leagueSetting-plan-table-row-items-teamsName'>{match.FirstTeamName} - {match.SecondTeamName}</span>
                                                                    </div>
                                                                    <div className='col-md-4 form-group'>

                                                                        {
                                                                            (match.Time !== '' && match.Time !== undefined) ?
                                                                                <TimePicker
                                                                                    id={`time-${match.MatchId}`}
                                                                                    format={str}
                                                                                    showSecond={showSecond}
                                                                                    onChange={() => { this.timeChanged(`${match.MatchId}`) }}
                                                                                    defaultValue={moment(`${match.Time}`, 'HH:mm:ss')}
                                                                                    className="MyCustomizedTimePickerContainer"
                                                                                    hideDisabledOptions
                                                                                />
                                                                                :
                                                                                <TimePicker
                                                                                    id={`time-${match.MatchId}`}
                                                                                    format={str}
                                                                                    showSecond={showSecond}
                                                                                    onChange={() => { this.timeChanged(`${match.MatchId}`) }}
                                                                                    className="MyCustomizedTimePickerContainer"
                                                                                    hideDisabledOptions
                                                                                />

                                                                        }

                                                                    </div>

                                                                    <div className='col-md-4 form-group'>

                                                                        {
                                                                            (match.Time !== '' && match.Time !== undefined) ?
                                                                                <DatePicker
                                                                                    inputComponent={this.DatePickerInputMatchesPlan}
                                                                                    placeholder=""
                                                                                    format="jYYYY/jMM/jDD"
                                                                                    id={`date-${match.MatchId}`}
                                                                                    preSelected={`${match.Date}`}
                                                                                    customClass='leagueSettingCustomizedDatepickerReact'
                                                                                    cancelOnBackgroundClick={false}
                                                                                    containerClass='datepickerInputCostumize'
                                                                                    onChange={() => { this.dateChanged(`${match.MatchId}`) }}
                                                                                />
                                                                                :
                                                                                <DatePicker
                                                                                    inputComponent={this.DatePickerInputMatchesPlan}
                                                                                    placeholder=""
                                                                                    format="jYYYY/jMM/jDD"
                                                                                    id={`date-${match.MatchId}`}
                                                                                    customClass='leagueSettingCustomizedDatepickerReact'
                                                                                    cancelOnBackgroundClick={false}
                                                                                    containerClass='datepickerInputCostumize'
                                                                                    onChange={() => { this.dateChanged(`${match.MatchId}`) }}
                                                                                />
                                                                        }


                                                                    </div>
                                                                    <div className='leagueSetting-plan-table-row-items-buttton-container'>
                                                                        <div className='leagueSetting-plan-table-buttton-eachInput-container'>
                                                                            <div style={{ visibility: (match.Time !== '' || match.Date !== '') ? 'hidden' : 'visible' }} id={`send-${match.MatchId}`} className='leagueSetting-plan-table-accept' title='تایید' onClick={() => { this.setMatchTime(`${match.MatchId}`) }}></div>
                                                                            <div id={`reset-${match.MatchId}`} className='leagueSetting-plan-table-dismiss' title='مجدد' onClick={() => { this.resetTimers(`${match.MatchId}`) }}></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            )

                                        })
                                    }

                                    {
                                        (this.state.leagueStructure === 2 || this.state.leagueStructure === '2')
                                            ?
                                            <div className='row' style={{ marginTop:50 }}>
                                                <div className='col-md-12'>
                                                    <a className='link-hover-defaultStyle' href={`/leagueProfile/leagueGraph/L/${leagueID}`} target={leagueID}><span className={`${localStorage.getItem('theme') === 'dark' ? 'check-cup-duagram--dark' : 'check-cup-duagram'}`}>مشاهده گراف لیگ</span></a>
                                                </div>
                                            </div>
                                            :
                                            null
                                    }

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
            </Fragment >
        );
    }
}
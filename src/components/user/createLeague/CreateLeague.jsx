import React, { Component, Fragment } from 'react';
import Modal from 'react-responsive-modal';
import { DatePicker } from "react-advance-jalaali-datepicker";
import 'react-leaflet-fullscreen/dist/styles.css'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import FullscreenControl from 'react-leaflet-fullscreen';
import Swiper from 'react-id-swiper/lib/ReactIdSwiper.full';
import 'react-id-swiper/src/styles/css/swiper.css';
import { Navigation } from 'swiper/dist/js/swiper.esm';
import ImageUploader from 'react-images-upload';
import { getBase64, getResizeImg } from '../../../jsFunctions/all';
import { toast } from 'react-toastify';
import Hashids from 'hashids';
import { handleMSG } from '../../../jsFunctions/all.js';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../jsFunctions/all.js';
import ReactTooltip from 'react-tooltip';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';


// متغییر سراسری
let createLeagueBackgroundId = 0;
let leagueAvatar = '/src/icon/photo-camera.png';
let hashid = new Hashids('', 7);
let urlArray = [];
let resizeImg = '';

// استپر
export class CreateLeagueStepperModal extends Component {
    static displayName = CreateLeagueStepperModal.name;

    constructor(props) {
        super(props);
        this.state = {
            stepOneOpen: false,
            stepTwoOpen: false,
            stepThreeOpen: false,
            ourOrganizations: [],
            progressBarPercent: 0,
            progressBarPercent2: 0,
            progressBarPercent3: 0,
            /* درصد و مرحله برای مدال 1 */
            leagueNamePercent: 0,
            orgsPercent: 0,
            genderPercent: 0,
            sportPercent: 0,
            agePercent: 0,
            teamCountPercent: 0,
            teamStructurePercent: 0,
            hasOrgsload: true,
            /* درصد و مرحله برای مدال 2 */
            beginDatePercent: 0,
            endDatePercent: 0,
            leagueContactNumberPercent: 0,
            leaguePriceRadioPercent: 0,
            /* درصد و مرحله برای مدال 3 */
            leagueAvatarPercent: 0,
            leagueCoverPercent: 0,
            leagueCityPercent: 0,
            leagueAddressPercent: 0,
            /*  مدال ۱  */
            leagueName: '',
            personalOrOrg: 0,
            whichOrg: '',
            newOrgInput: '',
            leagueSport: 0,
            leagueGender: 0,
            leagueAgeRange: 0,
            leagueTeamCount: '',
            leagueMinPlayer: 0,
            leagueMaxPlayer: 0,
            leagueStructureId: 0,
            leagueRound: 1,
            /*  مدال 2  */
            beginDate: '',
            endDate: '',
            RulsArrayvalues: [''],
            GiftsArrayvalues: [''],
            CreatorContact: '',
            leagueContactNumber: '',
            leaguePriceRadio: '',
            leaguePrice: '',
            leaguePriceMirror: '',
            ourPercent: 9,
            LeaguePriceForceDate: '',
            /*  مدال 3  */
            weWillGetPhoto: true,
            leaagueComments: '',
            provinces: [],
            leagueProvince: '',
            cities: [],
            leagueCity: '',
            leagueAddress: '',
            leagueLat: 35.69982570505505,
            leagueLng: 51.401596069335945,
            /*برای کراپ*/
            imageSrc: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 3,
            croppedAreaPixels: null,
            croppedImage: null,
            /*تعداد لیگ های باقی مانده کاربر*/
            remainingCredit: null,
            //قبل از ارسال درخواست حالت لودینگ
            showThisBtn: <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn--dark' : 'createLeagueSendBtn'}`} onClick={this.createLeague}>ثبت</button>,
            orginalBtn: <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn--dark' : 'createLeagueSendBtn'}`} onClick={this.createLeague}>ثبت</button>,
            doneBtn: <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn-done--dark' : 'createLeagueSendBtn-done'}`}><div className='requestBtn-result-container-modal'><img style={{ height: 16 }} src='src/icon/done-icon.png ' alt='done' /></div></button>,
            failBtn: <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn-done--dark' : 'createLeagueSendBtn-done'}`}><div className='requestBtn-result-container-modal'><img style={{ height: 16 }} src='src/icon/fail-icon.svg ' alt='failed' /></div></button>,
            btnLoading: <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn--dark' : 'createLeagueSendBtn'}`}><img style={{ height: 16 }} src='src/icon/loading.gif ' alt='loading' /></button>,
        }
        this.DatePickerInputBegin = this.DatePickerInputBegin.bind(this);
        this.DatePickerInputEnd = this.DatePickerInputEnd.bind(this);
        this.DatePickerInpuLeaguePriceForceDate = this.DatePickerInpuLeaguePriceForceDate.bind(this);
        this.handleLeagueName = this.handleLeagueName.bind(this);
        this.handleSports = this.handleSports.bind(this);
    }

    componentDidMount() {
        // دریافت استان
        if (this.state.provinces.length === 0) {
            let form = new FormData();
            form.append('UserID', localStorage.getItem('exID'));
            fetch(`${configPort.TetaSport}${configUrl.GetProvinces}`, {
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
                        if (data.Provinces) {
                            this.setState({ provinces: data.Provinces });
                        }
                    }
                });
        }
        //تعداد لیگ های باقی مانده کاربر
        let form1 = new FormData();
        form1.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetRemainingUserCredit}`, {
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
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.RemainingCredit) {
                        this.setState({
                            remainingCredit: data.RemainingCredit
                        });
                    }
                }
            });

    }

    //مرحله ۱
    onOpenModal1 = () => {
        this.setState({ stepOneOpen: true });
    };
    onCloseModal1 = () => {
        this.setState({ stepOneOpen: false });
    };
    //مرحله ۲
    onOpenModal2 = () => {
        this.setState({ stepTwoOpen: true });
    };
    onCloseModal2 = () => {
        this.setState({ stepTwoOpen: false });
    };
    //مرحله ۳
    onOpenModal3 = () => {
        this.setState({ stepThreeOpen: true });
    };
    onCloseModal3 = () => {
        this.setState({ stepThreeOpen: false });
    };


    handleNextModal1 = () => {
        //بستن قبلی
        this.onCloseModal2();
        this.onCloseModal3();
        //باز شدن جدید
        this.onOpenModal1();
    }
    handleNextModal2 = () => {
        if (localStorage.getItem('exID')) {
            if (this.state.leagueName !== '') {
                if (this.state.personalOrOrg !== 0) {
                    let isOrgSet = false
                    switch (this.state.personalOrOrg) {
                        case 1:
                            isOrgSet = true;
                            break;
                        case 2:
                            if (this.state.whichOrg !== '') {
                                isOrgSet = true;
                            } else {
                                isOrgSet = false;
                                toast.error("! انتخاب سازمان لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                            }
                            break;
                        default:
                    }
                    if (isOrgSet) {
                        if (this.state.leagueSport !== 0) {
                            if (this.state.leagueGender !== 0) {
                                if (this.state.leagueAgeRange !== 0) {
                                    if (this.state.leagueTeamCount !== '') {
                                        if (this.state.leagueStructureId !== 0) {
                                            //بستن قبلی
                                            this.onCloseModal1();
                                            this.onCloseModal3();
                                            //بازکردن جدید
                                            this.onOpenModal2();
                                        } else {
                                            toast.error("! تعیین ساختار لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                        }

                                    } else {
                                        toast.error("! تعداد تیم های لیگ باید مشخص شود", { position: toast.POSITION.TOP_CENTER });
                                    }

                                } else {
                                    toast.error("! انتخاب رده سنی اعضای لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                }

                            } else {
                                toast.error("! انتخاب جنسیت اعضای لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                            }

                        } else {
                            toast.error("! انتخاب ورزش برای لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                        }
                    }
                } else {
                    toast.error("! نوع لیگ باید شخصی یا سازمانی باشد", { position: toast.POSITION.TOP_CENTER });
                }

            } else {
                toast.error("! وارد کردن نام لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
            }

        } else {
            toast.error("! برای ساخت لیگ باید ثبت نام کنید", { position: toast.POSITION.TOP_CENTER });
        }
    }
    handleNextModal3 = () => {
        let mobileRegex = /^09\d{9}$/;
        if (localStorage.getItem('exID')) {
            if (this.state.leagueName !== '') {
                if (this.state.personalOrOrg !== 0) {
                    let isOrgSet = false
                    switch (this.state.personalOrOrg) {
                        case 1:
                            isOrgSet = true;
                            break;
                        case 2:
                            if (this.state.whichOrg !== '') {
                                isOrgSet = true;
                            } else {
                                isOrgSet = false;
                                toast.error("! انتخاب سازمان لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                            }
                            break;
                        default:
                    }
                    if (isOrgSet) {
                        if (this.state.beginDate !== '') {
                            if (this.state.endDate !== '') {
                                if (this.state.leagueContactNumber !== '') {
                                    if (mobileRegex.test(this.state.leagueContactNumber)) {
                                        if (this.state.leaguePriceRadio !== '') {
                                            let isSetMoney = false;
                                            if (this.state.leaguePriceRadio === 1) {
                                                if (this.state.leaguePrice !== '') {
                                                    isSetMoney = true;
                                                } else {
                                                    isSetMoney = false;
                                                }
                                            } else {
                                                isSetMoney = true;
                                            }
                                            if (isSetMoney) {
                                                //بستن قبلی
                                                this.onCloseModal1();
                                                this.onCloseModal2();
                                                //بازکردن جدید
                                                this.onOpenModal3();
                                            } else {
                                                toast.error("! تعیین مبلغ ورودی لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                            }

                                        } else {
                                            toast.error("! تعیین رایگان یا عدم رایگان بودن لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                        }

                                    } else {
                                        toast.error("! شماره تماس وارد شده نادرست است", { position: toast.POSITION.TOP_CENTER });
                                    }
                                } else {
                                    toast.error("! افزودن شماره تماس برای پشتیبانی لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                }
                            } else {
                                toast.error("! تعیین تاریخ پایان لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                            }

                        } else {
                            toast.error("! تعیین تاریخ شروع لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                        }
                    }
                } else {
                    toast.error("! نوع لیگ باید شخصی یا سازمانی باشد", { position: toast.POSITION.TOP_CENTER });
                }

            } else {
                toast.error("! وارد کردن نام لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
            }

        } else {
            toast.error("! برای ساخت لیگ باید ثبت نام کنید", { position: toast.POSITION.TOP_CENTER });
        }

    }


    handlePrevModal1 = () => {
        this.onCloseModal2();
        this.onCloseModal3();
        this.onOpenModal1();
    }
    handlePrevModal2 = () => {
        this.onCloseModal1();
        this.onCloseModal3();
        this.onOpenModal2();
    }
    handlePrevModal3 = () => {
        this.onCloseModal1();
        this.onCloseModal2();
        this.onOpenModal1();
    }

    handleLeagueName = (e) => {
        // نمودار پیشرفت
        let SNP = this.state.leagueNamePercent
        if (SNP === 0) {
            SNP = 5;
        }
        if (e.target.value !== '') {
            this.setState({
                leagueNamePercent: 5,
            })
            this.setState({
                progressBarPercent: SNP + this.state.orgsPercent + this.state.genderPercent + this.state.sportPercent + this.state.agePercent + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        } else {
            this.setState({
                leagueNamePercent: 0,
            })
            this.setState({
                progressBarPercent: 0 + this.state.orgsPercent + this.state.genderPercent + this.state.sportPercent + this.state.agePercent + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        }

        this.setState({
            leagueName: e.target.value,
        })
    }
    handleSports = (e) => {
        // نمودار پیشرفت
        let SSP = this.state.sportPercent
        if (SSP === 0) {
            SSP = 5;
        }
        if (e.target.value !== '') {
            this.setState({
                sportPercent: 5,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + this.state.genderPercent + SSP + this.state.agePercent + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        } else {
            this.setState({
                sportPercent: 0,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + this.state.genderPercent + 0 + this.state.agePercent + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        }

        this.setState({ leagueSport: e.target.value });
    }
    handleGenders = (e) => {
        // نمودار پیشرفت
        let SGP = this.state.genderPercent
        if (SGP === 0) {
            SGP = 5;
        }
        if (e.target.value !== '') {
            this.setState({
                genderPercent: 5,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + SGP + this.state.sportPercent + this.state.agePercent + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        } else {
            this.setState({
                genderPercent: 0,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + 0 + this.state.sportPercent + this.state.agePercent + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        }

        this.setState({ leagueGender: e.target.value });
    }
    handleAgeRange = (e) => {
        // نمودار پیشرفت
        let SAP = this.state.agePercent
        if (SAP === 0) {
            SAP = 5;
        }
        if (e.target.value !== '') {
            this.setState({
                agePercent: 5,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + this.state.genderPercent + this.state.sportPercent + SAP + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        } else {
            this.setState({
                agePercent: 0,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + this.state.genderPercent + this.state.sportPercent + 0 + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        }

        this.setState({ leagueAgeRange: e.target.value });
    }
    handleTeamCount = (e) => {
        // نمودار پیشرفت
        let STCP = this.state.teamCountPercent
        if (STCP === 0) {
            STCP = 5;
        }
        if (e.target.value !== '') {
            this.setState({
                teamCountPercent: 5,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + this.state.genderPercent + this.state.sportPercent + this.state.agePercent + STCP + this.state.teamStructurePercent,
            })
        } else {
            this.setState({
                teamCountPercent: 0,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + this.state.genderPercent + this.state.sportPercent + this.state.agePercent + 0 + this.state.teamStructurePercent,
            })
        }

        this.setState({ leagueTeamCount: e.target.value });
        if (e.target.value > 64) {
            this.setState({ leagueTeamCount: 64 });
        }
        if (e.target.value <= 0) {
            this.setState({ leagueTeamCount: 1 });
        }


    }
    leagueRound = (e) => {

        this.setState({ leagueRound: e.target.value });
        if (e.target.value > 100) {
            this.setState({ leagueRound: 100 });
        }
        if (e.target.value <= 0) {
            this.setState({ leagueRound: 1 });
        }

    }

    handleleagueAddress = (e) => {
        this.setState({ leagueAddress: e.target.value })
    }
    handleLeagueCity = (e) => {
        this.setState({ leagueCity: e.target.value })
    }


    handleAvatarChild = () => {
    }
    handleSwiperChild = () => {
    }

    //هندل شخصی یا سازمانی
    handleRadioButtonSelfOrOrg(value) {
        // مرحله
        let SOP = this.state.orgsPercent;
        if (SOP === 0) {
            SOP = 5;
        }
        if (value !== 0) {
            this.setState({
                orgsPercent: 5,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + SOP + this.state.genderPercent + this.state.sportPercent + this.state.agePercent + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        } else {
            this.setState({
                orgsPercent: 0,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + 0 + this.state.genderPercent + this.state.sportPercent + this.state.agePercent + this.state.teamCountPercent + this.state.teamStructurePercent,
            })
        }

        this.setState({ personalOrOrg: value });
        if (value === 1 || value === '1') {
            this.setState({
                whichOrg: '',
            })
        }
    }
    handleRadioButtonWhichOrg = (value) => {
        this.setState({
            whichOrg: value
        });
    }

    //هندل هزینه لیگ
    handleleaguePriceRadio(value) {
        // مرحله
        let SPRP = this.state.leaguePriceRadioPercent;
        if (SPRP === 0) {
            SPRP = 11;
        }
        if (value !== '') {
            this.setState({
                leaguePriceRadioPercent: 11,
            })
            this.setState({
                progressBarPercent2: this.state.beginDatePercent + this.state.endDatePercent + this.state.leagueContactNumberPercent + SPRP,
            })
        } else {
            this.setState({
                leaguePriceRadioPercent: 0,
            })
            this.setState({
                progressBarPercent2: this.state.beginDatePercent + this.state.endDatePercent + this.state.leagueContactNumberPercent + 0,
            })
        }

        this.setState({
            leaguePriceRadio: value,
        })
    }


    handleLeagueMinPlayer = (e) => {
        this.setState({ leagueMinPlayer: e.target.value });
    }

    handleLeagueMaxPlayer = (e) => {
        this.setState({ leagueMaxPlayer: e.target.value });
    }

    // انتخاب تاریخ
    DatePickerInputBegin(props) {
        return <input {...props} style={{ width: '70%', display: 'inline-block', marginLeft: 40 }} type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueName form-control`} placeholder='تاریخ شروع' title='تاریخ شروع' value={this.state.beginDate} onChange={(e) => { this.setState({ beginDate: e.target.value }) }} />;
    }
    DatePickerInputEnd(props) {
        return <input {...props} style={{ width: '70%', display: 'inline-block', marginLeft: 40 }} type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueName form-control`} placeholder='تاریخ پایان' title='تاریخ پایان' value={this.state.endDate} onChange={(e) => { this.setState({ endDate: e.target.value }) }} />;
    }
    handleBeginDate = (unix, formatted) => {
        // نمودار پیشرفت
        let SBP = this.state.beginDatePercent;
        if (SBP === 0) {
            SBP = 30;
        }

        if (formatted !== '') {
            this.setState({
                beginDatePercent: 30,
            })
            this.setState({
                progressBarPercent2: SBP + this.state.endDatePercent + this.state.leagueContactNumberPercent + this.state.leaguePriceRadioPercent,
            })
        } else {
            this.setState({
                beginDatePercent: 0,
            })
            this.setState({
                progressBarPercent2: 0 + this.state.endDatePercent + this.state.leagueContactNumberPercent + this.state.leaguePriceRadioPercent,
            })
        }

        this.setState({ beginDate: formatted });
    }
    handleEndDate = (unix, formatted) => {
        // نمودار پیشرفت
        let SEP = this.state.endDatePercent;
        if (SEP === 0) {
            SEP = 10;
        }
        if (formatted !== '') {
            this.setState({
                endDatePercent: 10,
            })
            this.setState({
                progressBarPercent2: this.state.beginDatePercent + SEP + this.state.leagueContactNumberPercent + this.state.leaguePriceRadioPercent,
            })
        } else {
            this.setState({
                endDatePercent: 0,
            })
            this.setState({
                progressBarPercent2: this.state.beginDatePercent + 0 + this.state.leagueContactNumberPercent + this.state.leaguePriceRadioPercent,
            })
        }

        this.setState({ endDate: formatted });
    }

    DatePickerInpuLeaguePriceForceDate(props) {
        return (
            <Fragment>
                <div className="custom-control">
                    <label className='createLeagueInputsLabel' style={{ fontFamily: 'iranYekanBold' }}>آخرین مهلت پرداخت مبلغ ورودی از سوی تیم ها را مشخص کنید</label>
                    <input {...props} type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueLastTimeLeagueMoney form-control`} placeholder='' value={this.state.LeaguePriceForceDate} onChange={(e) => { this.setState({ LeaguePriceForceDate: e.target.value }) }} />
                </div>
            </Fragment>
        )
    }
    handleLeaguePriceForceDate = (unix, formatted) => {
        this.setState({ LeaguePriceForceDate: formatted });
    }

    hazfiClicked = () => {
        this.setState({ leagueStructureId: 2 });
        document.getElementById('leagueHazfi').style.backgroundColor = `${(localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12'}`;
        document.getElementById('leagueHazfi').style.color = '#fff';
        document.getElementById('leagueLeague').style.backgroundColor = '#F8F8F8';
        document.getElementById('leagueLeague').style.color = '#5C5D5B';

        // نمودار پیشرفت
        let SHP = this.state.teamStructurePercent;
        if (SHP === 0) {
            this.setState({
                teamStructurePercent: 10,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + this.state.genderPercent + this.state.sportPercent + this.state.agePercent + this.state.teamCountPercent + 10,
            })
        }
    }
    leagueClicked = () => {
        this.setState({ leagueStructureId: 1 });
        document.getElementById('leagueLeague').style.backgroundColor = `${(localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12'}`;
        document.getElementById('leagueLeague').style.color = '#fff';
        document.getElementById('leagueHazfi').style.backgroundColor = '#F8F8F8';
        document.getElementById('leagueHazfi').style.color = '#5C5D5B';

        // نمودار پیشرفت
        let SHP = this.state.teamStructurePercent;
        if (SHP === 0) {
            this.setState({
                teamStructurePercent: 10,
            })
            this.setState({
                progressBarPercent: this.state.leagueNamePercent + this.state.orgsPercent + this.state.genderPercent + this.state.sportPercent + this.state.agePercent + this.state.teamCountPercent + 10,
            })
        }
    }

    //انپوت های داینامیک قوانین
    addRuleCreateUI() {
        return this.state.RulsArrayvalues.map((el, i) =>
            <div key={i} style={{ position: 'relative', paddingTop: 7 }}>
                <input type="text" value={el || ''} onChange={this.handleChange.bind(this, i)} className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueName form-control`} placeholder='این قوانین شامل' />
                <input type='button' className='createLeagueRemoveInput' onClick={this.removeClick.bind(this, i)} />
            </div>
        )
    }
    handleChange(i, event) {
        let RulsArrayvalues = [...this.state.RulsArrayvalues];
        RulsArrayvalues[i] = event.target.value;
        this.setState({ RulsArrayvalues });
    }
    addClick() {
        this.setState(prevState => ({ RulsArrayvalues: [...prevState.RulsArrayvalues, ''] }));
    }
    removeClick(i) {
        let RulsArrayvalues = [...this.state.RulsArrayvalues];
        RulsArrayvalues.splice(i, 1);
        this.setState({ RulsArrayvalues });
    }


    //اینپوت های داینامیک جوایز
    addGiftsCreateUI() {
        return this.state.GiftsArrayvalues.map((el, i) =>
            <div key={i} style={{ position: 'relative', paddingTop: 7 }}>
                <input type="text" value={el || ''} onChange={this.handleGiftsChange.bind(this, i)} className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueName form-control`} placeholder='این جوایز شامل' />
                <input type='button' className='createLeagueRemoveInput' onClick={this.removeGiftsClick.bind(this, i)} />
            </div>
        )
    }
    handleGiftsChange(i, event) {
        let GiftsArrayvalues = [...this.state.GiftsArrayvalues];
        GiftsArrayvalues[i] = event.target.value;
        this.setState({ GiftsArrayvalues });
    }
    addGiftsClick() {
        this.setState(prevState => ({ GiftsArrayvalues: [...prevState.GiftsArrayvalues, ''] }));
    }
    removeGiftsClick(i) {
        let GiftsArrayvalues = [...this.state.GiftsArrayvalues];
        GiftsArrayvalues.splice(i, 1);
        this.setState({ GiftsArrayvalues });
    }


    //هزینه لیگ
    leagueHasPrice = (e) => {
        let onlyNum = /^\d*$/;
        if (onlyNum.test(e.target.value)) {
            this.setState({ leaguePrice: e.target.value, leaguePriceMirror: e.target.value });
            //if (e.target.value !== '') {
            //    this.leagueCalculatePrice(e.target.value);
            //} else {
            //    this.setState({
            //        leaguePrice: ''
            //    })
            //}
        }
    }
    leagueCalculatePrice = (value) => {
        let percent = (this.state.ourPercent / 100) * value;
        let total = parseInt(value) + percent;
        this.setState({
            leaguePrice: Math.round(total)
        })
    }
    //کانتکت لیگ
    leagueContact = (e) => {
        let onlyNum = /^\d*$/;

        // نمودار پیشرفت
        let SCNP = this.state.leagueContactNumberPercent;
        if (SCNP === 0) {
            SCNP = 9;
        }
        if (onlyNum.test(e.target.value) && e.target.value !== '') {
            this.setState({
                leagueContactNumberPercent: 9,
            })
            this.setState({
                progressBarPercent2: this.state.beginDatePercent + this.state.endDatePercent + SCNP + this.state.leaguePriceRadioPercent,
            })
        } else {
            this.setState({
                leagueContactNumberPercent: 0,
            })
            this.setState({
                progressBarPercent2: this.state.beginDatePercent + this.state.endDatePercent + 0 + this.state.leaguePriceRadioPercent,
            })
        }

        if (onlyNum.test(e.target.value)) {

            this.setState({ leagueContactNumber: e.target.value })
        }
    }

    //درگ نقشه
    draged = (e) => {
        let latLng = e.target.getLatLng(); //گرفتن طول و عرض مارکر بعد از تغییر مکان
        //آپدیت 
        this.setState({ leagueLat: latLng.lat, leagueLng: latLng.lng })
    }

    //آیکون نقشه
    suitcasePoint = new L.Icon({
        iconUrl: `${localStorage.getItem('theme') === 'dark' ? `/src-dark/icon/marker-icon-1.png` : `/src/icon/marker-icon-1.png`}`,
        iconRetinaUrl: `${localStorage.getItem('theme') === 'dark' ? `/src-dark/icon/marker-icon-1.png` : `/src/icon/marker-icon-1.png`}`,
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [40, 40],
        shadowSize: [29, 40],
        shadowAnchor: [7, 40],
    })

    //دریافت سازمان ها
    getOrgsFromApi = () => {
        this.setState({
            hasOrgsload: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        });
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        if (this.state.ourOrganizations.length === 0) {
            fetch(`${configPort.TetaSport}${configUrl.GetUserOrgs}`, {
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
                        this.setState({ hasOrgsload: true });
                        handleMSG(code, response.json());
                        return false;
                }
            }).then(
                data => {
                    if (data) {
                        if (data.Organizations) {
                            this.setState({ ourOrganizations: data.Organizations, hasOrgsload: true })
                        } else {
                            this.setState({
                                hasOrgsload: true,
                            });
                        }
                    }
                });
        }

    }

    // دریافت شهر ها
    getCities = (e) => {
        this.setState({
            cities: [],
            leagueCity: '',
            leagueProvince: e.target.value
        });
        let form = new FormData();
        form.append('ProvinceID', e.target.value);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetProvinceCities}`, {
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
                    if (data.Cities) {
                        this.setState({
                            cities: data.Cities,
                            leagueLat: data.Latitude,
                            leagueLng: data.Longitude,
                        });
                    }
                }
            });

    }

    //ساخت لیگ
    createLeague = () => {
        //قبل از ارسال
        this.setState({
            showThisBtn: this.state.btnLoading,
        });
        let exId = localStorage.getItem('exID');
        let form = new FormData();

        form.append('UserID', exId);

        form.append('Title', this.state.leagueName);

        if (this.state.whichOrg === 0 || this.state.whichOrg === '0') {
            form.append('LeagueType', 3);
        } else {
            form.append('LeagueType', this.state.personalOrOrg);
            form.append('OrgID', this.state.whichOrg);
        }
        form.append('OrgName', this.state.newOrgInput);

        form.append('SportID', this.state.leagueSport);

        form.append('Gender', this.state.leagueGender);

        form.append('AgeCategoryID', this.state.leagueAgeRange);

        form.append('NumberOfTeams', this.state.leagueTeamCount);

        form.append('MinPlayers', this.state.leagueMinPlayer);

        form.append('MaxPlayers', this.state.leagueMaxPlayer);

        form.append('LeagueStructureID', this.state.leagueStructureId);

        form.append('StartDate', this.state.beginDate);

        form.append('EndDate', this.state.endDate);

        let lenRule = this.state.RulsArrayvalues.length;
        if (lenRule > 0) {

            for (let i = 0; i < lenRule; i++) {
                if (this.state.RulsArrayvalues[i] !== '') {
                    form.append('Rules[]', this.state.RulsArrayvalues[i]);
                }

            }

        }

        let lenAward = this.state.GiftsArrayvalues.length;
        if (lenAward > 0) {

            for (let i = 0; i < lenAward; i++) {
                if (this.state.GiftsArrayvalues[i] !== '') {
                    form.append('Awards[]', this.state.GiftsArrayvalues[i]);
                }
            }

        }

        if (this.state.leaguePriceRadio && this.state.leaguePriceRadio === 1) {
            form.append('PayStatus', true);
        } else {
            form.append('PayStatus', false);
        }
        form.append('PayAmount', this.state.leaguePrice);

        form.append('PayTimeDate', this.state.LeaguePriceForceDate);

        form.append('LeagueAvatar', leagueAvatar);

        form.append('LeagueCoverPhotoID', createLeagueBackgroundId);

        form.append('WantCamera', this.state.weWillGetPhoto);

        form.append('Comments', this.state.leaagueComments);

        form.append('ProvinceID', this.state.leagueProvince);

        form.append('CityID', this.state.leagueCity);

        form.append('Address', this.state.leagueAddress);

        form.append('Latitude', this.state.leagueLat);

        form.append('Longitude', this.state.leagueLng);

        form.append('Mobile', this.state.leagueContactNumber);

        form.append('Cycle', this.state.leagueRound);


        let mobileRegex = /^09\d{9}$/;

        if (localStorage.getItem('exID')) {
            if (this.state.leagueName !== '') {
                if (this.state.personalOrOrg !== 0) {
                    if (this.state.leagueSport !== 0) {
                        if (this.state.leagueGender !== 0) {
                            if (this.state.leagueAgeRange !== 0) {
                                if (this.state.leagueTeamCount !== '') {
                                    if (this.state.leagueStructureId !== 0) {
                                        if (this.state.beginDate !== '') {
                                            if (this.state.endDate !== '') {
                                                if (this.state.leagueContactNumber !== '') {
                                                    if (mobileRegex.test(this.state.leagueContactNumber)) {
                                                        if (this.state.leaguePriceRadio !== '') {
                                                            if (leagueAvatar !== '' && leagueAvatar !== '/src/icon/photo-camera.png') {
                                                                if (createLeagueBackgroundId !== 0) {
                                                                    if (this.state.leagueCity !== '') {
                                                                        if (this.state.leagueAddress !== '') {
                                                                            fetch(`${configPort.TetaSport}${configUrl.AddLeague}`, {
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
                                                                                        toast.success(
                                                                                            <div className='toasty-div'>
                                                                                                <span className='toasty-header'>لیگ با موفقیت ساخته شد</span>
                                                                                                <span className='toasty-body'>درحال ارسال شما به صفحه لیگ...</span>
                                                                                            </div>
                                                                                            , { position: toast.POSITION.TOP_CENTER, pauseOnHover: false, closeOnClick: false, draggable: false, pauseOnVisibilityChange: false, closeButton: false }
                                                                                        );
                                                                                        createLeagueBackgroundId = 0;
                                                                                        leagueAvatar = '/src/icon/photo-camera.png';
                                                                                        this.setState({
                                                                                            ourOrganizations: [],
                                                                                            progressBarPercent: 0,
                                                                                            progressBarPercent2: 0,
                                                                                            progressBarPercent3: 0,
                                                                                            /* درصد و مرحله مدال 1 */
                                                                                            leagueNamePercent: 0,
                                                                                            orgsPercent: 0,
                                                                                            genderPercent: 0,
                                                                                            sportPercent: 0,
                                                                                            agePercent: 0,
                                                                                            teamCountPercent: 0,
                                                                                            teamStructurePercent: 0,
                                                                                            /* درصد و مرحله مدال 2 */
                                                                                            beginDatePercent: 0,
                                                                                            endDatePercent: 0,
                                                                                            leagueContactNumberPercent: 0,
                                                                                            leaguePriceRadioPercent: 0,
                                                                                            /* درصد و مرحله مدال 3 */
                                                                                            leagueAvatarPercent: 0,
                                                                                            leagueCoverPercent: 0,
                                                                                            leagueCityPercent: 0,
                                                                                            leagueAddressPercent: 0,
                                                                                            leagueName: '',
                                                                                            personalOrOrg: 0,
                                                                                            whichOrg: '',
                                                                                            newOrgInput: '',
                                                                                            leagueSport: 0,
                                                                                            leagueGender: 0,
                                                                                            leagueAgeRange: 0,
                                                                                            leagueTeamCount: '',
                                                                                            leagueStructureId: 0,
                                                                                            beginDate: '',
                                                                                            endDate: '',
                                                                                            RulsArrayvalues: [''],
                                                                                            GiftsArrayvalues: [''],
                                                                                            CreatorContact: '',
                                                                                            leagueContactNumber: '',
                                                                                            leaguePriceRadio: '',
                                                                                            leaguePrice: '',
                                                                                            LeaguePriceForceDate: '',
                                                                                            weWillGetPhoto: false,
                                                                                            leaagueComments: '',
                                                                                            provinces: [],
                                                                                            leagueProvince: '',
                                                                                            cities: [],
                                                                                            leagueCity: '',
                                                                                            leagueAddress: '',
                                                                                            leagueLat: 35.69982570505505,
                                                                                            leagueLng: 51.401596069335945,
                                                                                            showThisBtn: this.state.doneBtn,
                                                                                        });
                                                                                        this.onCloseModal1();
                                                                                        this.onCloseModal2();
                                                                                        this.onCloseModal3();
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
                                                                            }).then((data) => {
                                                                                if (data) {
                                                                                    let leagueID = hashid.encode(data.LeagueID);
                                                                                    setTimeout(function () {
                                                                                        window.location.replace(`/leagueProfile/matchInfo/L/${leagueID}`);
                                                                                    }, 5000);
                                                                                    //Url پیمایش
                                                                                    let str = this.props.location.pathname;
                                                                                    let splitStr = str.split("/");
                                                                                    urlArray = [];
                                                                                    for (let i = 1; i < splitStr.length; i++) {
                                                                                        urlArray.push(splitStr[i]);
                                                                                    }
                                                                                    if (urlArray.length !== 0) {
                                                                                        let x = urlArray[0].toLowerCase();
                                                                                        if (x === 'leagueprofile') {
                                                                                            this.props.history.replace(`/leagueProfile/matchInfo/L/${leagueID}`);
                                                                                            setTimeout(function () {
                                                                                                window.location.reload();
                                                                                            }, 5000)
                                                                                        }
                                                                                    }
                                                                                } else {
                                                                                    this.setState({
                                                                                        showThisBtn: this.state.orginalBtn,
                                                                                    });
                                                                                }
                                                                            })
                                                                        } else {
                                                                            toast.error("! افزودن آدرس محل برگزاری لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                                                            this.setState({
                                                                                showThisBtn: this.state.orginalBtn,
                                                                            });
                                                                        }

                                                                    } else {
                                                                        toast.error("! انتخاب شهر برگزاری لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                                                        this.setState({
                                                                            showThisBtn: this.state.orginalBtn,
                                                                        });
                                                                    }

                                                                } else {
                                                                    toast.error("! انتخاب عکس برای هدر لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                                                    this.setState({
                                                                        showThisBtn: this.state.orginalBtn,
                                                                    });
                                                                }

                                                            } else {
                                                                toast.error("! انتخاب عکس برای آواتار لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                                                this.setState({
                                                                    showThisBtn: this.state.orginalBtn,
                                                                });
                                                            }

                                                        } else {
                                                            toast.error("! تعیین رایگان یا عدم رایگان بودن لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                                            this.setState({
                                                                showThisBtn: this.state.orginalBtn,
                                                            });
                                                        }
                                                    } else {
                                                        toast.error("! شماره تماس وارد شده نادرست است", { position: toast.POSITION.TOP_CENTER });
                                                        this.setState({
                                                            showThisBtn: this.state.orginalBtn,
                                                        });
                                                    }
                                                } else {
                                                    toast.error("! افزودن شماره تماس برای پشتیبانی لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                                    this.setState({
                                                        showThisBtn: this.state.orginalBtn,
                                                    });
                                                }

                                            } else {
                                                toast.error("! تعیین تاریخ پایان لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                                this.setState({
                                                    showThisBtn: this.state.orginalBtn,
                                                });
                                            }

                                        } else {
                                            toast.error("! تعیین تاریخ شروع لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                            this.setState({
                                                showThisBtn: this.state.orginalBtn,
                                            });
                                        }

                                    } else {
                                        toast.error("! تعیین ساختار لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                        this.setState({
                                            showThisBtn: this.state.orginalBtn,
                                        });
                                    }

                                } else {
                                    toast.error("! تعداد تیم های لیگ باید مشخص شود", { position: toast.POSITION.TOP_CENTER });
                                    this.setState({
                                        showThisBtn: this.state.orginalBtn,
                                    });
                                }

                            } else {
                                toast.error("! انتخاب رده سنی اعضای لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                                this.setState({
                                    showThisBtn: this.state.orginalBtn,
                                });
                            }

                        } else {
                            toast.error("! انتخاب جنسیت اعضای لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                            this.setState({
                                showThisBtn: this.state.orginalBtn,
                            });
                        }

                    } else {
                        toast.error("! انتخاب ورزش برای لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                        this.setState({
                            showThisBtn: this.state.orginalBtn,
                        });
                    }

                } else {
                    toast.error("! نوع لیگ باید شخصی یا سازمانی باشد", { position: toast.POSITION.TOP_CENTER });
                    this.setState({
                        showThisBtn: this.state.orginalBtn,
                    });
                }

            } else {
                toast.error("! وارد کردن نام لیگ الزامی است", { position: toast.POSITION.TOP_CENTER });
                this.setState({
                    showThisBtn: this.state.orginalBtn,
                });
            }

        } else {
            toast.error("! برای ساخت لیگ باید ثبت نام کنید", { position: toast.POSITION.TOP_CENTER });
            this.setState({
                showThisBtn: this.state.orginalBtn,
            });
        }
    }

    /*برای کراپ*/
    onCropChange = crop => {
        this.setState({ crop })
    }
    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({ croppedAreaPixels })
    }
    onZoomChange = zoom => {
        this.setState({ zoom })
    }
    showCroppedImageAvatar = async () => {
        const croppedImage = await getCroppedImg(
            this.state.imageSrc,
            this.state.croppedAreaPixels
        )
        this.setState({
            croppedImage,
        })
        leagueAvatar = croppedImage;
        this.AvatarUploader.setCroppedImg(croppedImage);
        document.getElementById('crop-me-league').style.display = 'none';
    }
    handleClose = () => {
        this.setState({ croppedImage: null })
    }

    //تغییر چایلد
    handlerAvatar = (img) => {
        document.getElementById('crop-me-league').style.display = 'block';
        document.getElementById('croped-AVATAR-league').style.display = 'block';
        document.getElementById('croped-COVER-league').style.display = 'none';
        this.setState({
            imageSrc: img
        })
    }
    handlerCover = (img) => {
        document.getElementById('crop-me').style.display = 'block';
        document.getElementById('croped-AVATAR-league').style.display = 'none';
        document.getElementById('croped-COVER-league').style.display = 'block';
        this.setState({
            imageSrc: img
        })
    }

    render() {
        const { stepOneOpen } = this.state;
        const { stepTwoOpen } = this.state;
        const { stepThreeOpen } = this.state;
        const allOrgs = this.state.ourOrganizations;
        const provinces = this.state.provinces;
        const cities = this.state.cities;
        const { remainingCredit } = this.state;

        //آیا سازمانی است
        let isOrg = false;
        if (this.state.personalOrOrg && this.state.personalOrOrg === 2) {
            isOrg = true;
        } else {
            isOrg = false;
        }

        //آیا ساخت سازمان جدید
        let isNewOrg = false;
        if (this.state.whichOrg === 0) {
            isNewOrg = true;
        } else {
            isNewOrg = false;
        }

        //اگر هزینه باید پرداخت شود
        let leagueHasPrice = false;
        if (this.state.leaguePriceRadio && this.state.leaguePriceRadio === 1) {
            leagueHasPrice = true;
        } else {
            leagueHasPrice = false;
        }

        // رنگ لیگ
        let HazfiBgColor = '#F8F8F8';
        let HazfiColor = '#5C5D5B';
        let LeagueBgColor = '#F8F8F8';
        let LeagueColor = '#5C5D5B';
        switch (this.state.leagueStructureId) {
            case 1:
                LeagueBgColor = `${(localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12'}`;
                LeagueColor = '#fff';
                HazfiBgColor = '#F8F8F8';
                HazfiColor = '#5C5D5B';
                break;
            case 2:
                HazfiBgColor = `${(localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12'}`;
                HazfiColor = '#fff';
                LeagueBgColor = '#F8F8F8';
                LeagueColor = '#5C5D5B';
                break;
            default:
        }

        //تغییر بردر
        let allProgress = this.state.progressBarPercent + this.state.progressBarPercent2 + this.state.progressBarPercent3;

        // غیر فعال کردن شهر قبل از استان
        let isCityDisabled = true;
        if (this.state.leagueProvince !== '') {
            isCityDisabled = false;
        } else {
            isCityDisabled = true;
        }

        // مکان نقشه
        const position = [this.state.leagueLat, this.state.leagueLng];
        return (
            <Fragment>
                <ReactTooltip place="top" type="dark" effect="solid" />

                <button onClick={this.onOpenModal1} className='btn createTeambtnCm' style={{ fontFamily: 'IRANYekanBold', background: (localStorage.getItem('theme') === 'dark') ? '#000' : 'rgb(13, 106, 18)', color: '#fff', marginTop: 5, direction: 'rtl', position: 'relative' }}>
                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'createTeambtnCm-icon-container--dark' : 'createTeambtnCm-icon-container'}`}>
                        <span className='add-new-plus-icon'></span>
                    </div>
                    <span className='createTeambtnCm-txt'>ساخت لیگ</span>
                    {remainingCredit !== null && <span className='badge-remainingCount' title={`شما مجاز به ساخت ${remainingCredit} لیگ می باشید`}>{remainingCredit}</span>}
                </button>

                {/* مدال مرحله ی اول ساخت لیگ */}
                <Modal classNames={{ overlay: 'CreateLeagueModalStepOne', modal: 'CreateLeagueModal-bg', closeButton: 'CreateLeagueModal-closeBtn' }} open={stepOneOpen} onClose={this.onCloseModal1} closeOnEsc={true} center>

                    <div className="transparentRow">
                        <div className='row allSteppersContainerRow'>
                            <div className='col stepperContainer stepperContainerAlignRight' onClick={this.handleNextModal1}>
                                <div className={`createLeague-proggressBar ${localStorage.getItem('theme') === 'dark' ? 'createLeague-Inproggress--dark' : 'createLeague-Inproggress'} stepperIcon stepperIconProgress`} id='stepperIcon1' style={{ borderColor: (allProgress >= 33) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}>1</div>
                                <div className="stepperCellLine stepperCellLine1 stepperCellLineInprogress" style={{ background: (allProgress >= 33) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}></div>
                            </div>
                            <div className='col stepperContainer stepperContainerAlignCenter' onClick={this.handleNextModal2}>
                                <div className={`createLeague-proggressBar ${localStorage.getItem('theme') === 'dark' ? 'createLeague-notProggress--dark' : 'createLeague-notProggress'} stepperIcon`} id='stepperIcon2' style={{ borderColor: (allProgress >= 95) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}>2</div>
                                <div className="stepperCellLine stepperCellLine2" style={{ background: (allProgress >= 95) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}></div>
                                <div className='stepperProsessBar'><div className={`${localStorage.getItem('theme') === 'dark' ? 'stepperProsessBarLevel--dark' : 'stepperProsessBarLevel'}`} style={{ width: `${this.state.progressBarPercent + this.state.progressBarPercent2 + this.state.progressBarPercent3}%` }}></div></div>
                            </div>
                            <div className='col stepperContainer stepperContainerAlignLeft' onClick={this.handleNextModal3}>
                                <div className={`createLeague-proggressBar ${localStorage.getItem('theme') === 'dark' ? 'createLeague-notProggress--dark' : 'createLeague-notProggress'} stepperIcon`} id='stepperIcon3' style={{ borderColor: (allProgress >= 99) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}>3</div>
                                <div className="stepperCellLine stepperCellLine3" style={{ background: (allProgress >= 99) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                        style={{ maxWidth: 745, paddingTop: 0, borderRadius: 5, marginTop: '0%', boxShadow: 'none !important', minHeight: 640, background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : null, color: (localStorage.getItem('theme') === 'dark') ? 'hsla(0,0%,100%,.6)' : null, }}>


                        <div className="" style={{ paddingTop: 65 }}>

                            <div className='row'>

                                <div className='col-12' style={{ padding: '0 70px' }}>
                                    <input type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueName form-control`} value={this.state.leagueName} onChange={this.handleLeagueName} placeholder='نام لیگ' />
                                </div>

                                <div className='col-12 league-type-radio-container' style={{ padding: '9px 70px', direction: 'rtl' }}>

                                    <div className="custom-control custom-radio myStyledRadio">
                                        <input type="radio" className="custom-control-input" id="createLeagueSelfRadio" name="createLeagueRadio" value={1} checked={this.state.personalOrOrg === 1} onChange={() => this.handleRadioButtonSelfOrOrg(1)} />
                                        <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createLeague-StepOneRadio--dark' : 'createLeague-StepOneRadio'}`} htmlFor="createLeagueSelfRadio">شخصی</label>
                                    </div>

                                    <div style={{ textAlign: 'center' }} className="custom-control custom-radio myStyledRadio">
                                        <input type="radio" className="custom-control-input" id="createLeagueSelfOrg" name="createLeagueRadio" value={2} checked={this.state.personalOrOrg === 2} onChange={() => this.handleRadioButtonSelfOrOrg(2)} onClick={this.getOrgsFromApi} />
                                        <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createLeague-StepOneRadio--dark' : 'createLeague-StepOneRadio'}`} htmlFor="createLeagueSelfOrg">سازمانی</label>
                                    </div>
                                    {/* radio fetched */}
                                    {
                                        (isOrg) ?
                                            this.state.hasOrgsload &&
                                            <div className='operationsRadioContainer'>

                                                {
                                                    allOrgs.map((org, index) => {
                                                        return (
                                                            <Fragment key={index}>
                                                                <div className="custom-control custom-radio serverStyledRadio">
                                                                    <input type="radio" className="custom-control-input" id={`createLeagueSelfOrg${org.OrgID}`} name="createLeagueOperationsRadio" value={`${org.OrgID}`} checked={this.state.whichOrg === `${org.OrgID}`} onChange={() => this.handleRadioButtonWhichOrg(`${org.OrgID}`)} />
                                                                    <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createLeague-StepOneRadio--dark' : 'createLeague-StepOneRadio'}`} htmlFor={`createLeagueSelfOrg${org.OrgID}`}>{org.OrgName}</label>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    })
                                                }

                                                <div className="custom-control custom-radio serverStyledRadio">
                                                    <input type="radio" className="custom-control-input" id='createLeagueSelfOrg0' name="createLeagueOperationsRadio" value={0} checked={this.state.whichOrg === 0} onChange={() => this.handleRadioButtonWhichOrg(0)} />
                                                    <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createLeague-StepOneRadio--dark' : 'createLeague-StepOneRadio'}`} htmlFor="createLeagueSelfOrg0">ساخت سازمان جدید <span className='addNewRadioBtn'></span> </label>
                                                </div>

                                            </div>
                                            :
                                            null

                                    }
                                    {
                                        (isNewOrg) ?
                                            <div className='col-12' style={{ paddingRight: 10, marginTop: 10, textAlign: 'left' }}>
                                                <input style={{ display: 'inline-block', width: '40%' }} type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueName createLeague-newLeagueName form-control`} value={this.state.newOrgInput} onChange={(e) => { this.setState({ newOrgInput: e.target.value }) }} placeholder='نام سازمان جدید' />
                                            </div>
                                            :
                                            null
                                    }


                                </div>

                                <div className='col-12' style={{ padding: '10px 70px' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'center' }}>
                                        <div className='col'>
                                            <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueThreeSelectBoxTitle--dark' : 'createLeagueThreeSelectBoxTitle'}`}>ورزش لیگ</h3>
                                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueThreeSelectBoxStyle--dark' : 'createLeagueThreeSelectBoxStyle'}`} id="createLeague-leagueSport" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.leagueSport} onChange={this.handleSports}>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}>ـ انتخاب کنید ـ</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="1" style={{ color: '#0D6A12' }}>فوتبال</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="2" style={{ color: '#0D6A12' }}>فوتسال</option>
                                            </select>
                                        </div>
                                        <div className='col'>
                                            <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueThreeSelectBoxTitle--dark' : 'createLeagueThreeSelectBoxTitle'}`}>جنسیت بازیکنان</h3>
                                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueThreeSelectBoxStyle--dark' : 'createLeagueThreeSelectBoxStyle'}`} id="createLeague-leagueGender" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.leagueGender} onChange={this.handleGenders}>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}>ـ انتخاب کنید ـ</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="1" style={{ color: '#0D6A12' }}>آقا</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="2" style={{ color: '#0D6A12' }}>خانم</option>
                                            </select>
                                        </div>
                                        <div className='col'>
                                            <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueThreeSelectBoxTitle--dark' : 'createLeagueThreeSelectBoxTitle'}`}>رده سنی بازیکنان</h3>
                                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueThreeSelectBoxStyle--dark' : 'createLeagueThreeSelectBoxStyle'}`} id="createLeague-leagueAges" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.leagueAgeRange} onChange={this.handleAgeRange}>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}>ـ انتخاب کنید ـ</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="1" style={{ color: '#0D6A12' }}>نونهالان(14-10)</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="2" style={{ color: '#0D6A12' }}>نوجوانان(16-14)</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="3" style={{ color: '#0D6A12' }}>جوانان(19-16)</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="4" style={{ color: '#0D6A12' }}>امید(21-19)</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="5" style={{ color: '#0D6A12' }}>بزرگسالان(21 به بالا)</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="6" style={{ color: '#0D6A12' }}>تمام رده های سنی</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '30px 70px 0px 70px' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'center' }}>
                                        <div className='col-4' style={{ paddingTop: 5 }}>
                                            <p className='createLeagueInputsLabel'>تعداد تیم ها</p>
                                        </div>
                                        <div className='col-8' style={{ textAlign: 'right' }}>
                                            <input style={{ marginRight: 3 }} id='createLeagueTeamCount' type="number" min='0' max='32' className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark createLeague-leagueTeamCount--dark' : 'createLeague-leagueInputs createLeague-leagueTeamCount'}  form-control`} value={this.state.leagueTeamCount} onChange={this.handleTeamCount} />
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '30px 70px 0px 70px' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'center' }}>
                                        <div className='col-4' style={{ paddingTop: 5 }}>
                                            <p className='createLeagueInputsLabel'>حداقل افراد  هر تیم</p>
                                        </div>
                                        <div className='col-8' style={{ textAlign: 'right' }}>
                                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueTeamMaxAndMinPlayer--dark' : 'createLeague-leagueTeamMaxAndMinPlayer'}`} id="createLeague-leagueTeamMinPlayer" style={{ fontFamily: 'iranyekanRegular' }} value={this.state.leagueMinPlayer} onChange={this.handleLeagueMinPlayer}>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}></option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="5" style={{ color: '#0D6A12' }}>5</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="6" style={{ color: '#0D6A12' }}>6</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="7" style={{ color: '#0D6A12' }}>7</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="8" style={{ color: '#0D6A12' }}>8</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="9" style={{ color: '#0D6A12' }}>9</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="10" style={{ color: '#0D6A12' }}>10</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="11" style={{ color: '#0D6A12' }}>11</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="12" style={{ color: '#0D6A12' }}>12</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="13" style={{ color: '#0D6A12' }}>13</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="14" style={{ color: '#0D6A12' }}>14</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="15" style={{ color: '#0D6A12' }}>15</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="16" style={{ color: '#0D6A12' }}>16</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="17" style={{ color: '#0D6A12' }}>17</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="18" style={{ color: '#0D6A12' }}>18</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12' style={{ padding: '30px 70px 30px 70px' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'center' }}>
                                        <div className='col-4' style={{ paddingTop: 5 }}>
                                            <p className='createLeagueInputsLabel'>حداکثر افراد  هر تیم</p>
                                        </div>
                                        <div className='col-8' style={{ textAlign: 'right' }}>
                                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueTeamMaxAndMinPlayer--dark' : 'createLeague-leagueTeamMaxAndMinPlayer'}`} id="createLeague-leagueTeamMaxPlayer" style={{ fontFamily: 'iranyekanRegular' }} value={this.state.leagueMaxPlayer} onChange={this.handleLeagueMaxPlayer}>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}></option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="5" style={{ color: '#0D6A12' }}>5</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="6" style={{ color: '#0D6A12' }}>6</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="7" style={{ color: '#0D6A12' }}>7</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="8" style={{ color: '#0D6A12' }}>8</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="9" style={{ color: '#0D6A12' }}>9</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="10" style={{ color: '#0D6A12' }}>10</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="11" style={{ color: '#0D6A12' }}>11</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="12" style={{ color: '#0D6A12' }}>12</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="13" style={{ color: '#0D6A12' }}>13</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="14" style={{ color: '#0D6A12' }}>14</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="15" style={{ color: '#0D6A12' }}>15</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="16" style={{ color: '#0D6A12' }}>16</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="17" style={{ color: '#0D6A12' }}>17</option>
                                                <option className='createLeagueThreeSelectBoxStyle-Options' value="18" style={{ color: '#0D6A12' }}>18</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '0px 70px 0px 70px' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'center' }}>
                                        <div className='col-4'>
                                            <p className='createLeagueInputsLabel'>ساختار لیگ</p>
                                        </div>
                                        <div className='col-8' style={{ textAlign: 'right' }}>
                                            <a style={{ textDecoration: 'underline', fontFamily: 'iranyekanBold', fontSize: 15, color: (localStorage.getItem('theme') === 'dark') ? '#fff' : '#5C5D5B', cursor: 'pointer' }} target='_blank' href='/leagueStructure'>راهنما</a>
                                        </div>
                                        <div className='col-12' style={{ textAlign: 'right', padding: '5px 30px' }}>
                                            <button onClick={this.hazfiClicked} id='leagueHazfi' className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueLeagueStructureBtns--dark' : 'createLeagueLeagueStructureBtns'}`} style={{ background: HazfiBgColor, color: HazfiColor }}>حذفی</button>
                                            <button onClick={this.leagueClicked} id='leagueLeague' className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueLeagueStructureBtns--dark' : 'createLeagueLeagueStructureBtns'}`} style={{ background: LeagueBgColor, color: LeagueColor }}>لیگ</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 league-round' style={{ padding: '0px 70px 30px 70px', paddingTop: '1rem', opacity: (this.state.leagueStructureId === 1 || this.state.leagueStructureId === '1') ? 1 : 0, visibility: (this.state.leagueStructureId === 1 || this.state.leagueStructureId === '1') ? 'visible' : 'hidden' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'center' }}>
                                        <div className='col-4' style={{ paddingTop: 5 }}>
                                            <p className='createLeagueInputsLabel'>تعداد دور بازی</p>
                                        </div>
                                        <div className='col-8' style={{ textAlign: 'right' }}>
                                            <input style={{ marginRight: 3 }} id='createLeagueTeamRount' type="number" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark createLeague-leagueTeamCount--dark' : 'createLeague-leagueInputs createLeague-leagueTeamCount'}  form-control`} value={this.state.leagueRound} onChange={this.leagueRound} />
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '30px 70px', paddingTop: 0 }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'center' }}>
                                        <div className='col-12'>
                                            <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn--dark' : 'createLeagueSendBtn'}`} onClick={this.handleNextModal2}>بعدی</button>
                                            <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn--dark' : 'createLeagueSendBtn'}`} onClick={this.onCloseModal1}>بستن</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Modal>
                {/* مدال مرحله ی دوم ساخت لیگ */}
                <Modal classNames={{ overlay: 'CreateLeagueModalStepTwo', modal: 'CreateLeagueModal-bg', closeButton: 'CreateLeagueModal-closeBtn' }} open={stepTwoOpen} onClose={this.onCloseModal2} closeOnEsc={true} closeOnOverlayClick={true} center>

                    <div className="transparentRow">
                        <div className='row allSteppersContainerRow'>
                            <div className='col stepperContainer stepperContainerAlignRight' onClick={this.handleNextModal1}>
                                <div className={`createLeague-proggressBar ${localStorage.getItem('theme') === 'dark' ? 'createLeague-notProggress--dark' : 'createLeague-notProggress'} stepperIcon`} id='stepperIcon1' style={{ borderColor: (allProgress >= 33) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}>1</div>
                                <div className="stepperCellLine stepperCellLine1" style={{ background: (allProgress >= 33) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}></div>
                            </div>
                            <div className='col stepperContainer stepperContainerAlignCenter' onClick={this.handleNextModal2}>
                                <div className={`createLeague-proggressBar ${localStorage.getItem('theme') === 'dark' ? 'createLeague-Inproggress--dark' : 'createLeague-Inproggress'} stepperIcon stepperIconProgress`} id='stepperIcon2' style={{ borderColor: (allProgress >= 95) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}>2</div>
                                <div className="stepperCellLine stepperCellLine2 stepperCellLineInprogress" style={{ background: (allProgress >= 95) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}></div>
                                <div className='stepperProsessBar'><div className={`${localStorage.getItem('theme') === 'dark' ? 'stepperProsessBarLevel--dark' : 'stepperProsessBarLevel'}`} style={{ width: `${this.state.progressBarPercent + this.state.progressBarPercent2 + this.state.progressBarPercent3}%` }}></div></div>
                            </div>
                            <div className='col stepperContainer stepperContainerAlignLeft' onClick={this.handleNextModal3}>
                                <div className={`createLeague-proggressBar ${localStorage.getItem('theme') === 'dark' ? 'createLeague-notProggress--dark' : 'createLeague-notProggress'} stepperIcon`} id='stepperIcon3' style={{ borderColor: (allProgress >= 99) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}>3</div>
                                <div className="stepperCellLine stepperCellLine3" style={{ background: (allProgress >= 99) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                        style={{ maxWidth: 745, paddingTop: 0, borderRadius: 5, marginTop: '0%', boxShadow: 'none !important', minHeight: 640, background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : null, color: (localStorage.getItem('theme') === 'dark') ? 'hsla(0,0%,100%,.6)' : null, }}>



                        <div className="w3-section" style={{ paddingTop: 65 }}>

                            <div className='row' style={{ direction: 'rtl', textAlign: 'right' }}>

                                <div className='col-12' style={{ padding: '0 70px' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'right' }}>
                                        <div className='col-12'>
                                            <div className='row'>
                                                <div className='col-md-6 col-sm-12' style={{ marginBottom: 5 }}>
                                                    <DatePicker
                                                        inputComponent={this.DatePickerInputBegin}
                                                        placeholder="تاریخ شروع لیگ"
                                                        format="jYYYY/jMM/jDD"
                                                        onChange={this.handleBeginDate}
                                                        id={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueBeginDate--dark' : 'createLeagueBeginDate'}`}
                                                        customClass={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueCustomizedDatepickerReact--dark' : 'createLeagueCustomizedDatepickerReact'}`}
                                                    />
                                                </div>
                                                <div className='col-md-6 col-sm-12'>
                                                    <DatePicker
                                                        inputComponent={this.DatePickerInputEnd}
                                                        placeholder="تاریخ پایان لیگ"
                                                        format="jYYYY/jMM/jDD"
                                                        onChange={this.handleEndDate}
                                                        id={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueEndDate--dark' : 'createLeagueEndDate'}`}
                                                        customClass={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueCustomizedDatepickerReact--dark' : 'createLeagueCustomizedDatepickerReact'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '40px 70px 10px 70px' }}>
                                    {/* افزودن قوانین */}
                                    <label style={{ fontFamily: 'iranyekanBold', color: `${localStorage.getItem('theme') === 'dark' ? 'hsla(0,0%,100%,.6)' : '#5C5D5B'}`, fontSize: 15 }}>قوانین لیگ</label>
                                    {this.addRuleCreateUI()}
                                    <div className='col-12' style={{ padding: '7px 0px 7px' }}>
                                        <input readOnly id='createLeagueAddNewGift' type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'}  createLeague-leagueAddNewGift form-control`} placeholder='افزودن به قوانین لیگ' onClick={this.addClick.bind(this)} />
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '10px 70px' }}>
                                    {/* افزودن جوایز */}
                                    <label style={{ fontFamily: 'iranyekanBold', color: `${localStorage.getItem('theme') === 'dark' ? 'hsla(0,0%,100%,.6)' : '#5C5D5B'}`, fontSize: 15 }}>جوایز لیگ</label>
                                    {this.addGiftsCreateUI()}
                                    <div className='col-12' style={{ padding: '7px 0px 7px' }}>
                                        <input readOnly type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'}  createLeague-leagueAddNewGift form-control`} placeholder='افزودن به جوایز لیگ' onClick={this.addGiftsClick.bind(this)} />
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '10px 70px 5px 70px' }}>
                                    <p className='createLeagueInputsLabel' style={{ display: 'inline-block', marginLeft: 40 }}>شماره تماس خود را برای نمایش در صفحه لیگ وارد کنید </p>
                                    <input type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueTeamContactNumber form-control`} onChange={this.leagueContact} value={this.state.leagueContactNumber} />
                                </div>

                                <div className='col-12' style={{ padding: '15px 70px' }}>
                                    <div className='row'>
                                        <div className='col-8'>
                                            <p className='createLeagueInputsLabel' style={{ paddingTop: 5 }}>آیا برای شرکت در لیگ تیم ها باید مبلغی را به عنوان ورودی بپردازند؟  </p>
                                        </div>
                                        <div className='col-4'>
                                            <div className="custom-control custom-radio myStyledRadio" style={{ marginLeft: 20 }}>
                                                <input type="radio" className="custom-control-input" id="createLeaguePremiumRadioYes" name="createLeaguePremiumRadio" value={1} onChange={() => { this.handleleaguePriceRadio(1) }} checked={this.state.leaguePriceRadio === 1} />
                                                <label style={{ fontFamily: 'iranyekanBold', color: `${localStorage.getItem('theme') === 'dark' ? 'hsla(0, 0%, 100%, 0.6)' : '#5C5D5B'}`, fontSize: 13 }} className="custom-control-label" htmlFor="createLeaguePremiumRadioYes" >بله</label>
                                            </div>

                                            <div style={{ textAlign: 'center' }} className="custom-control custom-radio myStyledRadio">
                                                <input type="radio" className="custom-control-input" id="createLeaguePremiumRadioNo" name="createLeaguePremiumRadio" value={0} onChange={() => { this.handleleaguePriceRadio(0) }} checked={this.state.leaguePriceRadio === 0} />
                                                <label style={{ fontFamily: 'iranyekanBold', color: `${localStorage.getItem('theme') === 'dark' ? 'hsla(0, 0%, 100%, 0.6)' : '#5C5D5B'}`, fontSize: 13 }} className="custom-control-label" htmlFor="createLeaguePremiumRadioNo">خیر</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {
                                    (leagueHasPrice) ?
                                        <Fragment>
                                            <div className='col-12' style={{ padding: '0 70px' }}>
                                                <div className='row'>
                                                    <div className='col-md-12'>
                                                        <p className='createLeagueInputsLabel' style={{ display: 'inline-block', marginLeft: 40 }}>مبلغ ورودی به ازای هر تیم چقدر است؟</p>
                                                    </div>
                                                    <div className='col-md-12'>
                                                        <label className='createLeagueInputsLabel' style={{ marginLeft: 3, fontFamily: 'iranYekanBold' }} htmlFor="createLeagueTeamCount">تومان</label>
                                                        <input id='createLeagueTeamCount' type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark createLeague-leagueTeamPrice--dark' : 'createLeague-leagueInputs createLeague-leagueTeamPrice'}  form-control`} onChange={this.leagueHasPrice} value={this.state.leaguePrice} data-tip='مقدار' />
                                                        {/*<label className='createLeagueTeamCount-plus' style={{ fontFamily: 'iranyekanBold', color: '#5C5D5B', fontSize: 13, marginLeft: 3 }}></label>
                                                        <input id='' type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark createLeague-leagueTeamPrice--dark' : 'createLeague-leagueInputs createLeague-leagueTeamPrice'}  form-control`} value={`${this.state.ourPercent}%`} readOnly data-tip='درصد' />
                                                        <label className='createLeagueTeamCount-equal' style={{ fontFamily: 'iranyekanBold', color: '#5C5D5B', fontSize: 13, marginLeft: 3 }}></label>
                                                        <input id='' type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark createLeague-leagueTeamPrice--dark' : 'createLeague-leagueInputs createLeague-leagueTeamPrice'}  form-control`} value={this.state.leaguePrice} readOnly data-tip='مجموع' />*/}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-12' style={{ padding: '30px 70px' }}>
                                                <DatePicker
                                                    inputComponent={this.DatePickerInpuLeaguePriceForceDate}
                                                    placeholder=" تاریخ شروع"
                                                    format="jYYYY/jMM/jDD"
                                                    onChange={this.handleLeaguePriceForceDate}
                                                    id={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueLastTimeLeagueMoney--dark' : 'createLeagueLastTimeLeagueMoney'}`}
                                                    customClass={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueCustomizedDatepickerReact--dark' : 'createLeagueCustomizedDatepickerReact'}`}
                                                />
                                            </div>
                                        </Fragment>
                                        :
                                        null

                                }




                                <div className='col-12' style={{ padding: '30px 70px' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'center' }}>
                                        <div className='col-12'>
                                            <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn--dark' : 'createLeagueSendBtn'}`} onClick={this.handleNextModal3}>بعدی</button>
                                            <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn--dark' : 'createLeagueSendBtn'}`} onClick={this.handlePrevModal1}>قبلی</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </Modal>
                {/* مدال مرحله ی سوم ساخت لیگ */}
                <Modal classNames={{ overlay: 'CreateLeagueModalStepThree', modal: 'CreateLeagueModal-bg', closeButton: 'CreateLeagueModal-closeBtn' }} open={stepThreeOpen} onClose={this.onCloseModal3} closeOnEsc={true} closeOnOverlayClick={true} center>

                    <div className="transparentRow">
                        <div className='row allSteppersContainerRow'>
                            <div className='col stepperContainer stepperContainerAlignRight' onClick={this.handleNextModal1}>
                                <div className={`createLeague-proggressBar ${localStorage.getItem('theme') === 'dark' ? 'createLeague-notProggress--dark' : 'createLeague-notProggress'} stepperIcon`} id='stepperIcon1' onClick={this.handlePrevModal1} style={{ borderColor: (allProgress >= 33) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}>1</div>
                                <div className="stepperCellLine stepperCellLine1" style={{ background: (allProgress >= 33) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}></div>
                            </div>
                            <div className='col stepperContainer stepperContainerAlignCenter'>
                                <div className={`createLeague-proggressBar ${localStorage.getItem('theme') === 'dark' ? 'createLeague-notProggress--dark' : 'createLeague-notProggress'} stepperIcon`} id='stepperIcon2' onClick={this.handleNextModal2} style={{ borderColor: (allProgress >= 95) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}>2</div>
                                <div className="stepperCellLine stepperCellLine2" style={{ background: (allProgress >= 95) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}></div>
                                <div className='stepperProsessBar'><div className={`${localStorage.getItem('theme') === 'dark' ? 'stepperProsessBarLevel--dark' : 'stepperProsessBarLevel'}`} style={{ width: `${this.state.progressBarPercent + this.state.progressBarPercent2 + this.state.progressBarPercent3}%` }}></div></div>
                            </div>
                            <div className='col stepperContainer stepperContainerAlignLeft'>
                                <div className={`createLeague-proggressBar ${localStorage.getItem('theme') === 'dark' ? 'createLeague-Inproggress--dark' : 'createLeague-Inproggress'} stepperIcon stepperIconProgress`} onClick={this.handlePrevModal3} id='stepperIcon3' style={{ borderColor: (allProgress >= 99) ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#fff' }}>3</div>
                                <div className="stepperCellLine stepperCellLine3 stepperCellLineInprogress" style={{ background: (allProgress >= 99) ? `${localStorage.getItem('theme') === 'dark' ? `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` : '#0D6A12'}` : '#fff' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                        style={{ maxWidth: 745, paddingTop: 0, borderRadius: 5, marginTop: '0%', boxShadow: 'none !important', minHeight: 640, background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : null, color: (localStorage.getItem('theme') === 'dark') ? 'hsla(0,0%,100%,.6)' : null, }}>
                        <div className="w3-section" style={{ paddingTop: 40 }}>
                            <div className='row' style={{ direction: 'rtl' }}>
                                <div className='col-12' style={{ padding: '0 70px' }}>
                                    <div className='row'>
                                        <div className='col-md-8' style={{ textAlign: 'right', paddingTop: 45, paddingRight: 0 }}>
                                            <p className='createLeagueInputsLabel' style={{ paddingRight: 15 }}>انتخاب عکس آواتار برای لیگ</p>
                                        </div>
                                        <div className='col-md-4' style={{ direction: 'ltr', paddingLeft: 35 }}>
                                            <div className='createTeamChooseLeagueAvatarContainer'>
                                                <LeagueAvatarUploader handleAvatar={this.handleAvatarChild} {...this.props} handler={(img) => { this.handlerAvatar(img) }} onRef={ref => (this.AvatarUploader = ref)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12' style={{ padding: '0 70px' }}>
                                    <div className='crop-avatar' id='crop-me-league'>
                                        <div className="crop-avatar-container">
                                            <Cropper
                                                image={this.state.imageSrc}
                                                crop={this.state.crop}
                                                zoom={this.state.zoom}
                                                aspect={this.state.aspect}
                                                onCropChange={this.onCropChange}
                                                onCropComplete={this.onCropComplete}
                                                onZoomChange={this.onZoomChange}
                                                cropSize={{ width: 200, height: 200 }}
                                            />
                                            <div id='croped-AVATAR-league' className='done-croping-container' onClick={this.showCroppedImageAvatar}>
                                                <span className='done-croping'>تایید آواتار</span>
                                            </div>
                                            <div id='croped-COVER-league' className='done-croping-container' onClick={this.showCroppedImageCover}>
                                                <span className='done-croping'>تایید کاور</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '0px 70px' }}>
                                    <div className='row'>
                                        <div className='col-12' style={{ direction: 'ltr', paddingLeft: 50 }}>
                                            <p className='createLeagueInputsLabel' style={{ textAlign: 'right' }}>انتخاب عکس هدر برای لیگ</p>
                                        </div>

                                        <div className='col-12'>
                                            <CreateLeagueSwiper handleSwiper={this.handleSwiperChild} />
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '0px 70px', direction: 'rtl' }}>
                                    <hr className='createLeagueSplitHr' />
                                </div>

                                <div className='col-12' style={{ padding: '20px 70px' }}>
                                    <div className='row'>
                                        <div className='col-12 take-photograph-container' style={{ direction: 'ltr', paddingLeft: 50, textAlign: 'right', fontFamily: 'iranYekanBold', fontSize: 13, background: (this.state.weWillGetPhoto) ? '#C9FFD3' : '#FE6363' }}>

                                            <div className='col-12'>
                                                <div className="custom-control custom-checkbox" style={{ textAlign: 'center', fontSize: 13 }}>
                                                    <div className='createLeaguePhotographyIcon-tick' onClick={() => { this.setState({ weWillGetPhoto: !this.state.weWillGetPhoto }) }} style={{ backgroundPositionY: (this.state.weWillGetPhoto) ? 4 : '-47px' }}>
                                                        <span className='createLeaguePhotographyIcon-tick-fake-container'></span>
                                                        <span className='createLeaguePhotographyIcon-tick-spn' style={{ transform: (this.state.weWillGetPhoto) ? 'scale(1)' : 'scale(0)' }}></span>
                                                    </div>
                                                    <input type="checkbox" className="custom-control-input" id="createLeagueWeWillTakeFilmAndPhoto" name="createLeagueWeWillTakeFilmAndPhoto" checked={this.state.weWillGetPhoto} onChange={() => { this.setState({ weWillGetPhoto: !this.state.weWillGetPhoto }) }} />
                                                    <label className="custom-control-label createLeaguePhotographyLable createLeagueInputsLabelPhoto" htmlFor="createLeagueWeWillTakeFilmAndPhoto">استفاده از خدمات عکس و فیلم برای برگزاری رویداد شما</label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '0px 70px' }}>
                                    <hr className='createLeagueSplitHr' />
                                </div>

                                <div className='col-12' style={{ padding: '7px 70px' }}>
                                    <div className='row'>
                                        <div className='col-12' style={{ direction: 'ltr', paddingLeft: 50, paddingRight: 0 }}>
                                            <div className='col-12'>
                                                <p className='createLeagueInputsLabel' style={{ textAlign: 'right' }}>توضیحات تکمیلی</p>
                                            </div>
                                            <div className='col-12'>
                                                <div className="form-group">
                                                    <textarea style={{ textAlign: 'right', fontFamily: 'iranyekanBold' }} className={`form-control rounded-0 ${localStorage.getItem('theme') === 'dark' ? 'createLeagueTextArea--dark' : 'createLeagueTextArea'}`} rows="4" value={this.state.leaagueComments} onChange={(e) => { this.setState({ leaagueComments: e.target.value }) }}></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '26px 70px' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'right' }}>
                                        <div className='col-12' style={{ direction: 'rtl', paddingLeft: 50 }}>

                                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueStateArea--dark' : 'createLeague-leagueStateArea'}`} id="createLeague-leagueStateArea" style={{ color: `${localStorage.getItem('theme') === 'dark' ? '#fff' : '#495057'}`, fontFamily: 'iranyekanRegular', width: 125, display: 'inline-block', marginBottom: 5 }} value={this.state.leagueProvince} onChange={this.getCities} title='استان محل برگزاری'>
                                                <option value="" style={{ display: 'none' }}>استان محل برگزاری لیگ</option>
                                                {
                                                    provinces.map((p, index) => {
                                                        return (
                                                            <Fragment key={index}>
                                                                <option value={p.ProvinceID} style={{ color: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` }}>{p.ProvinceName}</option>
                                                            </Fragment>
                                                        )
                                                    })
                                                }
                                            </select>

                                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueCity--dark' : 'createLeague-leagueCity'}`} id={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueCity--dark' : 'createLeague-leagueCity'}`} style={{ color: `${localStorage.getItem('theme') === 'dark' ? '#fff' : '#495057'}`, fontFamily: 'iranyekanRegular', width: 125, display: 'inline-block', marginBottom: 5 }} disabled={isCityDisabled} value={this.state.leagueCity} onChange={this.handleLeagueCity} title='شهر محل برگزاری'>
                                                <option value="" style={{ display: 'none' }}>شهر محل برگزاری لیگ </option>
                                                {
                                                    cities.map((city, index) => {
                                                        return (
                                                            <Fragment key={index}>
                                                                <option value={city.CityID} style={{ color: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}` }}>{city.CityName}</option>
                                                            </Fragment>
                                                        )
                                                    })
                                                }
                                            </select>

                                            <input type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueAddress form-control`} placeholder='آدرس محل برگزاری لیگ' value={this.state.leagueAddress} onChange={this.handleleagueAddress} title='آدرس محل برگزاری' />

                                        </div>
                                    </div>
                                </div>

                                <div className='col-12' style={{ padding: '26px 70px' }}>
                                    <p className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueInputsLabelLocation--dark' : 'createLeagueInputsLabelLocation'}`}>لوکیشن محل برگزاری لیگ را روی نقشه مشخص کنید</p>
                                </div>

                                <div className='col-12 myLeafletContainer' style={{ padding: '26px 15px', height: 180, width: '100%' }}>
                                    <Map center={position} maxZoom={18} zoom={13} zoomOffset={1}
                                    >
                                        <TileLayer
                                            url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                                        />
                                        <Marker position={position} icon={this.suitcasePoint}
                                            draggable={true}
                                            onDragend={this.draged}
                                        >
                                            <Popup>
                                                آدرس لیگ شما
                                            </Popup>
                                        </Marker>
                                        <FullscreenControl position="topleft" />
                                    </Map>
                                </div>

                                <div className='col-12' style={{ padding: '55px 50px' }}>
                                    <div className='row' style={{ direction: 'rtl', textAlign: 'center' }}>
                                        <div className='col-12'>
                                            {this.state.showThisBtn}
                                            <button className={`${localStorage.getItem('theme') === 'dark' ? 'createLeagueSendBtn--dark' : 'createLeagueSendBtn'}`} onClick={this.handlePrevModal2}>قبلی</button>
                                        </div>
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

// آپلود آواتار
export class LeagueAvatarUploader extends React.Component {
    static displayName = LeagueAvatarUploader.name;

    constructor(props) {
        super(props);

        this.state = {
            pictures: [],
            src: leagueAvatar
        };
        this.onDrop = this.onDrop.bind(this);

    }

    onDrop(picture) {
        let file = picture[picture.length - 1];
        let validateFileExt = /\.(gif|jpg|jpeg|png)$/i;
        if (file) {
            if (validateFileExt.test(file.name)) {
                if (file.size < 5242880) {
                    getBase64(file, (result) => {
                        let cardBase64 = result;
                        //ارسال عکس دریافتی از کاربر به دیتابیس
                        leagueAvatar = cardBase64;
                        this.props.handler(cardBase64);
                        //کاهش حجم عکس
                        let img = document.createElement("img");
                        img.src = leagueAvatar;
                        let canvas = document.createElement('canvas');
                        setTimeout(function () {
                            resizeImg = getResizeImg(img, canvas, '900', '900');
                            this.setState({
                                pictures: this.state.pictures.concat(picture),
                                src: resizeImg
                            });

                        }.bind(this), 1000)
                        //call parent function
                        this.props.handleAvatar();

                    });
                } else {
                    toast.error("! سایز فایل انتخاب شده بیش از اندازه میباشد", { position: toast.POSITION.TOP_CENTER });
                }
            } else {
                toast.error("! فرمت فایل انتخابی نادرست است", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            toast.error("! فرمت یا سایز فایل انتخابی نادرست است", { position: toast.POSITION.TOP_CENTER });
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    };

    setCroppedImg = (img) => {
        this.setState({
            src: img
        })
    }

    render() {
        const { src } = this.state;
        return (
            <React.Fragment>
                <ImageUploader
                    withIcon={false}
                    buttonText=''
                    buttonStyles={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 115, height: 115, backgroundColor: 'transparent', margin: 0, padding: 0, marginTop: '-15px' }}
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.png']}
                    maxFileSize={5242880}
                    singleImage={true}
                    withLable={false}
                    withPreview={false}
                    label=""
                    fileContainerStyle={{
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        borderColor: 'transparent',
                        width: '115px',
                        height: '115px',
                        borderRadius: '50%',
                        marginLeft: '-3px',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: (localStorage.getItem('theme') === 'dark') ? '1px solid #00acd8' : '1px solid #8d8d8d',
                        padding: 0,
                        margin: 0,
                        marginTop: '-15px',
                    }}
                    fileTypeError="فرمت عکس مورد نظر شما پشتیبانی نمیشود"
                    fileSizeError="سایز عکس شما بیش از اندازه می باشد"

                />
            </React.Fragment>
        );
    }
}

// انتخاب عکس کاور لیگ
const CreateLeagueSwiper = (props) => {
    const params = {
        modules: [Navigation],
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3,
        loop: false,
        loopFillGroupWithBlank: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    };

    const leagueCover1Clicked = () => {
        //نمودار پیشرفت
        props.handleSwiper();

        document.getElementById('createLeagueSelectedItem1').style.opacity = 1;
        document.getElementById('createLeagueSelectedItem2').style.opacity = 0;
        document.getElementById('createLeagueSelectedItem3').style.opacity = 0;
        document.getElementById('createLeagueSelectedItem4').style.opacity = 0;


        createLeagueBackgroundId = 1;
    }
    const leagueCover2Clicked = () => {
        //نمودار پیشرفت
        props.handleSwiper();

        document.getElementById('createLeagueSelectedItem1').style.opacity = 0;
        document.getElementById('createLeagueSelectedItem2').style.opacity = 1;
        document.getElementById('createLeagueSelectedItem3').style.opacity = 0;
        document.getElementById('createLeagueSelectedItem4').style.opacity = 0;

        createLeagueBackgroundId = 2;
    }
    const leagueCover3Clicked = () => {
        //نمودار پیشرفت
        props.handleSwiper();

        document.getElementById('createLeagueSelectedItem1').style.opacity = 0;
        document.getElementById('createLeagueSelectedItem2').style.opacity = 0;
        document.getElementById('createLeagueSelectedItem3').style.opacity = 1;
        document.getElementById('createLeagueSelectedItem4').style.opacity = 0;

        createLeagueBackgroundId = 3;
    }
    const leagueCover4Clicked = () => {
        //نمودار پیشرفت
        props.handleSwiper();

        document.getElementById('createLeagueSelectedItem1').style.opacity = 0;
        document.getElementById('createLeagueSelectedItem2').style.opacity = 0;
        document.getElementById('createLeagueSelectedItem3').style.opacity = 0;
        document.getElementById('createLeagueSelectedItem4').style.opacity = 1;

        createLeagueBackgroundId = 4;
    }

    // انتخاب بعد از تغییر
    let selectItem1 = 0;
    let selectItem2 = 0;
    let selectItem3 = 0;
    let selectItem4 = 0;
    switch (createLeagueBackgroundId) {
        case 1:
            selectItem1 = 1;
            selectItem2 = 0;
            selectItem3 = 0;
            selectItem4 = 0;
            break;
        case 2:
            selectItem1 = 0;
            selectItem2 = 1;
            selectItem3 = 0;
            selectItem4 = 0;
            break;
        case 3:
            selectItem1 = 0;
            selectItem2 = 0;
            selectItem3 = 1;
            selectItem4 = 0;
            break;
        case 4:
            selectItem1 = 0;
            selectItem2 = 0;
            selectItem3 = 0;
            selectItem4 = 1;
            break;
        default:
    }

    return (
        <Swiper {...params}>

            <div className='createLeagueBgs' onClick={leagueCover1Clicked}>
                <img className='createLeagueBgs-img' src='/src/backgrounds/CreateLeagueBgs/createLeagueBg1.jpg' alt='1' />
                <span id='createLeagueSelectedItem1' className='createLeagueSelectedItem' style={{ opacity: selectItem1 }}></span>
            </div>
            <div className='createLeagueBgs' onClick={leagueCover2Clicked}>
                <img className='createLeagueBgs-img' src='/src/backgrounds/CreateLeagueBgs/createLeagueBg2.jpg' alt='2' />
                <span id='createLeagueSelectedItem2' className='createLeagueSelectedItem' style={{ opacity: selectItem2 }}></span>
            </div>
            <div className='createLeagueBgs' onClick={leagueCover3Clicked}>
                <img className='createLeagueBgs-img' src='/src/backgrounds/CreateLeagueBgs/createLeagueBg3.jpg' alt='3' />
                <span id='createLeagueSelectedItem3' className='createLeagueSelectedItem' style={{ opacity: selectItem3 }}></span>
            </div>
            <div className='createLeagueBgs' onClick={leagueCover4Clicked}>
                <img className='createLeagueBgs-img' src='/src/backgrounds/CreateLeagueBgs/createLeagueBg4.jpg' alt='4' />
                <span id='createLeagueSelectedItem4' className='createLeagueSelectedItem' style={{ opacity: selectItem4 }}></span>
            </div>

        </Swiper>
    )
}



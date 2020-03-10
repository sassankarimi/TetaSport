import React, { Fragment } from 'react';
import Modal from 'react-responsive-modal';
import '../../../css/site.css';
import { toast } from 'react-toastify';
import classnames from 'classnames/bind';
import Hashids from 'hashids';
import { Carousel } from 'react-bootstrap';
import IziToast from 'izitoast';
import ImageUploader from 'react-images-upload';
import { handleMSG } from '../../../jsFunctions/all.js';
import { getBase64, getResizeImg } from '../../../jsFunctions/all';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// استایل ها
const btnStyles = {
    'margBottom': '0px !important',
    'margTop': '35px !important',
    'borderClr': '#0D6A12',
    'paddTop': '0px !important'
}

// متغییر های سراسری
let hashid = new Hashids('', 7);
let avatar = '';
let initAvatar = '';
let resizeImg = '';

// کامپوننت ویرایش اطلاعات کاربر
export default class TeamProfileEdit extends React.Component {
    static displayName = TeamProfileEdit.name;

    constructor(props) {
        super(props);

        this.state = {
            info: [],
            /* states before edit */
            initTeamName: '',
            initTeamAvatar: '',
            initTeamAge: '',
            initTeamAgeID: '',
            initTeamCity: '',
            initTeamCityID: '',
            initTeamCoverPhoto: '',
            initTeamCoverPhotoID: 1,
            initTeamDescription: '',
            initTeamGenderTitle: '',
            initTeamGenderID: '',
            initTeamProvince: '',
            initProvinceID: '',
            initSportFieldTitle: '',
            initSportFieldID: '',
            initTeamAdminName: '',
            /* states after edit */
            teamName: '',
            teamAvatar: '',
            teamAge: '',
            teamCity: '',
            teamCityID: '',
            teamCoverPhoto: '',
            teamCoverPhotoID: 1,
            teamDescription: '',
            teamGenderTitle: '',
            teamProvince: '',
            ProvinceID: '',
            SportFieldTitle: '',
            TeamAdminName: '',
            SportFieldID: '',
            teamGenderID: '',
            teamAgeID: '',
            provinces: [],
            cities: [],
            //مدال
            open: false,
            selecetChange: false,
            //اسلایدر
            index: 0,
            direction: null,
        }
    };

    componentDidMount() {
        //دریافت اطلاعات و شهر
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetTeamInfo}`, {
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
                        info: data,
                        teamName: data.TeamName,
                        teamAvatar: data.Avatar,
                        teamAge: data.AgeCategoryTitle,
                        teamAgeID: data.AgeCategoryID,
                        teamCity: data.City,
                        teamCityID: data.CityID,
                        teamCoverPhotoID: data.CoverPhotoID,
                        //اسلایدر ایندکس از 0
                        index: (data.CoverPhotoID !== 0 || data.CoverPhotoID !== '0') ? data.CoverPhotoID - 1 : 0,
                        teamDescription: (data.Description && data.Description !== null && data.Description !== undefined && data.Description !== '') ? data.Description : '',
                        teamGenderTitle: data.GenderTitle,
                        teamGenderID: data.GenderID,
                        teamProvince: data.Province,
                        ProvinceID: data.ProvinceID,
                        SportFieldTitle: data.SportFieldTitle,
                        SportFieldID: data.SportFieldID,
                        TeamAdminName: data.TeamAdminName,
                        /* init states */
                        initTeamName: data.TeamName,
                        initTeamAvatar: data.Avatar,
                        initTeamAge: data.AgeCategoryTitle,
                        initTeamAgeID: data.AgeCategoryID,
                        initTeamCity: data.City,
                        initTeamCityID: data.CityID,
                        initTeamCoverPhotoID: data.CoverPhotoID,
                        initTeamDescription: (data.Description && data.Description !== null && data.Description !== undefined && data.Description !== '') ? data.Description : '',
                        initTeamGenderTitle: data.GenderTitle,
                        initTeamGenderID: data.GenderID,
                        initTeamProvince: data.Province,
                        initProvinceID: data.ProvinceID,
                        initSportFieldTitle: data.SportFieldTitle,
                        initSportFieldID: data.SportFieldID,
                        initTeamAdminName: data.TeamAdminName,
                    });
                    // شهر
                    let formCity = new FormData();
                    formCity.append('ProvinceID', data.ProvinceID);
                    formCity.append('UserID', localStorage.getItem('exID'));
                    fetch(`${configPort.TetaSport}${configUrl.GetProvinceCities}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': localStorage.getItem('Token')
                        },
                        body: formCity
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
                                    this.setState({ cities: data.Cities });
                                }
                            }
                        });
                }
            });

        // استان
        if (this.state.provinces.length === 0) {
            let form = new FormData();
            form.append('UserID', localStorage.getItem('exID'));
            fetch(`${configPort.TetaSport}${configUrl.GetProvinces}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                },
                body:form
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

    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };


    handleSelectBox = (e) => {
        this.setState({ yourGender: e.target.value, selecetChange: true });
    };
    handleSelectBoxSport = (e) => {
        this.setState({ SportFieldID: e.target.value });
    };
    handleSelectBoxGender = (e) => {
        this.setState({ teamGenderID: e.target.value });
    }
    handleSelectBoxAge = (e) => {
        this.setState({ teamAgeID: e.target.value });
    }

    Regret = () => {
        this.setState({ open: false });
        // برگرداندن تغییرات انجام شده به حالت قبلی
    };

    // شهر
    getCities = (e) => {
        this.setState({
            cities:[],
            teamCity: '',
            teamProvince: e.target.value
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
                        this.setState({ cities: data.Cities });
                    }
                }
            });

    }
    handleTeamCity = (e) => {
        this.setState({ teamCityID: e.target.value })
    }
    handleTeamProvince = (e) => {
        this.setState({
            ProvinceID: e.target.value,
            teamCityID: '',
            cities: []
        })
        let formCity = new FormData();
        formCity.append('ProvinceID', e.target.value);
        formCity.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetProvinceCities}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('Token')
            },
            body: formCity
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
                        this.setState({ cities: data.Cities });
                    }
                }
            });
    }
    handleSelect = (selectedIndex, e) => {
        this.setState({
            index: selectedIndex,
            direction: e.direction,
            teamCoverPhotoID: selectedIndex + 1
        });
    }

    updateProfile = () => {
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        //ارسال داده های جدید دریافتی از کاربر به دیتابیس
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('TeamID', teamIdDecoded);
        form.append('Name', this.state.teamName);
        form.append('SportFieldID', this.state.SportFieldID);
        form.append('GenderCategoryID', this.state.teamGenderID);
        form.append('AgeCategoryID', this.state.teamAgeID);
        form.append('Avatar', avatar);
        form.append('CoverPhotoID', this.state.teamCoverPhotoID);
        form.append('ProvinceID', this.state.ProvinceID);
        form.append('CityID', this.state.teamCityID);

        if (this.state.teamDescription !== '') {
            form.append('Description', this.state.teamDescription);
        }
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0) {
            if (this.state.teamName !== this.state.initTeamName ||
                this.state.SportFieldID !== this.state.initSportFieldID ||
                this.state.teamGenderID !== this.state.initTeamGenderID ||
                this.state.teamAgeID !== this.state.initTeamAgeID ||
                avatar !== initAvatar ||
                this.state.teamCoverPhotoID !== this.state.initTeamCoverPhotoID ||
                this.state.ProvinceID !== this.state.initProvinceID ||
                this.state.teamCityID !== this.state.initTeamCityID) {

                fetch(`${configPort.TetaSport}${configUrl.UpdateTeamProfileInfo}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('Token')
                    },
                    body: form
                }).then(response => {
                    let code = response.status;
                    switch (code) {
                        case 204:
                            this.setState({
                                teamName: '',
                                teamAvatar: '',
                                teamAge: '',
                                teamCity: '',
                                teamCityID: '',
                                teamCoverPhoto: '',
                                teamDescription: '',
                                teamGenderTitle: '',
                                teamProvince: '',
                                ProvinceID: '',
                                SportFieldTitle: '',
                                TeamAdminName: '',
                                SportFieldID: '',
                                teamGenderID: '',
                                teamAgeID: '',
                            })
                            avatar = '';
                            IziToast.success({
                                close: false,
                                closeOnEscape: true,
                                timeout: 1500,
                                position: 'center'
                            });
                            setTimeout(function () { 
                                window.location.reload();
                            }, 1500)
                            //بستن مدال باز شده پس از انجام تغییرات
                            this.setState({ open: false });
                            break;
                        case 401:
                            Logout({ ...this.props });
                            return false;
                        case 420:
                            LogoutSoft({ ...this.props });
                            return false;
                        default:
                            handleMSG(code, response.json());
                            break;
                    }
                })

            } else {
                //بستن
                this.setState({
                    open: false
                })
            }

        }
    };

    render() {
        const { open } = this.state;

        //select اضافه کرد کلاس 
        const selectBoxClass = classnames('custom-select select-arrow-down modal-input-focus color-when-change', {
            'greenTextEdit select-arrow-down': this.state.selecetChange,
        });
        // اضافه کرد کلاس به فیلد
        let mobileInput = ["form-control modal-input-focus mobile-check-first modal-input-placeholder col-12 col-md-8"];
        if (this.state.yourNumber !== '') {
            mobileInput.push('greenTextEdit');
        }
        // اضافه کرد کلاس به  فیلد یوزرنیم
        let usernNameInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.yourUserName !== '') {
            usernNameInputClass.push('greenTextEdit');
        }
        // اضافه کرد کلاس به  فیلد نام    
        let nameInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.yourName !== '') {
            nameInputClass.push('greenTextEdit');
        }
        // اضافه کرد کلاس به  فیلد سال نام خانوادگی
        let familyInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.yourFamily !== '') {
            familyInputClass.push('greenTextEdit');
        }
        // اضافه کرد کلاس به  فیلد روز تولد
        let birthDayInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.yourBirthDay !== '') {
            birthDayInputClass.push('greenTextEdit');
        }
        // اضافه کرد کلاس به  فیلد ماه تولد
        let birthMonthInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.yourBirthMonth !== '') {
            birthMonthInputClass.push('greenTextEdit');
        }
        // اضافه کرد کلاس به  فیلد سال تولد
        let birthYearInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.yourBirthYear !== '') {
            birthYearInputClass.push('greenTextEdit');
        }
        // اضافه کرد کلاس به  فیلد علاقه مندی ها
        let yourIntrestInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.yourIntrest !== '') {
            yourIntrestInputClass.push('greyTextEdit');
        }
        const provinces = this.state.provinces;
        const cities = this.state.cities;
        const { index, direction } = this.state;
        return (
            <Fragment>
                <div className='teamProfile-leagues-setting-btn-icon' onClick={this.onOpenModal} style={{ cursor: 'pointer' }}>
                    <img className='teamProfile-leagues-setting-btn-icon-setImg' src='/src/icon/leagueSettings.png' alt='setting' />
                </div>
                <div className='teamProfile-leagues-setting-btn' onClick={this.onOpenModal}>
                    <span id='edit' className='teamProfile-leagues-setting-btn-txt' style={{ cursor: 'pointer' }}>ویرایش پروفایل</span>
                </div>
                <Modal classNames={{ overlay: 'editMyProfileModal', modal: 'editMyProfileModal-bg', closeButton: 'editMyProfileModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={false} center>
                    <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                        style={{ maxWidth: 680, paddingTop: 0, borderRadius: 10, marginTop: '0%', boxShadow: 'none !important', minHeight: 900, paddingBottom: 55, cursor: 'default' }}>

                        <div className='Cover-selector-container'>
                            <Carousel
                                activeIndex={index}
                                direction={direction}
                                onSelect={this.handleSelect}
                                interval={null}
                                pauseOnHover={false}
                            >
                                <Carousel.Item>
                                    <div className='public-carousel-item-container'>
                                        <img
                                            className="d-block teamEdit-carousel-item-img"
                                            src="/src/backgrounds/teamBgs/teamBg1.jpg"
                                            alt="team background"
                                        />
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <div className='public-carousel-item-container'>
                                        <img
                                            className="d-block teamEdit-carousel-item-img"
                                            src="/src/backgrounds/teamBgs/teamBg2.jpg"
                                            alt="team background"
                                        />
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <div className='public-carousel-item-container'>
                                        <img
                                            className="d-block teamEdit-carousel-item-img"
                                            src="/src/backgrounds/teamBgs/teamBg3.jpg"
                                            alt="team background"
                                        />
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <div className='public-carousel-item-container'>
                                        <img
                                            className="d-block teamEdit-carousel-item-img"
                                            src="/src/backgrounds/teamBgs/teamBg4.jpg"
                                            alt="team background"
                                        />
                                    </div>
                                </Carousel.Item>
                            </Carousel>
                        </div>

                        <AvatarUploader {...this.props} defaultAvatar={this.state.teamAvatar} />

                        <div className="w3-section px-5">
                            <div className="row rtl" >
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold t-align-right" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>نام تیم</p>
                                </div>
                                <div className="col-md-8 form-group">
                                    <input defaultValue={this.state.teamName} onChange={(e) => this.setState({ teamName: e.target.value })} className={usernNameInputClass.join(' ')} id="your_username" type="text" placeholder="نام تیم" style={{ fontFamily: 'IRANYekanRegular', color: '#0D6A12', width: 234 }} />
                                    <div id="error_none_english" className="form-control iranyekanBold" style={{ background: '#FFE8E8', height: 26, border: 0, borderRadius: '0 0 5px 5px !important', color: '#BF0505', fontSize: 12, display: 'none', fontFamily: 'iranyekanBold', textAlign: 'right' }}>نام کاربری را انگلیسی وارد نمایید</div>
                                </div>
                            </div>
                            <div className="row rtl">
                                <div className="col-md-4">
                                    <p className="font-fam-irsans-bold t-align-right" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>ورزش تیم</p>
                                </div>
                                <div className="col-md-8 form-group text-right">
                                    <select value={this.state.SportFieldID} onChange={this.handleSelectBoxSport} id="your_gender" className={selectBoxClass} style={{ width: 234, color: '#0D6A12 ', fontFamily: 'iranyekanRegular' }}>
                                        <option value="" style={{ display: 'none' }}>ورزش</option>
                                        <option value="1" style={{ color: '#0D6A12' }}>فوتبال</option>
                                        <option value="2" style={{ color: '#0D6A12' }}>فوتسال</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row rtl">
                                <div className="col-md-4">
                                    <p className="font-fam-irsans-bold t-align-right" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>جنسیت بازیکنان</p>
                                </div>
                                <div className="col-md-8 form-group text-right">
                                    <select value={this.state.teamGenderID} onChange={this.handleSelectBoxGender} id="your_gender" className={selectBoxClass} style={{ width: 234, color: '#0D6A12 ', fontFamily: 'iranyekanRegular' }}>
                                        <option value="" style={{ display: 'none' }}>جنسیت</option>
                                        <option value="1" style={{ color: '#0D6A12' }}>آقا</option>
                                        <option value="2" style={{ color: '#0D6A12' }}>خانم</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row rtl">
                                <div className="col-md-4">
                                    <p className="font-fam-irsans-bold t-align-right" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>رده سنی بازیکنان</p>
                                </div>
                                <div className="col-md-8 form-group text-right">
                                    <select value={this.state.teamAgeID} onChange={this.handleSelectBoxAge} id="your_gender" className={selectBoxClass} style={{ width: 234, color: '#0D6A12 ', fontFamily: 'iranyekanRegular' }}>
                                        <option value="" style={{ display: 'none' }}>رده سنی</option>
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
                            <div className="row rtl">
                                <div className="col-md-4">
                                    <p className="font-fam-irsans-bold t-align-right" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>استان</p>
                                </div>
                                <div className="col-md-8 form-group text-right">
                                    <select className='custom-select select-arrow-down modal-input-focus color-when-change' id="createLeague-leagueStateArea" style={{ color: '#495057', fontFamily: 'iranyekanRegular', width: 234, display: 'inline-block' }} value={this.state.ProvinceID} onChange={this.handleTeamProvince}>
                                        <option value='' style={{ display: 'none' }}>استان محل برگزاری لیگ</option>
                                        {
                                            provinces.map((p, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <option value={p.ProvinceID} style={{ color: '#0D6A12' }}>{p.ProvinceName}</option>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="row rtl">
                                <div className="col-md-4">
                                    <p className="font-fam-irsans-bold t-align-right" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>شهر</p>
                                </div>
                                <div className="col-md-8 form-group text-right">
                                    <select className='custom-select select-arrow-down modal-input-focus color-when-change' id="createLeague-leagueCity" style={{ color: '#495057', fontFamily: 'iranyekanRegular', width: 234, display: 'inline-block' }} value={this.state.teamCityID} onChange={this.handleTeamCity}>
                                        <option value='' style={{ display: 'none' }}>شهر محل برگزاری لیگ </option>
                                        {
                                            cities.map((city, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <option value={city.CityID} style={{ color: '#0D6A12' }}>{city.CityName}</option>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="row rtl">
                                <div className="col-md-12">
                                    <p className="font-fam-irsans-bold t-align-right" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>توضیحات</p>
                                </div>
                                <div className="col-md-12 form-group text-right">
                                    <textarea value={this.state.teamDescription} onChange={(e) => { this.setState({ teamDescription: e.target.value }) }} className='edit-team-description-input' ></textarea>
                                </div>
                            </div>

                            <center style={{ direction: 'rtl' }}>
                                <button className="btn sign-btn-focus mobile-modal-btn"
                                    style={{ width: 127, background: '#0D6A12', color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }}
                                    type="submit" onClick={this.updateProfile} id="mobileBtnClick">
                                    تایید
                                </button>
                                <button className="btn sign-btn-focus mobile-modal-btn"
                                    style={{ width: 127, background: '#0D6A12', color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36 }}
                                    type="submit"
                                    onClick={this.Regret}

                                >
                                    لغو
                                </button>
                            </center>
                        </div>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}

export class AvatarUploader extends React.Component {
    static displayName = AvatarUploader.name;

    constructor(props) {
        super(props);

        this.state = {
            pictures: [],
            src: ''
        };
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('teamID', teamIdDecoded)
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetTeamInfo}`, {
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
                    if (data.Avatar && data.Avatar !== '' && data.Avatar !== undefined && data.Avatar !== null) {
                        this.setState({
                            src: data.Avatar,
                        });
                        avatar = data.Avatar;
                        /* init avatar */
                        initAvatar = data.Avatar;
                    }
                }
            });
    }

    onDrop(picture) {
        let file = picture[picture.length - 1];
        let validateFileExt = /\.(gif|jpg|jpeg|png)$/i;
        if (file) {
            if (validateFileExt.test(file.name)) {
                if (file.size < 5242880) {
                    getBase64(file, (result) => {
                        //کاهش حجم عکس
                        let img = document.createElement("img");
                        img.src = result;
                        let canvas = document.createElement('canvas');
                        setTimeout(function () {
                            resizeImg = getResizeImg(img, canvas, '900', '900');
                            this.setState({
                                pictures: this.state.pictures.concat(picture),
                                src: resizeImg
                            });
                            avatar = resizeImg;

                        }.bind(this), 1000)
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
    render() {
        const { src } = this.state;
        return (
            <React.Fragment>
                <ImageUploader
                    withIcon={false}
                    buttonText=''
                    buttonStyles={{ backgroundImage: 'url(' + require('../../../css/assets/icon/smallPencil.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 155, height: 155, backgroundColor: 'transparent', margin: 0, marginTop: '-13px', padding: 0, zIndex: 100 }}
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
                        width: '155px',
                        height: '155px',
                        borderRadius: '50%',
                        marginTop: '-95px',
                        marginRight: '30px',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: '1px solid rgb(210, 210, 210)',
                        padding: 0,
                        overFlow: 'hidden'
                    }}
                    fileTypeError="فرمت عکس مورد نظر شما پشتیبانی نمیشود"
                    fileSizeError="سایز عکس شما بیش از اندازه می باشد"

                />
            </React.Fragment>
        );
    }
}

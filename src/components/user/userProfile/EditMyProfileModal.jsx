import React, { Fragment } from 'react';
import { NavItem } from 'reactstrap';
import Modal from 'react-responsive-modal';
import '../../../css/site.css';
import { toast } from 'react-toastify';
import ImageUploader from 'react-images-upload';
import { getBase64 , getResizeImg } from '../../../jsFunctions/all';
import IziToast from 'izitoast';
import classnames from 'classnames/bind';
import { handleMSG } from '../../../jsFunctions/all.js';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../jsFunctions/all.js';
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
let avatar = '';
let cover = '';
let resizeImg = '';
let resizeImgCover = '';



// کامپوننت ویرایش اطلاعات کاربر
export default class EditMyProfileModal extends React.Component {
    static displayName = EditMyProfileModal.name;

    constructor(props) {
        super(props);

        let intrest = '';
        if (localStorage.getItem('Intrest') && localStorage.getItem('Intrest') !== 'null' && localStorage.getItem('Intrest') !== 'undefined' && localStorage.getItem('Intrest') !== undefined) {
            intrest = localStorage.getItem('Intrest');
        }
        let birthday = ''
        if (localStorage.getItem('Day') && localStorage.getItem('Day') !== 'null' && localStorage.getItem('Day') !== 'undefined' && localStorage.getItem('Day') !== undefined) {
            birthday = localStorage.getItem('Day');
        }
        let BirthMonth = ''
        if (localStorage.getItem('Month') && localStorage.getItem('Month') !== 'null' && localStorage.getItem('Month') !== 'undefined' && localStorage.getItem('Month') !== undefined) {
            BirthMonth = localStorage.getItem('Month');
        }
        let BirthYear = ''
        if (localStorage.getItem('Year') && localStorage.getItem('Year') !== 'null' && localStorage.getItem('Year') !== 'undefined' && localStorage.getItem('Year') !== undefined) {
            BirthYear = localStorage.getItem('Year');
        }
        let city = ''
        if (localStorage.getItem('city') && localStorage.getItem('city') !== 'null' && localStorage.getItem('city') !== 'undefined' && localStorage.getItem('city') !== undefined) {
            city = localStorage.getItem('city');
        }
        let prv = ''
        if (localStorage.getItem('prv') && localStorage.getItem('prv') !== 'null' && localStorage.getItem('prv') !== 'undefined' && localStorage.getItem('prv') !== undefined) {
            prv = localStorage.getItem('prv');
        }
        let about = ''
        if (localStorage.getItem('about') && localStorage.getItem('about') !== 'null' && localStorage.getItem('about') !== 'undefined' && localStorage.getItem('about') !== undefined) {
            about = localStorage.getItem('about');
        }

        this.state = {
            yourNumber: '',
            yourUserName: localStorage.getItem('Username'),
            yourGender: localStorage.getItem('Gn'),
            yourBirthDay: birthday,
            yourBirthMonth: BirthMonth,
            yourBirthYear: BirthYear,
            yourName: localStorage.getItem('Name'),
            yourFamily: localStorage.getItem('Family'),
            yourIntrest: intrest,
            yourEmail: 'Email',
            yourNickname: 'Nickname',
            open: false,
            selecetChange: false,
            cities: [],
            userCity: '',
            userCityID: city,
            provinces: [],
            userProvinces: '',
            userProvincesID: prv,
            aboutMe: about,
            /*برای کراپ*/
            imageSrc: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 3,
            croppedAreaPixels: null,
            croppedImage: null,
        }
    };

    componentDidMount() {
        //استان
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
        if (localStorage.getItem('prv') && localStorage.getItem('prv') !== 'null' && localStorage.getItem('prv') !== 'undefined' && localStorage.getItem('prv') !== undefined) {
            // شهر
            let formCity = new FormData();
            formCity.append('UserID', localStorage.getItem('exID'));
            formCity.append('ProvinceID', localStorage.getItem('prv'));
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
                            this.setState({
                                cities: data.Cities,
                            });
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

    updateProfile = () => {
        //ارسال داده های جدید دریافتی از کاربر به دیتابیس
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('Username', this.state.yourUserName);
        form.append('Firstname', this.state.yourName);
        form.append('Lastname', this.state.yourFamily);
        form.append('Status', this.state.yourIntrest);
        form.append('AboutMe', this.state.aboutMe);
        form.append('BirthYear', this.state.yourBirthYear);
        form.append('BirthMonth', this.state.yourBirthMonth);
        form.append('BirthDay', this.state.yourBirthDay);
        form.append('Gender', this.state.yourGender);
        form.append('ProvinceID', this.state.userProvincesID);
        form.append('CityID', this.state.userCityID);
        if (avatar !== '' && avatar !== 'src/profilePic/defaultAvatar.png') {
            form.append('Avatar', avatar);
        } else {
            if (localStorage.getItem('userAvatar') && localStorage.getItem('userAvatar') !== 'null' && localStorage.getItem('userAvatar') !== '') {
                form.append('Avatar', localStorage.getItem('userAvatar'));
            }
        }
        if (cover !== '' && cover !== 'src/backgrounds/profBanner.png') {
            form.append('CoverPhoto', cover);
        } else {
            if (localStorage.getItem('CoverPhoto') && localStorage.getItem('CoverPhoto') !== 'null' && localStorage.getItem('CoverPhoto') !== '') {
                form.append('CoverPhoto', localStorage.getItem('CoverPhoto'));
            }
        }


        fetch(`${configPort.TetaSport}${configUrl.UpdateUserProfileInfo}`, {
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
                    localStorage.setItem('Username', this.state.yourUserName);
                    localStorage.setItem('Name', this.state.yourName);
                    localStorage.setItem('Family', this.state.yourFamily);
                    localStorage.setItem('Gn', this.state.yourGender);
                    localStorage.setItem('Intrest', this.state.yourIntrest);
                    localStorage.setItem('Day', this.state.yourBirthDay);
                    localStorage.setItem('Month', this.state.yourBirthMonth);
                    localStorage.setItem('Year', this.state.yourBirthYear);
                    localStorage.setItem('about', this.state.aboutMe);
                    if (this.state.userCityID !== '') {
                        localStorage.setItem('city', this.state.userCityID);
                    }
                    if (this.state.userCityID !== '') {
                        localStorage.setItem('prv', this.state.userProvincesID);
                    }
                    if (avatar !== '' && avatar !== 'src/profilePic/defaultAvatar.png') {
                        localStorage.setItem('userAvatar', avatar);
                    }
                    if (cover !== '' && cover !== 'src/backgrounds/profBanner.png') {
                        localStorage.setItem('CoverPhoto', cover);
                    }

                    /* info */
                    document.getElementById('your_username').innerText = this.state.yourUserName;
                    document.getElementById('your_name').innerText = this.state.yourName;
                    document.getElementById('your_family').innerText = this.state.yourFamily;
                    document.getElementById('your_gender').selectedIndex = this.state.yourGender;
                    document.getElementById('your_intrest').innerText = this.state.yourIntrest;
                    document.getElementById('your_birth_year').innerText = this.state.yourBirthYear;
                    document.getElementById('your_birth_month').innerText = this.state.yourBirthMonth;
                    document.getElementById('your_birth_day').innerText = this.state.yourBirthDay;
                    document.getElementById('userNameAndFamilySpan').innerText = this.state.yourName + ' ' + this.state.yourFamily;
                    document.getElementById('userUsernameSpan').innerText = this.state.yourUserName;
                    document.getElementById('myProfileNavUsername').innerText = this.state.yourUserName;
                    document.getElementById('userIntrestSpan').innerText = this.state.yourIntrest;

                    /* avatar */
                    if (avatar !== '' && avatar !== 'src/profilePic/defaultAvatar.png') {
                        document.getElementById('userImgAvatar').style.background = `url(${avatar})`;
                        document.getElementById('userImgAvatar').style.backgroundRepeat = 'no-repeat';
                        document.getElementById('userImgAvatar').style.backgroundSize = 'cover';
                        document.getElementById('userImgAvatar').style.backgroundPosition = 'center';
                        document.getElementById('userImgNavAvatar').style.background = `url(${avatar})`;
                        document.getElementById('userImgNavAvatar').style.backgroundSize = 'cover';
                        document.getElementById('userImgNavAvatar').style.backgroundRepeat = 'no-repeat';
                        document.getElementById('userImgNavAvatar').style.backgroundPosition = 'center';
                    }

                    /* کاور */
                    if (cover !== '' && cover !== 'src/backgrounds/profBanner.png') {
                        document.getElementById('userBgCover').style.background = `url(${cover})`;
                        document.getElementById('userBgCover').style.backgroundRepeat = 'no-repeat';
                        document.getElementById('userBgCover').style.backgroundSize = 'cover';
                        document.getElementById('userBgCover').style.backgroundPosition = 'center';
                    }
                    IziToast.success({
                        close: false,
                        closeOnEscape: true,
                        timeout: 1500,
                        position: 'center'
                    });
                    //بستن مدال باز شده پس از انجام تغییرات
                    this.setState({ open: false });
                    break;
                case 401:
                    Logout({ ...this.props })
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    handleMSG(code, response.json());
                    return false;
            }
        })


    };

    handleSelectBox = (e) => {
        this.setState({ yourGender: e.target.value, selecetChange: true });
    };

    handleUserCity = (e) => {
        this.setState({ userCityID: e.target.value })
    }

    Regret = () => {
        this.setState({ open: false });
        // برگرداندن تغییرات انجام شده به حالت قبلی
    };

    // دریافت شهر
    getCities = (e) => {
        this.setState({
            cities: [],
            userCityID: '',
            userProvincesID: e.target.value
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
                        });
                    }
                }
            });

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
            avatar: croppedImage
        })
        avatar = croppedImage;
        this.AvatarUploader.setCroppedImg(croppedImage);
        document.getElementById('crop-me').style.display = 'none';
    }
    showCroppedImageCover = async () => {
        const croppedImage = await getCroppedImg(
            this.state.imageSrc,
            this.state.croppedAreaPixels
        )
        this.setState({
            croppedImage,
        })
        cover = croppedImage;
        this.CoverUploader.setCroppedImg(croppedImage);
        document.getElementById('crop-me').style.display = 'none';
    }
    handleClose = () => {
        this.setState({ croppedImage: null })
    }

    //تغییر چایلد
    handlerAvatar = (img) => {
        document.getElementById('crop-me').style.display = 'block';
        document.getElementById('croped-AVATAR').style.display = 'block';
        document.getElementById('croped-COVER').style.display = 'none';
        this.setState({
            imageSrc: img
        })
    }
    handlerCover = (img) => {
        document.getElementById('crop-me').style.display = 'block';
        document.getElementById('croped-AVATAR').style.display = 'none';
        document.getElementById('croped-COVER').style.display = 'block';
        this.setState({
            imageSrc: img
        })
    }

    render() {

        const { open } = this.state;
        const provinces = this.state.provinces;
        const cities = this.state.cities;

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

        // disable city selectbox
        let isCityDisabled = true;
        if (this.state.userProvincesID !== '') {
            isCityDisabled = false;
        } else {
            isCityDisabled = true;
        }


        return (
            <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark list-group-item-fontFam--dark' : 'list-group-item-hover list-group-item-fontFam'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-border-top-and-buttom`}>
                <span id='edit' className='list-group-item-link-padding-display sc-txt-alg' onClick={this.onOpenModal} style={{ cursor: 'pointer' }}>ویرایش پروفایل</span>
                <Modal classNames={{ overlay: 'editMyProfileModal', modal: 'editMyProfileModal-bg', closeButton: 'editMyProfileModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={false} center>
                    <div className="w3-modal-content w3-card-4 w3-animate-opacity sc-editProfile"
                        style={{ paddingTop: 0, borderRadius: 10, marginTop: '0%', boxShadow: 'none !important', paddingBottom: 20, background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : null }}>

                        <CoverUploader {...this.props} handler={(img) => { this.handlerCover(img) }} onRef={ref => (this.CoverUploader = ref)} />
                        <AvatarUploader {...this.props} handler={(img) => { this.handlerAvatar(img) }} onRef={ref => (this.AvatarUploader = ref)} />


                        <div className='crop-avatar' id='crop-me'>
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
                                <div id='croped-AVATAR' className='done-croping-container' onClick={this.showCroppedImageAvatar}>
                                    <span className='done-croping'>تایید آواتار</span>
                                </div>
                                <div id='croped-COVER' className='done-croping-container' onClick={this.showCroppedImageCover}>
                                    <span className='done-croping'>تایید کاور</span>
                                </div>
                            </div>
                        </div>



                        <div className="w3-section px-5">
                            <div className="row rtl" >
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold txl sc-txt-alg" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>نام کاربری</p>
                                </div>
                                <div className="col-md-6 form-group">
                                    <input defaultValue={this.state.yourUserName} onChange={(e) => this.setState({ yourUserName: e.target.value })} className={usernNameInputClass.join(' ')} id="your_username" type="text" placeholder="نام کاربردی/انگلیسی وارد شود" style={{ fontFamily: 'IRANYekanRegular', color: '#0D6A12' }} />
                                    <div id="error_none_english" className="form-control iranyekanBold" style={{ background: '#FFE8E8', height: 26, border: 0, borderRadius: '0 0 5px 5px !important', color: '#BF0505', fontSize: 12, display: 'none', fontFamily: 'iranyekanBold', textAlign: 'right' }}>نام کاربری را انگلیسی وارد نمایید</div>
                                </div>
                            </div>
                            <div className="row rtl">
                                <div className="col-md-4">
                                    <p className="font-fam-irsans-bold txl sc-txt-alg" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>جنسیت</p>
                                </div>
                                <div className="col-md-6 form-group text-right">
                                    <select defaultValue={this.state.yourGender} onChange={this.handleSelectBox} id="your_gender" className={selectBoxClass} style={{ width: 234, color: '#0D6A12 ', fontFamily: 'iranyekanRegular' }}>
                                        <option value="" style={{ display: 'none' }}>جنسیت</option>
                                        <option value="1" style={{ color: '#0D6A12' }}>آقا</option>
                                        <option value="2" style={{ color: '#0D6A12' }}>خانم</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row rtl" >
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold txl sc-txt-alg" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>تاریخ تولد</p>
                                </div>
                                <div className="col-md-6 form-group text-right">
                                    <input defaultValue={this.state.yourBirthDay} onChange={(e) => this.setState({ yourBirthDay: e.target.value })} className={'numonly ' + birthDayInputClass.join(' ')} id="your_birth_day" maxLength="2" type="text" placeholder="روز" style={{ fontFamily: 'iranyekanRegular', width: 49.59, display: 'inline-block', fontSize: 15, color: '#0D6A12', marginRight: 3 }} />
                                    <input defaultValue={this.state.yourBirthMonth} onChange={(e) => this.setState({ yourBirthMonth: e.target.value })} className={'numonly margRightInpt ' + birthMonthInputClass.join(' ')} id="your_birth_month" maxLength="2" type="text" placeholder="ماه" style={{ fontFamily: 'iranyekanRegular', width: 49.59, display: 'inline-block', fontSize: 15, color: '#0D6A12', marginRight: 3 }} />
                                    <input defaultValue={this.state.yourBirthYear} onChange={(e) => this.setState({ yourBirthYear: e.target.value })} className={'numonly margRightInpt ' + birthYearInputClass.join(' ')} id="your_birth_year" maxLength="4" type="text" placeholder="تاریخ تولد/سال" style={{ fontFamily: 'iranyekanRegular', width: 114, marginLeft: '0 !important', display: 'inline-block', fontSize: 14, color: '#0D6A12' }} />
                                </div>

                            </div>
                            <div className="row rtl">
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold txl sc-txt-alg" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>نام و نام خانوادگی</p>
                                </div>
                                <div className="col-md-6">
                                    <div className="row rtl">
                                        <div className="col-md-6 form-group text-right  pl-0">
                                            <input defaultValue={this.state.yourName} onChange={(e) => this.setState({ yourName: e.target.value })} className={nameInputClass.join(' ')} id="your_name" type="text" placeholder="نام" style={{ fontFamily: 'iranyekanRegular', color: '#0D6A12' }} />
                                        </div>
                                        <div className="col-md-6 form-group text-right pl-0 paddingRightFam rc-editProf-fam">
                                            <input defaultValue={this.state.yourFamily} onChange={(e) => this.setState({ yourFamily: e.target.value })} className={familyInputClass.join(' ')} id="your_family" type="text" placeholder="نام خانوادگی" style={{ fontFamily: 'iranyekanRegular', color: '#0D6A12' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row rtl">
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold txl sc-txt-alg" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>جمله ی من</p>
                                </div>
                                <div className="col-md-6 form-group">
                                    <input defaultValue={this.state.yourIntrest} onChange={(e) => this.setState({ yourIntrest: e.target.value })} className={yourIntrestInputClass.join(' ')} id="your_intrest" type="text" placeholder="جمله ای از من" style={{ fontFamily: 'IRANYekanRegular', color: '#0D6A12' }} />
                                </div>
                            </div>
                            <div className="row rtl">
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold txl sc-txt-alg" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>درباره ی من</p>
                                </div>
                                <div className="col-md-6 form-group">
                                    <textarea className='edit-team-description-input' value={this.state.aboutMe} onChange={(e) => { this.setState({ aboutMe: e.target.value }) }}></textarea>
                                </div>
                            </div>

                            <div className="row rtl">
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold txl sc-txt-alg" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>استان</p>
                                </div>
                                <div className="col-md-6 form-group">
                                    <select className='custom-select select-arrow-down modal-input-focus color-when-change' id="createLeague-leagueStateArea" style={{ color: '#495057', fontFamily: 'iranyekanRegular', width: '100%', display: 'inline-block' }} value={this.state.userProvincesID} onChange={this.getCities}>
                                        <option value='' style={{ display: 'none' }}>استان خود را انتخاب کنید</option>
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
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold txl sc-txt-alg" style={{ color: '#5C5D5B', textAlign: 'center', fontSize: 18 }}>شهر</p>
                                </div>
                                <div className="col-md-6 form-group">
                                    <select className='custom-select select-arrow-down modal-input-focus color-when-change' id="createLeague-leagueCity" style={{ color: '#495057', fontFamily: 'iranyekanRegular', width: '100%', display: 'inline-block' }} disabled={isCityDisabled} value={this.state.userCityID} onChange={this.handleUserCity}>
                                        <option value='' style={{ display: 'none' }}>شهر خود را انتخاب کنید </option>
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

                            <center style={{ direction: 'rtl' }}>
                                <button className="btn sign-btn-focus mobile-modal-btn"
                                    style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }}
                                    type="submit" onClick={this.updateProfile} id="mobileBtnClick">
                                    تایید
                                </button>
                                <button className="btn sign-btn-focus mobile-modal-btn"
                                    style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }}
                                    type="submit"
                                    onClick={this.Regret}

                                >
                                    بازگشت
                                </button>
                            </center>
                        </div>
                    </div>
                </Modal>
            </NavItem>
        );
    }
}

export class AvatarUploader extends React.Component {
    static displayName = AvatarUploader.name;

    constructor(props) {
        super(props);

        let storageImageAvatar = '';
        if (this.props.avatar && this.props.avatar !== '' && this.props.avatar !== null) {
            storageImageAvatar = this.props.avatar;
        } else {
            if (localStorage.getItem('userAvatar') && localStorage.getItem('userAvatar') !== 'null' && localStorage.getItem('userAvatar') !== '' && localStorage.getItem('userAvatar') !== undefined) {
                storageImageAvatar = localStorage.getItem('userAvatar')
            } else {
                storageImageAvatar = 'src/profilePic/defaultAvatar.png';
            }
        }


        this.state = {
            pictures: [],
            src: storageImageAvatar,
        };
        this.onDrop = this.onDrop.bind(this);

    }

    componentDidMount() {
        this.props.onRef(this);
    };

    onDrop(picture) {
        let file = picture[picture.length - 1];

        let validateFileExt = /\.(gif|jpg|jpeg|png)$/i;
        if (file) {
            if (validateFileExt.test(file.name)) {
                if (file.size < 1000000) {
                    getBase64(file, (result) => {
                        let cardBase64 = result;
                        this.props.handler(cardBase64);
                        //کاهش حجم عکس
                        let img = document.createElement("img");
                        img.src = cardBase64;
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
                    buttonStyles={{ backgroundImage: 'url(' + require('../../../css/assets/icon/smallPencil.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 150, height: 150, backgroundColor: 'transparent', margin: 0, padding: 0 }}
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.png']}
                    maxFileSize={2000000}
                    singleImage={true}
                    withLable={false}
                    withPreview={false}
                    label=""
                    fileContainerStyle={{
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        borderColor: 'transparent',
                        borderRadius: '50%',
                        marginRight: '30px',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: '3px solid #FFF',
                        padding: 0
                    }}
                    className='user-avatar-upload'
                    fileTypeError="فرمت عکس مورد نظر شما پشتیبانی نمیشود"
                    fileSizeError="سایز عکس شما بیش از اندازه می باشد"

                />
            </React.Fragment>
        );
    }
}

export class CoverUploader extends React.Component {
    static displayName = CoverUploader.name;


    constructor(props) {
        super(props);

        let storageImageCover = '';
        if (localStorage.getItem('CoverPhoto') && localStorage.getItem('CoverPhoto') !== 'null') {
            storageImageCover = localStorage.getItem('CoverPhoto')
        } else {
            storageImageCover = 'src/backgrounds/profBanner.png';
        }

        this.state = {
            pictures: [],
            src: storageImageCover,
            /*برای کراپ*/
            imageSrc: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 3,
            croppedAreaPixels: null,
            croppedImage: null,
        };
        this.onDrop = this.onDrop.bind(this);

    }

    componentDidMount() {
        this.props.onRef(this);
    };

    onDrop(picture) {
        let file = picture[picture.length - 1];
        let validateFileExt = /\.(gif|jpg|jpeg|png)$/i;
        if (file) {
            if (validateFileExt.test(file.name)) {
                if (file.size < 1000000) {
                    getBase64(file, (result) => {
                        let cardBase64 = result;
                        //this.props.handler(cardBase64);
                        //کاهش حجم عکس
                        let img = document.createElement("img");
                        img.src = cardBase64;
                        let canvas = document.createElement('canvas');
                        setTimeout(function () {
                            resizeImgCover = getResizeImg(img, canvas, '900', '900');
                            this.setState({
                                pictures: this.state.pictures.concat(picture),
                                src: resizeImgCover
                            });
                            cover = resizeImgCover;

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
                    className='coverInput editBGCover'
                    withIcon={false}
                    buttonText=''
                    buttonStyles={{ backgroundImage: 'url(' + require('../../../css/assets/icon/pencil.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 55, height: 55, backgroundColor: 'transparent' }}
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.png']}
                    maxFileSize={2000000}
                    singleImage={true}
                    withLable={false}
                    withPreview={false}
                    label=""
                    fileContainerStyle={{
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        borderRadius: '8px 8px 0 0',
                        borderColor: 'transparent',
                        height: '200px'

                    }}
                    fileTypeError="فرمت عکس مورد نظر شما پشتیبانی نمیشود"
                    fileSizeError="سایز عکس شما بیش از اندازه می باشد"
                    errorStyle={{ maxWidth: 500, position: 'fixed', top: 0, backgroundColor: 'red' }}

                />
            </React.Fragment>
        );
    }
}




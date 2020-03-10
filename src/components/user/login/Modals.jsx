import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import '../../../css/site.css';
import { toast } from 'react-toastify';
import IziToast from 'izitoast';
import classnames from 'classnames/bind';
import PasswordMask from 'react-password-mask';
import { handleMSG } from '../../../jsFunctions/all.js';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let exID = 0;
let name_array = [];
let name_array_forget = [];

// استایل ها
const btnStyles = {
    'margBottom': '0px !important',
    'margTop': '35px !important',
    'borderClr': '#0D6A12',
    'paddTop': '0px !important'
}

// کامپوننت بخش شماره تلفن 
export class LoginModal extends React.Component {
    static displayName = LoginModal.name;

    constructor(props) {
        super(props);
        this.state = {
            yourNumber: '',
            open: true,
        }
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    enterPressed = (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) {
            document.getElementById('mobileBtnClick').click();
        }
    };

    login = () => {
        var form = new FormData();
        form.append('Mobile', this.state.yourNumber);

        if (this.state.yourNumber !== '') {
            let mobileRegex = /^09\d{9}$/;
            if (mobileRegex.test(this.state.yourNumber)) {

                fetch(`${configPort.SSO}${configUrl.IsRegistered}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: form
                }).then(response => {

                    let code = response.status;
                    switch (code) {
                        case 200:
                            //بستن مدال قبلی
                            document.getElementsByClassName('loginModal')[0].style.display = 'none';
                            //باز کردن مدال ورود کاربر
                            this.UserLoginModal.onOpenModal();
                            return response.json();
                        case 201:
                            //بستن مدال قبلی
                            document.getElementsByClassName('loginModal')[0].style.display = 'none';
                            //باز کردن مدال تایید کد برای ثبت نام
                            this.VerifyModal.onOpenModal();
                            break;
                        default:
                            handleMSG(code, response.json());
                            return false;
                    }

                }).then(data => {
                    if (data) {
                        if (data != null) {
                            exID = data.ExternalID;
                        }
                    }
                })
            } else {
                toast.error("! شماره موبایل قابل قبول نیست", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            toast.error("! شماره موبایل خود را وارد کنید", { position: toast.POSITION.TOP_CENTER });
        }
    };



    render() {
        const { open } = this.state;
        // اضافه کردن کلاس به فیلد
        let mobileInput = [`form-control w3-input w3-margin-bottom  ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus mobile-check-first--dark' : 'modal-input-focus mobile-check-first'} modal-input-placeholder`];
        if (this.state.yourNumber !== '') {
            mobileInput.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        }
        return (
            <NavItem>
                <VerifyModal {...this.props} {...this.state} onRef={ref => (this.VerifyModal = ref)} />
                <UserLoginModal {...this.props} {...this.state} onRef={ref => (this.UserLoginModal = ref)} />
                <NavLink id='login' tag={Link} to="/login" className="txt-color-nav-items left-margin-first-li" onClick={this.onOpenModal} >ورود/ثبت نــام</NavLink>
                <Modal classNames={{ overlay: 'loginModal', modal: 'loginModal-bg', closeButton: 'loginModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={false} closeOnOverlayClick={false} center>
                    <div className="w3-modal-content w3-card-4 w3-animate-opacity sc-modal-med"
                        style={{ maxWidth: 625, width: 575, height: 260, paddingTop: 31, borderRadius: 8, marginTop: '10%', boxShadow: 'none !important', background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : null }}>
                        <p className="font-fam-irsans-bold loginmodal-number-title" style={{ color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', textAlign: 'center', marginBottom: 30, fontSize: 21 }}>شماره موبایل خود را وارد کنید</p>
                        <div className="w3-section px-5">

                            <input className={mobileInput.join(' ')} type="text" name="yourNumber" id="yourNumber"
                                value={this.state.yourNumber}
                                onChange={(e) => this.setState({ yourNumber: e.target.value })}
                                onKeyPress={this.enterPressed}
                                autoComplete="off"
                                placeholder="0912XXXXXXX" autoFocus title="تلفن همراه" maxLength="11" style={{ fontFamily: 'arial-regular', borderRadius: 5, textAlign: 'left', border: '1px solid #E6E6E6', marginTop: 33, direction: 'ltr' }} />

                            <center>
                                <button className="btn sign-btn-focus mobile-modal-btn sc-modal-btn"
                                    style={{ width: 127, background: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 25, paddingTop: btnStyles.paddTop, height: 44 }}
                                    type="submit" onClick={this.login} id="mobileBtnClick">
                                    ورود
                                </button>
                            </center>
                        </div>
                    </div>
                </Modal>
            </NavItem>
        );
    }
}


// کامپوننت  کد فعال سازی برای بخش ثبت نام
export class VerifyModal extends React.Component {
    static displayName = VerifyModal.name;

    constructor(props) {
        super(props);
        this.state = {
            yourNumber: '',
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            code5: '',
            open: false,
        }
    };

    componentDidMount() {
        this.props.onRef(this);
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    enterPressed = (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) {
            document.getElementById('ok-verify').click();
        }
    };

    signUp_verify = () => {
        var form = new FormData();
        // شماره موبایل
        form.append('Mobile', this.props.yourNumber);
        // کد فعال سازی 
        form.append("OTP", this.state.code1 + this.state.code2 + this.state.code3 + this.state.code4 + this.state.code5);

        if (this.state.code1 !== '' &&
            this.state.code2 !== '' &&
            this.state.code3 !== '' &&
            this.state.code4 !== '' &&
            this.state.code5 !== '') {
            fetch(`${configPort.SSO}${configUrl.VerifyOTP}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: form
            }).then(response => {
                let code = response.status;

                switch (code) {
                    case 204:
                        //بستن مدال قبلی
                        document.getElementsByClassName('verifyModal')[0].style.display = 'none';
                        //باز کردن مدال بعدی 
                        this.SignUpModal.onOpenModal();
                        return response.text();
                    default:
                        handleMSG(code, response.json());
                        return false;
                }
            })
        } else {
            toast.error("! کد پنج رقمی را به درستی وارد کنید", { position: toast.POSITION.TOP_CENTER });
        }
    };

    resendCode = () => {
        let count = 15;
        let counter = setInterval(timer, 1000);
        function timer() {
            count = count - 1;
            if (count <= 0) {
                clearInterval(counter);
                document.getElementById("timer").innerHTML = '<span onClick="resendCode()" style=\'text-align: right;cursor:pointer\'>ارسال مجدد کد</span>';
                //ارسال مجدد کد
                document.getElementById('mobileBtnClick').click();
                return;
            }
            document.getElementById("timer").innerHTML = count + " ثانیه تا ارسال مجدد کد";
        }
    };

    //کنترل رفتار اینپوت های این کامپوننت
    handleKey = (e) => {

        let maxlength = e.target.attributes["maxLength"].value;
        let name = e.target.attributes["name"].value;
        name_array = name_array.concat(name);
        let array_length = name_array.length;
        let mylength = e.target.value.length;
        //خودکار فیلد ها پس از پر شدن توسط کاربر Focus
        if (mylength >= maxlength) {
            let next = e.target;
            while ((next = next.nextElementSibling)) {
                if (next === null) {
                    break;
                }

                if (next.tagName.toLowerCase() === "input") {
                    next.focus();
                    break;
                }
            }

        }

        // ارسال خودکار
        if ((name === "code5") && (array_length === 5)) {
            this.signUp_verify();
        }

        // Backspace رفتار کلید
        if (e.which === 8 && name !== "code1") {
            let prev = e.target;
            prev = prev.previousElementSibling;
            if (prev.tagName.toLowerCase() === "input") {
                prev.focus();

            }
        }
    }


    render() {
        const { open } = this.state;
        // اضافه کردن کلاس به فیلد ها
        let vCode1 = ['form-control verif_code_style'];
        if (this.state.code1 !== '') {
            vCode1.push(`${localStorage.getItem('theme') === 'dark' ? 'vCodeText--dark' : 'vCodeText'}`);
        }
        let vCode2 = ['form-control verif_code_style'];
        if (this.state.code2 !== '') {
            vCode2.push(`${localStorage.getItem('theme') === 'dark' ? 'vCodeText--dark' : 'vCodeText'}`);
        }
        let vCode3 = ['form-control verif_code_style'];
        if (this.state.code3 !== '') {
            vCode3.push(`${localStorage.getItem('theme') === 'dark' ? 'vCodeText--dark' : 'vCodeText'}`);
        }
        let vCode4 = ['form-control verif_code_style'];
        if (this.state.code4 !== '') {
            vCode4.push(`${localStorage.getItem('theme') === 'dark' ? 'vCodeText--dark' : 'vCodeText'}`);
        }
        let vCode5 = ['form-control verif_code_style'];
        if (this.state.code5 !== '') {
            vCode5.push(`${localStorage.getItem('theme') === 'dark' ? 'vCodeText--dark' : 'vCodeText'}`);
        }
        return (
            <Modal classNames={{ overlay: 'verifyModal', modal: 'verifyModal-bg', closeButton: 'verifyModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={false} closeOnOverlayClick={false} center>
                <SignUpModal {...this.props} onRef={ref => (this.SignUpModal = ref)} />
                <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                    style={{ maxWidth: 625, width: 429, minHeight: 280, paddingTop: "8%", borderRadius: 8, marginTop: "10%", boxShadow: "none!important", paddingBottom: 15, background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : '' }}>
                    <p className="font-fam-irsans-bold" style={{ color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', textAlign: 'center', margiBottom: 30, fontSize: 19 }}>کد تایید حساب را وارد نمایید</p>
                    <div className="w3-section" style={{ textAlign: 'right', direction: 'rtl' }}>
                        <div className="input-group mb-3">
                            <div className="row" style={{ textAlign: 'center' }}>
                                <div className="col-md-12 form-group dir-ltr-important">
                                    <input value={this.state.code1} onKeyPress={this.enterPressed} onKeyUp={this.handleKey} onChange={(e) => this.setState({ code1: e.target.value })} className={vCode1.join(' ')} maxLength="1" type="text" id="verify-code1" name="code1" autoFocus />
                                    <input value={this.state.code2} onKeyPress={this.enterPressed} onKeyUp={this.handleKey} onChange={(e) => this.setState({ code2: e.target.value })} className={vCode2.join(' ')} maxLength="1" type="text" id="verify-code2" name="code2" />
                                    <input value={this.state.code3} onKeyPress={this.enterPressed} onKeyUp={this.handleKey} onChange={(e) => this.setState({ code3: e.target.value })} className={vCode3.join(' ')} maxLength="1" type="text" id="verify-code3" name="code3" />
                                    <input value={this.state.code4} onKeyPress={this.enterPressed} onKeyUp={this.handleKey} onChange={(e) => this.setState({ code4: e.target.value })} className={vCode4.join(' ')} maxLength="1" type="text" id="verify-code4" name="code4" />
                                    <input value={this.state.code5} onKeyPress={this.enterPressed} onKeyUp={this.handleKey} onChange={(e) => this.setState({ code5: e.target.value })} className={vCode5.join(' ')} maxLength="1" type="text" id="verify-code5" name="code5" />
                                </div>
                                <div className="col-md-12">
                                    <p id="timer" style={{ fontFamily: 'IRANYekan', textAlign: 'center', color: '#BBBBBB' }}><span onClick={this.resendCode} style={{ textAlign: 'right', cursor: 'pointer' }}>ارسال مجدد کد</span></p>
                                </div>
                                <div className="col-md-12" style={{ textAlign: 'center' }}>
                                    <button style={{ width: 140, background: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', color: '#fff', fontFamily: 'iranyekanBold', fontSize: 22, height: 44, borderRadius: 5, paddingTop: 1 }}
                                        className="btn mt-3" id="ok-verify" onClick={this.signUp_verify}>
                                        تایید
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}


// کامپوننت بخش ثبت نام کاربر جدید
export class SignUpModal extends React.Component {
    static displayName = SignUpModal.name;

    constructor(props) {
        super(props);
        this.state = {
            yourNumber: '',
            yourUserName: '',
            yourName: '',
            yourFamily: '',
            yourBirthDay: '',
            yourBirthYear: '',
            yourBirthMonth: '',
            yourPassword: '',
            yourGender: 'جنسیت',
            yourEmail: 'Email',
            yourNickname: 'Nickname',
            open: false,
            selecetChange: false,
        }
    };

    componentDidMount() {
        this.props.onRef(this);
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    handleSelectBox = (e) => {
        this.setState({ yourGender: e.target.value, selecetChange: true });
    }

    // username اعتبار سنجی فیلد
    userNameHandler = (e) => {
        this.setState({ yourUserName: e.target.value });
        // مقادیر انگلیسی :
        // let english = /^[A-Za-z0-9]*$/;

        // مقادیر فارسی :
        let persian = /^[\u0600-\u06FF\s]+$/;

        if (e.target.value !== '') {
            if (!persian.test(e.target.value)) {
                document.getElementById('error_none_english').style.display = 'none';
                document.getElementById('your_username').setAttribute('style', `border-color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#09A603'} !important;font-family: IRANYekanRegular; color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'} !important`);

            } else {
                document.getElementById('error_none_english').style.display = 'block';
                document.getElementById('your_username').setAttribute('style', 'border-color:#BF0505 !important;font-family: IRANYekanRegular; color:#BF0505 !important');
            }
        } else {
            document.getElementById('error_none_english').style.display = 'none';
            document.getElementById('your_username').setAttribute('style', `border-color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#09A603'} !important;font-family: IRANYekanRegular; color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'} !important`);
        }
    }

    handleName = (e) => {
        this.setState({ yourName: e.target.value });
        // مقادیر فارسی :
        let persian = /^[\u0600-\u06FF\s]+$/;

        if (e.target.value !== '') {
            if (persian.test(e.target.value)) {
                document.getElementById('error_none_persian_name').style.display = 'none';
                document.getElementById('your_name').setAttribute('style', `border-color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#09A603'} !important;font-family: IRANYekanRegular; color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'} !important`);

            } else {
                document.getElementById('error_none_persian_name').style.display = 'block';
                document.getElementById('your_name').setAttribute('style', 'border-color:#BF0505 !important;font-family: IRANYekanRegular; color:#BF0505 !important');
            }
        } else {
            document.getElementById('error_none_persian_name').style.display = 'none';
            document.getElementById('your_name').setAttribute('style', `border-color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#09A603'} !important;font-family: IRANYekanRegular; color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'} !important`);
        }
    }

    handleFamily = (e) => {
        this.setState({ yourFamily: e.target.value });
        // مقادیر فارسی :
        let persian = /^[\u0600-\u06FF\s]+$/;
        if (e.target.value !== '') {
            if (persian.test(e.target.value)) {
                document.getElementById('error_none_persian_family').style.display = 'none';
                document.getElementById('your_family').setAttribute('style', `border-color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#09A603'} !important;font-family: IRANYekanRegular; color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'} !important`);

            } else {
                document.getElementById('error_none_persian_family').style.display = 'block';
                document.getElementById('your_family').setAttribute('style', 'border-color:#BF0505 !important;font-family: IRANYekanRegular; color:#BF0505 !important');
            }
        } else {
            document.getElementById('error_none_persian_family').style.display = 'none';
            document.getElementById('your_family').setAttribute('style', `border-color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#09A603'} !important;font-family: IRANYekanRegular; color:${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'} !important`);
        }

    }

    enterPressed = (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) {
            document.getElementById('sendNewUser').click();
        }
    };

    addUser = () => {
        var form = new FormData();
        // فیلد ها
        form.append('Username', this.state.yourUserName);
        form.append('Password', this.state.yourPassword);
        form.append('Firstname', this.state.yourName);
        form.append('Lastname', this.state.yourFamily);
        form.append('Gender', this.state.yourGender);
        form.append('BirthDay', this.state.yourBirthDay);
        form.append('BirthMonth', this.state.yourBirthMonth);
        form.append('BirthYear', this.state.yourBirthYear);
        form.append('Mobile', this.props.yourNumber);

        // مقادیر فارسی :
        let persian = /^[\u0600-\u06FF\s]+$/;

        if (!persian.test(this.state.yourUserName)) {
            if (persian.test(this.state.yourName) && persian.test(this.state.yourFamily)) {

                if (this.state.yourUserName !== '' &&
                    this.state.yourPassword !== '' &&
                    this.state.yourName !== '' &&
                    this.state.yourFamily !== '' &&
                    this.state.yourGender !== '' &&
                    this.props.yourNumber !== ''
                ) {
                    fetch(`${configPort.SSO}${configUrl.AddUser}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                        },
                        body: form
                    }).then(response => {
                        let code = response.status;
                        switch (code) {
                            case 201:
                                localStorage.setItem('Username', this.state.yourUserName);
                                localStorage.setItem('Name', this.state.yourName);
                                localStorage.setItem('Family', this.state.yourFamily);
                                localStorage.setItem('Gn', this.state.yourGender);
                                localStorage.setItem('Day', this.state.yourBirthDay);
                                localStorage.setItem('Month', this.state.yourBirthMonth);
                                localStorage.setItem('Year', this.state.yourBirthYear);
                                localStorage.setItem('Intrest', '');
                                return response.json();
                            default:
                                handleMSG(code, response.json());
                                return false;
                        }
                    }).then((data) => {
                        if (data) {
                            localStorage.setItem('exID', data.ExternalID);
                            localStorage.setItem('view_profile', data.ExternalID);
                            if (data.Token && data.Token !== undefined && data.Token !== null && data.Token !== '') {
                                localStorage.setItem('Token', data.Token);
                            } else {
                                localStorage.removeItem('Token');
                            }

                            // ارسال مشخصات کاربر برای ذخیره در  دیتابیس Api داخلی tetasport
                            var form = new FormData();
                            // فیلد ها
                            form.append('UserID', data.ExternalID);


                            fetch(`${configPort.TetaSport}${configUrl.AddUserProfileToLocalDB}`, {
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
                                        //ارسال کاربر به صفحه پروفایل 
                                        this.props.history.replace(`/profile/${this.state.yourUserName}`);
                                        break;
                                    case 401:
                                        LogoutSoft();
                                        window.location.reload();
                                        break;
                                    case 420:
                                        LogoutSoft({ ...this.props });
                                        return false;
                                    default:
                                        handleMSG(code, response.json());
                                        return false;
                                }
                            })
                        }
                    })
                } else {
                    toast.error("! ورودی ها را به درستی وارد کنید", { position: toast.POSITION.TOP_CENTER });
                }
            } else {
                toast.error("! نام و نام خانوادگی باید فارسی باشند", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            toast.error("! نام کاربری باید لاتین باشد", { position: toast.POSITION.TOP_CENTER });
        }
    };

    render() {
        const { open } = this.state;
        // select اضافه کرد کلاس به 
        let selectBoxClass = null;
        if (localStorage.getItem('theme') === 'dark') {
            selectBoxClass = classnames(`custom-select select-arrow-down ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'} color-when-change`, {
                'greenText--dark select-arrow-down-green--dark': this.state.selecetChange,
            });
        } else {
            selectBoxClass = classnames(`custom-select select-arrow-down ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'} color-when-change`, {
                'greenText select-arrow-down-green': this.state.selecetChange,
            });
        }

        // username اضافه کرد کلاس به فیلد
        let usernNameInputClass = [`form-control modal-input-placeholder ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'}`];
        if (this.state.yourUserName !== '') {
            usernNameInputClass.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        }
        // firstname اضافه کرد کلاس به فیلد
        let nameInputClass = [`form-control modal-input-placeholder ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'}`];
        if (this.state.yourName !== '') {
            nameInputClass.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        }
        // lastname اضافه کرد کلاس به فیلد
        let familyInputClass = [`form-control modal-input-placeholder ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'}`];
        if (this.state.yourFamily !== '') {
            familyInputClass.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        }
        // birthday اضافه کرد کلاس به فیلد
        let birthDayInputClass = [`form-control modal-input-placeholder ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'}`];
        if (this.state.yourBirthDay !== '') {
            birthDayInputClass.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        }
        // birthmonth اضافه کرد کلاس به فیلد
        let birthMonthInputClass = [`form-control modal-input-placeholder ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'}`];
        if (this.state.yourBirthMonth !== '') {
            birthMonthInputClass.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        }
        // bearthyear اضافه کرد کلاس به فیلد
        let birthYearInputClass = [`form-control modal-input-placeholder ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'}`];
        if (this.state.yourBirthYear !== '') {
            birthYearInputClass.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        }
        // password اضافه کرد کلاس به فیلد
        let passwordInputClass = [`form-control modal-input-placeholder ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'}`];
        if (this.state.yourPassword !== '') {
            passwordInputClass.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        }

        return (
            <Modal classNames={{ overlay: 'signUpModal', modal: 'signUpModal-bg', closeButton: 'signUpModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={false} closeOnOverlayClick={false} center>

                <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                    style={{ width: 617, borderRadius: 8, marginTop: '2%', boxShadow: 'none!important', minHeight: 495, background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : null }}>
                    <header className="w3-containerl" style={{ backgroundColor: (localStorage.getItem('theme') === 'dark') ? '#3d4046' : '#EFF5F0', color: '#0D6A12', height: 57, paddingTop: '1%', marginBottom: 60 }}>
                        <h2 className="font-fam-irsans-bold" style={{ textAlign: 'center', fontSize: 21, color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0d6a12' }}>ثـبت نـام</h2>
                    </header>
                    <div className="w3-container px-5" style={{ direction: 'rtl' }}>
                        <div className="row">
                            <div className="col-md-12 form-group">
                                <input value={this.state.yourUserName} onKeyPress={this.enterPressed} onChange={this.userNameHandler} className={usernNameInputClass.join(' ')} id="your_username" type="text" placeholder="نام کاربردی/انگلیسی وارد شود" style={{ fontFamily: 'IRANYekanRegular', color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12' }} title='نام کاربردی'/>
                                <div id="error_none_english" className="form-control iranyekanBold" style={{ background: '#FFE8E8', height: 26, border: 0, borderRadius: '0 0 5px 5px !important', color: '#BF0505', fontSize: 12, display: 'none', fontFamily: 'iranyekanBold', textAlign: 'right' }}>نام کاربری را انگلیسی وارد نمایید</div>
                            </div>
                            <div className="col-md-6 form-group">
                                <input value={this.state.yourName} onKeyPress={this.enterPressed} onChange={this.handleName} className={nameInputClass.join(' ')} id="your_name" type="text" placeholder="نام" style={{ fontFamily: 'iranyekanRegular', color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12' }} title='نام'/>
                                <div id="error_none_persian_name" className="form-control iranyekanBold" style={{ background: '#FFE8E8', height: 26, border: 0, borderRadius: '0 0 5px 5px !important', color: '#BF0505', fontSize: 12, display: 'none', fontFamily: 'iranyekanBold', textAlign: 'right' }}>نام را فارسی وارد نمایید</div>
                            </div>
                            <div className="col-md-6 form-group">
                                <input value={this.state.yourFamily} onKeyPress={this.enterPressed} onChange={this.handleFamily} className={familyInputClass.join(' ')} id="your_family" type="text" placeholder="نام خانوادگی" style={{ fontFamily: 'iranyekanRegular', color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12' }} title='نام خانوادگی' />
                                <div id="error_none_persian_family" className="form-control iranyekanBold" style={{ background: '#FFE8E8', height: 26, border: 0, borderRadius: '0 0 5px 5px !important', color: '#BF0505', fontSize: 12, display: 'none', fontFamily: 'iranyekanBold', textAlign: 'right' }}>نام خانوادگی را فارسی وارد نمایید</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <input value={this.state.yourBirthDay} onKeyPress={this.enterPressed} onChange={(e) => this.setState({ yourBirthDay: e.target.value })} className={'numonly ' + birthDayInputClass.join(' ')} id="your_birth_day" maxLength="2" type="text" placeholder="روز" style={{ fontFamily: 'iranyekanRegular', width: '22%', display: 'inline-block', fontSize: 15, color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12' }} />
                                <input value={this.state.yourBirthMonth} onKeyPress={this.enterPressed} onChange={(e) => this.setState({ yourBirthMonth: e.target.value })} className={'numonly ' + birthMonthInputClass.join(' ')} id="your_birth_month" maxLength="2" type="text" placeholder="ماه" style={{ fontFamily: 'iranyekanRegular', width: '22%', display: 'inline-block', fontSize: 15, color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', marginRight: '2%' }} />
                                <input value={this.state.yourBirthYear} onKeyPress={this.enterPressed} onChange={(e) => this.setState({ yourBirthYear: e.target.value })} className={'numonly ' + birthYearInputClass.join(' ')} id="your_birth_year" maxLength="4" type="text" placeholder="تاریخ تولد/سال" style={{ fontFamily: 'iranyekanRegular', width: '50%', marginLeft: '0 !important', display: 'inline-block', fontSize: 15, color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', marginRight: '2%' }} />
                            </div>
                            <div className="col-md-6 form-group">
                                <select value={this.state.yourGender} onChange={this.handleSelectBox} id="your_gender" className={selectBoxClass} style={{ color:'#d8d8d8', fontFamily: 'iranyekanRegular' }}>
                                    <option value="" style={{ display: 'none' }}>جنسیت</option>
                                    <option value="1" style={{ color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12' }}>آقا</option>
                                    <option value="2" style={{ color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12' }}>خانم</option>
                                </select>
                            </div>
                            <div className="col-md-12 form-group" style={{ marginBottom: -10 }}>
                                <PasswordMask
                                    value={this.state.yourPassword}
                                    onKeyDown={this.enterPressed}
                                    onChange={(e) => this.setState({ yourPassword: e.target.value })}
                                    className="input-group mb-3 "
                                    type="password"
                                    placeholder="رمز عبور"
                                    inputClassName={'show-hide-input-pass-my-style ' + passwordInputClass.join(' ')}
                                    buttonClassName="show-hide-btn-pass-my-style toggle-eye-password-input"
                                    showButtonContent=' '
                                    hideButtonContent=' '
                                />
                            </div>
                            <div className="col-md-12" style={{ textAlign: 'center' }}>
                                <button style={{ width: 140, backgroundColor: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', color: '#fff', fontFamily: 'iranyekanBold', fontSize: 25, height: 44, borderRadius: 5, marginBottom: 45, paddingTop: 1 }}
                                    className="btn mt-3" id="sendNewUser" onClick={this.addUser}>
                                    تایید
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}


// کامپوننت ورود کاربران به سایت
export class UserLoginModal extends React.Component {
    static displayName = UserLoginModal.name;

    constructor(props) {
        super(props);
        this.state = {
            userPassword: '',
            open: false,
            playerUserName: '',
        }
    };

    componentDidMount() {
        this.props.onRef(this);
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    handlePasswordChange = () => {

    };

    enterPressed = (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) {
            document.getElementById('sendLoginUser').click();
        }
    };

    //فراموشی رمز عبور
    forgetMyPassword = () => {

        var form = new FormData();
        // موبایل
        form.append('Mobile', this.props.yourNumber);
        if (this.props.yourNumber !== '') {
            fetch(`${configPort.SSO}${configUrl.SendOTP}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: form
            }).then(response => {
                let code = response.status;

                switch (code) {
                    case 201:
                        //بستن مدال قبلی
                        document.getElementsByClassName('userLoginModal')[0].style.display = 'none';
                        //باز کردن مدال تایید کد برای بخش فراموشی رمز عبور
                        this.VerifyForgetPasswordModal.onOpenModal();
                        return response.text();
                    default:
                        handleMSG(code, response.json());
                        return false;
                }
            })
        } else {
            toast.error("! شما به این بخش دسترسی ندارید", { position: toast.POSITION.TOP_CENTER });
        }
    };

    //ورود کاربر
    loginUser = () => {
        localStorage.removeItem('view_profile');
        var form = new FormData();
        form.append('ExternalID', exID);
        form.append('Password', this.state.userPassword);

        if (exID !== '' && exID !== 0) {
            if (this.state.userPassword !== '') {
                fetch(`${configPort.SSO}${configUrl.VerifyPassword}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: form
                }).then(response => {
                    let code = response.status;
                    switch (code) {
                        case 200:
                            return response.json();
                        default:
                            handleMSG(code, response.json());
                            return false;
                    }
                }).then(data => {
                    if (data) {
                        this.setState({
                            playerUserName: data.Username
                        })
                        localStorage.setItem('Username', data.Username);
                        localStorage.setItem('Name', data.Firstname);
                        localStorage.setItem('Family', data.Lastname);
                        localStorage.setItem('Gn', data.Gender);
                        localStorage.setItem('Day', data.BirthDay);
                        localStorage.setItem('Month', data.BirthMonth);
                        localStorage.setItem('Year', data.BirthYear);
                        if (data.Token && data.Token !== undefined && data.Token !== null && data.Token !== '') {
                            localStorage.setItem('Token', data.Token);
                        } else {
                            localStorage.removeItem('Token');
                        }
                        /* update token */
                        var form = new FormData();
                        form.append('UserID', exID);

                        fetch(`${configPort.TetaSport}${configUrl.UpdateUserToken}`, {
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
                                    return true;
                                case 401:
                                    LogoutSoft();
                                    window.location.reload();
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
                                    localStorage.setItem('exID', exID);
                                    localStorage.setItem('view_profile', exID);
                                    /* get items */
                                    var form = new FormData();
                                    form.append('UserID', localStorage.getItem('exID'));
                                    form.append('PlayerID', exID);
                                    form.append('MyProfile', true);
                                    fetch(`${configPort.TetaSport}${configUrl.GetUserProfileItems}`, {
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
                                            case 401:
                                                LogoutSoft();
                                                window.location.reload();
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
                                                localStorage.setItem('CoverPhoto', data.UserCoverPhoto);
                                                localStorage.setItem('Intrest', data.Status);
                                                localStorage.setItem('countOfFav', data.UserFavoriteSports3.length);
                                                localStorage.setItem('about', data.AboutMe);
                                                localStorage.setItem('city', data.CityID);
                                                localStorage.setItem('prv', data.ProvinceID);
                                                //ارسال کاربر به صفحه پروفایل 
                                                this.props.history.replace(`/profile/myLeagues/${this.state.playerUserName}`);
                                            }
                                        });
                                }
                            });
                    }

                })
            } else {
                toast.error("! رمز عبور خود را وارد کنید", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            toast.error("! شما به این بخش دسترسی ندارید", { position: toast.POSITION.TOP_CENTER });
        }
    };

    render() {
        const { open } = this.state;
        // استایل ها
        // password اضافه کردن کلاس به فیلد
        let passwordInput = [`form-control modal-input-placeholder ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'} toggleMePasswordLogin`];
        if (this.state.userPassword !== '') {
            passwordInput.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        }
        return (
            <Modal classNames={{ overlay: 'userLoginModal', modal: 'userLoginModal-bg', closeButton: 'userLoginModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={false} closeOnOverlayClick={false} center>
                <VerifyForgetPasswordModal {...this.props} onRef={ref => (this.VerifyForgetPasswordModal = ref)} />
                <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                    style={{
                        maxWidth: 625, width: 575, height: 375, paddingTop: 35, borderRadius: 8, marginTop: '10%', boxShadow: 'none', background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : null
                    }}>
                    <p className="font-fam-irsans-bold" style={{ color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', textAlign: 'center', marginBottom: 30, fontSize: 19 }}>رمز عبور خود را وارد کنید</p>
                    <div className="w3-section px-5" style={{ textAlign: 'right', direction: 'rtl' }}>


                        <div className="col-md-12 form-group" style={{ marginBottom: -10 }}>
                            <div className="input-group mb-3" style={{ textAlign: 'right', direction: 'rtl' }}>
                                <input className={`form-control w3-input w3-margin-bottom ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark mobile-check-first--dark' : 'modal-input-focus mobile-check-first'} modal-input-placeholder`} type="text" name="ourUserNumber" id={`${localStorage.getItem('theme') === 'dark' ? 'ourUserNumber--dark' : 'ourUserNumber'}`}
                                    value={this.props.yourNumber}
                                    autoComplete="off" readOnly maxLength="11"
                                    placeholder=""
                                    title="تلفن همراه شما"
                                    style={{ fontFamily: 'arialRegular', borderRadius: 5, textAlign: 'left', border: '1px solid #E6E6E6', marginTop: 33, direction: 'ltr' }} />
                            </div>

                            <PasswordMask
                                value={this.state.userPassword}
                                onKeyDown={this.enterPressed}
                                onChange={(e) => this.setState({ userPassword: e.target.value })}
                                className="input-group mb-3 "
                                type="password"
                                placeholder="رمز عبور"
                                inputClassName={'show-hide-input-pass-my-style ' + passwordInput.join(' ')}
                                buttonClassName="show-hide-btn-pass-my-style toggle-eye-password-input"
                                showButtonContent=' '
                                hideButtonContent=' '
                                autoFocus
                            />
                            <div><span id="forgetMyPassword" style={{ fontFamily: 'IRANYekanRegular', fontSize: 13, color: '#BBBBBB', cursor: 'pointer' }} onClick={this.forgetMyPassword}>رمز عبور را فراموش کرده‌ام</span></div>

                        </div>

                        <center>
                            <button className="btn sign-btn-focus"
                                style={{ width: 127, background: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: 0, borderRadius: 5, borderColor: '#0D6A12', fontSize: 25, paddingTop: 0, height: 44, marginTop: 30 }}
                                type="submit"
                                onClick={this.loginUser}
                                id='sendLoginUser'
                            >

                                ورود
                            </button>
                        </center>
                    </div>
                </div>
            </Modal>
        );
    }
}


// کامپوننت کد فعال سازی برای بخش فراموشی رمز عبور 
export class VerifyForgetPasswordModal extends React.Component {
    static displayName = VerifyForgetPasswordModal.name;

    constructor(props) {
        super(props);
        this.state = {
            yourNumber: '',
            VFcode1: '',
            VFcode2: '',
            VFcode3: '',
            VFcode4: '',
            VFcode5: '',
            open: false,
        }
    };

    componentDidMount() {
        this.props.onRef(this);
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    enterPressed = (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) {
            document.getElementById('ok-verify-forget').click();
        }
    };

    //کنترل رفتار فیلد های این کامپوننت
    forget_handleKey = (e) => {

        let maxlength = e.target.attributes["maxLength"].value;
        let name = e.target.attributes["name"].value;
        name_array_forget = name_array_forget.concat(name);
        let array_length = name_array_forget.length;
        let mylength = e.target.value.length;
        if (mylength >= maxlength) {
            let next = e.target;
            while ((next = next.nextElementSibling)) {
                if (next === null) {
                    break;
                }

                if (next.tagName.toLowerCase() === "input") {
                    next.focus();
                    break;
                }
            }

        }

        // ارسال خودکار
        if ((name === "VFcode5") && (array_length === 5)) {
            this.forget_verify();
        }

        // Backspace رفتار کلید
        if (e.which === 8 && name !== "VFcode1") {
            let prev = e.target;
            prev = prev.previousElementSibling;
            if (prev.tagName.toLowerCase() === "input") {
                prev.focus();

            }
        }
    }

    forget_verify = () => {

        var form = new FormData();
        // موبایل 
        form.append('Mobile', this.props.yourNumber);

        // کد 
        form.append("OTP", this.state.VFcode1 + this.state.VFcode2 + this.state.VFcode3 + this.state.VFcode4 + this.state.VFcode5);

        if (this.state.VFcode1 !== '' &&
            this.state.VFcode2 !== '' &&
            this.state.VFcode3 !== '' &&
            this.state.VFcode4 !== '' &&
            this.state.VFcode5 !== '') {
            fetch(`${configPort.SSO}${configUrl.VerifyOTP}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: form
            }).then(response => {
                let code = response.status;
                switch (code) {
                    case 204:
                        //بستن مدال قبلی
                        document.getElementsByClassName('verifyForgetPasswordModal')[0].style.display = 'none';
                        //باز کردن مدال تغییر رمز عبور
                        this.ForgetPassword.onOpenModal();
                        return response.text();
                    default:
                        handleMSG(code, response.json());
                        return false;
                }
            })
        } else {
            toast.error("! کد پنج رقمی را به درستی وارد کنید", { position: toast.POSITION.TOP_CENTER });
        }
    };

    makeSpan = () => {
        return <span onClick={this.resendCodeForget} style={{ textAlign: 'right', cursor: 'pointer' }}>ارسال مجدد کد</span>;
    };

    resendCodeForget = () => {
        let count = 15;
        let counter = setInterval(timerForget, 1000);
        function timerForget() {
            count = count - 1;
            if (count <= 0) {
                clearInterval(counter);
                //ارسال مجدد کد
                document.getElementById('forgetMyPassword').click();
                document.getElementById("timer-forget").innerHTML = '<span onClick="resendCodeForget()" style=\'text-align: right; cursor: pointer\'>ارسال مجدد کد</span>';
                return;
            }
            document.getElementById("timer-forget").innerHTML = count + " ثانیه تا ارسال مجدد کد";
        }
    };

    render() {
        const { open } = this.state;
        // اضافه کردن کلاس به فیلد ها
        let vfCode1 = ['form-control verif_code_style verif_forget_code_style'];
        if (this.state.VFcode1 !== '') {
            vfCode1.push(`${localStorage.getItem('theme') === 'dark' ? 'vfCodeText--dark' : 'vfCodeText'}`);
        }
        let vfCode2 = ['form-control verif_code_style verif_forget_code_style'];
        if (this.state.VFcode2 !== '') {
            vfCode2.push(`${localStorage.getItem('theme') === 'dark' ? 'vfCodeText--dark' : 'vfCodeText'}`);
        }
        let vfCode3 = ['form-control verif_code_style verif_forget_code_style'];
        if (this.state.VFcode3 !== '') {
            vfCode3.push(`${localStorage.getItem('theme') === 'dark' ? 'vfCodeText--dark' : 'vfCodeText'}`);
        }
        let vfCode4 = ['form-control verif_code_style verif_forget_code_style'];
        if (this.state.VFcode4 !== '') {
            vfCode4.push(`${localStorage.getItem('theme') === 'dark' ? 'vfCodeText--dark' : 'vfCodeText'}`);
        }
        let vfCode5 = ['form-control verif_code_style verif_forget_code_style'];
        if (this.state.VFcode5 !== '') {
            vfCode5.push(`${localStorage.getItem('theme') === 'dark' ? 'vfCodeText--dark' : 'vfCodeText'}`);
        }

        return (
            <Modal classNames={{ overlay: 'verifyForgetPasswordModal', modal: 'verifyForgetPasswordModal-bg', closeButton: 'verifyForgetPasswordModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={false} closeOnOverlayClick={false} center>
                <ForgetPassword {...this.props} onRef={ref => (this.ForgetPassword = ref)} />
                <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                    style={{ maxWidth: 625, width: 429, height: 280, paddingTop: "8%", borderRadius: 8, marginTop: "10%", boxShadow: "none!important", background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : '' }}>
                    <p className="font-fam-irsans-bold" style={{ color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', textAlign: 'center', margiBottom: 30, fontSize: 19 }}>کد تایید را وارد نمایید</p>
                    <div className="w3-section" style={{ textAlign: 'right', direction: 'rtl' }}>
                        <div className="input-group mb-3" style={{ paddingLeft: "3%" }}>
                            <div className="row" style={{ textAlign: "center" }}>
                                <div className="col-md-12 form-group dir-ltr-important">
                                    <input value={this.state.VFcode1} onKeyPress={this.enterPressed} onKeyUp={this.forget_handleKey} onChange={(e) => this.setState({ VFcode1: e.target.value })} className={vfCode1.join(' ')} maxLength="1" type="text" id="verify-forget-code1" name="VFcode1" autoFocus />
                                    <input value={this.state.VFcode2} onKeyPress={this.enterPressed} onKeyUp={this.forget_handleKey} onChange={(e) => this.setState({ VFcode2: e.target.value })} className={vfCode2.join(' ')} maxLength="1" type="text" id="verify-forget-code2" name="VFcode2" />
                                    <input value={this.state.VFcode3} onKeyPress={this.enterPressed} onKeyUp={this.forget_handleKey} onChange={(e) => this.setState({ VFcode3: e.target.value })} className={vfCode3.join(' ')} maxLength="1" type="text" id="verify-forget-code3" name="VFcode3" />
                                    <input value={this.state.VFcode4} onKeyPress={this.enterPressed} onKeyUp={this.forget_handleKey} onChange={(e) => this.setState({ VFcode4: e.target.value })} className={vfCode4.join(' ')} maxLength="1" type="text" id="verify-forget-code4" name="VFcode4" />
                                    <input value={this.state.VFcode5} onKeyPress={this.enterPressed} onKeyUp={this.forget_handleKey} onChange={(e) => this.setState({ VFcode5: e.target.value })} className={vfCode5.join(' ')} maxLength="1" type="text" id="verify-forget-code5" name="VFcode5" />
                                </div>
                                <div className="col-md-12">
                                    <p id="timer-forget" style={{ fontFamily: 'IRANYekan', textAlign: 'center', color: '#BBBBBB' }}><span onClick={this.resendCodeForget} style={{ textAlign: 'right', cursor: 'pointer' }}>ارسال مجدد کد</span></p>
                                </div>
                                <div className="col-md-12">
                                    <button style={{ width: 140, background: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', color: '#fff', fontFamily: 'iranyekanBold', fontSize: 22, height: 44, borderRadius: 5, paddingTop: 1 }}
                                        className="btn mt-3" id="ok-verify-forget" onClick={this.forget_verify}>
                                        تایید
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}


// کامپوننت فراموشی رمز عبور   
export class ForgetPassword extends React.Component {
    static displayName = ForgetPassword.name;

    constructor(props) {
        super(props);
        this.state = {
            userExID: exID,
            userNewPassword: '',
            validateNewPassword: '',
            open: false,
        }
    };

    componentDidMount() {
        this.props.onRef(this);
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    enterPressed = (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) {
            document.getElementById('sendNewPassword').click();
        }
    };

    forgetPassword = () => {
        var form = new FormData();
        form.append('ExternalID', exID);
        form.append('Password', this.state.userNewPassword);
        if (exID !== '' && exID !== 0) {
            if (this.state.userNewPassword !== '') {
                if (this.state.userNewPassword === this.state.validateNewPassword) {
                    fetch(`${configPort.SSO}${configUrl.UpdateUserPassword}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
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
                                break;
                            default:
                                handleMSG(code, response.json());
                                return false;
                        }

                    })
                } else {
                    toast.error("! ورودی ها مطابقت ندارند", { position: toast.POSITION.TOP_CENTER });
                }
            } else {
                toast.error("! رمز عبور جدید خود را وارد کنید", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            toast.error("! شما به این بخش دسترسی ندارید", { position: toast.POSITION.TOP_CENTER });
        }
    };

    render() {
        const { open } = this.state;
        // new password اضافه کردن کلاس به فیلد 
        let newPasswordInput = [`form-control modal-input-placeholder ${localStorage.getItem('theme') === 'dark' ? 'modal-input-focus--dark' : 'modal-input-focus'} toggleMePasswordForget`];
        if (this.state.userNewPassword === this.state.validateNewPassword && this.state.userNewPassword !== '') {
            newPasswordInput.push(`${localStorage.getItem('theme') === 'dark' ? 'greenText--dark' : 'greenText'}`);
        } else {
            if (this.state.userNewPassword !== '' && this.state.validateNewPassword !== '') {
                newPasswordInput.push('redText');
            }
        }

        return (
            <Modal classNames={{ overlay: 'forgetPasswordModal', modal: 'forgetPasswordModal-bg', closeButton: 'forgetPasswordModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={false} closeOnOverlayClick={false} center>
                <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                    style={{ maxWidth: 625, width: 575, height: 260, paddingTop: '2%', borderRadius: 8, marginTop: '10%', boxShadow: 'none', background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : '' }}>
                    <p className="font-fam-irsans-bold" style={{ color: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', textAlign: 'center', marginBottom: 30, fontSize: 19 }}>رمز عبور جدید را وارد نمایید</p>
                    <div className="w3-section px-5" style={{ textAlign: 'right', direction: 'rtl' }}>
                        <div className="col-md-12 form-group" style={{ marginBottom: -10 }}>
                            <PasswordMask
                                value={this.state.userNewPassword}
                                onKeyDown={this.enterPressed}
                                onChange={(e) => this.setState({ userNewPassword: e.target.value })}
                                className="input-group mb-3 "
                                type="password"
                                placeholder="رمز عبور"
                                inputClassName={'show-hide-input-pass-my-style ' + newPasswordInput.join(' ')}
                                buttonClassName="show-hide-btn-pass-my-style toggle-eye-password-input"
                                showButtonContent=' '
                                hideButtonContent=' '
                                id='pass_word'
                                autoFocus
                            />
                            <PasswordMask
                                value={this.state.validateNewPassword}
                                onKeyDown={this.enterPressed}
                                onChange={(e) => this.setState({ validateNewPassword: e.target.value })}
                                className="input-group mb-3 "
                                type="password"
                                placeholder="تکرار رمز عبور"
                                inputClassName={'show-hide-input-pass-my-style ' + newPasswordInput.join(' ')}
                                buttonClassName="show-hide-btn-pass-my-style toggle-eye-password-input"
                                showButtonContent=' '
                                hideButtonContent=' '
                                id='pass_word_2'
                            />
                        </div>
                        <center>
                            <button className="btn  w3-section  sign-btn-focus"
                                style={{ width: 127, background: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: 0, marginTop: 35, borderRadius: 5, borderColor: '#0D6A12', fontSize: 25, paddingTop: 0, height: 44 }}
                                type="submit" onClick={this.forgetPassword}
                                id='sendNewPassword'
                            >
                                تایید
                            </button>
                        </center>
                    </div>
                </div>
            </Modal>
        );
    }
}

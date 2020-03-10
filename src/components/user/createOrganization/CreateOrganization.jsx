import React, { Fragment } from 'react';
import Modal from 'react-responsive-modal';
import '../../../css/site.css';
import ImageUploader from 'react-images-upload';
import { getBase64, getResizeImg } from '../../../jsFunctions/all';
import { toast } from 'react-toastify';
import Hashids from 'hashids';
import { handleMSG } from '../../../jsFunctions/all.js';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../jsFunctions/all.js';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json'; import { setTimeout } from 'timers';



// متغییر های سراسری
let hashid = new Hashids('', 7);
let orgAvatar = '';
let orgCoverBg = '';
let urlArray = [];
let resizeImg = '';
let resizeImgCover = '';

// استایل ها
const btnStyles = {
    'margBottom': '0px !important',
    'margTop': '35px !important',
    'borderClr': '#0D6A12',
    'paddTop': '0px !important'
}

// کامپوننت ساخت سازمان
export default class CreateOrganizationModal extends React.Component {
    static displayName = CreateOrganizationModal.name;

    constructor(props) {
        super(props);

        this.state = {
            orgName: '',
            orgDescription: '',
            open: false,
            selecetChange: false,
            /*برای کراپ*/
            imageSrc: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 3,
            croppedAreaPixels: null,
            croppedImage: null,
            //قبل از ارسال درخواست حالت لودینگ
            showThisBtn: <button className="btn sign-btn-focus mobile-modal-btn" style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }} type="submit" onClick={this.createOrganization} id="mobileBtnClick">ثبت</button>,
            orginalBtn: <button className="btn sign-btn-focus mobile-modal-btn" style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }} type="submit" onClick={this.createOrganization} id="mobileBtnClick">ثبت</button>,
            doneBtn: <button className="btn sign-btn-focus mobile-modal-btn" style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }}><div className='requestBtn-result-container-modal'><img style={{ height: 16 }} src='src/icon/done-icon.png ' alt='done' /></div></button>,
            failBtn: <button className="btn sign-btn-focus mobile-modal-btn" style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }}><div className='requestBtn-result-container-modal'><img style={{ height: 16 }} src='src/icon/fail-icon.svg ' alt='failed' /></div></button>,
            btnLoading: <button className="btn sign-btn-focus mobile-modal-btn" style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }}><img style={{ height: 16 }} src='src/icon/loading.gif ' alt='loading' /></button>,
        }
        this.createOrganization = this.createOrganization.bind(this);
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({
            open: false,
            orgName: '',
            orgDescription: '',
            selecetChange: false,
        });
        orgAvatar = '';
        orgCoverBg = '';
    };

    createOrganization = () => {
        //قبل از ارسال
        this.setState({
            showThisBtn: this.state.btnLoading,
        });
        //ارسال داده های جدید دریافتی از کاربر به دیتابیس
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('Name', this.state.orgName);
        form.append('Description', this.state.orgDescription);
        form.append('Avatar', orgAvatar);
        form.append('CoverPhoto', orgCoverBg);
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0) {
            if (this.state.orgName !== '') {
                fetch(`${configPort.TetaSport}${configUrl.AddOrganization}`, {
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
                            this.setState({
                                showThisBtn: this.state.doneBtn,
                            });
                            toast.success(
                                <div className='toasty-div'>
                                    <span className='toasty-header'>سازمان با موفقیت ساخته شد</span>
                                    <span className='toasty-body'>درحال ارسال شما به صفحه سازمان...</span>
                                </div>
                                , { position: toast.POSITION.TOP_CENTER, pauseOnHover: false, closeOnClick: false, draggable: false, pauseOnVisibilityChange: false, closeButton: false }
                            );
                            this.onCloseModal();
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
                }).then(data => {
                    if (data) {
                        let orgID = hashid.encode(data.OrgID);
                        setTimeout(function () {
                            try {
                                window.location.replace(`/pro/organization/${orgID}`);
                            }
                            catch {

                            }
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
                            let x2 = urlArray[1].toLowerCase();
                            if (x === 'pro' && x2 === 'organization') {
                                this.props.history.replace(`/pro/organization/${orgID}`);
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
                this.setState({
                    showThisBtn: this.state.orginalBtn,
                });
                toast.error("! نام سازمان الزامی است", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            this.setState({
                showThisBtn: this.state.orginalBtn,
            });
            toast.error("! برای ساخت سازمان باید ثبت نام کنید", { position: toast.POSITION.TOP_CENTER });
        }
    };

    handleSelectBox = (e) => {
        this.setState({ yourGender: e.target.value, selecetChange: true });
    };

    Regret = () => {
        this.setState({ open: false });
    };


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
        orgAvatar = croppedImage;
        this.AvatarUploader.setCroppedImg(croppedImage);
        document.getElementById('crop-me-org').style.display = 'none';
    }
    showCroppedImageCover = async () => {
        const croppedImage = await getCroppedImg(
            this.state.imageSrc,
            this.state.croppedAreaPixels
        )
        this.setState({
            croppedImage,
        })
        orgCoverBg = croppedImage;
        this.CoverUploader.setCroppedImg(croppedImage);
        document.getElementById('crop-me-org').style.display = 'none';
    }
    handleClose = () => {
        this.setState({ croppedImage: null })
    }

    //تغییر چایلد
    handlerAvatar = (img) => {
        document.getElementById('crop-me-org').style.display = 'block';
        document.getElementById('croped-AVATAR-org').style.display = 'block';
        document.getElementById('croped-COVER-org').style.display = 'none';
        this.setState({
            imageSrc: img
        })
    }
    handlerCover = (img) => {
        document.getElementById('crop-me-org').style.display = 'block';
        document.getElementById('croped-AVATAR-org').style.display = 'none';
        document.getElementById('croped-COVER-org').style.display = 'block';
        this.setState({
            imageSrc: img
        })
    }


    render() {

        const { open } = this.state;

        // اضافه کرد کلاس به  فیلد یوزرنیم
        let usernNameInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.yourUserName !== '') {
            usernNameInputClass.push('greenTextEdit');
        }
        // اضافه کرد کلاس به  فیلد علاقه مندی ها
        let yourIntrestInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.yourIntrest !== '') {
            yourIntrestInputClass.push('greyTextEdit');
        }

        return (
            <Fragment>
                <button onClick={this.onOpenModal} className='btn createOrganizationbtnCm' style={{ fontFamily: 'IRANYekanBold', background: (localStorage.getItem('theme') === 'dark') ? '#000' : 'rgb(13, 106, 18)', color: '#fff', marginTop: 5, direction: 'rtl' }}>
                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'createOrganizationbtnCm-icon-container--dark' : 'createOrganizationbtnCm-icon-container'}`}>
                        <span className='add-new-plus-icon'></span>
                    </div>
                    <span className='createOrganizationbtnCm-txt'>ساخت سازمان</span>
                </button>
                <Modal classNames={{ overlay: 'editMyProfileModal', modal: 'editMyProfileModal-bg', closeButton: 'editMyProfileModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={true} center>
                    <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                        style={{ maxWidth: 745, paddingTop: 0, borderRadius: 10, marginTop: '0%', boxShadow: 'none !important', minHeight: 525, paddingBottom: 20, background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : null }}>

                        <CoverUploader  {...this.props} handler={(img) => { this.handlerCover(img) }} onRef={ref => (this.CoverUploader = ref)} />
                        <AvatarUploader {...this.props} handler={(img) => { this.handlerAvatar(img) }} onRef={ref => (this.AvatarUploader = ref)} />

                        <div className='crop-avatar' id='crop-me-org'>
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
                                <div id='croped-AVATAR-org' className='done-croping-container' onClick={this.showCroppedImageAvatar}>
                                    <span className='done-croping'>تایید آواتار</span>
                                </div>
                                <div id='croped-COVER-org' className='done-croping-container' onClick={this.showCroppedImageCover}>
                                    <span className='done-croping'>تایید کاور</span>
                                </div>
                            </div>
                        </div>

                        <div className="w3-section p-5">
                            <div className="row rtl" >
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold p_inMobile" style={{ color: '#5C5D5B', fontSize: 18 }}>نام سازمان</p>
                                </div>
                                <div className="col-md-6 form-group">
                                    <input value={this.state.orgName} onChange={(e) => this.setState({ orgName: e.target.value })} className={usernNameInputClass.join(' ')} id="your_username" type="text" placeholder="نام سازمان" style={{ fontFamily: 'IRANYekanRegular', color: '#0D6A12' }} />
                                    <div id="error_none_english" className="form-control iranyekanBold" style={{ background: '#FFE8E8', height: 26, border: 0, borderRadius: '0 0 5px 5px !important', color: '#BF0505', fontSize: 12, display: 'none', fontFamily: 'iranyekanBold', textAlign: 'right' }}>نام کاربری را انگلیسی وارد نمایید</div>
                                </div>
                            </div>


                            <div className="row rtl">
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold  p_inMobile" style={{ color: '#5C5D5B', fontSize: 18 }}>توضیحات</p>
                                </div>
                                <div className="col-md-6 form-group">
                                    <input value={this.state.orgDescription} onChange={(e) => this.setState({ orgDescription: e.target.value })} className={yourIntrestInputClass.join(' ')} id="your_intrest" type="text" placeholder="توضیحات سازمان شما" style={{ fontFamily: 'IRANYekanRegular', color: '#0D6A12' }} />
                                </div>

                            </div>
                            <center style={{ direction: 'rtl' }}>
                                {this.state.showThisBtn}
                                <button className="btn sign-btn-focus mobile-modal-btn"
                                    style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }}
                                    type="submit" onClick={this.onCloseModal} id="mobileBtnClick">
                                    بستن
                                </button>
                            </center>
                        </div>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}

// آپلود آواتار
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
        this.props.onRef(this);
    };

    onDrop(picture) {
        let file = picture[picture.length - 1];
        let validateFileExt = /\.(gif|jpg|jpeg|png)$/i;
        if (file) {
            if (validateFileExt.test(file.name)) {
                if (file.size < 5242880) {
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
                            orgAvatar = resizeImg;

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
                    buttonStyles={{ backgroundImage: 'url(/src/icon/uploadImage-png.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 39, height: 39, backgroundColor: 'transparent', backgroundSize: '80%' }}
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
                        marginTop: '-68px',
                        marginRight: '25px',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: (localStorage.getItem('theme') === 'dark') ? '1px solid #00acd8' : '1px solid #D2D2D2',
                    }}
                    fileTypeError="فرمت عکس مورد نظر شما پشتیبانی نمیشود"
                    fileSizeError="سایز عکس شما بیش از اندازه می باشد"

                />
            </React.Fragment>
        );
    }
}

// آپلود کاور
export class CoverUploader extends React.Component {
    static displayName = CoverUploader.name;


    constructor(props) {
        super(props);

        this.state = {
            pictures: [],
            src: ''
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
                if (file.size < 10485761) {
                    getBase64(file, (result) => {
                        let cardBase64 = result;
                        //this.props.handler(cardBase64);
                        let img = document.createElement("img");
                        img.src = cardBase64;
                        let canvas = document.createElement('canvas');
                        setTimeout(function () {
                            resizeImgCover = getResizeImg(img, canvas, '900', '900');
                            this.setState({
                                pictures: this.state.pictures.concat(picture),
                                src: resizeImgCover
                            });
                            orgCoverBg = resizeImgCover;

                        }.bind(this), 1000)
                    });
                } else {
                    toast.error("سایز فایل انتخاب شده بیش از اندازه میباشد.  حداکثر حجم تصویر 10 مگابایت ", { position: toast.POSITION.TOP_CENTER });
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
                    buttonStyles={{ backgroundImage: 'url(/src/icon/uploadImage-png.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 100, height: 100, backgroundColor: 'transparent' }}
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.png', '.jpeg', 'gif']}
                    maxFileSize={20971520}
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
                        height: '200px',

                    }}
                    fileTypeError="فرمت عکس مورد نظر شما پشتیبانی نمیشود"
                    fileSizeError="سایز عکس شما بیش از اندازه می باشد"
                    errorStyle={{ maxWidth: 500, position: 'fixed', top: 0, backgroundColor: 'red' }}

                />
            </React.Fragment>
        );
    }
}


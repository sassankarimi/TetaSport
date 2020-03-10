import React from 'react';
import { NavItem } from 'reactstrap';
import Modal from 'react-responsive-modal';
import '../../../css/site.css';
import ImageUploader from 'react-images-upload';
import { getBase64, getResizeImg } from '../../../jsFunctions/all';
import { toast } from 'react-toastify';
import { handleMSG } from '../../../jsFunctions/all.js';
import IziToast from 'izitoast';
import Hashids from 'hashids';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../jsFunctions/all.js';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';;



// متغییر های سراسری
let hashid = new Hashids('', 7);
let avatar = '';
let cover = '';
let resizeImg = '';
let resizeImgCover = '';

// استایل ها
const btnStyles = {
    'margBottom': '0px !important',
    'margTop': '35px !important',
    'borderClr': '#0D6A12',
    'paddTop': '0px !important'
}

// کامپوننت ویرایش اطلاعات کاربر
export default class EditUserOrgProfileModal extends React.Component {
    static displayName = EditUserOrgProfileModal.name;

    constructor(props) {
        super(props);

        this.state = {
            orgName: '',
            newOrgName: '',
            orgDescription: '',
            newOrgDescription: '',
            open: false,
            selecetChange: false,
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
        let orgID = this.props.children.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        var form = new FormData();
        form.append('OrgID', orgIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0 && localStorage.getItem('exID') !== null && localStorage.getItem('exID') !== '' && localStorage.getItem('exID') !== '0') {
            //توضیحات سازمان
            fetch(`${configPort.TetaSport}${configUrl.GetOrganizationDescription}`, {
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
                    case 400:
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    case 500:
                        return false;
                    default:
                }
            }).then(
                data => {
                    if (data) {
                        if (data.Description && data.Description !== '' && data.Description !== null) {
                            this.setState({
                                orgDescription: data.Description,
                                newOrgDescription: data.Description
                            })
                        }
                    }
                });
            //نام سازمان
            fetch(`${configPort.TetaSport}${configUrl.GetOrganizationName}`, {
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
                    case 400:
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    case 500:
                        return false;
                    default:
                }
            }).then(
                data => {
                    if (data) {
                        if (data.Name && data.Name !== '' && data.Name !== null) {
                            this.setState({
                                orgName: data.Name,
                                newOrgName: data.Name
                            })
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
        let orgID = this.props.children.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        //ارسال داده های جدید دریافتی از کاربر به دیتابیس
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('OrgID', orgIdDecoded);
        form.append('Name', this.state.newOrgName);
        form.append('Description', this.state.newOrgDescription);
        form.append('Avatar', avatar);
        form.append('CoverPhoto', cover);

        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0) {
            if (this.state.newOrgName !== '') {
                if (
                    this.state.newOrgName !== this.state.orgName ||
                    this.state.newOrgDescription !== this.state.orgDescription ||
                    avatar !== '' ||
                    cover !== ''
                ) {

                    fetch(`${configPort.TetaSport}${configUrl.UpdateOrganizationInfo}`, {
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
                                    orgName: this.state.newOrgName,
                                    orgDescription: this.state.newOrgDescription,
                                })
                                document.getElementById('InfoOrgName').innerText = this.state.newOrgName;
                                document.getElementById('InfoOrgDescription').innerText = this.state.newOrgDescription;
                                IziToast.success({
                                    close: false,
                                    closeOnEscape: true,
                                    timeout: 1500,
                                    position: 'center'
                                });
                                if (avatar !== '') {
                                    document.getElementById('orgImgAvatar').style.background = `url(${avatar})`;
                                    document.getElementById('orgImgAvatar').style.backgroundRepeat = 'no-repeat';
                                    document.getElementById('orgImgAvatar').style.backgroundSize = 'cover';
                                    document.getElementById('orgImgAvatar').style.backgroundPosition = 'center';
                                }
                                if (cover !== '') {
                                    document.getElementById('orgBgCover').style.background = `url(${cover})`;
                                    document.getElementById('orgBgCover').style.backgroundRepeat = 'no-repeat';
                                    document.getElementById('orgBgCover').style.backgroundSize = 'cover';
                                    document.getElementById('orgBgCover').style.backgroundPosition = 'center';
                                }
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
                    // بستن مدال پیغام موفقیت آمیز
                    toast.success("! اطلاعات با موفقیت آپدیت شد", { position: toast.POSITION.TOP_CENTER });
                    //بستن مدال باز شده پس از انجام تغییرات
                    this.setState({ open: false });
                }
            } else {
                toast.error("! ورودی ها را به درستی وارد کنید", { position: toast.POSITION.TOP_CENTER });
            }

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

        // اضافه کرد کلاس به  فیلد یوزرنیم
        let usernNameInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.newOrgName !== '') {
            usernNameInputClass.push('greenTextEdit');
        }
        // اضافه کرد کلاس به  فیلد علاقه مندی ها
        let yourIntrestInputClass = ["form-control modal-input-placeholder modal-input-focus"];
        if (this.state.newOrgDescription !== '') {
            yourIntrestInputClass.push('greyTextEdit');
        }

        return (
            <NavItem className={`${localStorage.getItem('theme') === 'dark' ? 'list-group-item--dark list-group-item-hover--dark list-group-item-fontFam--dark' : 'list-group-item-hover list-group-item-fontFam'} list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-hover list-group-item-border-top-and-buttom`}>
                <span id='edit' className='list-group-item-link-padding-display ' onClick={this.onOpenModal} style={{ cursor: 'pointer' }}>ویرایش پروفایل</span>
                <Modal classNames={{ overlay: 'editMyProfileModal', modal: 'editMyProfileModal-bg', closeButton: 'editMyProfileModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={false} center>
                    <div className="w3-modal-content w3-card-4 w3-animate-opacity sc-editOrgProf"
                        style={{ maxWidth: 745, paddingTop: 0, borderRadius: 10, marginTop: '0%', boxShadow: 'none !important', paddingBottom: 20, background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : null }}>

                        <CoverUploader {...this.props} handler={(img) => { this.handlerCover(img) }} onRef={ref => (this.CoverUploader = ref)}  />
                        <AvatarUploader {...this.props} handler={(img) => { this.handlerAvatar(img) }} onRef={ref => (this.AvatarUploader = ref)}  />

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
                                    <p className="font-fam-irsans-bold txl sc-editOrgProf-headers" style={{ color: '#5C5D5B', fontSize: 18 }}>نام سازمان</p>
                                </div>
                                <div className="col-md-6 form-group">
                                    <input defaultValue={this.state.orgName} onChange={(e) => this.setState({ newOrgName: e.target.value })} className={usernNameInputClass.join(' ')} id="org_Name" type="text" placeholder="نام سازمان/انگلیسی وارد شود" style={{ fontFamily: 'IRANYekanRegular', color: '#0D6A12' }} />
                                    <div id="error_none_english" className="form-control iranyekanBold" style={{ background: '#FFE8E8', height: 26, border: 0, borderRadius: '0 0 5px 5px !important', color: '#BF0505', fontSize: 12, display: 'none', fontFamily: 'iranyekanBold', textAlign: 'right' }}>نام کاربری را انگلیسی وارد نمایید</div>
                                </div>
                            </div>


                            <div className="row rtl">
                                <div className="col-md-4" >
                                    <p className="font-fam-irsans-bold txl sc-editOrgProf-headers" style={{ color: '#5C5D5B', fontSize: 18 }}>توضیحات</p>
                                </div>
                                <div className="col-md-6 form-group">
                                    <input defaultValue={this.state.orgDescription} onChange={(e) => this.setState({ newOrgDescription: e.target.value })} className={yourIntrestInputClass.join(' ')} id="org_Description" type="text" placeholder="توضیحات سازمان شما" style={{ fontFamily: 'IRANYekanRegular', color: '#0D6A12' }} />
                                </div>

                            </div>
                            <center style={{ direction: 'rtl' }}>
                                <button className="btn sign-btn-focus mobile-modal-btn"
                                    style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36, marginLeft: 20 }}
                                    type="submit" onClick={this.updateProfile} id="mobileBtnClick">
                                    تایید
                                </button>
                                <button className="btn sign-btn-focus mobile-modal-btn"
                                    style={{ width: 127, background: `${localStorage.getItem('theme') === 'dark' ? '#7289da' : '#0D6A12'}`, color: '#fff', fontFamily: 'iranyekanRegular', marginBottom: btnStyles.margBottom, marginTop: btnStyles.margTop, borderRadius: 5, borderColor: btnStyles.borderClr, fontSize: 19, paddingTop: btnStyles.paddTop, height: 36 }}
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

        this.state = {
            pictures: [],
            src: ''
        };
        this.onDrop = this.onDrop.bind(this);

    }

    componentDidMount() {
        this.props.onRef(this);
        let orgID = this.props.children.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        var form = new FormData();
        form.append('OrgID', orgIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0) {
            fetch(`${configPort.TetaSport}${configUrl.GetOrganizationAvatar}`, {
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
                    case 400:
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    case 500:
                        return false;
                    default:
                }
            }).then(
                data => {
                    if (data) {
                        if (data.Avatar && data.Avatar !== null && data.Avatar !== undefined && data.Avatar !== '') {
                            this.setState({ src: data.Avatar });
                            avatar = data.Avatar;
                        } else {
                            this.setState({ src: '/src/icon/orgProfileDefaultAvatar.png' });
                        }
                    }
                });
        }
    }


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
                    buttonStyles={{ backgroundImage: 'url(' + require('../../../css/assets/icon/smallPencil.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 39, height: 470, backgroundColor: 'transparent', marginTop:0 }}
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
                        border: '3px solid #FFF',
                    }}
                    fileTypeError="فرمت عکس مورد نظر شما پشتیبانی نمیشود"
                    fileSizeError="سایز عکس شما بیش از اندازه می باشد"
                    className='avatar-upload-org'

                />
            </React.Fragment>
        );
    }
}

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
        let orgID = this.props.children.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        var form = new FormData();
        form.append('OrgID', orgIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== 0 && localStorage.getItem('exID') !== null && localStorage.getItem('exID') !== '' && localStorage.getItem('exID') !== '0') {
            fetch(`${configPort.TetaSport}${configUrl.GetOrganizationCoverPhoto}`, {
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
                    case 400:
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    case 500:
                        return false;
                    default:
                }
            }).then(
                data => {
                    if (data) {
                        if (data.CoverPhoto && data.CoverPhoto !== null && data.CoverPhoto !== undefined && data.CoverPhoto !== '') {
                            this.setState({ src: data.CoverPhoto });
                            cover = data.CoverPhoto;
                        } else {
                            this.setState({ src: 'src/backgrounds/orgProfileDefaultBanner.png' });
                        }
                    }
                });
        }
    }

    onDrop(picture) {
        let file = picture[picture.length - 1];
        let validateFileExt = /\.(gif|jpg|jpeg|png)$/i;
        if (file) {
            if (validateFileExt.test(file.name)) {
                if (file.size < 10485761) {
                    getBase64(file, (result) => {
                        let cardBase64 = result;
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
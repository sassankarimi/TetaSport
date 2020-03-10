import React, { Component, Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import { Carousel } from 'react-bootstrap';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { Container } from 'reactstrap';
import { NewTeam } from '../components/user/createTeam/NewTeam';
import ImageUploader from 'react-images-upload';
import { getBase64, getResizeImg } from '../jsFunctions/all';
import { toast } from 'react-toastify';
import { Nav } from 'react-bootstrap';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../jsFunctions/all.js';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';


let avatar = '';
let createTeamBackgroundId = 1;
let resizeImg = '';

export class NewTeamLayout extends Component {
    static displayName = NewTeamLayout.name;

    constructor(props) {
        super(props);
        this.state = {
            coverPhoto: 'src/backgrounds/orgProfileDefaultBanner.png',
            avatar: '',
            /*برای کراپ*/
            imageSrc: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 3,
            croppedAreaPixels: null,
            croppedImage: null,
            //اسلایدر
            index: 0,
            direction: null,
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
            avatar: croppedImage
        })
        avatar = croppedImage;
        this.AvatarUploader.setCroppedImg(croppedImage);
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

    handleSelect = (selectedIndex, e) => {
        this.setState({
            index: selectedIndex,
            direction: e.direction,
            teamCoverPhotoID: selectedIndex + 1
        });
        createTeamBackgroundId = selectedIndex + 1;
    }

    render() {
        const { index, direction } = this.state;
        return (
            <div className='profileBG'>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu بخش */}
                <NavMenuAccount  {...this.props} />
                {/* Banner بخش */}
                <div className='orgBgCover' style={{ width: '100%', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
                    <Carousel
                        activeIndex={index}
                        direction={direction}
                        onSelect={this.handleSelect}
                        interval={null}
                        pauseOnHover={false}
                    >
                        <Carousel.Item>
                            <div className='public-carousel-item-container'>
                                <div id='userBgCover' className='profileBanner' style={{
                                    width: '100%', backgroundImage: `url(/src/backgrounds/teamBgs/teamBg1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center center',
                                }}></div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className='public-carousel-item-container'>
                                <div id='userBgCover' className='profileBanner' style={{
                                    width: '100%', backgroundImage: `url(/src/backgrounds/teamBgs/teamBg2.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center center',
                                }}></div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className='public-carousel-item-container'>
                                <div id='userBgCover' className='profileBanner' style={{
                                    width: '100%', backgroundImage: `url(/src/backgrounds/teamBgs/teamBg3.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center center',
                                }}></div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className='public-carousel-item-container'>
                                <div id='userBgCover' className='profileBanner' style={{
                                    width: '100%', backgroundImage: `url(/src/backgrounds/teamBgs/teamBg4.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center center',
                                }}></div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
                {/* content بخش */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'profile-footer--dark' : 'profile-footer'}`}>
                    {/* profile Avatar بخش */}
                    <Fragment>
                        <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileInfo-createTeam--dark' : 'profileInfo-createTeam'}`} style={{ width: '100%' }}>
                            <AvatarUploader   {...this.props} handler={(img) => { this.handlerAvatar(img) }} onRef={ref => (this.AvatarUploader = ref)} />
                        </div>
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
                                <div id='croped-AVATAR' className='done-croping-container-new' onClick={this.showCroppedImageAvatar}>
                                    <span className='done-croping'>تایید آواتار</span>
                                </div>
                                <div id='croped-COVER' className='done-croping-container-new' onClick={this.showCroppedImageCover}>
                                    <span className='done-croping'>تایید کاور</span>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                    <Container>
                        <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent--dark' : 'profileContent'}`} id='create-team-profile-content' style={{ height: 500 }}>
                            <div className='row w-100'>
                                <div className='col-md-3'>
                                    {/* Categories بخش */}
                                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent-right--dark' : 'profileContent-right'}`}>
                                        <div className='profileContent-right-border-left orgProfileContent-right-padding-top' id='categoryItems'>
                                            <Nav className="list-group list-group-padingRight-Customize" style={{ paddingRight: '5%', paddingLeft: '5%', paddingTop: 55 }}>
                                                <div className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom fake-item-category'>
                                                    <span className='list-group-item-link-padding-display'>لیست بازیکنان تیم</span>
                                                </div>
                                                <div className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom fake-item-category'>
                                                    <span className='list-group-item-link-padding-display'>ویرایش بازیکن</span>
                                                </div>
                                                <div className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom fake-item-category'>
                                                    <span className='list-group-item-link-padding-display'>لیگ های تیم</span>
                                                </div>
                                                <div className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom fake-item-category'>
                                                    <span className='list-group-item-link-padding-display'>درباره تیم</span>
                                                </div>
                                                <div className='list-group-item list-group-item-no-border list-group-item-no-padding list-group-item-fontFam list-group-item-hover list-group-item-border-top-and-buttom fake-item-category'>
                                                    <span id='edit' className='list-group-item-link-padding-display '>ویرایش پروفایل تیم</span>
                                                </div>
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                            </Nav>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-9 overflow-left-content' id='mayScrollSomeTimes'>
                                    <div className='profileContent-left' id='contentItems'>
                                        <NewTeam Avatar={avatar} CoverPhoto={createTeamBackgroundId} {...this.props} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}


export class AvatarUploader extends React.Component {
    static displayName = AvatarUploader.name;

    constructor(props) {
        super(props);

        this.state = {
            pictures: [],
            src: '/src/icon/add-team-avatar-createTeam.png'
        };
        this.onDrop = this.onDrop.bind(this);

    }

    componentDidMount() {
        this.props.onRef(this);
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
                    buttonStyles={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 200, height: 200, backgroundColor: 'transparent', marginTop: '-15px',marginBottom:0 }}
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
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        marginTop: '-95px',
                        marginRight: '90px',
                        boxShadow: 'none',
                        padding:'0px'
                    }}
                    fileTypeError="فرمت عکس مورد نظر شما پشتیبانی نمیشود"
                    fileSizeError="سایز عکس شما بیش از اندازه می باشد"
                    className='avatar-upload-org'
                    id='orgImgAvatar'

                />
            </React.Fragment>
        );
    }
}



import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import Hashids from 'hashids';
import IziToast from 'izitoast';
import { handleMSG } from '../../../jsFunctions/all.js';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {
    TwitterShareButton,
    TelegramShareButton,
    FacebookShareButton,
} from 'react-share';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);


export class LeagueProfileLeagueGallery extends Component {
    static displayName = LeagueProfileLeagueGallery.name;

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            hasMore: true,
            isLoading: false,
            imagesIDs: [],
            images: [],
            msg: '',
            photoIndex: 0,
            isOpen: false,
            isLeagueAdmin: false,
            isShareOpen: false,
            hasAnyImg: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        };
        localStorage.setItem('league-gallery', '[]');

    }

    componentDidMount() {
        //آیا ادمین لیگ است
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueID', leagueIdDecoded);
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== '' && localStorage.getItem('exID') !== null && localStorage.getItem('exID') !== undefined) {
            fetch(`${configPort.TetaSport}${configUrl.IsLeagueAdmin}`, {
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
            }).then(data => {
                if (data) {
                    if (data.Result === 'True') {
                        this.setState({
                            isLeagueAdmin: true,
                        })
                    } else {
                        this.setState({
                            isLeagueAdmin: false,
                        })
                    }
                }
            });

        } else {
            this.setState({
                isLeagueAdmin: false,
            })
        }


        // دریافت تمامی عکس ها
        form.append('EntityID', leagueIdDecoded);
        form.append('EntityCode', 1);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetEntityPicIDs}`, {
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
                case 210:
                    return response.json();
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    handleMSG(code, response.json());
                    return false;

            }
        }).then(data => {
            if (data) {
                if (data.MSG210) {
                    this.setState({
                        hasAnyImg: 'چیزی برای نمایش موجود نیست',
                    });
                } else {
                    if (data.MSG) {
                        this.setState({
                            msg: data.MSG,
                            hasAnyImg: null,
                        });
                    } else {
                        if (data.Pics) {
                            if (data.Pics.length !== 0) {
                                this.setState({
                                    imagesIDs: data.Pics,
                                    hasAnyImg: null,
                                });
                                localStorage.setItem('league-gallery', JSON.stringify(data.Pics.map(image => (image.PicID))));

                                this.loadImagesForFirstTime();

                                let Iarr = JSON.parse(localStorage.getItem('league-gallery'));
                                if (Iarr.length === 0) {
                                    this.setState({ isLoading: false })
                                }

                                let empty = [];
                                if (Iarr.length !== 0) {
                                    if (Iarr.length > 10) {
                                        Iarr.splice(0, 10);
                                        localStorage.setItem('league-gallery', JSON.stringify(Iarr));
                                    } else {
                                        localStorage.setItem('league-gallery', JSON.stringify(empty));
                                    }
                                }
                            } else {
                                this.setState({
                                    hasAnyImg: 'چیزی برای نمایش موجود نیست',
                                });
                            }
                        } else {
                            this.setState({
                                hasAnyImg: 'چیزی برای نمایش موجود نیست',
                            });
                        }
                    }
                }


            }
        });

        window.addEventListener("scroll", this.handleScroll);

    }


    handleScroll = () => {
        if (localStorage.getItem('league-gallery') && localStorage.getItem('league-gallery') !== '[]') {
            const {
                loadImages,
                state: {
                    error,
                    isLoading,
                    hasMore,
                },
            } = this;
            // بررسی ارور
            if (error || isLoading || !hasMore) return;
            // اسکرول رسیده به انتها
            const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            const body = document.body;
            const html = document.documentElement;
            const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            const windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight) {

                let Iarr = JSON.parse(localStorage.getItem('league-gallery'));
                if (Iarr.length === 0) {
                    this.setState({ isLoading: false })
                }
                if (localStorage.getItem('league-gallery') && Iarr.length !== 0) {
                    loadImages();

                    let empty = [];
                    if (Iarr.length !== 0) {
                        if (Iarr.length > 10) {
                            Iarr.splice(0, 10);
                            localStorage.setItem('league-gallery', JSON.stringify(Iarr));
                        } else {
                            localStorage.setItem('league-gallery', JSON.stringify(empty));
                        }
                    }
                }

            }
        }
    }

    loadImagesForFirstTime = () => {
        let form = new FormData();
        let imgIdArray = JSON.parse(localStorage.getItem('league-gallery'));

        for (let i = 0; i < 10; i++) {
            form.append('IDs[]', imgIdArray[i]);
        }
        form.append('UserID', localStorage.getItem('exID'));
        this.setState({ isLoading: true }, () => {
            fetch(`${configPort.TetaSport}${configUrl.RequestEntityPicsByIDs}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                },
                body: form
            }
            ).then((results) => {
                let code = results.status;
                switch (code) {
                    case 200:
                        return results.json();
                    case 400:
                        this.setState({ image: [], isLoading: false, hasAnyImg: null, })
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props, hasAnyImg: null, });
                        return false;
                    case 500:
                        this.setState({ image: [], isLoading: false, hasAnyImg: null, })
                        return false;
                    default:
                        this.setState({ image: [], isLoading: false, hasAnyImg: null, })
                        return false;
                }
            }).then(data => {
                if (data) {
                    const nextImages = data.Pics
                    this.setState({
                        hasMore: true,
                        isLoading: false,
                        images: [
                            ...this.state.images,
                            ...nextImages,
                        ],
                        hasAnyImg: null,
                    });
                }
            })
        });
    }

    // نگه داشتن عکس های قبلی اگر در اسکرول دوم یا بیشتر نتیجه ای دریافت نشد
    loadImages = () => {
        let form = new FormData();
        let imgIdArray = JSON.parse(localStorage.getItem('league-gallery'));
        for (let i = 0; i < 10; i++) {
            form.append('IDs[]', imgIdArray[i]);
        }
        form.append('UserID', localStorage.getItem('exID'));
        this.setState({ isLoading: true }, () => {
            fetch(`${configPort.TetaSport}${configUrl.RequestEntityPicsByIDs}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                },
                body: form
            }
            ).then((results) => {
                let code = results.status;
                switch (code) {
                    case 200:
                        return results.json();
                    case 400:
                        this.setState({ isLoading: false, hasAnyImg: null, })
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    case 500:
                        this.setState({ isLoading: false, hasAnyImg: null, })
                        return false;
                    default:
                }
            }).then(data => {
                if (data) {
                    const nextImages = data.Pics
                    this.setState({
                        hasMore: true,
                        isLoading: false,
                        images: [
                            ...this.state.images,
                            ...nextImages,
                        ],
                        hasAnyImg: null,
                    });
                }
            })
        });
    }

    removeThisImage = (picId) => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('ID', picId);
        fetch(`${configPort.TetaSport}${configUrl.RemoveEntityGalleryPic}`, {
            method: 'DELETE',
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
                    let obj = []
                    obj = this.state.images.filter((img) => {
                        return (
                            img.PicID !== picId
                        )
                    })

                    this.setState({
                        images: obj
                    })
                }
            });
    }


    ComingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
    }

    showShareBtns = (picID) => {
        let elOpacity = document.getElementById(picID).style.opacity;
        if (elOpacity !== '1') {
            document.getElementById(picID).style.zIndex = '100';
            document.getElementById(picID).style.opacity = '1';
        } else {
            document.getElementById(picID).style.zIndex = '-1';
            document.getElementById(picID).style.opacity = '0';
        }
    }

    render() {
        const {
            error,
            hasMore,
            isLoading,
            photoIndex,
            isOpen
        } = this.state;

        let images = this.state.images;
        if (images.length !== 0) {
            return (
                <div className='leagueProfileContent-center-container-leagueGallery'>
                    <div className='leagueProfile-galleryContainer'>
                        <div className='row'>
                            {
                                images.map((image, index) => {

                                    let img = image.PicBase64;
                                    return (
                                        <Fragment key={index}>
                                            <div className='leagueProfile-singleGalleryContainer m-1' style={{ width: 300, height: 210 }}>
                                                <img style={{ cursor: 'pointer' }} src={img} alt='گالری' onClick={() => this.setState({ isOpen: true, photoIndex: index })} />
                                                {
                                                    this.state.isLeagueAdmin &&
                                                    <div className='orgProfileContent-UI-gallery-delete-this-item-container' onClick={() => { this.removeThisImage(image.PicID) }}></div>
                                                }
                                                <span className='leagueProfile-picShareIcon' onClick={() => { this.showShareBtns(`share${index}`) }}></span>
                                                <div className='leagueProfile-picShare-container' id={`share${index}`}>
                                                    <TelegramShareButton url={image.PicBase64}>
                                                        <span className='shareLeagueIcon' style={{ background: `url('/src/icon/leagueTelegramShare.png')` }} title='تلگرام'></span>
                                                    </TelegramShareButton>
                                                    <TwitterShareButton url={image.PicBase64}>
                                                        <span className='shareLeagueIcon' style={{ background: `url('/src/icon/leagueTwShare.png')` }} title='تویتر'></span>
                                                    </TwitterShareButton>
                                                    <FacebookShareButton url={image.PicBase64}>
                                                        <span className='shareLeagueIcon' style={{ background: `url('/src/icon/social-fb.png')` }} title='فیسبوک'></span>
                                                    </FacebookShareButton>
                                                </div>

                                            </div>
                                        </Fragment>
                                    )

                                }

                                )

                            }

                            {isOpen && (
                                <Lightbox
                                    mainSrc={images[photoIndex].PicBase64}
                                    nextSrc={images[(photoIndex + 1) % images.length].PicBase64}
                                    prevSrc={images[(photoIndex + images.length - 1) % images.length].PicBase64}
                                    onCloseRequest={() => this.setState({ isOpen: false })}
                                    onMovePrevRequest={() =>
                                        this.setState({
                                            photoIndex: (photoIndex + images.length - 1) % images.length,
                                        })
                                    }
                                    onMoveNextRequest={() =>
                                        this.setState({
                                            photoIndex: (photoIndex + 1) % images.length,
                                        })
                                    }
                                />
                            )}
                        </div>


                        <hr />
                        {error &&
                            <div style={{ color: '#900' }}>
                                {error}
                            </div>
                        }
                        {isLoading &&
                            <div style={{ direction: 'rtl', fontFamily: 'iranyekanRegular', fontSize: 20, color: (localStorage.getItem('theme') === 'dark') ? '#fff' : null }}>در حال بارگذاری تصاویر...</div>
                        }
                        {!hasMore &&
                            <div style={{ direction: 'rtl' }}>You did it! You reached the end!</div>
                        }
                    </div>
                </div>
            );
        } else {
            return (
                <div className='leagueProfileContent-center-container-leagueGallery'>
                    <div className='leagueProfile-galleryContainer'>
                        <div className='row'>
                            <div className='col-md-12' style={{ fontFamily: 'iranYekanBold', paddingTop: 20, textAlign: 'center', color: (localStorage.getItem('theme') === 'dark') ? '#fff' : null }}>
                                {this.state.hasAnyImg}
                            </div>

                            <hr />
                            {error &&
                                <div style={{ color: '#900' }}>
                                    {error}
                                </div>
                            }
                            {isLoading &&
                                <div style={{ direction: 'rtl', fontFamily: 'iranyekanRegular', fontSize: 20, color: (localStorage.getItem('theme') === 'dark') ? '#fff' : null }}>در حال بارگذاری تصاویر...</div>
                            }
                            {!hasMore &&
                                <div style={{ direction: 'rtl' }}>You did it! You reached the end!</div>
                            }
                        </div>
                    </div>
                </div>
            );
        }

    }
}

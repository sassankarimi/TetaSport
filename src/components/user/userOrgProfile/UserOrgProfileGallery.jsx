import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { handleMSG } from '../../../jsFunctions/all.js';
import IziToast from 'izitoast';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';


// متغییر هایسراسری
let hashid = new Hashids('', 7);

export class UserOrgProfileGallery extends Component {
    static displayName = UserOrgProfileGallery.name;

    constructor(props) {
        super(props)
        this.state = {
            error: false,
            hasMore: true,
            isLoading: false,
            imgs: [],
            imgIDs: [],
            msg: '',
            photoIndex: 0,
            isOpen: false,
            hasAnyImg: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
    }

    componentDidMount() {
        let orgID = this.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        let form = new FormData();
        form.append('EntityID', orgIdDecoded);
        form.append('EntityCode', 2);
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
                    return response.json();
                case 210:
                    this.setState({
                        hasAnyImg: 'چیزی برای نمایش موجود نیست',
                    });
                    break;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    this.setState({
                        hasAnyImg: null,
                    });
                    handleMSG(code, response.json());
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Pics) {
                        if (data.Pics.length !== 0) {
                            this.setState({
                                imgIDs: data.Pics,
                                hasAnyImg: null,
                            });

                            this.loadImageForFirstTime();

                            let Iarr = this.state.imgIDs;
                            let empty = [];
                            if (Iarr.length === 0) {
                                this.setState({ isLoading: false })
                            }
                            if (Iarr.length !== 0) {
                                if (Iarr.length > 10) {
                                    Iarr.splice(0, 10);
                                    this.setState({ imgIDs: Iarr });
                                } else {
                                    this.setState({
                                        imgIDs: empty
                                    })
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
            });

        window.document.getElementById('mayScrollSomeTimes').onscroll = () => {
            const {
                loadImage,
                state: {
                    error,
                    isLoading,
                    hasMore,
                },
            } = this;
            // بررسی خطا
            if (error || isLoading || !hasMore) return;
            let el = document.getElementById('mayScrollSomeTimes');
            if (el.scrollHeight - el.scrollTop === el.clientHeight) {
                let Iarr = this.state.imgIDs;
                if (Iarr.length === 0) {
                    this.setState({ isLoading: false })
                }
                if (Iarr && Iarr.length !== 0) {
                    loadImage();
                    let empty = [];
                    if (Iarr.length !== 0) {
                        if (Iarr.length > 10) {
                            Iarr.splice(0, 10);
                            this.setState({
                                imgIDs: Iarr
                            })
                        } else {
                            this.setState({
                                imgIDs: empty
                            })
                        }
                    }
                }
            }
        }
    }

    loadImageForFirstTime = () => {
        let form = new FormData();
        let imgIdArray = this.state.imgIDs;
        for (let i = 0; i < 10; i++) {
            if (imgIdArray[i] !== '' && imgIdArray[i] !== null && imgIdArray[i] !== undefined) {
                form.append('IDs[]', imgIdArray[i].PicID);
            }
        }
        this.setState({ isLoading: true }, () => {
            form.append('UserID', localStorage.getItem('exID'));
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
                        this.setState({ imgs: [], isLoading: false })
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    case 500:
                        this.setState({ imgs: [], isLoading: false })
                        return false;
                    default:
                }
            }).then(data => {
                if (data) {
                    const nextImages = data.Pics
                    this.setState({
                        hasMore: true,
                        isLoading: false,
                        imgs: [
                            ...this.state.imgs,
                            ...nextImages,
                        ],
                    });
                }
            })
        });
    }

    loadImage = () => {
        let form = new FormData();
        let imgIdArray = this.state.imgIDs;
        for (let i = 0; i < 10; i++) {
            if (imgIdArray[i] !== '' && imgIdArray[i] !== null && imgIdArray[i] !== undefined) {
                form.append('IDs[]', imgIdArray[i].PicID);
            }
        }
        this.setState({ isLoading: true }, () => {
            form.append('UserID', localStorage.getItem('exID'));
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
                        this.setState({ isLoading: false })
                        return false;
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    case 500:
                        this.setState({ isLoading: false })
                        return false;
                    default:
                }
            }).then(data => {
                if (data) {
                    const nextImages = data.Pics
                    this.setState({
                        hasMore: true,
                        isLoading: false,
                        imgs: [
                            ...this.state.imgs,
                            ...nextImages,
                        ],
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
                    obj = this.state.imgs.filter((img) => {
                        return (
                            img.PicID !== picId
                        )
                    })

                    this.setState({
                        imgs: obj
                    })
                }
            });
    }

    render() {
        const { imgs,
            error,
            hasMore,
            isLoading,
            photoIndex,
            isOpen
        } = this.state;
        if (imgs.length !== 0) {
            return (
                <Fragment>
                    <div className='orgProfileContent-UI-container'>
                        <div className='row'>
                            {
                                (imgs.length)
                                    ?
                                    imgs.map((img, i) => {
                                        return (
                                            <Fragment key={i}>
                                                <div className='col-md-4'>
                                                    <div className='orgProfileContent-UI-gallery-LeftSide-items-single-container'>
                                                        <img className='orgProfileContent-UI-gallery-LeftSide-items-img' src={`${img.PicBase64}`} alt='tetasport organization gallery' style={{ cursor: 'pointer' }} onClick={() => this.setState({ isOpen: true, photoIndex: i })} />
                                                        <div className='orgProfileContent-UI-gallery-delete-this-item-container' onClick={() => { this.removeThisImage(img.PicID) }}></div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                    :
                                    null

                            }
                            {isOpen && (
                                <Lightbox
                                    mainSrc={imgs[photoIndex].PicBase64}
                                    nextSrc={imgs[(photoIndex + 1) % imgs.length].PicBase64}
                                    prevSrc={imgs[(photoIndex + imgs.length - 1) % imgs.length].PicBase64}
                                    onCloseRequest={() => this.setState({ isOpen: false })}
                                    onMovePrevRequest={() =>
                                        this.setState({
                                            photoIndex: (photoIndex + imgs.length - 1) % imgs.length,
                                        })
                                    }
                                    onMoveNextRequest={() =>
                                        this.setState({
                                            photoIndex: (photoIndex + 1) % imgs.length,
                                        })
                                    }
                                />
                            )}

                        </div>

                        <div className='row'>
                            <hr />
                            {error &&
                                <div style={{ color: '#900' }}>
                                    {error}
                                </div>
                            }
                            {isLoading &&
                                <div style={{ direction: 'rtl', fontFamily: 'iranyekanRegular', fontSize: 20 }}>در حال بارگذاری تصاویر...</div>
                            }
                            {!hasMore &&
                                <div style={{ direction: 'rtl' }}>You did it! You reached the end!</div>
                            }
                        </div>
                    </div>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <div className='orgProfileContent-UI-container'>
                        <div className={`${localStorage.getItem('theme') === 'dark' ? 'what-result-org-img--dark' : 'what-result-org-img'}`}>
                            {this.state.hasAnyImg}
                        </div>
                    </div>
                </Fragment>
            )
        }

    }
}

import React, { Component, Fragment } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import 'dropzone/dist/min/dropzone.min.css';
import { getBase64, handleMSG, getResizeImg } from '../../../jsFunctions/all.js';
import IziToast from 'izitoast';
import Hashids from 'hashids';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';


// متغییر های سراسری
let hashid = new Hashids('', 7);

var componentConfig = { postUrl: 'no-url' };
var djsConfig = {
    autoProcessQueue: false,
    addRemoveLinks: true,
    maxFilesize: 1,
    acceptedFiles: ".jpg,.jpeg,.png"
}

var myDropzone;
let resizeImg = '';

function initCallback(dropzone) {
    myDropzone = dropzone;
}


export class LeagueProfileMediaUpload extends Component {
    static displayName = LeagueProfileMediaUpload.name;

    constructor(props) {
        super(props)
        this.state = {
            photos: [],
            view: [],
            AparatInputLinks: [],
            Aparatlinks: [],
        }
    }

    componentDidMount() {
        let leagueId = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueId);
        let form = new FormData();
        form.append('EntityID', leagueIdDecoded);
        form.append('EntityCode', 1);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetEntityVideoLinks}`, {
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
                    this.setState({
                        Aparatlinks: [data]
                    });
                }
            });
    }

    pushInArray = (file) => {
        let regex = /image/g;
        this.setState({
            view: [...this.state.view, file]
        })
        if (file.size < 1000000 && regex.test(file.type)) {
            getBase64(file, (result) => {
                let fileToBase64 = result;
                //کاهش حجم عکس
                let img = document.createElement("img");
                img.src = fileToBase64;
                let canvas = document.createElement('canvas');
                setTimeout(function () {
                    resizeImg = getResizeImg(img, canvas, '900', '900');
                    this.setState({
                        photos: [...this.state.photos, resizeImg]
                    })

                }.bind(this), 1000)
            })
        }
    }

    removeFromArray = (file) => {
        getBase64(file, (result) => {
            let fileToBase64 = result;
            let obj = []
            obj = this.state.photos.filter((f) => {
                return (
                    f !== fileToBase64
                )
            })

            this.setState({
                photos: obj
            })
        })
    }

    //اینپوت های داینامیک
    addInputs() {
        return this.state.AparatInputLinks.map((el, i) =>
            <div key={i} style={{ position: 'relative', paddingTop: 7 }}>
                <input type="text" value={el || ''} onChange={this.handleChange.bind(this, i)} className={`${localStorage.getItem('theme') === 'dark' ? 'createLeague-leagueInputs--dark' : 'createLeague-leagueInputs'} createLeague-leagueName form-control`} placeholder='لینک آپارات' />
                <input type='button' className='createLeagueRemoveInput' onClick={this.removeClick.bind(this, i)} />
            </div>
        )
    }

    handleChange(i, event) {
        let AparatInputLinks = [...this.state.AparatInputLinks];
        AparatInputLinks[i] = event.target.value;
        this.setState({ AparatInputLinks });
    }

    addClick() {
        this.setState(prevState => ({ AparatInputLinks: [...prevState.AparatInputLinks, ''] }));

    }

    removeClick(i) {
        let AparatInputLinks = [...this.state.AparatInputLinks];
        AparatInputLinks.splice(i, 1);
        this.setState({ AparatInputLinks });
    }

    handlePhotos = () => {
        let leagueId = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueId);
        let lenPhotos = this.state.photos.length;
        if (lenPhotos !== 0) {
            let form = new FormData();
            form.append('UserID', localStorage.getItem('exID'));
            form.append('EntityID', leagueIdDecoded);
            form.append('EntityCode', 1);
            for (let i = 0; i < lenPhotos; i++) {
                if (this.state.photos[i] !== '') {
                    form.append('pics[]', this.state.photos[i]);

                }
            }
            fetch(`${configPort.TetaSport}${configUrl.UploadPicsForEntity}`, {
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
                        myDropzone.removeAllFiles();
                        break;
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
            })
        }
    }



    handleVideoLink = () => {
        let leagueId = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueId);
        let lenLinks = this.state.AparatInputLinks.length;
        if (lenLinks !== 0) {
            let form = new FormData();
            form.append('UserID', localStorage.getItem('exID'));
            form.append('EntityID', leagueIdDecoded);
            form.append('EntityCode', 1);
            for (let i = 0; i < lenLinks; i++) {
                if (this.state.AparatInputLinks[i] !== '') {
                    form.append('Links[]', this.state.AparatInputLinks[i]);

                }
            }
            fetch(`${configPort.TetaSport}${configUrl.UploadVideoLinksForEntity}`, {
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
                        return response.json();
                    case 210:
                        return false;
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
                        let aparatLinkArr = this.state.Aparatlinks;
                        //بار اول که آرایه خالیست کلید ویدیو نداریم
                        if (aparatLinkArr.length === 0 || aparatLinkArr === undefined) {
                            aparatLinkArr = [{ "Videos": [] }];
                        }
                        for (let i = 0; i < data.Videos.length; i++) {
                            aparatLinkArr[0].Videos.unshift(data.Videos[i]);
                            this.setState({
                                Aparatlinks: aparatLinkArr,
                                AparatInputLinks: []
                            });
                        }
                    }
                });
        }
    }

    RemoveVideoLink = (ID) => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('ID', ID);
        fetch(`${configPort.TetaSport}${configUrl.RemoveEntityGalleryVideo}`, {
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

                    let links = this.state.Aparatlinks[0].Videos;
                    let filtered = links.filter((Link) => {
                        return (
                            Link.ID !== ID
                        )
                    })
                    let obj = { 'Videos': filtered };
                    this.setState({
                        Aparatlinks: [obj]
                    })
                }
            });

    }

    render() {
        const { Aparatlinks } = this.state;
        for (let i = 0; i < document.querySelectorAll('.dz-error-message').length; i++) {
            document.querySelectorAll('.dz-error-message')[i].innerHTML = "  فرمت یا سایز تصویر قابل قبول نیست. (فرمت قابل قبول jpg,jpeg,png و حداکثر سایز 5 مگابایت)";
            document.querySelectorAll('.dz-error-message')[i].style.fontFamily = "iranyekanBold";
            document.querySelectorAll('.dz-error-message')[i].style.color = "#fff";
        }
        for (let i = 0; i < document.querySelectorAll('.dz-remove').length; i++) {
            document.querySelectorAll('.dz-remove')[i].style.fontFamily = "iranyekanBold";
            document.querySelectorAll('.dz-remove')[i].style.color = "crimson";
            document.querySelectorAll('.dz-remove')[i].innerHTML = "حذف فایل";
        }

        return (
            <Fragment>
                <div className='userOrg-media-container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            {/*dropzone*/}
                            <DropzoneComponent config={componentConfig}
                                eventHandlers={{
                                    addedfile: (file) => this.pushInArray(file),
                                    removedfile: (file) => this.removeFromArray(file),
                                    init: (dropzone) => initCallback(dropzone),
                                }}
                                djsConfig={djsConfig} />

                            <button type="button" className={`${localStorage.getItem('theme') === 'dark' ? 'userOrg-media-btn--dark' : 'userOrg-media-btn'}`} onClick={this.handlePhotos}>ثبت عکس</button>
                            <div className='col-12' style={{ padding: '40px 70px 10px 70px' }}>
                                {/* افزودن لینک آپارات*/}
                                <label style={{ fontFamily: 'iranyekanBold', color: (localStorage.getItem('theme') === 'dark') ? '#fff' : '#5C5D5B', fontSize: 15 }}>لینک های آپارات</label>
                                {this.addInputs()}
                                <div className='col-12' style={{ padding: '7px 0px 7px' }}>
                                    <input readOnly style={{ cursor: 'pointer' }} type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'Input-StyledInputs--dark' : 'Input-StyledInputs'} Input-AddNewInput form-control`} placeholder='افزودن لینک آپارات' onClick={this.addClick.bind(this)} />
                                </div>
                            </div>
                            <button type="button" className={`${localStorage.getItem('theme') === 'dark' ? 'userOrg-media-btn--dark' : 'userOrg-media-btn'} userOrg-media-video-btn`} onClick={this.handleVideoLink} >ثبت ویدیو</button>
                            <div className='userOrg-media-spliter'></div>
                            <div className='userOrg-media-uploaded-videos-link-container pb-4'>

                                {
                                    (Aparatlinks.length !== 0) ?
                                        Aparatlinks[0].Videos.map((l, index) => {

                                            return (
                                                <Fragment key={index}>
                                                    <div style={{ textAlign: "left" }} className="whitebg custom-control custom-radio  my-2 py-1">
                                                        <span title="حذف لینک" className='userOrg-media-uploaded-videos-link-removeItem' onClick={() => { this.RemoveVideoLink(l.ID) }}></span>
                                                        <span className='userOrg-media-uploaded-videos-link-txt'>{l.Link}</span>

                                                    </div>
                                                </Fragment>
                                            )
                                        })
                                        :
                                        null
                                }

                            </div>
                        </div>
                    </div>
                </div>

            </Fragment>
        )
    }

}

import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { handleMSG } from '../../../jsFunctions/all.js';
import IziToast from 'izitoast';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);
export class UserOrgProfileVideos extends Component {
    static displayName = UserOrgProfileVideos.name;
    constructor(props) {
        super(props)
        this.state = {
            Aparatlinks: [],
            hasAnyVid: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
    }
    componentDidMount() {
        let orgID = this.props.match.params.orgId;
        let orgIdDecoded = hashid.decode(orgID);
        let form = new FormData();
        form.append('EntityID', orgIdDecoded);
        form.append('EntityCode', 2);
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
                    this.setState({
                        hasAnyVid: 'چیزی برای نمایش موجود نیست',
                    });
                    break;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                default:
                    this.setState({
                        hasAnyVid: null,
                    });
                    handleMSG(code, response.json());
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({
                        Aparatlinks: [data],
                        hasAnyVid: null,
                    });
                } 
            });
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
                    Logout({ ...this.props }) 
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
        if (Aparatlinks.length !== 0) {
            return (
                <Fragment>
                    <div className="row pb-4">
                        {
                            (Aparatlinks.length !== 0) ?
                                Aparatlinks[0].Videos.map((l, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <div className='col-md-6'>
                                                <span title="حذف ویدیو" className="videos-removeItem" onClick={() => { this.RemoveVideoLink(l.ID) }} >&#215;</span>
                                                <div className="h_iframe-aparat_embed_frame">
                                                    <iframe title={l.Key} src={` https://www.aparat.com/video/video/embed/videohash/${l.Key}/vt/frame `} allowFullScreen={true}></iframe>
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                })
                                :
                                null
                        }
                    </div>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <div className="row pb-4">
                        <div className='col-md-12'>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'pub-org-vid--dark' : 'pub-org-vid'}`}>
                                {this.state.hasAnyVid}
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }
        
    }
}

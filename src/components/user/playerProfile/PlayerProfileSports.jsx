import React, { Component, Fragment } from 'react';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';
// متغییر های سراسری
let urlUsername = '';
let urlArray = [];

export default class PlayerProfileSports extends Component {
    static displayName = PlayerProfileSports.name;
    constructor(props) {
        super(props)
        this.state = {
            favSports: true,
            Sports: '',
            favSportsLoading: 'چیزی برای نمایش یافت نشد',
            aboutMe: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
        //Url پیمایش
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            urlArray.push(splitStr[i]);
        }
        switch (urlArray.length) {
            case 3:
                if (splitStr[3] !== '') {
                    urlUsername = splitStr[3];
                }
                break;
            case 4:
                if (splitStr[3] !== '') {
                    urlUsername = splitStr[3];
                }
                break;
            default:
        }
    }

    componentDidMount() {
        let form = new FormData();
        form.append('Username', urlUsername);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.IsTetaSportUser}`, {
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
                    return false;
                default:
                    return false;
            }
        }).then(data => {
            if (data) {
                let form2 = new FormData();
                form2.append('PlayerID', data.UserID);
                form2.append('UserID', localStorage.getItem('exID'));
                form2.append('MyProfile', false);
                fetch(`${configPort.TetaSport}${configUrl.GetUserProfileItems}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('Token')
                    },
                    body: form2
                }).then(response => {
                    let code = response.status;
                    switch (code) {
                        case 200:
                            return response.json();
                        case 401:
                            return false;
                        case 420:
                            return false;
                        default:
                            return false;
                    }
                    }).then(data => {
                        if (data) {
                            if (data.AboutMe !== '' && data.AboutMe !== null && data.AboutMe !== undefined) {
                                this.setState({
                                    aboutMe: data.AboutMe,
                                })
                            } else {
                                this.setState({
                                    aboutMe: 'چیزی برای نمایش یافت نشد',
                                })
                            }

                        }
                })
            }
        })
    }

    render() {
        if (localStorage.getItem('about') && localStorage.getItem('about') !== null && localStorage.getItem('about') !== undefined && localStorage.getItem('about') !== 'null' && localStorage.getItem('about') !== 'undefined') {
            return (
                <Fragment>
                    <div className='profileContent-left-container-favSports'>
                        <h4 className='profileContent-left-fontFam-favSports'>درباره من</h4>
                        <div className='row sportsIcon-Row' style={{ background: '#EFF5F5' }}>
                            <div className='aboutMe-style'>
                                {
                                    this.state.aboutMe
                                }
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <div className='profileContent-left-container'>
                        <h4 className='profileContent-left-fontFam'>
                            {this.state.favSportsLoading}
                        </h4>
                    </div>
                </Fragment>
            )
        }
    }
}
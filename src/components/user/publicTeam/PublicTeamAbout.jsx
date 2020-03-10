import React, { Component, Fragment } from 'react';
import { LogoutSoft } from '../logout/UserLogout';
import Hashids from 'hashids';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

export class PublicTeamAbout extends Component {
    static displayName = PublicTeamAbout.name;

    constructor(props) {
        super(props);
        this.state = {
            teamDesc: '',
            isTeamAdmin: false,
            hasAbout: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
    }

    componentDidMount() {
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetTeamDescription}`, {
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
                    this.setState({ teamDesc: '', hasAbout: null });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.TeamDescription && data.TeamDescription !== '' && data.TeamDescription !== null) {
                        this.setState({ teamDesc: data.TeamDescription, hasAbout: null });
                    } else {
                        this.setState({ teamDesc: '', hasAbout: 'چیزی برای نمایش موجود نیست' });
                    }
                }
            });
    }

    render() {
        if (this.state.teamDesc !== '') {
            return (
                <Fragment>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'teamP-about-header--dark' : 'teamP-about-header'}`}>درباره تیم</h1>
                        </div>
                        <div className='col-md-12'>
                            <div className='about-team-txt-container'>
                                {(this.state.teamDesc !== '' && this.state.teamDesc !== null && this.state.teamDesc !== 'null' && this.state.teamDesc !== undefined && this.state.teamDesc !== 'undefined') ? this.state.teamDesc : 'چیزی برای نمایش موجود نیست'}
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'teamP-about-header--dark' : 'teamP-about-header'}`}>درباره تیم</h1>
                        </div>
                        <div className='col-md-12'>
                            <div className='about-team-txt-container' style={{
                                textAlign: 'center'
                            }}>
                                {this.state.hasAbout}
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }

    }
}
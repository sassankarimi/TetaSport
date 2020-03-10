import React, { Component, Fragment } from 'react';
import { handleMSG } from '../../../jsFunctions/all.js';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';


export default class ProfileNotifications extends Component {
    static displayName = ProfileNotifications.name;
    constructor(props) {
        super(props)
        this.state = {
            hasEvent: false,
            newEvent: '',
            expiredEvents: '',
            eventDate: '',
            notif: [],
            notifications: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
    }

    async componentDidMount() {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', localStorage.getItem('view_profile'));
        await fetch(`${configPort.TetaSport}${configUrl.GetUserNotifications}`, {
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
                    this.setState({
                        notif: JSON.parse(JSON.stringify(data.Notifications)),
                    });

                    if (data.Notifications.length === 0) {
                        this.setState({
                            notifications: 'شما رویداد تازه ای ندارید',
                        });
                    }
                }
            });
    }

    render() {
        let allNotif = this.state.notif;
        return (
            (allNotif.length !== 0) ?
                <Fragment>
                    {allNotif.map(notif =>
                        <Fragment key={notif.NotificationID}>
                            {
                                (!notif.Seen) ?
                                    <div className='profileContent-left-container' style={{ position: 'relative' }}>
                                        <h4 className='profileContent-left-fontFam newEvent-padding-right-left' style={{ textAlign: 'right', color: '#000', fontFamily: 'iranyekanBold', fontSize: 15, fontWeight: 'bold' }}>
                                            <div className='profileContentNotifAvatar'></div>
                                            {notif.Text}
                                        </h4>
                                    </div>
                                    :
                                    <div className='profileContent-left-container-expired' style={{ position: 'relative' }}>
                                        <h4 className='profileContent-left-fontFam newEvent-padding-right-left' style={{ textAlign: 'right', color: '#000', fontFamily: 'iranyekanBold', fontSize: 13 }}>
                                            <div className='profileContentNotifAvatar'></div>
                                            {notif.Text}
                                            <span className='eventDate' style={{ position: "absolute", top: '-8px', right: 10 }}>{notif.Date}</span>
                                        </h4>
                                    </div>
                            }
                        </Fragment>
                    )}
                </Fragment>
                :
                <Fragment>
                    <div className='profileContent-left-container'>
                        <h4 className='profileContent-left-fontFam'>
                            {this.state.notifications}
                        </h4>
                    </div>
                </Fragment>
        )
    }
}
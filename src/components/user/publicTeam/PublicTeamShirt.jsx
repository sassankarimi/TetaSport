import React, { Component, Fragment } from 'react';
import { LogoutSoft } from '../logout/UserLogout';
import Hashids from 'hashids';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

export class PublicTeamShirt extends Component {
    static displayName = PublicTeamShirt.name;

    constructor(props) {
        super(props);
        this.state = {
            info: [],
            isTeamAdmin: false,
            hasInfo: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        }
    }

    componentDidMount() {
        let teamID = this.props.match.params.teamId;
        let teamIdDecoded = hashid.decode(teamID);
        var form = new FormData();
        form.append('TeamID', teamIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetTeamInfo}`, {
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
                    this.setState({ info: [], hasInfo: null });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    this.setState({ info: data, hasInfo: null });
                } else {
                    this.setState({ info: [], hasInfo: 'چیزی یافت نشد' });
                }
            });

    }

    render() {
        const { info } = this.state;
        let team1shirt = info.Kit1Color;
        let team2shirt = info.Kit2Color;
        if (info.length !== 0) {
            return (
                <Fragment>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'teamP-about-header--dark' : 'teamP-about-header'}`}>رنگ لباس تیم</h1>
                        </div>
                        <div className='col-md-6'>
                            <h2 className='tshirt-title-tshirtCat'>لباس اول</h2>
                            <div className='shirt-team-txt-container' title='لباس اول'>
                                <div className={`Tshirt-container-container ${localStorage.getItem('theme') === 'dark' ? 'shirt-public-container--dark' : 'shirt-public-container'}`}>
                                    <div className='Tshirt-container shirt-public' style={{ background: `${team1shirt}` }}></div>
                                    <div className='Tshirt-container Tshirt-1 shirt-public' style={{ background: `${team1shirt}` }}></div>
                                    <div className='Tshirt-container Tshirt-2 shirt-public' style={{ background: `${team1shirt}` }}></div>
                                    <div className='Tshirt-container Tshirt-3 shirt-public' style={{ background: `${team1shirt}` }}></div>
                                    <div className='Tshirt-inside shirt-public' style={{ background: `${team1shirt}` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <h2 className='tshirt-title-tshirtCat'>لباس دوم</h2>
                            <div className='shirt-team-txt-container' title='لباس دوم'>
                                <div className={`Tshirt-container-container ${localStorage.getItem('theme') === 'dark' ? 'shirt-public-container--dark' : 'shirt-public-container'}`}>
                                    <div className='Tshirt-container shirt-public' style={{ background: `${team2shirt}` }}></div>
                                    <div className='Tshirt-container Tshirt-1 shirt-public' style={{ background: `${team2shirt}` }}></div>
                                    <div className='Tshirt-container Tshirt-2 shirt-public' style={{ background: `${team2shirt}` }}></div>
                                    <div className='Tshirt-container Tshirt-3 shirt-public' style={{ background: `${team2shirt}` }}></div>
                                    <div className='Tshirt-inside shirt-public' style={{ background: `${team2shirt}` }}></div>
                                </div>
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
                            <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'teamP-about-header--dark' : 'teamP-about-header'}`}>رنگ لباس تیم</h1>
                        </div>
                        <div className='col-md-12' style={{ textAlign:'center' }}>
                            {this.state.hasInfo}
                        </div>
                    </div>
                </Fragment>
                )
        }      
    }
}
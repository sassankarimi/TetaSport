import React, { Component, Fragment } from 'react';
//import { LogoutSoft } from '../logout/UserLogout';
//import Hashids from 'hashids';
//import { toast } from 'react-toastify';
//import IziToast from 'izitoast';
//import { handleMSG } from '../../../jsFunctions/all.js';
import Modal from 'react-responsive-modal';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

export class ProfileTeamPayment extends Component {
    static displayName = ProfileTeamPayment.name;

    constructor(props) {
        super(props);
        this.state = {
            leaguePayment: [],
            openModal: false,
            packageObject: null,
            waiting: <div id='Listleague-loading'>
                <div className='Listleague-loading-container'>
                    <img src='/src/icon/teta-logo.png' className='Listleague-loading-icon' alt='loading' />
                    <div className='Listleague-loading-gif'></div>
                </div>
            </div>,
        }
    }

    componentDidMount() {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.ListNotPayedEntrances}`, {
            method: 'POST',
            Headers: {
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('Token')
            },
            body: form,
        }).then(response => {
            let code = response.status;
            switch (code) {
                case 200:
                    return response.json();
                case 401:
                    //LogoutSoft();
                    return false;
                case 403:
                    //LogoutSoft();
                    return false;
                case 420:
                    //LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    return false;
                default:
                    return false;
            }
        }).then(data => {
            if (data)
                console.log(data);
            //this.setState({
            //    leaguePayment: data
            //})
        })
    }

    onOpenModal = () => {
        this.setState({
            openModal: true,
        });
    };

    onCloseModal = () => {
        this.setState({ openModal: false });
    };

    handlemodal = (obj) => {
        this.setState({
            openSureModal: true,
            packageObject: obj

        })
    }

    render() {
        const { leaguePayment, openModal } = this.state;
        // تایتل صفحه
        return (
            <Fragment>
                <div className='row'>
                    <div className='col-md-12'>
                        {(leaguePayment.length !== 0) ?
                            <table>
                                <tbody>
                                    <tr>
                                        <th>لیگ</th>
                                        <th>مبلغ</th>
                                    </tr>
                                    {
                                        leaguePayment.map((lp, index) => {
                                            let lpPayment = {
                                                'id': lp.Id,
                                                'title': lp.Name,
                                                'price': lp.Price,
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>{lp.Name}</td>
                                                    <td>{lp.Price}</td>
                                                    <td>
                                                        <button onClick={(e) => { this.handlemodal(lpPayment) }} className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`} >
                                                            پرداخت
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            :
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'aboutMe-style--dark' : 'aboutMe-style'}`} style={{ textAlign: 'center' }}>
                                چیزی برای نمایش موجود نمی باشد
                            </div>
                        }
                    </div>
                </div>


                {/* پیش فاکتور */}
                <Modal classNames={{ overlay: 'areUsureModal', modal: 'areUsureModal-bg', closeButton: 'areUsureModal-closeBtn' }} open={openModal} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={true} center>
                    <div className="w3-modal-content w3-card-4 w3-animate-opacity"
                        style={{ maxWidth: 880, paddingBottom: 60, paddingTop: "8%", borderRadius: 3, textAlign: 'center' }}>
                        <div className="w3-section px-5" style={{ textAlign: 'right', direction: 'rtl' }}>
                            <div className="input-group mb-3" style={{ paddingRight: 30 }}>
                                <div className="row" style={{ width: "100%", textAlign: 'center' }}>
                                    <div className="col-md-12">
                                        {/* متن , تابع مدال */}
                                        <ModalConfirm Obj={this.state.leaguePayment} />
                                        {/* لغو */}
                                        <button
                                            className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                                            onClick={this.onCloseModal}
                                        >
                                            خیر
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </Fragment>
        );

    }
}// بخش اطلاعات و تابع مدال به صورت داینامیک
const ModalConfirm = (props) => {
    const obj = props.obj;
    // دریافت پکیج
    const wantThisPackages = (obj) => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('LeagueId', obj.lid);
        form.append('TeamId', obj.tid);
        fetch(`${configPort.TetaSport}${configUrl.PayEntrance}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('Token')
            },
            body: form,
        }).then(response => {
            let code = response.status;
            console.log('buy package status :', code)
            switch (code) {
                case 200:
                    return response.json();
                case 401:
                    LogoutSoft();
                    return false;
                case 403:
                    LogoutSoft();
                    return false;
                case 420:
                    LogoutSoft({ ...props });
                    return false;
                case 500:
                    return false;
                default:
                    return false;
            }
        }).then(data => {
            console.log('result package :', data);
        })
    }

    return (
        <Fragment>
            <button className={`btn mt-3 ${localStorage.getItem('theme') === 'dark' ? 'btn-sure-modal--dark' : 'btn-sure-modal'}`}
                onClick={wantThisPackages(obj)}>
                بله
           </button>
        </Fragment>
    )
}

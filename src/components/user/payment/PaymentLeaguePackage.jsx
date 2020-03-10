import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

export class PaymentLeaguePackage extends Component {
    static displayName = PaymentLeaguePackage.name;

    constructor(props) {
        super(props);
        this.state = {
            ok:false,
        }
    }

    componentDidMount() {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('Authority', 'cg');
        fetch(`${configPort.TetaSport}${configUrl.VerifyPayment}`, {
            method: 'POST',
            headers: {
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
                    LogoutSoft();
                    return false;
                case 403:
                    LogoutSoft();
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    return false;
                default:
                    return false;
            }
        }).then(data => {
            if (data)
                if (data.Packages) {
                    this.setState({
                        packages: data.Packages
                    })
                }
        })
    }

    comingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
    }

    goBackToIndex = () => {
        this.props.history.push(`/`);
    }


    render() {
        // تایتل صفحه
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت | نتیجه خرید`;
        if (this.state.ok) {
            return (
                <Fragment>
                    <div className='row w3-display-middle' style={{ width:'50%' }}>
                        <div className='col-md-12'>
                            <div className='payment-result-container payment-result-ok'>
                                <span className='payment-result-txt'>خرید با موفقیت انجام شد</span>
                                <hr />
                                <span className='payment-result-txt'>درحال ارسال شما به صفحه اصلی...</span>

                                <div className='row'>
                                    <div className='col-md-12' style={{ textAlign: 'center' }}>
                                        <div className="loader"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <div className='row w3-display-middle' style={{ width: '50%' }}>
                        <div className='col-md-12'>
                            <div className='payment-result-container payment-result-nok'>
                                <span className='payment-result-txt'>خرید ناموفق !</span>
                                <hr />
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }

    }
}
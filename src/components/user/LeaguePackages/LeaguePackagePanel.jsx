import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

export class LeaguePackagePanel extends Component {
    static displayName = LeaguePackagePanel.name;

    constructor(props) {
        super(props);
        this.state = {
            packages: []
        }
    }

    componentDidMount() {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.LoadPricingPackages}`, {
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
    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    wantThisPackages = (pkgId) => {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('CreditPackageId', pkgId);
        fetch(`${configPort.TetaSport}${configUrl.BuyCreditPackage}`, {
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
                    LogoutSoft({ ...this.props });
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


    render() {
        const { packages } = this.state;
        // عنوان صفحه
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت | پنل خرید پکیج لیگ`;

        return (
            <Fragment>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-panel-cointainer--dark' : 'leaguePackage-panel-cointainer'}`}>
                    <div className='row' style={{ marginBottom: 20, marginTop: 20 }}>
                        <div className='col-12'>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-panel-icon--dark' : 'leaguePackage-panel-icon'}`}></div>
                            <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-panel-title--dark' : 'leaguePackage-panel-title'}`}>خرید بسته ی لیگ</h1>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <button className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-Panel-btn--dark' : 'leaguePackage-Panel-btn'}`} onClick={this.goBackToIndex}>بازگشت به صفحه اصلی</button>
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: 30 }}>
                        {/* بسته یکی */}
                        {
                            packages.map((pkg, i) => {
                                return (
                                    <Fragment key={i}>
                                        <div className='col-md-4' style={{ marginBottom: 20 }}>
                                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-item--dark' : 'leaguePackage-item'}`}>
                                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-item-header--dark' : 'leaguePackage-item-header'}`}>
                                                    <div className='leaguePackage-item-header-icon leaguePackage-item-header-icon-package'></div>
                                                    <h2 className='leaguePackage-item-header-title'>بسته {pkg.Name}</h2>
                                                </div>
                                                <div className='leaguePackage-item-body'>
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <div className='leaguePackage-text-container'>
                                                                <span className='leaguePakcage-text'>با خرید این بسته شما مجاز به ساخت لیگ به صورت حذفی یا لیگی تا حداکثر {pkg.CreditCount} بار می باشید</span>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-12'>
                                                            <hr className={`${localStorage.getItem('theme') === 'dark' ? 'package-spliter--dark' : 'package-spliter'}`} />
                                                        </div>
                                                        <div className='col-md-12' style={{ marginTop: 10, marginBottom: 10 }}>
                                                            <div className='leaguePackage-text-container'>
                                                                <span className='leaguePakcage-text-mark'></span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}>تعداد لیگ : {pkg.CreditCount}</span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}></span>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-12' style={{ marginTop: 10, marginBottom: 10 }}>
                                                            <div className='leaguePackage-text-container'>
                                                                <span className='leaguePakcage-text-mark'></span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}>قیمت : {this.numberWithCommas(pkg.Price)} ریال</span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}></span>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-12' style={{ marginTop: 10, marginBottom: 10 }}>
                                                            <div className='leaguePackage-text-container'>
                                                                <span className='leaguePakcage-text-mark'></span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}>ثبت نتایج و رویداد ها</span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}></span>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-12' style={{ marginTop: 10, marginBottom: 10 }}>
                                                            <div className='leaguePackage-text-container'>
                                                                <span className='leaguePakcage-text-mark'></span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}>مشاهده ی بهترین های لیگ</span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}></span>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-12' style={{ marginTop: 10, marginBottom: 10 }}>
                                                            <div className='leaguePackage-text-container'>
                                                                <span className='leaguePakcage-text-mark'></span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}>مشاهده ی جداول لیگ و نمودار حذفی مسابقات</span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}></span>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-12' style={{ marginTop: 10, marginBottom: 10 }}>
                                                            <div className='leaguePackage-text-container'>
                                                                <span className='leaguePakcage-text-mark'></span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}>بارگذاری عکس ها و ویدیو های بازی های انجام شده در لیگ</span>
                                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}></span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-btn--dark' : 'leaguePackage-btn'}`} onClick={() => { this.wantThisPackages(pkg.Id) }}>
                                                        <span className='leaguePackage-btn-icon leaguePackage-btn-icon-plus'></span>
                                                        <span className='leaguePackage-btn-txt'>خرید</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>
                                )

                            })
                        }{/* end of map*/}
                    </div>
                </div>
            </Fragment>
        );
    }
}
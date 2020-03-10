import React, { Fragment } from 'react';
import 'react-accessible-accordion/dist/fancy-example.css';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

export class SortOrganizations extends React.Component {
    static displayName = SortOrganizations.name;

    constructor(props) {
        super(props);
        this.state = {
            isStillLoading: true,
            // استیت های سرچ باکس
            searchTxt: '',
            // استیت های بخش لیست لیگ ها
            resOrgs: [],
            orgs: <div id='Listleague-loading'>
                <div className='Listleague-loading-container'>
                    <img src='/src/icon/teta-logo.png' className='Listleague-loading-icon' alt='loading' />
                    <div className='Listleague-loading-gif'></div>
                </div>
            </div>,
        };
        this.sort = this.sort.bind(this);
    }

    componentDidMount() {
        // ست کردن استیت بخش سرچ باکس
        this.setState({ searchTxt: decodeURIComponent(this.props.location.search.replace('?q=', '')) });
        // Api ارسال درخواست به
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        if (this.props.location.search) {
            let query = this.props.location.search.replace('?q=', '');
            form.append('SearchText', query);
        }

        fetch(`${configPort.TetaSport}${configUrl.SearchOrgs}`, {
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
                    localStorage.setItem('OrderingID', 2);
                    return response.json();
                case 401:
                    LogoutSoft();
                    this.setState({ orgs: 'برای استفاده از این گزینه باید شهر و استان خود را در بخش ویرایش پروفایل مشخص کنید', isStillLoading: false, });
                    return false;
                case 404:
                    this.setState({ orgs: 'برای استفاده از این گزینه باید شهر و استان خود را در بخش ویرایش پروفایل مشخص کنید', isStillLoading: false, });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({ orgs: 'خطای سرور', isStillLoading: false, });
                    return false;
                default:
                    this.setState({ isStillLoading: false, orgs: '', resOrgs: [] });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Orgs) {
                        this.setState({
                            resOrgs: JSON.parse(JSON.stringify(data.Orgs)),
                            isStillLoading: false,
                        });
                        if (data.Orgs.length === 0) {
                            this.setState({
                                orgs: 'سازمانی برای نمایش موجود نیست',
                                isStillLoading: false,
                            });
                        }
                    } else {
                        this.setState({
                            orgs: data.MSG,
                            resOrgs: [],
                            isStillLoading: false,
                        });
                    }
                } else {
                    this.setState({
                        orgs: 'سازمانی برای نمایش موجود نیست',
                        isStillLoading: false,
                    });
                }
            });

    }

    // توابع سرچ باکس  
    handleSearchText = (e) => {
        this.setState({ searchTxt: e.target.value });
    }
    handlesearchIcon = () => {
        let searchQuery = this.props.location.search.replace('?q=', '');
        if (this.state.searchTxt) {
            if (this.state.searchTxt !== searchQuery) {
                this.props.history.push({
                    pathname: `${this.props.location.pathname}`,
                    search: `q=${this.state.searchTxt}`
                })
                //بررسی متن سرچ شده
                this.props.location.search = `?q=${this.state.searchTxt}`;
                this.getNewLeagueFromApi();
            }
        } else {
            if (this.state.searchTxt !== searchQuery) {
                localStorage.removeItem('SearchText');
                this.props.history.push({
                    pathname: `${this.props.location.pathname}`,
                })
                //متن سرچ شده خالی
                this.props.location.search = '';
                this.getNewLeagueFromApi();
            }
        }
    }
    sendSearchReq = (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) {
            document.getElementById('searchAllLeagues').click();
        }
    }


    // Url تابع اضافه یا حذف فیلتر انتخاب شده در
    sort(type, thisIsChecked) {
        let ok = false;
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            if (splitStr[i] === `${type}`) {
                ok = true;
            }
        }
        if (!ok) {
            this.props.history.push({
                pathname: `${type}/`,
                search: this.props.location.search
            })
        }

        if (thisIsChecked) {
            let str = this.props.location.pathname;
            let ret = str.replace(`/${type}`, '');
            this.props.history.push({
                pathname: `${ret}`,
                search: this.props.location.search
            })
        }
    }

    // تابع ارسال درخواست و دریافت لیست لیگ های فیلتر شده باتوجه به چک باکس ها
    getNewLeagueFromApi = () => {

        this.setState({
            orgs: <div id='Listleague-loading'>
                <div className='Listleague-loading-container'>
                    <img src='/src/icon/teta-logo.png' className='Listleague-loading-icon' alt='loading' />
                    <div className='Listleague-loading-gif'></div>
                </div>
            </div>,
            isStillLoading: true,
            resOrgs: [],
        });

        // Api ارسال درخواست به
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('SearchText', this.state.searchTxt);

        fetch(`${configPort.TetaSport}${configUrl.SearchOrgs}`, {
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
                    this.setState({ isStillLoading: false, });
                    localStorage.setItem('OrderingID', 2);
                    return response.json();
                case 401:
                    LogoutSoft();
                    this.setState({ orgs: 'برای استفاده از این گزینه باید شهر و استان خود را در بخش ویرایش پروفایل مشخص کنید', isStillLoading: false, });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({ orgs: 'متاسفانه خطایی رخ داده است دوباره امتحان کنید', isStillLoading: false, });
                    return false;
                default:
                    this.setState({ orgs: '', resOrgs: [], isStillLoading: false });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Orgs) {
                        this.setState({
                            resOrgs: JSON.parse(JSON.stringify(data.Orgs)),
                        });
                        if (data.Orgs.length === 0) {
                            this.setState({
                                orgs: 'سازمانی برای نمایش موجود نیست',
                                isStillLoading: false,
                            });
                        }
                    } else {
                        this.setState({
                            orgs: data.MSG,
                            resOrgs: [],
                            isStillLoading: false,
                        });

                    }
                } else {
                    this.setState({
                        orgs: 'سازمانی برای نمایش موجود نیست',
                        isStillLoading: false,
                    });
                }
            });

    }


    render() {
        // لیست لیگ ها
        let orgs = this.state.resOrgs;
        let loading = this.state.isStillLoading;

        // تایتل صفحه
        document.getElementsByTagName("title")[0].innerHTML = `سازمان های تتا اسپرت`;

        if (orgs.length !== 0 && !loading) {

            return (
                <Fragment>
                    {/* بخش سرچ */}
                    <div className="row" style={{ marginTop: 50 }}>
                        <div className="input-group League-searchbox-styles" >
                            <input className="form-control py-2 border" type="search" placeholder='... نام سازمان' value={this.state.searchTxt} onChange={this.handleSearchText} onKeyDown={this.sendSearchReq} id="League-searchbox-val" style={{ height: 58, textAlign: 'right', fontFamily: 'iranyekanBold', background: '#F3F3F3' }} />
                            <span className="input-group-append">
                                <button className="btn btn-outline-secondary border-left-0 border " type="button" style={{ background: '#F3F3F3', paddingBottom: 0, }}>
                                    <span style={{ border: '1px solid #4A4A4A', height: 45, display: 'inline-block' }}></span>
                                    <span id='searchAllLeagues' className='League-searchbox-btn' onClick={this.handlesearchIcon}></span>
                                </button>
                            </span>
                        </div>
                    </div>
                    {/* لیست سازمان ها */}
                    <div className='row' style={{ marginTop: 50 }}>
                        <div className='col-md-12'>
                            <h1 className={`${localStorage.getItem('theme') === 'dark' ? 'organizations-title--dark' : 'organizations-title'}`}>سازمان های تتا اسپرت</h1>
                        </div>
                    </div>
                    <div id='tetaSport-Leagues' className='league-container backOpacity'>
                        <div className='leagueContent-left-container-joinedLeague' style={{ zIndex: '-1' }}>
                            <div className='row' style={{ marginLeft: '0', marginRight: '0' }}>
                                {
                                    orgs.map((org, index) => {
                                        //آیدی سازمان
                                        let orgId = hashid.encode(org.OrgID);
                                        //let orgTitle = org.OrgName.replace(' ', '-');
                                        //let orgAdminName = org.AdminName.replace(' ', '-');
                                        let cmOrgAdminName = `سازنده: ${org.AdminName}`;
                                        //let orgAdminUserName = org.AdminUsername.replace(' ', '-');
                                        let orgAvatar = '/src/icon/orgProfileDefaultAvatar.png';
                                        if (org.OrgAvatar && org.OrgAvatar && org.OrgAvatar !== '' && org.OrgAvatar !== null && org.OrgAvatar !== undefined) {
                                            orgAvatar = org.OrgAvatar;
                                        }
                                        let orgBg = '/src/backgrounds/orgProfileDefaultBanner.png';
                                        if (org.OrgCoverPhoto && org.OrgCoverPhoto && org.OrgCoverPhoto !== '' && org.OrgCoverPhoto !== null && org.OrgCoverPhoto !== undefined) {
                                            orgBg = org.OrgCoverPhoto;
                                        }

                                        return (
                                            <Fragment key={index}>
                                                <div className='col-md-6 org-items-container'>
                                                    <a className='link-hover-defaultStyle-org' href={`/organization/${orgId}`} target={orgId}>
                                                        <div className={`${localStorage.getItem('theme') === 'dark' ? 'search-org-item-container--dark' : 'search-org-item-container'}`}>
                                                            <div className='search-org-cover' style={{ backgroundImage: (`url(${orgBg})`) }}></div>
                                                            <img className='search-org-avatar' src={orgAvatar} alt={org.OrgName} title={org.OrgName} />
                                                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'search-org-title--dark' : 'search-org-title'}`}>{org.OrgName}</span>
                                                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'search-org-admin--dark' : 'search-org-admin'}`}>{cmOrgAdminName}</span>
                                                        </div>
                                                    </a>
                                                </div>
                                            </Fragment>
                                        )

                                    })

                                }
                            </div>
                        </div>
                    </div>


                </Fragment>
            );

        } else {

            return (
                <Fragment>
                    {/* بخش سرچ */}
                    <div className="row" style={{ marginTop: 50 }}>
                        <div className="input-group League-searchbox-styles" >
                            <input className="form-control py-2 border" type="search" placeholder='... نام سازمان' value={this.state.searchTxt} onChange={this.handleSearchText} onKeyDown={this.sendSearchReq} id="League-searchbox-val" style={{ height: 58, textAlign: 'right', fontFamily: 'iranyekanBold', background: '#F3F3F3' }} />
                            <span className="input-group-append">
                                <button className="btn btn-outline-secondary border-left-0 border " type="button" style={{ background: '#F3F3F3', paddingBottom: 0, }}>
                                    <span style={{ border: '1px solid #4A4A4A', height: 45, display: 'inline-block' }}></span>
                                    <span id='searchAllLeagues' className='League-searchbox-btn' onClick={this.handlesearchIcon}></span>
                                </button>
                            </span>
                        </div>
                    </div>
                    {/* لیست لیگ ها */}
                    <div id='tetaSport-Leagues' className='league-container backOpacity'>
                        <div className='leagueContent-left-container-joinedLeague'>
                            <div className='row' style={{ textAlign: 'center', fontFamily: 'iranyekanRegular', fontSize: 20, background: '#eff5f0' }}>
                                <div className='col-md-12'>
                                    <span>{this.state.orgs}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );

        }
    }
}

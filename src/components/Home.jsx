import React, { Component, Fragment } from 'react';
import { Container } from 'reactstrap';
import { Carousel } from 'react-bootstrap';
import { NavMenuIndex } from '../components/NavMenu';
import Hashids from 'hashids';
import { toast } from 'react-toastify';
import { CreateLeagueStepperModal } from './user/createLeague/CreateLeague';
import { LogoutSoft } from './user/logout/UserLogout';
import configPort from '../configPort.json';
import configUrl from '../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

const btnStyles = {
    'FsizeBtn': '22px',

}
const titleStyle = {
    'FsizeTitle': '60px'
}


export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            progressLeagues: [],
            haveLeagues: false,
            index: 0,
            direction: null,
            switchChecked: (localStorage.getItem('theme') === 'dark') ? true : false,
            isOnceSwitch: false,
            packages: [],
        }
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        let form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetLatestOnPerfomingLeagueCards}`, {
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
                case 400:
                    this.setState({ Leagues: ' خطایی رخ داده دوباره تلاش کنید ' });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    this.setState({ Leagues: ' خطایی رخ داده دوباره تلاش کنید ' });
                    return false;
                case 500:
                    this.setState({ Leagues: ' خطایی رخ داده دوباره تلاش کنید ' });
                    return false;
                default:
                    this.setState({ Leagues: ' خطایی رخ داده دوباره تلاش کنید ' });
            }
        }).then(
            data => {
                if (data) {
                    if (data.Leagues) {
                        this.setState({
                            progressLeagues: data.Leagues,
                            haveLeagues: true,
                        });
                    }
                }
            });
        let form1 = new FormData();
        form1.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.LoadPricingPackages}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('Token')
            },
            body: form1,
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

    handleSelect = (selectedIndex, e) => {
        this.setState({
            index: selectedIndex,
            direction: e.direction,
        });
    }

    allPackages = () => {
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== '0') {
            this.props.history.push('/leaguePackages')
        } else {
            this.props.history.push('/login')
        }
    }

    ComingSoon = () => {
        toast.info("! این بخش به زودی در دسترس خواهد بود", { position: toast.POSITION.TOP_CENTER });
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    render() {
        const { progressLeagues,
            haveLeagues,
            index,
            direction,
            packages } = this.state;
        let count = 0;
        return (
            <Fragment>
                {/*  landing  */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'indexBG--dark' : 'indexBG'} margin-top-left-txt`}>
                    <NavMenuIndex {...this.props} />
                    <Container className='home-txt-style'>
                        <h1 className={`display-4 font-fam-irsans-bold ${localStorage.getItem('theme') === 'dark' ? 'txt-color-banner--dark' : 'txt-color-banner'}`} style={{ fontSize: titleStyle.FsizeTitle, marginTop: 0, marginBottom: 50 }}>
                            مسـابـقات واقعی<br />
                            بازتاب‌های مجازی
                        </h1>
                        <div className='home-btns-container'>
                            {
                                (localStorage.getItem('exID') &&
                                    localStorage.getItem('exID') !== 0 &&
                                    localStorage.getItem('exID') !== null &&
                                    localStorage.getItem('exID') !== undefined &&
                                    localStorage.getItem('exID') !== '0')
                                    ?
                                    <CreateLeagueStepperModal {...this.props} />
                                    :
                                    <a href='/login' className={`${localStorage.getItem('theme') === 'dark' ? 'btn-create-league--dark' : 'btn-create-league'} btn home-btns font-fam-irsans`} style={{ fontSize: btnStyles.FsizeBtn }}>لیگت رو بساز</a>
                            }
                        </div>
                    </Container>
                </div>

                <div className='index-carousel'>
                    <Carousel
                        activeIndex={index}
                        direction={direction}
                        onSelect={this.handleSelect}
                        interval={3000}
                        pauseOnHover={false}
                    >
                        <Carousel.Item>
                            <div className='carousel-item-container'>
                                <div className='row'>
                                    <div className='col-md-6 carousel-item-news-container' style={{ height: 380 }}>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <h3 className='carousel-item-news-title'>یوآخیم لوو همچنان سرمربی آلمان باقی می‌ماند</h3>
                                            </div>
                                            <div className='col-md-12'>
                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'carousel-item-news-text--dark' : 'carousel-item-news-text'}`}>
                                                    آقای لوو پس از جام جهانی ۲۰۰۶ تاکنون سرمربی تیم ملی آلمان بوده است و در سال ۲۰۱۴ این تیم را به چهارمین قهرمانی خود در مسابقات جام جهانی رساند.
            وی که تا پیش از جام جهانی روسیه تیم کشورش را در تمامی رقابت‌های بزرگ فوتبال دست‌کم به مرحله نیمه‌نهایی رسانده بود در واکنش به خبر ابقای خود گفت بابت اعتمادی که فدراسیون فوتبال کشور همچنان نسبت به وی دارد بسیار سپاسگزار است.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6' style={{ height: 380 }}>
                                        <img
                                            className="d-block carousel-item-img"
                                            src="/src/backgrounds/carousel-example-img.png"
                                            alt="First slide"
                                        />
                                    </div>
                                </div>

                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className='carousel-item-container'>
                                <div className='row'>
                                    <div className='col-md-6 carousel-item-news-container' style={{ height: 380 }}>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <h3 className='carousel-item-news-title'>بازیکن استثنایی کریستیانو رونالدو</h3>
                                            </div>
                                            <div className='col-md-12'>
                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'carousel-item-news-text--dark' : 'carousel-item-news-text'}`}>
                                                    در دورانی که ستاره های فوتبال در 35 سالگی به کشورهای خاور دور رفته و بازنشسته می‌شوند، کریستیانو رونالدو هنوز در سطح اول فوتبال جهان می درخشد و گل های زیادی به ثمر می رساند.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6' style={{ height: 380 }}>
                                        <img
                                            className="d-block carousel-item-img"
                                            src="/src/backgrounds/carousel-example-img2.png"
                                            alt="First slide"
                                        />
                                    </div>
                                </div>

                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className='carousel-item-container'>
                                <div className='row'>
                                    <div className='col-md-6 carousel-item-news-container' style={{ height: 380 }}>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <h3 className='carousel-item-news-title'>لیونل مسی ستاره آرژانتینی</h3>
                                            </div>
                                            <div className='col-md-12'>
                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'carousel-item-news-text--dark' : 'carousel-item-news-text'}`}>
                                                    به گزارش فارس، لیونل مسی ستاره آرژانتینی دنیای فوتبال که در باشگاه بارسا به عناوین مختلفی دست یافته است در تیم ملی نتوانسته انتظارات را بر آورده کند.همین امر نقطه ضعف وی به حساب می‌آید و رسانه‌ها بارها به شکل های مختلف به این موضوع پر و بال داده‌اند.

                                                                                                        نابغه آرژانتینی امروز وارد 32 سالگی شد و همین موضوع بازتاب‌های بسیاری در رسانه‌ها و فضای مجازی داشت.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6' style={{ height: 380 }}>
                                        <img
                                            className="d-block carousel-item-img"
                                            src="/src/backgrounds/carousel-example-img3.png"
                                            alt="First slide"
                                        />
                                    </div>
                                </div>

                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>


                {/*  لیگ ها  */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'index-leagues--dark' : 'index-leagues'}`} style={{ display: (haveLeagues) ? 'block' : 'none', paddingTop: 100 }}>
                    <div className='row' style={{ marginBottom: 70, marginLeft: 0, marginRight: 0 }}>
                        <div className='col-md-12 index-leagues-title'>
                            <span className={`index-leagues-title-item ${localStorage.getItem('theme') === 'dark' ? 'index-leagues-title-item-txt-noLink--dark index-leagues-title-item-txt-active--dark' : 'index-leagues-title-item-txt-noLink  index-leagues-title-item-txt-active'}`}>لیگ های در حال اجرا</span>
                            <span className='index-leagues-title-item index-leagues-title-item-nothing-really '></span>
                            <span className='index-leagues-title-item index-leagues-title-item-txt'><a className={`${localStorage.getItem('theme') === 'dark' ? 'index-leagues-title-item-txt-link--dark' : 'index-leagues-title-item-txt-link'}`} href='leagues' target={`leagues`}>نمایش همه لیگ ها</a></span>
                        </div>
                    </div>
                    <div className='row' style={{ marginBottom: 100, marginLeft: 0, marginRight: 0 }}>

                        {
                            progressLeagues.map((league, index) => {

                                //آیدی لیگ
                                let lgId = hashid.encode(league.LeagueID);
                                let lgTitle = league.LeagueTitle.replace(' ', '-');
                                let lgCity = league.City.replace(' ', '-');
                                let lgSport = league.Sport.replace(' ', '-');
                                let lgAdminName = league.AdminName.replace(' ', '-');

                                return (
                                    <Fragment key={index}>
                                        <div className='col-md-6 col-sm-12 joinedTeam-box index-joinedTeam-box'>
                                            <a className='joinedLeagu-box-Link' href={`/leagueProfile/matchInfo/L/${lgTitle}-${lgAdminName}-${lgSport}-${lgCity}-تتااسپرت/${lgId}`}>
                                                <div className='myLeagues-box myLeagues-box-height' style={{ background: `url(/src/backgrounds/leagueDefaultBackground${league.LeagueCoverPhotoID}.jpg)`, display: 'inline-block', minWidth: 365 }}>
                                                    <div className='myLeagues-box-header'></div>

                                                    <div className='myLeagues-box-content'>
                                                        <div className='myLeagues-box-content-txt'>
                                                            <h2 className='myLeagues-box-content-league-title'>{league.LeagueTitle}</h2>
                                                            <h5 className='myLeagues-box-content-league-player-name'>({league.AdminUsername}) {league.AdminName}</h5>
                                                        </div>
                                                        <div className='myLeagues-box-player-avatar myLeagues-box-player-avatar-mm'>
                                                            <img className='myLeagues-box-player-avatar-img'
                                                                src={league.LeagueAvatar}
                                                                alt='league avatar' />
                                                        </div>
                                                    </div>

                                                    <div className='myLeagues-box-footer'>
                                                        <div className='myLeagues-box-footer-location'>
                                                            <div className='myLeagues-box-footer-location-map'>
                                                                <span className='myLeagues-box-footer-location-map-icon'></span>
                                                                <span className='myLeagues-box-footer-location-map-txt'>{league.City}</span>
                                                            </div>
                                                        </div>
                                                        <div className='myLeagues-box-footer-tags'>
                                                            <p className='myLeagues-box-footer-tags-txt'>{league.Sport} / {league.GenderCategory} / {league.AgeCategory} / {league.Award}</p>
                                                        </div>
                                                        <div className='myLeagues-box-footer-description'>
                                                            <p className='myLeagues-box-footer-description-txt'>{league.LeagueStatus} ، {league.TeamCount} تیم</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>

                                        </div>
                                    </Fragment>
                                )
                            })
                        }
                        {
                            (progressLeagues.length === 0) ?
                                <div className='col-md-12'>
                                    <span style={{ fontFamily: 'iranYekanRegular', fontSize: 12, direction: 'rtl' }}>در حال حاضر لیگی در حال اجرا نمی باشد...</span>
                                </div>
                                :
                                null
                        }
                    </div>
                </div>

                {/*  پکیج ها  */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'index-packages--dark' : 'index-packages'}`} style={{ paddingTop: 100 }} id='leaguePackages'>
                    <div className='row' style={{ marginBottom: 70, marginLeft: 0, marginRight: 0 }}>
                        <div className='col-md-12 index-leagues-title'>
                            <span style={{ cursor: 'default', textAlign: 'right' }} className={`index-leagues-title-item ${localStorage.getItem('theme') === 'dark' ? 'index-leagues-title-item-txt-noLink--dark index-leagues-title-item-txt-active--dark' : 'index-leagues-title-item-txt-noLink  index-leagues-title-item-txt-active'}`}>خرید بسته های لیگ</span>
                        </div>
                    </div>
                    <div className='row'>
                        {
                            packages.map((pkg, i) => {
                                count++
                                if (count === 1) {
                                    return (
                                        <Fragment key={i}>
                                            <div className='col-md-6' style={{ marginBottom: 20 }}>
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

                                                        <button className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-btn--dark' : 'leaguePackage-btn'}`} onClick={this.wantThisPackages}>
                                                            <span className='leaguePackage-btn-icon leaguePackage-btn-icon-plus'></span>
                                                            <span className='leaguePackage-btn-txt'>خرید</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                        <div className='col-md-6' style={{ marginBottom: 20 }}>
                            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-item--dark' : 'leaguePackage-item'}`}>
                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-item-header--dark' : 'leaguePackage-item-header'}`}>
                                    <div className='leaguePackage-item-header-icon leaguePackage-item-header-icon-package'></div>
                                    <h2 className='leaguePackage-item-header-title'>تمامی بسته ها</h2>
                                </div>
                                <div className='leaguePackage-item-body'>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <div className='leaguePackage-text-container'>
                                                <span className='leaguePakcage-text'>برای مشاهده تمامی بسته ها از این قسمت استفاده بفرمایید</span>
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <hr className={`${localStorage.getItem('theme') === 'dark' ? 'package-spliter--dark' : 'package-spliter'}`} />
                                        </div>
                                        <div className='col-md-12' style={{ marginTop: 10, marginBottom: 10 }}>
                                            <div className='leaguePackage-text-container'>
                                                <span className='leaguePakcage-text-mark'></span>
                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}>بسته تک لیگ</span>
                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}></span>
                                            </div>
                                        </div>
                                        <div className='col-md-12' style={{ marginTop: 10, marginBottom: 10 }}>
                                            <div className='leaguePackage-text-container'>
                                                <span className='leaguePakcage-text-mark'></span>
                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}>بسته 5 تایی لیگ</span>
                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}></span>
                                            </div>
                                        </div>
                                        <div className='col-md-12' style={{ marginTop: 10, marginBottom: 10 }}>
                                            <div className='leaguePackage-text-container'>
                                                <span className='leaguePakcage-text-mark'></span>
                                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePakcage-text-term--dark' : 'leaguePakcage-text-term'}`}>بسته 20 تایی لیگ</span>
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

                                    <button className={`${localStorage.getItem('theme') === 'dark' ? 'leaguePackage-btn--dark' : 'leaguePackage-btn'}`} onClick={this.allPackages}>
                                        <span className='leaguePackage-btn-txt'>مشاهده</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/*  فوتر بالایی  */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-top--dark' : 'index-footer-top'} index-footer`}>
                    <div className='row'>
                        <div className='col-md-8' style={{ marginBottom: 8 }}>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-about-title--dark' : 'index-footer-about-title'}`}>درباره ما</span>
                                    <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-about-txt--dark' : 'index-footer-about-txt'}`}>
                                        تتا اسپورت پلتفرمی برای برگزار کردن لیگ در دو رشته فوتبال و فوتسال برای تمام کسانی که در حوزه‌ی برگزاری لیگ فعالیت دارند، همچنین تمام سازمانها و ارگانهایی که میخواهند لیگ برگزار کنند، میباشد.
                                    </span>
                                    <a className='link-hover-defaultStyle' href='/about' target='about'><span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-about-txt--dark' : 'index-footer-about-txt'} more-txt`}>بیشتر...</span></a>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4' style={{ marginBottom: 8 }}>
                            <div className='index-footer-top-contact-container'>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <address>
                                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-contact-title--dark' : 'index-footer-contact-title'}`} id='contactUs'>ارتباط با ما</span>
                                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-contact-txt--dark' : 'index-footer-contact-txt'}`}>آدرس : خیابان شریعتی نرسیده به پل سیدخندان کوچه موزه پلاک 9</span>
                                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-contact-txt--dark' : 'index-footer-contact-txt'}`}>تلفــن :  41705 -021  داخلی 120</span>
                                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-contact-txt--dark' : 'index-footer-contact-txt'}`}>فکس :  41705 -021  داخلی 101</span>
                                        </address>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  فوتر پایینی */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-btm--dark' : 'index-footer-btm'} index-footer`}>
                    <div className='row'>
                        <div className='col-md-8' style={{ marginTop: 8 }}>
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-help-txt--dark' : 'index-footer-help-txt'}`} onClick={this.ComingSoon}>راهنمای سرویس</span>
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-help-spliter--dark' : 'index-footer-help-spliter'}`} onClick={this.ComingSoon}></span>
                            <a className='link-hover-defaultStyle' href='/terms' target='_blank'><span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-help-txt--dark' : 'index-footer-help-txt'}`} >شرایط استفاده از سرویس</span></a>
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-help-spliter--dark' : 'index-footer-help-spliter'}`}></span>
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'index-footer-help-txt--dark' : 'index-footer-help-txt'}`} onClick={this.ComingSoon}>حریم خصوصی</span>
                        </div>
                        <div className='col-md-4' style={{ marginTop: 8 }}>
                            <div className='index-footer-btm-socials'>
                                <a className='index-footer-btm-socials-icon' rel='noreferrer noopener' href='https://www.instagram.com' target='_blank'><span className={`index-footer-btm-socials-icon ${localStorage.getItem('theme') === 'dark' ? 'index-footer-btm-socials-ig--dark' : 'index-footer-btm-socials-ig'}`}></span></a>
                                <a className='index-footer-btm-socials-icon' rel='noreferrer noopener' href='https://www.telegram.com' target='_blank'><span className={`index-footer-btm-socials-icon ${localStorage.getItem('theme') === 'dark' ? 'index-footer-btm-socials-tele--dark' : 'index-footer-btm-socials-tele'}`}></span></a>
                                <a className='index-footer-btm-socials-icon' rel='noreferrer noopener' href='https://www.twitter.com' target='_blank'><span className={`index-footer-btm-socials-icon ${localStorage.getItem('theme') === 'dark' ? 'index-footer-btm-socials-tw--dark' : 'index-footer-btm-socials-tw'}`}></span></a>
                            </div>
                        </div>
                    </div>
                </div>

            </Fragment>
        );
    }
}

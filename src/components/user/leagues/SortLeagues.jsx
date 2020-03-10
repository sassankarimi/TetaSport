import React, { Fragment } from 'react';
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { NavLink } from 'react-router-dom';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);
let SportsIDs = [];
let Sports = [];
let Gender = [];
let Gift = [];
let LeagueState = [];
let LeagueFilter = [];
let SortToFilter = [];

export class SortLeagues extends React.Component {
    static displayName = SortLeagues.name;

    constructor(props) {
        super(props);
        this.state = {
            isStillLoading: true,
            // استیت های سایدبار
            futsalUrlChecked: false,
            futsalChecked: false,
            footballChecked: false,
            genderMaleChecked: false,
            genderFemaleChecked: false,
            hasGiftChecked: false,
            noGiftChecked: false,
            inProgressChecked: false,
            doneChecked: false,
            planeForFutureChecked: false,
            sideBarButton: true,
            // استیت های سرچ باکس
            searchTxt: '',
            // استیت های فیلترینگ منو
            collapsed: true,
            near: false,
            new: false,
            popular: false,
            // استیت های بخش لیست لیگ ها
            resLeagues: [],
            Leagues: <div id='Listleague-loading'>
                <div className='Listleague-loading-container'>
                    <img src='/src/icon/teta-logo.png' className='Listleague-loading-icon' alt='loading' />
                    <div className='Listleague-loading-gif'></div>
                </div>
            </div>,
            filterBySport: [],
            filterByGender: [],
            filterByGift: [],
            filterByLeagueState: [],
        };
        this.handleFutsal = this.handleFutsal.bind(this);
        this.handleFootball = this.handleFootball.bind(this);
        this.handleGenderMale = this.handleGenderMale.bind(this);
        this.handleGenderFemale = this.handleGenderFemale.bind(this);
        this.handleHasGift = this.handleHasGift.bind(this);
        this.handleNoGift = this.handleNoGift.bind(this);
        this.handleInprogress = this.handleInprogress.bind(this);
        this.handleDone = this.handleDone.bind(this);
        this.handlePlaneForFuture = this.handlePlaneForFuture.bind(this);
        this.sort = this.sort.bind(this);
        this.toggleNavbar = this.toggleNavbar.bind(this);

    }

    componentDidMount() {
        // Url تغییر استیت چک باکس ها باتوجه به حضور فیلتر در
        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            let urlFilter = splitStr[i];
            switch (urlFilter) {
                case '1':
                case 'football':
                    // بخش چک باکس
                    this.setState({ footballChecked: true });
                    // بخش لیست لیگ ها
                    Sports.push(1);
                    break;
                case '2':
                case 'futsal':
                    // بخش چک باکس
                    this.setState({ futsalChecked: true });
                    // بخش لیست لیگ ها
                    Sports.push(2);
                    break;
                case '3':
                case 'male':
                    // بخش چک باکس
                    this.setState({ genderMaleChecked: true });
                    // بخش لیست لیگ ها
                    Gender.push(1);
                    break;
                case '4':
                case 'female':
                    // بخش چک باکس
                    this.setState({ genderFemaleChecked: true });
                    // بخش لیست لیگ ها
                    Gender.push(2);
                    break;
                case '5':
                case 'gift':
                    // بخش چک باکس
                    this.setState({ hasGiftChecked: true });
                    // بخش لیست لیگ ها
                    Gift.push(1);
                    break;
                case '6':
                case 'nogift':
                    // بخش چک باکس
                    this.setState({ noGiftChecked: true });
                    // بخش لیست لیگ ها
                    Gift.push(2);
                    break;
                case '7':
                case 'done':
                    // بخش چک باکس
                    this.setState({ doneChecked: true });
                    // بخش لیست لیگ ها
                    LeagueState.push(3);
                    break;
                case '8':
                case 'progress':
                    // بخش چک باکس
                    this.setState({ inProgressChecked: true });
                    // بخش لیست لیگ ها
                    LeagueState.push(2);
                    break;
                case '9':
                case 'planning':
                    // بخش چک باکس
                    this.setState({ planeForFutureChecked: true });
                    // بخش لیست لیگ ها
                    LeagueState.push(1);
                    break;
                case 'near':
                case 'Near':
                    LeagueFilter[0] = 0;
                    // بخش لیست لیگ ها
                    break;
                case 'new':
                case 'New':
                    LeagueFilter[0] = 1;
                    // بخش لیست لیگ ها
                    break;
                case 'popular':
                case 'Popular':
                    LeagueFilter[0] = 2;
                    // بخش لیست لیگ ها
                    break;
                case 'leagues':
                    window.addEventListener('click', function (e) {
                        if (document.getElementById('sideBarMenuButton')) {
                            if (document.getElementById('sideBarMenuButton').contains(e.target) || document.getElementById('League-Sidebar-Accordion').contains(e.target)) {
                                document.getElementById("League-Sidebar-Accordion").style.display = "block";
                                let lng = document.getElementsByClassName("lockLinks").length;
                                for (let i = 0; i < lng; i++) {
                                    document.getElementsByClassName("lockLinks")[i].style.pointerEvents = 'none';
                                    document.getElementsByClassName("lockLinks")[i].style.cursor = 'default';
                                }
                            } else {
                                document.getElementById("League-Sidebar-Accordion").style.display = "none";
                                document.getElementById("sideBarMenuButton").style.display = "block";
                                document.getElementById("closeSideBar").style.display = "none";
                                document.getElementsByClassName("backOpacity")[0].style.opacity = "1";
                                document.getElementsByClassName("backOpacity")[1].style.opacity = "1";
                                let lng = document.getElementsByClassName("lockLinks").length;
                                for (let i = 0; i < lng; i++) {
                                    document.getElementsByClassName("lockLinks")[i].style.pointerEvents = 'visible';
                                    document.getElementsByClassName("lockLinks")[i].style.cursor = 'pointer';

                                }
                            }
                        }
                    });
                    break;
                default:
            }
        }

        // ست کردن استیت بخش سرچ باکس
        this.setState({ searchTxt: decodeURIComponent(this.props.location.search.replace('?q=', '')) });

        // Api ارسال درخواست به
        var form = new FormData();
        if (localStorage.getItem('exID')) {
            form.append('UserID', localStorage.getItem('exID'));
        }

        if (LeagueFilter.length === 0) {
            form.append('OrderingID', 2);
        }
        if (LeagueFilter.length !== 0) {
            form.append('OrderingID', LeagueFilter[0]);
        }

        if (this.props.location.search) {
            let query = this.props.location.search.replace('?q=', '');
            form.append('SearchText', query);
        }
        if (Sports.length !== 0) {
            form.append('SportIDs[]', Sports[0]);
            form.append('SportIDs[]', Sports[1]);
        }
        if (Gender.length !== 0) {
            form.append('GenderClassIDs[]', Gender[0]);
            form.append('GenderClassIDs[]', Gender[1]);
        }
        if (Gift.length !== 0) {
            form.append('AwardStatusIDs[]', Gift[0]);
            form.append('AwardStatusIDs[]', Gift[1]);
        }
        if (LeagueState.length !== 0) {
            form.append('LeagueStatusIDs[]', LeagueState[0]);
            form.append('LeagueStatusIDs[]', LeagueState[1]);
            form.append('LeagueStatusIDs[]', LeagueState[2]);
        }

        fetch(`${configPort.TetaSport}${configUrl.GetLeaguesBySearch}`, {
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
                case 210:
                    this.setState({ Leagues: 'لیگی برای نمایش یافت نشد', isStillLoading: false, });
                    return false;
                case 401:
                    LogoutSoft();
                    this.setState({ Leagues: 'برای استفاده از این گزینه باید شهر و استان خود را در بخش ویرایش پروفایل مشخص کنید', isStillLoading: false, });
                    return false;
                case 404:
                    this.setState({ Leagues: 'برای استفاده از این گزینه باید شهر و استان خود را در بخش ویرایش پروفایل مشخص کنید', isStillLoading: false, });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({ Leagues: 'خطای سرور', isStillLoading: false, });
                    return false;
                default:
                    this.setState({ isStillLoading: false, Leagues:'' });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Leagues) {
                        this.setState({
                            resLeagues: JSON.parse(JSON.stringify(data.Leagues)),
                            isStillLoading: false,
                        });
                        if (data.Leagues.length === 0) {
                            this.setState({
                                Leagues: 'لیگی برای نمایش موجود نیست',
                                isStillLoading: false,
                            });
                        }
                    } else {
                        this.setState({
                            Leagues: data.MSG,
                            resLeagues: [],
                            isStillLoading: false,
                        });
                    }
                }
            });

    }

    // توابع تغییر چک باکس ها
    handleFutsal = () => {

        this.setState({ futsalChecked: !this.state.futsalChecked });
        if (this.state.futsalChecked) {
            //حذف آیدی ورزش مورد نظر از لوکال استوریج
            localStorage.removeItem('SportIDs');
            if (SportsIDs.indexOf(2) === 1) {
                SportsIDs.pop();
            }
            if (SportsIDs.indexOf(2) === 0) {
                SportsIDs.shift();
            }
            //حذف آیدی ورزش مورد نظر از آرایه سراسری 
            if (Sports.indexOf(2) === 1) {
                Sports.pop();
            }
            if (Sports.indexOf(2) === 0) {
                Sports.shift();
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

        if (!this.state.futsalChecked) {
            //افزودن آیدی ورزش مورد نظر به آرایه سراسری 
            if (Sports.indexOf(2) === -1) {
                Sports.push(2);
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();

        }

    }
    handleFootball = () => {

        this.setState({ footballChecked: !this.state.footballChecked });

        if (this.state.footballChecked) {
            //حذف آیدی ورزش مورد نظر از لوکال استوریج
            localStorage.removeItem('SportIDs');
            if (SportsIDs.indexOf(1) === 1) {
                SportsIDs.pop();
            }
            if (SportsIDs.indexOf(1) === 0) {
                SportsIDs.shift();
            }
            //حذف آیدی ورزش مورد نظر از آرایه سراسری 
            if (Sports.indexOf(1) === 1) {
                Sports.pop();
            }
            if (Sports.indexOf(1) === 0) {
                Sports.shift();
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();

        }

        if (!this.state.footballChecked) {
            //افزودن آیدی ورزش مورد نظر به آرایه سراسری 
            if (Sports.indexOf(1) === -1) {
                Sports.push(1);
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

    }
    handleGenderMale = () => {

        this.setState({ genderMaleChecked: !this.state.genderMaleChecked });

        if (this.state.genderMaleChecked) {
            localStorage.removeItem('GenderClassIDs');
            //حذف آیدی ورزش مورد نظر از آرایه سراسری 
            if (Gender.indexOf(1) === 1) {
                Gender.pop();
            }
            if (Gender.indexOf(1) === 0) {
                Gender.shift();
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

        if (!this.state.genderMaleChecked) {
            //افزودن آیدی ورزش مورد نظر به آرایه سراسری 
            if (Gender.indexOf(1) === -1) {
                Gender.push(1);
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

    }
    handleGenderFemale = () => {

        this.setState({ genderFemaleChecked: !this.state.genderFemaleChecked });

        if (this.state.genderFemaleChecked) {
            localStorage.removeItem('GenderClassIDs');
            //حذف آیدی ورزش مورد نظر از آرایه سراسری 
            if (Gender.indexOf(2) === 1) {
                Gender.pop();
            }
            if (Gender.indexOf(2) === 0) {
                Gender.shift();
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

        if (!this.state.genderFemaleChecked) {
            //افزودن آیدی ورزش مورد نظر به آرایه سراسری 
            if (Gender.indexOf(2) === -1) {
                Gender.push(2);
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

    }
    handleHasGift = () => {

        this.setState({ hasGiftChecked: !this.state.hasGiftChecked });

        if (this.state.hasGiftChecked) {
            localStorage.removeItem('AwardStatusIDs');
            //حذف آیدی ورزش مورد نظر از آرایه سراسری 
            if (Gift.indexOf(1) === 1) {
                Gift.pop();
            }
            if (Gift.indexOf(1) === 0) {
                Gift.shift();
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

        if (!this.state.hasGiftChecked) {
            //افزودن آیدی ورزش مورد نظر به آرایه سراسری 
            if (Gift.indexOf(1) === -1) {
                Gift.push(1);
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

    }
    handleNoGift = () => {

        this.setState({ noGiftChecked: !this.state.noGiftChecked });

        if (this.state.noGiftChecked) {
            localStorage.removeItem('AwardStatusIDs');
            //حذف آیدی ورزش مورد نظر از آرایه سراسری 
            if (Gift.indexOf(2) === 1) {
                Gift.pop();
            }
            if (Gift.indexOf(2) === 0) {
                Gift.shift();
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

        if (!this.state.noGiftChecked) {
            //افزودن آیدی ورزش مورد نظر به آرایه سراسری 
            if (Gift.indexOf(2) === -1) {
                Gift.push(2);
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

    }
    handlePlaneForFuture = () => {

        this.setState({ planeForFutureChecked: !this.state.planeForFutureChecked });

        if (this.state.planeForFutureChecked) {
            localStorage.removeItem('LeagueStatusIDs');
            //حذف آیدی ورزش مورد نظر از آرایه سراسری 
            if (LeagueState.indexOf(1) === 2) {
                LeagueState.pop();
            }
            if (LeagueState.indexOf(1) === 1) {
                LeagueState.splice(1, 1);
            }
            if (LeagueState.indexOf(1) === 0) {
                LeagueState.shift();
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

        if (!this.state.planeForFutureChecked) {
            //افزودن آیدی ورزش مورد نظر به آرایه سراسری 
            if (LeagueState.indexOf(1) === -1) {
                LeagueState.push(1);
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }
    }
    handleInprogress = () => {

        this.setState({ inProgressChecked: !this.state.inProgressChecked });

        if (this.state.inProgressChecked) {
            localStorage.removeItem('LeagueStatusIDs');
            //حذف آیدی ورزش مورد نظر از آرایه سراسری 
            if (LeagueState.indexOf(2) === 2) {
                LeagueState.pop();
            }
            if (LeagueState.indexOf(2) === 1) {
                LeagueState.splice(1, 1);
            }
            if (LeagueState.indexOf(2) === 0) {
                LeagueState.shift();
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();

        }

        if (!this.state.inProgressChecked) {
            //افزودن آیدی ورزش مورد نظر به آرایه سراسری 
            if (LeagueState.indexOf(2) === -1) {
                LeagueState.push(2);
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }
    }
    handleDone = () => {

        this.setState({ doneChecked: !this.state.doneChecked });

        if (this.state.doneChecked) {
            localStorage.removeItem('LeagueStatusIDs');
            //حذف آیدی ورزش مورد نظر از آرایه سراسری 
            if (LeagueState.indexOf(3) === 2) {
                LeagueState.pop();
            }
            if (LeagueState.indexOf(3) === 1) {
                LeagueState.splice(1, 1);
            }
            if (LeagueState.indexOf(3) === 0) {
                LeagueState.shift();
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }

        if (!this.state.doneChecked) {
            //افزودن آیدی ورزش مورد نظر به آرایه سراسری 
            if (LeagueState.indexOf(3) === -1) {
                LeagueState.push(3);
            }
            // Api ارسال درخواست به
            this.getNewLeagueFromApi();
        }
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

    // توابع فیلترینگ منو
    handleNearest = () => {
        this.setState({
            near: true,
            popular: false,
            new: false,
        });
        LeagueFilter[0] = 0;
        this.getNewLeagueFromApi();
    }
    heandleNewest = () => {
        this.setState({
            new: true,
            near: false,
            popular: false
        });
        LeagueFilter[0] = 1;
        this.getNewLeagueFromApi();
    }
    handePopular = () => {
        this.setState({
            popular: true,
            new: false,
            near: false
        });
        LeagueFilter[0] = 2;
        this.getNewLeagueFromApi();
    }
    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
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
            Leagues: <div id='Listleague-loading'>
                <div className='Listleague-loading-container'>
                    <img src='/src/icon/teta-logo.png' className='Listleague-loading-icon' alt='loading' />
                    <div className='Listleague-loading-gif'></div>
                </div>
            </div>,
            isStillLoading: true,
            resLeagues: [],
        });

        // Api ارسال درخواست به
        var form = new FormData();
        if (localStorage.getItem('exID')) {
            form.append('UserID', localStorage.getItem('exID'));
        }

        if (LeagueFilter.length === 0) {
            form.append('OrderingID', 2);
        }
        if (LeagueFilter.length !== 0) {
            form.append('OrderingID', LeagueFilter[0]);
        }

        if (this.props.location.search) {
            let query = this.props.location.search.replace('?q=', '');
            form.append('SearchText', query);
        }

        if (Sports.length !== 0) {
            form.append('SportIDs[]', Sports[0]);
            form.append('SportIDs[]', Sports[1]);
        }
        if (Gender.length !== 0) {
            form.append('GenderClassIDs[]', Gender[0]);
            form.append('GenderClassIDs[]', Gender[1]);
        }
        if (Gift.length !== 0) {
            form.append('AwardStatusIDs[]', Gift[0]);
            form.append('AwardStatusIDs[]', Gift[1]);
        }
        if (LeagueState.length !== 0) {
            form.append('LeagueStatusIDs[]', LeagueState[0]);
            form.append('LeagueStatusIDs[]', LeagueState[1]);
            form.append('LeagueStatusIDs[]', LeagueState[2]);
        }

        fetch(`${configPort.TetaSport}${configUrl.GetLeaguesBySearch}`, {
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
                case 210:
                    this.setState({ Leagues: 'لیگی برای نمایش یافت نشد', isStillLoading: false, });
                    return false;
                case 401:
                    LogoutSoft();
                    this.setState({ Leagues: 'برای استفاده از این گزینه باید شهر و استان خود را در بخش ویرایش پروفایل مشخص کنید', isStillLoading: false, });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({ Leagues: 'متاسفانه خطایی رخ داده است دوباره امتحان کنید', isStillLoading: false, });
                    return false;
                default:
                    this.setState({ isStillLoading: false, Leagues: '' });
                    return false;
            }
        }).then(
            data => {
                if (data) {

                    if (data.Leagues) {
                        this.setState({
                            resLeagues: JSON.parse(JSON.stringify(data.Leagues)),
                        });
                        if (data.Leagues.length === 0) {
                            this.setState({
                                Leagues: 'لیگی برای نمایش موجود نیست',
                                isStillLoading: false,
                            });
                        }
                    } else {
                        this.setState({
                            Leagues: data.MSG,
                            resLeagues: [],
                            isStillLoading: false,
                        });

                    }
                } else {
                    this.setState({
                        Leagues: 'لیگی برای نمایش موجود نیست',
                        isStillLoading: false,
                    });
                }
            });

    }

    handleSidebarMenu = () => {
        document.getElementById("League-Sidebar-Accordion").style.display = "block";
        document.getElementById("sideBarMenuButton").style.display = "none";
        document.getElementById("closeSideBar").style.display = "block";
        document.getElementsByClassName("backOpacity")[0].style.opacity = ".4";
        document.getElementsByClassName("backOpacity")[1].style.opacity = ".4";
        this.setState({
            sideBarButton: false
        })

    }
    closeSidebar = () => {
        document.getElementById("League-Sidebar-Accordion").style.display = "none";
        document.getElementById("sideBarMenuButton").style.display = "block";
        document.getElementById("closeSideBar").style.display = "none";
        document.getElementsByClassName("backOpacity")[0].style.opacity = "1";
        document.getElementsByClassName("backOpacity")[1].style.opacity = "1";
        this.setState({
            sideBarButton: true
        })

    }
    handleButtonWhenChecked = () => {
        this.setState({
            sideBarButton: false
        })

    }

    render() {
        if (this.state.futsalChecked) {
            if (SportsIDs.indexOf(2) === -1) {
                SportsIDs.push(2);
            }
            if (SportsIDs.indexOf(2) === 0) {
                localStorage.setItem('SportIDs', JSON.stringify(SportsIDs));

            }
            if (SportsIDs.indexOf(2) === 1) {
                localStorage.setItem('SportIDs', JSON.stringify(SportsIDs));
            }
            // افزودن سورت به آرایه سراسری برای استفاده در فیلترینگ
            if (SortToFilter.indexOf(2) === -1) {
                SortToFilter.push(2);
            }
        } else {
            // حذف سورت از آرایه سراسری برای استفاده در فیلترینگ
            for (let i = 0; i < SortToFilter.length; i++) {
                if (SortToFilter[i] === 1) {
                    SortToFilter.splice(i, 1);
                }
            }

        }

        if (this.state.footballChecked) {
            if (SportsIDs.indexOf(1) === -1) {
                SportsIDs.push(1);
            }
            localStorage.setItem('SportIDs', JSON.stringify(SportsIDs));
            // افزودن سورت به آرایه سراسری برای استفاده در فیلترینگ
            if (SortToFilter.indexOf(1) === -1) {
                SortToFilter.push(1);
            }
        } else {
            // حذف سورت از آرایه سراسری برای استفاده در فیلترینگ
            for (let i = 0; i < SortToFilter.length; i++) {
                if (SortToFilter[i] === 2) {
                    SortToFilter.splice(i, 1);
                }
            }
        }
        if (this.state.genderMaleChecked) {
            localStorage.setItem('GenderClassIDs', 1);
            // افزودن سورت به آرایه سراسری برای استفاده در فیلترینگ
            if (SortToFilter.indexOf(3) === -1) {
                SortToFilter.push(3);
            }
        } else {
            // حذف سورت از آرایه سراسری برای استفاده در فیلترینگ
            for (let i = 0; i < SortToFilter.length; i++) {
                if (SortToFilter[i] === 3) {
                    SortToFilter.splice(i, 1);
                }
            }
        }
        if (this.state.genderFemaleChecked) {
            localStorage.setItem('GenderClassIDs', 2);
            // افزودن سورت به آرایه سراسری برای استفاده در فیلترینگ
            if (SortToFilter.indexOf(4) === -1) {
                SortToFilter.push(4);
            }
        } else {
            // حذف سورت از آرایه سراسری برای استفاده در فیلترینگ
            for (let i = 0; i < SortToFilter.length; i++) {
                if (SortToFilter[i] === 4) {
                    SortToFilter.splice(i, 1);
                }
            }
        }
        if (this.state.hasGiftChecked) {
            localStorage.setItem('AwardStatusIDs', 1);
            // افزودن سورت به آرایه سراسری برای استفاده در فیلترینگ
            if (SortToFilter.indexOf(5) === -1) {
                SortToFilter.push(5);
            }
        } else {
            // حذف سورت از آرایه سراسری برای استفاده در فیلترینگ
            for (let i = 0; i < SortToFilter.length; i++) {
                if (SortToFilter[i] === 5) {
                    SortToFilter.splice(i, 1);
                }
            }
        }
        if (this.state.noGiftChecked) {
            localStorage.setItem('AwardStatusIDs', 2);
            // افزودن سورت به آرایه سراسری برای استفاده در فیلترینگ
            if (SortToFilter.indexOf(6) === -1) {
                SortToFilter.push(6);
            }
        } else {
            // حذف سورت از آرایه سراسری برای استفاده در فیلترینگ
            for (let i = 0; i < SortToFilter.length; i++) {
                if (SortToFilter[i] === 6) {
                    SortToFilter.splice(i, 1);
                }
            }
        }
        if (this.state.doneChecked) {
            localStorage.setItem('LeagueStatusIDs', 3);
            // افزودن سورت به آرایه سراسری برای استفاده در فیلترینگ
            if (SortToFilter.indexOf(7) === -1) {
                SortToFilter.push(7);
            }
        } else {
            // حذف سورت از آرایه سراسری برای استفاده در فیلترینگ
            for (let i = 0; i < SortToFilter.length; i++) {
                if (SortToFilter[i] === 7) {
                    SortToFilter.splice(i, 1);
                }
            }
        }
        if (this.state.inProgressChecked) {
            localStorage.setItem('LeagueStatusIDs', 2);
            // افزودن سورت به آرایه سراسری برای استفاده در فیلترینگ
            if (SortToFilter.indexOf(8) === -1) {
                SortToFilter.push(8);
            }
        } else {
            // حذف سورت از آرایه سراسری برای استفاده در فیلترینگ
            for (let i = 0; i < SortToFilter.length; i++) {
                if (SortToFilter[i] === 8) {
                    SortToFilter.splice(i, 1);
                }
            }
        }
        if (this.state.planeForFutureChecked) {
            localStorage.setItem('LeagueStatusIDs', 1);
            // افزودن سورت به آرایه سراسری برای استفاده در فیلترینگ
            if (SortToFilter.indexOf(9) === -1) {
                SortToFilter.push(9);
            }
        } else {
            // حذف سورت از آرایه سراسری برای استفاده در فیلترینگ
            for (let i = 0; i < SortToFilter.length; i++) {
                if (SortToFilter[i] === 9) {
                    SortToFilter.splice(i, 1);
                }
            }
        }

        //ذخیره مقدار استیت در متغییر
        let futsalInUrl = this.state.futsalChecked;
        let footballInUrl = this.state.footballChecked;
        let genderMaleInUrl = this.state.genderMaleChecked;
        let genderFemaleInUrl = this.state.genderFemaleChecked;
        let hasGiftInUrl = this.state.hasGiftChecked;
        let noGiftInUrl = this.state.noGiftChecked;
        let doneInUrl = this.state.doneChecked;
        let inProgressInUrl = this.state.inProgressChecked;
        let planeForFutureInUrl = this.state.planeForFutureChecked;

        let str = this.props.location.pathname;
        let splitStr = str.split("/");
        for (let i = 1; i < splitStr.length; i++) {
            switch (splitStr[i]) {
                case '1':
                case 'football':
                    footballInUrl = true;

                    if (SportsIDs.indexOf(1) === -1) {
                        SportsIDs.push(1);
                    }
                    if (SportsIDs.indexOf(1) === 0) {
                        localStorage.setItem('SportIDs', JSON.stringify(SportsIDs));

                    }
                    if (SportsIDs.indexOf(1) === 1) {
                        localStorage.setItem('SportIDs', JSON.stringify(SportsIDs));

                    }
                    break;
                case '2':
                case 'futsal':
                    futsalInUrl = true;
                    if (SportsIDs.indexOf(2) === -1) {
                        SportsIDs.push(2);
                    }
                    localStorage.setItem('SportIDs', JSON.stringify(SportsIDs));
                    break;
                case '3':
                case 'male':
                    genderMaleInUrl = true;
                    break;
                case '4':
                case 'female':
                    genderFemaleInUrl = true;
                    break;
                case '5':
                case 'gift':
                    hasGiftInUrl = true;
                    break;
                case '6':
                case 'nogift':
                    noGiftInUrl = true;
                    break;
                case '7':
                case 'done':
                    doneInUrl = true;
                    break;
                case '8':
                case 'progress':
                    inProgressInUrl = true;
                    break;
                case '9':
                case 'planning':
                    planeForFutureInUrl = true;
                    break;
                default:
            }
        }

        //فیلترینگ منو
        if (this.state.near) {
            localStorage.removeItem('OrderingID');
            localStorage.setItem('OrderingID', 2);
        }
        if (this.state.new) {
            localStorage.removeItem('OrderingID');
            localStorage.setItem('OrderingID', 0)
        }
        if (this.state.popular) {
            localStorage.removeItem('OrderingID');
            localStorage.setItem('OrderingID', 1)
        }

        // لیست لیگ ها
        let leagues = this.state.resLeagues;
        let loading = this.state.isStillLoading;

        // Url امکان استفاده از سورت و فیلترینگ به طور همزمان در
        let sortWihFilters = '';
        sortWihFilters = SortToFilter.join('/');
        if (sortWihFilters.indexOf(sortWihFilters.length - 1) !== '/' && SortToFilter.length !== 0) {
            sortWihFilters = sortWihFilters + '/';
        }

        let sQueryWithFilter = '';
        let stringQuery = this.props.location.search;
        if (stringQuery.length !== 0) {
            sQueryWithFilter = stringQuery;
        }
        // اگر لیگی برای نمایش موجود بود

        // تایتل صفحه
        document.getElementsByTagName("title")[0].innerHTML = `لیگ های تتا اسپرت`;

        if (leagues.length !== 0 && !loading) {

            return (
                <Fragment>
                    {/* بخش سایدبار */}
                    <Accordion accordion={false} id="League-Sidebar-Accordion" className={`${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion--dark' : 'League-Sidebar-Accordion'}`} >
                        <AccordionItem>
                            <AccordionItemTitle className={`${localStorage.getItem('theme') === 'dark' ? 'accordion__title accordion__title--dark ' : 'accordion__title'}`}>
                                <h3 className={`u-position-relative ${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion-header-text--dark' : 'League-Sidebar-Accordion-header-text'}`}>
                                    انتخاب رشته ورزشی
                            <div className="accordion__arrow" role="presentation" />
                                </h3>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('football', this.state.footballChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="futsallChecked" defaultChecked={footballInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleFootball} />
                                    <label className="custom-control-label" htmlFor="futsallChecked">فوتبال</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('futsal', this.state.futsalChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="futballChecked" defaultChecked={futsalInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleFutsal} />
                                    <label className="custom-control-label" htmlFor="futballChecked">فوتسال</label>
                                </div>

                            </AccordionItemBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionItemTitle className={`${localStorage.getItem('theme') === 'dark' ? 'accordion__title accordion__title--dark ' : 'accordion__title'}`}>
                                <h3 className={`u-position-relative ${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion-header-text--dark' : 'League-Sidebar-Accordion-header-text'}`}>
                                    جنسیت شرکت کننده ها
                            <div className="accordion__arrow" role="presentation" />
                                </h3>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('male', this.state.genderMaleChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="maleChecked" defaultChecked={genderMaleInUrl} onChange={this.handleGenderMale} onClick={this.handleButtonWhenChecked} />
                                    <label className="custom-control-label" htmlFor="maleChecked">آقا</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('female', this.state.genderFemaleChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="femaleChecked" defaultChecked={genderFemaleInUrl} onChange={this.handleGenderFemale} onClick={this.handleButtonWhenChecked} />
                                    <label className="custom-control-label" htmlFor="femaleChecked">خانم</label>
                                </div>
                            </AccordionItemBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionItemTitle className={`${localStorage.getItem('theme') === 'dark' ? 'accordion__title accordion__title--dark ' : 'accordion__title'}`}>
                                <h3 className={`u-position-relative ${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion-header-text--dark' : 'League-Sidebar-Accordion-header-text'}`}>
                                    <div className="accordion__arrow" role="presentation" />
                                    جایزه
                                </h3>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('gift', this.state.hasGiftChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="haveGiftChecked" defaultChecked={hasGiftInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleHasGift} />
                                    <label className="custom-control-label" htmlFor="haveGiftChecked">دارد</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('nogift', this.state.noGiftChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="NoGiftChecked" defaultChecked={noGiftInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleNoGift} />
                                    <label className="custom-control-label" htmlFor="NoGiftChecked">ندارد</label>
                                </div>
                            </AccordionItemBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionItemTitle className={`${localStorage.getItem('theme') === 'dark' ? 'accordion__title accordion__title--dark ' : 'accordion__title'}`}>
                                <h3 className={`u-position-relative ${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion-header-text--dark' : 'League-Sidebar-Accordion-header-text'}`}>
                                    وضعیت لیگ
                                <div className="accordion__arrow" role="presentation" />
                                </h3>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('done', this.state.doneChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="doneChecked" defaultChecked={doneInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleDone} />
                                    <label className="custom-control-label" htmlFor="doneChecked">خاتمه یافته</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('progress', this.state.inProgressChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="inProgressChecked" defaultChecked={inProgressInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleInprogress} />
                                    <label className="custom-control-label" htmlFor="inProgressChecked">در حال اجرا</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('planning', this.state.planeForFutureChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="planForFutureChecked" defaultChecked={planeForFutureInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handlePlaneForFuture} />
                                    <label className="custom-control-label" htmlFor="planForFutureChecked">برنامه ریزی شده برای آینده</label>
                                </div>
                            </AccordionItemBody>
                        </AccordionItem>

                    </Accordion>

                    {/* بخش فیلترینگ منو */}
                    <div className="row widthInMobile" style={{ marginTop: 22 }} >
                        <div className="input-group League-searchbox-styles" >
                            <input className="form-control py-2 border" type="search" placeholder='... نام لیگ' value={this.state.searchTxt} onChange={this.handleSearchText} onKeyDown={this.sendSearchReq} id="League-searchbox-val" style={{ height: 59, textAlign: 'right', fontFamily: 'iranyekanBold', background: '#F3F3F3' }} />
                            <span className="input-group-append">
                                <button className="btn btn-outline-secondary border-left-0 border " type="button" style={{ background: '#F3F3F3', paddingBottom: 0, }}>
                                    <span style={{ border: '1px solid #4A4A4A', height: 45, display: 'inline-block' }}></span>
                                    <span id='searchAllLeagues' className='League-searchbox-btn' onClick={this.handlesearchIcon}></span>
                                </button>
                            </span>
                            <div style={{ display: (this.state.isStillLoading) ? 'none' : 'block' }}>
                                <span id="sideBarMenuButton" className="sideBarMenuButton mt-2 ml-3" type="buttom" onClick={this.handleSidebarMenu} style={this.state.sideBarButton ? { display: 'block' } : { display: 'none' }} ></span>
                            </div>
                            <span id="closeSideBar" className="closeSideBar mt-2 ml-3" onClick={this.closeSidebar} style={this.state.sideBarButton ? { display: 'none' } : { display: 'block' }} ></span>
                        </div>
                        <div className="sorting backOpacity"  >

                            <span className="mx-2">
                                <NavLink activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text-active--dark' : 'League-filter-navbar-text-active'}`} className={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text--dark' : 'League-filter-navbar-text'} lockLinks`} style={{ textDecoration: 'none' }} onClick={this.handleNearest} to={`/leagues/near/${sortWihFilters}${sQueryWithFilter}`}>نزدیک ترین</NavLink>
                            </span>
                            <span className="mx-2">
                                <NavLink activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text-active--dark' : 'League-filter-navbar-text-active'}`} className={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text--dark' : 'League-filter-navbar-text'} lockLinks`} style={{ textDecoration: 'none' }} onClick={this.heandleNewest} to={`/leagues/new/${sortWihFilters}${sQueryWithFilter}`}>تازه ترین</NavLink>
                            </span>
                            <span className="mx-2">
                                <NavLink activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text-active--dark' : 'League-filter-navbar-text-active'}`} className={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text--dark' : 'League-filter-navbar-text'} lockLinks`} style={{ textDecoration: 'none' }} onClick={this.handePopular} to={`/leagues/popular/${sortWihFilters}${sQueryWithFilter}`}>پربازدید ترین</NavLink>
                            </span>
                        </div>
                    </div>
                    {/* لیست لیگ ها */}
                    <div id='tetaSport-Leagues' className='league-container backOpacity'>
                        <div className='leagueContent-left-container-joinedLeague' style={{ zIndex: '-1' }}>
                            <div className='row' style={{ marginLeft: '0', marginRight: '0' }}>
                                {
                                    leagues.map((lg, index) => {
                                        //آیدی لیگ
                                        let lgId = hashid.encode(lg.LeagueID);
                                        let lgTitle = lg.LeagueTitle.replace(' ', '-');
                                        let lgCity = (lg.City !== null && lg.City !== undefined) ? lg.City.replace(' ', '-') : '';
                                        let lgSport = lg.Sport.replace(' ', '-');
                                        let lgAdminName = lg.AdminName.replace(' ', '-');

                                        return (

                                            <Fragment key={index}>

                                                <div className='col-12 joinedLeagu-box lockLinks'>
                                                    <a className='joinedLeagu-box-Link' href={`/leagueProfile/matchInfo/L/${lgTitle}-${lgAdminName}-${lgSport}-${lgCity}-تتااسپرت/${lgId}`}>
                                                        <div className='myLeagues-box' style={{ background: `url(/src/backgrounds/leagueDefaultBackground${lg.LeagueCoverPhotoID}.jpg) no-repeat` }}>
                                                            <div className='myLeagues-box-header'></div>

                                                            <div className='myLeagues-box-content'>
                                                                <div className='myLeagues-box-content-txt'>
                                                                    <h2 className='myLeagues-box-content-league-title'>لیگ {lg.LeagueTitle}</h2>
                                                                    <h5 className='myLeagues-box-content-league-player-name'>({lg.AdminUsername}) {lg.AdminName}</h5>
                                                                </div>
                                                                <div className='myLeagues-box-player-avatar myLeagues-box-player-avatar-mm'>
                                                                    <img className='myLeagues-box-player-avatar-img' src={lg.LeagueAvatar} alt='league avatar' />
                                                                </div>
                                                            </div>

                                                            <div className='myLeagues-box-footer'>
                                                                <div className='myLeagues-box-footer-location'>
                                                                    <div className='myLeagues-box-footer-location-map'>
                                                                        <span className='myLeagues-box-footer-location-map-icon'></span>
                                                                        <span className='myLeagues-box-footer-location-map-txt'>{lg.City}</span>
                                                                    </div>
                                                                </div>
                                                                <div className='myLeagues-box-footer-tags'>
                                                                    <p className='myLeagues-box-footer-tags-txt'>{lg.Sport} / {lg.GenderCategory}/ {lg.AgeCategory} / {lg.Award}</p>
                                                                </div>
                                                                <div className='myLeagues-box-footer-description'>
                                                                    <p className='myLeagues-box-footer-description-txt'>{lg.LeagueStatus} ، {lg.TeamCount} تیم</p>
                                                                </div>
                                                            </div>
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

                    {/* بخش سایدبار */}
                    <Accordion accordion={false} id="League-Sidebar-Accordion" className={`${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion--dark' : 'League-Sidebar-Accordion'}`} >
                        <AccordionItem>
                            <AccordionItemTitle className={`${localStorage.getItem('theme') === 'dark' ? 'accordion__title accordion__title--dark ' : 'accordion__title'}`}>
                                <h3 className={`u-position-relative ${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion-header-text--dark' : 'League-Sidebar-Accordion-header-text'}`}>
                                    انتخاب رشته ورزشی
                                    <div className="accordion__arrow" role="presentation" />
                                </h3>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('football', this.state.footballChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="futsallChecked" defaultChecked={footballInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleFootball} />
                                    <label className="custom-control-label" htmlFor="futsallChecked">فوتبال</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('futsal', this.state.futsalChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="futballChecked" defaultChecked={futsalInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleFutsal} />
                                    <label className="custom-control-label" htmlFor="futballChecked">فوتسال</label>
                                </div>
                            </AccordionItemBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionItemTitle className={`${localStorage.getItem('theme') === 'dark' ? 'accordion__title accordion__title--dark ' : 'accordion__title'}`}>
                                <h3 className={`u-position-relative ${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion-header-text--dark' : 'League-Sidebar-Accordion-header-text'}`}>
                                    جنسیت شرکت کننده ها
                            <div className="accordion__arrow" role="presentation" />
                                </h3>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('male', this.state.genderMaleChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="maleChecked" defaultChecked={genderMaleInUrl} onChange={this.handleGenderMale} onClick={this.handleButtonWhenChecked} />
                                    <label className="custom-control-label" htmlFor="maleChecked">آقا</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('female', this.state.genderFemaleChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="femaleChecked" defaultChecked={genderFemaleInUrl} onChange={this.handleGenderFemale} onClick={this.handleButtonWhenChecked} />
                                    <label className="custom-control-label" htmlFor="femaleChecked">خانم</label>
                                </div>
                            </AccordionItemBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionItemTitle className={`${localStorage.getItem('theme') === 'dark' ? 'accordion__title accordion__title--dark ' : 'accordion__title'}`}>
                                <h3 className={`u-position-relative ${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion-header-text--dark' : 'League-Sidebar-Accordion-header-text'}`}>
                                    <div className="accordion__arrow" role="presentation" />
                                    جایزه
                                </h3>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('gift', this.state.hasGiftChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="haveGiftChecked" defaultChecked={hasGiftInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleHasGift} />
                                    <label className="custom-control-label" htmlFor="haveGiftChecked">دارد</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('nogift', this.state.noGiftChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="NoGiftChecked" defaultChecked={noGiftInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleNoGift} />
                                    <label className="custom-control-label" htmlFor="NoGiftChecked">ندارد</label>
                                </div>
                            </AccordionItemBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionItemTitle className={`${localStorage.getItem('theme') === 'dark' ? 'accordion__title accordion__title--dark ' : 'accordion__title'}`}>
                                <h3 className={`u-position-relative ${localStorage.getItem('theme') === 'dark' ? 'League-Sidebar-Accordion-header-text--dark' : 'League-Sidebar-Accordion-header-text'}`}>
                                    وضعیت لیگ
                                <div className="accordion__arrow" role="presentation" />
                                </h3>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('done', this.state.doneChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="doneChecked" defaultChecked={doneInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleDone} />
                                    <label className="custom-control-label" htmlFor="doneChecked">خاتمه یافته</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('progress', this.state.inProgressChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="inProgressChecked" defaultChecked={inProgressInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handleInprogress} />
                                    <label className="custom-control-label" htmlFor="inProgressChecked">در حال اجرا</label>
                                </div>
                                <div className="custom-control custom-checkbox" onClick={() => { this.sort('planning', this.state.planeForFutureChecked) }}>
                                    <input type="checkbox" className="custom-control-input" id="planForFutureChecked" defaultChecked={planeForFutureInUrl} onClick={this.handleButtonWhenChecked} onChange={this.handlePlaneForFuture} />
                                    <label className="custom-control-label" htmlFor="planForFutureChecked">برنامه ریزی شده برای آینده</label>
                                </div>
                            </AccordionItemBody>
                        </AccordionItem>
                    </Accordion>

                    {/* بخش فیلترینگ منو */}
                    <div className="row"  >
                        <div className="input-group League-searchbox-styles" >
                            <input className="form-control py-2 border" type="search" placeholder='... نام لیگ' value={this.state.searchTxt} onChange={this.handleSearchText} onKeyDown={this.sendSearchReq} id="League-searchbox-val" style={{ height: 58, textAlign: 'right', fontFamily: 'iranyekanBold', background: '#F3F3F3' }} />
                            <span className="input-group-append">
                                <button className="btn btn-outline-secondary border-left-0 border " type="button" style={{ background: '#F3F3F3', paddingBottom: 0, }}>
                                    <span style={{ border: '1px solid #4A4A4A', height: 45, display: 'inline-block' }}></span>
                                    <span id='searchAllLeagues' className='League-searchbox-btn' onClick={this.handlesearchIcon}></span>
                                </button>
                            </span>

                            <div style={{ display: (this.state.isStillLoading) ? 'none' : 'block' }}>
                                <span id="sideBarMenuButton" className="sideBarMenuButton mt-2 ml-3" type="buttom" onClick={this.handleSidebarMenu} style={this.state.sideBarButton ? { display: 'block' } : { display: 'none' }} ></span>
                            </div>
                            <span id="closeSideBar" className="closeSideBar mt-2 ml-3" onClick={this.closeSidebar} style={this.state.sideBarButton ? { display: 'none' } : { display: 'block' }} ></span>

                        </div>

                        <div className="sorting backOpacity"  >

                            <span className="mx-2">
                                <NavLink activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text-active--dark' : 'League-filter-navbar-text-active'}`} className={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text--dark' : 'League-filter-navbar-text'} lockLinks`} style={{ textDecoration: 'none' }} onClick={this.handleNearest} to={`/leagues/near/${sortWihFilters}${sQueryWithFilter}`}>نزدیک ترین</NavLink>
                            </span>
                            <span className="mx-2">
                                <NavLink activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text-active--dark' : 'League-filter-navbar-text-active'}`} className={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text--dark' : 'League-filter-navbar-text'} lockLinks`} style={{ textDecoration: 'none' }} onClick={this.heandleNewest} to={`/leagues/new/${sortWihFilters}${sQueryWithFilter}`}>تازه ترین</NavLink>
                            </span>
                            <span className="mx-2">
                                <NavLink activeClassName={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text-active--dark' : 'League-filter-navbar-text-active'}`} className={`${localStorage.getItem('theme') === 'dark' ? 'League-filter-navbar-text--dark' : 'League-filter-navbar-text'} lockLinks`} style={{ textDecoration: 'none' }} onClick={this.handePopular} to={`/leagues/popular/${sortWihFilters}${sQueryWithFilter}`}>پربازدید ترین</NavLink>
                            </span>


                        </div>
                    </div>

                    {/* لیست لیگ ها */}
                    <div id='tetaSport-Leagues' className='league-container backOpacity'>
                        <div className='leagueContent-left-container-joinedLeague'>
                            <div className='row' style={{ textAlign: 'center', fontFamily: 'iranyekanRegular', fontSize: 20, background: '#eff5f0' }}>
                                <div className='col-md-12'>
                                    <span>{this.state.Leagues}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </Fragment>
            );

        }
    }
}

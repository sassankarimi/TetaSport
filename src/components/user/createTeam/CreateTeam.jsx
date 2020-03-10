import React, { Component, Fragment } from 'react';
import Swiper from 'react-id-swiper/lib/ReactIdSwiper.full';
import 'react-id-swiper/src/styles/css/swiper.css';
import { Navigation } from 'swiper/dist/js/swiper.esm';
import ImageUploader from 'react-images-upload';
import { getBase64 } from '../../../jsFunctions/all';
import { toast } from 'react-toastify';
import Hashids from 'hashids';
import { handleMSG } from '../../../jsFunctions/all.js';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../jsFunctions/all.js';
import Logout from '../logout/UserLogout';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';



//متغییر های سراسری
let hashid = new Hashids('', 7);
let createTeamBackgroundId = 0;
let teamAvatar = '/src/icon/photo-camera.png';

export class CreateTeam extends Component {
    static displayName = CreateTeam.name;
    constructor(props) {
        super(props);
        this.state = {
            timeOut: 0,
            searchValue: '',
            loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            searchPlayers: [],
            exceptThesePlayers: [],
            createTeamName: '',
            TeamSport: 0,
            TeamGender: 0,
            TeamAgeRange: 0,
            teamDescription: '',
            teamCaptain: 0,
            provinces: [],
            TeamProvince: '',
            cities: [],
            TeamCity: '',
            /*برای کراپ*/
            imageSrc: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 3,
            croppedAreaPixels: null,
            croppedImage: null,

        }
        this.handleSearchBtn = this.handleSearchBtn.bind(this);
    }

    componentDidMount() {
        // دریافت استان
        if (this.state.provinces.length === 0) {
            let form = new FormData();
            form.append('UserID', localStorage.getItem('exID'));
            fetch(`${configPort.TetaSport}${configUrl.GetProvinces}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                },
                body:form
            }).then(response => {
                let code = response.status;
                switch (code) {
                    case 200:
                        return response.json();
                    case 420:
                        LogoutSoft({ ...this.props });
                        return false;
                    default:
                        return false;
                }
            }).then(
                data => {
                    if (data) {
                        if (data.Provinces) {
                            this.setState({ provinces: data.Provinces });
                        }
                    }
                });
        }

    }

    handleSports = (e) => {
        this.setState({ TeamSport: e.target.value });
    }
    handleGenders = (e) => {
        this.setState({ TeamGender: e.target.value });
    }
    handleAgeRange = (e) => {
        this.setState({ TeamAgeRange: e.target.value });
    }
    handleCaptain = (e) => {
        this.setState({ teamCaptain: e.target.value });
    }

    handleTeamCity = (e) => {
        this.setState({ TeamCity: e.target.value })
    }

    handleSearchBox = (e) => {
        let searchTxt = e.target.value;
        this.setState({
            searchValue: e.target.value,
        })
        if (e.target.value !== '') {
            document.getElementById('createTeam-search-result').style.opacity = 1;
            document.getElementById('createTeam-search-result').style.visibility = 'visible';
            document.getElementById('createTeam-search-result').style.zIndex = 10000;
        } else {
            document.getElementById('createTeam-search-result').style.opacity = 0;
            document.getElementById('createTeam-search-result').style.visibility = 'hidden';
            document.getElementById('createTeam-search-result').style.zIndex = -1;
        }

        if (e.target.value !== '') {
            if (this.state.timeOut) clearTimeout(this.state.timeOut);
            this.setState({
                searchPlayers: [],
                loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
                timeOut: setTimeout(() => { this.getSearchPlayers(searchTxt) }, 500),
            })
            //تابع سرچ
        } else {
            this.setState({
                searchPlayers: [],
                loadingOrNoResult: null
            })
        }
    }

    getSearchPlayers = (txt) => {
        this.setState({
            loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
        });
        //دریافت بازیکنان
        var form = new FormData();
        form.append('SearchText', txt);
        for (let i = 0; i < this.state.exceptThesePlayers.length; i++) {
            let EceptArray = [];
            EceptArray.push(this.state.exceptThesePlayers[i].PlayerID);
            form.append('ExceptTheseIDs[]', EceptArray);
        }
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.SearchAmongAllPlayersButList}`, {
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
                case 500:
                    this.setState({
                        loadingOrNoResult: 'خطایی رخ داده است',
                    });
                    return false;
                default:
            }
        }).then(
            data => {
                if (data) {
                    if (data.Players) {
                        if (data.Players.length !== 0) {
                            this.setState({
                                searchPlayers: data.Players,
                                loadingOrNoResult: null,
                            });
                        } else {
                            this.setState({
                                loadingOrNoResult: 'چیزی برای نمایش موجود نیست',
                                searchPlayers: [],
                            });
                        }
                    }
                }
            });
    }

    addNewPlayerToTeam = (playerID, playerName, playerUserName, avatar) => {
        let obj = { 'PlayerID': playerID, 'PlayerName': playerName, 'PlayerUserName': playerUserName, 'PlayerAvatar': avatar };

        this.setState({
            searchPlayers: [...this.state.searchPlayers, obj],
            exceptThesePlayers: [...this.state.exceptThesePlayers, obj],
        })

        document.getElementById('createTeam-search-result').style.opacity = 0;
        document.getElementById('createTeam-search-result').style.visibility = 'hidden';
        document.getElementById('createTeam-search-result').style.zIndex = -1;

    }

    handleSearchBtn = () => {
        this.setState({
            searchPlayers: [],
        })
        if (this.state.searchValue !== '') {
            this.getSearchPlayers(this.state.searchValue);
            document.getElementById('createTeam-search-result').style.opacity = 1;
            document.getElementById('createTeam-search-result').style.visibility = 'visible';
            document.getElementById('createTeam-search-result').style.zIndex = 10000;
        }

    }

    deleteTeamFromLeague = (playerId) => {
        let allPlayer = this.state.exceptThesePlayers;

        let filtered = allPlayer.filter((player) => {
            return (
                player.PlayerID !== playerId
            )
        })
        let obj = filtered;
        this.setState({
            exceptThesePlayers: obj,
        })

    }

    /*برای کراپ*/
    onCropChange = crop => {
        this.setState({ crop })
    }
    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({ croppedAreaPixels })
    }
    onZoomChange = zoom => {
        this.setState({ zoom })
    }
    showCroppedImageAvatar = async () => {
        const croppedImage = await getCroppedImg(
            this.state.imageSrc,
            this.state.croppedAreaPixels
        )
        this.setState({
            croppedImage,
        })
        teamAvatar = croppedImage;
        this.AvatarUploader.setCroppedImg(croppedImage);
        document.getElementById('crop-me').style.display = 'none';
    }
    handleClose = () => {
        this.setState({ croppedImage: null })
    }

    //تغییر چایلد
    handlerAvatar = (img) => {
        document.getElementById('crop-me').style.display = 'block';
        document.getElementById('croped-AVATAR').style.display = 'block';
        document.getElementById('croped-COVER').style.display = 'none';
        this.setState({
            imageSrc: img
        })
    }
    handlerCover = (img) => {
        document.getElementById('crop-me').style.display = 'block';
        document.getElementById('croped-AVATAR').style.display = 'none';
        document.getElementById('croped-COVER').style.display = 'block';
        this.setState({
            imageSrc: img
        })
    }


    // دریافت شهر
    getCities = (e) => {
        this.setState({
            cities:[],
            TeamCity: '',
            TeamProvince: e.target.value
        });
        let form = new FormData();
        form.append('ProvinceID', e.target.value);
        form.append('UserID', localStorage.getItem('exID'));
        fetch(`${configPort.TetaSport}${configUrl.GetProvinceCities}`, {
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
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Cities) {
                        this.setState({
                            cities: data.Cities,
                        });
                    }
                }
            });

    }

    createTeam = () => {
        //دریافت بازیکنان
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('Name', this.state.createTeamName);
        form.append('SportFieldID', this.state.TeamSport);
        form.append('GenderCategoryID', this.state.TeamGender);
        form.append('AgeCategoryID', this.state.TeamAgeRange);
        if (teamAvatar !== '/src/icon/photo-camera.png') {
            form.append('Avatar', teamAvatar);
        }
        form.append('CoverPhotoID', createTeamBackgroundId);
        form.append('ProvinceID', this.state.TeamProvince);
        form.append('CityID', this.state.TeamCity);
        form.append('Description', this.state.teamDescription);
        form.append('CaptainID', this.state.teamCaptain);
        let EceptArray = [];
        for (let i = 0; i < this.state.exceptThesePlayers.length; i++) {
            EceptArray.push(this.state.exceptThesePlayers[i].PlayerID);
            form.append('PlayersID[]', this.state.exceptThesePlayers[i].PlayerID);
        }
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== '0' && localStorage.getItem('exID') !== null && localStorage.getItem('exID') !== undefined && localStorage.getItem('exID') !== '') {
            if (this.state.createTeamName !== '') {
                if (this.state.TeamSport !== 0) {
                    if (this.state.TeamGender !== 0) {
                        if (this.state.TeamAgeRange !== 0) {
                            if (this.state.TeamProvince !== '') {
                                if (this.state.TeamCity !== '') {
                                    if (createTeamBackgroundId !== 0) {
                                        if (EceptArray.length !== 0) {
                                            if (this.state.teamCaptain !== 0) {
                                                fetch(`${configPort.TetaSport}${configUrl.AddTeam}`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Accept': 'application/json',
                                                        'Authorization': localStorage.getItem('Token')
                                                    },
                                                    body: form
                                                }).then(response => {
                                                    let code = response.status;
                                                    switch (code) {
                                                        case 201:
                                                            toast.success(
                                                                <div className='toasty-div'>
                                                                    <span className='toasty-header'>تیم با موفقیت ساخته شد</span>
                                                                    <span className='toasty-body'>درحال ارسال شما به صفحه تیم...</span>
                                                                </div>
                                                                , { position: toast.POSITION.TOP_CENTER, pauseOnHover: false, closeOnClick: false, draggable: false, pauseOnVisibilityChange: false, closeButton: false }
                                                            );
                                                            this.setState({
                                                                searchPlayers: [],
                                                                exceptThesePlayers: [],
                                                                createTeamName: '',
                                                                TeamSport: 0,
                                                                TeamGender: 0,
                                                                TeamAgeRange: 0,
                                                                teamDescription: '',
                                                                teamCaptain: 0,
                                                                provinces: [],
                                                                TeamProvince: '',
                                                                cities: [],
                                                                TeamCity: '',
                                                            })
                                                            teamAvatar = '/src/icon/photo-camera.png';
                                                            createTeamBackgroundId = 0;
                                                            document.getElementById('createTeamSelectedItem1').style.opacity = 0;
                                                            document.getElementById('createTeamSelectedItem2').style.opacity = 0;
                                                            document.getElementById('createTeamSelectedItem3').style.opacity = 0;
                                                            document.getElementById('createTeamSelectedItem4').style.opacity = 0;
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
                                                }).then(data => {
                                                    if (data) {
                                                        let teamID = hashid.encode(data.TeamID);
                                                        setTimeout(function () {
                                                            this.props.history.push(`teamProfile/${teamID}`);
                                                        }.bind(this), 5000)
                                                    }

                                                })


                                            } else {
                                                toast.error("! انتخاب کاپیتان الزامی است", { position: toast.POSITION.TOP_CENTER });
                                            }
                                        } else {
                                            toast.error("! بازیکنان تیم را مشخص کنید", { position: toast.POSITION.TOP_CENTER });
                                        }
                                    } else {
                                        toast.error("! انتخاب عکس کاور برای تیم الزامی است", { position: toast.POSITION.TOP_CENTER });
                                    }
                                } else {
                                    toast.error("! شهر تیم را انتخاب کنید", { position: toast.POSITION.TOP_CENTER });
                                }
                            } else {
                                toast.error("! استان تیم را انتخاب کنید", { position: toast.POSITION.TOP_CENTER });
                            }
                        } else {
                            toast.error("! محدوده سنی تیم را وارد کنید", { position: toast.POSITION.TOP_CENTER });
                        }
                    } else {
                        toast.error("! جنسیت تیم را وارد کنید", { position: toast.POSITION.TOP_CENTER });
                    }
                } else {
                    toast.error("! نوع ورزش را وارد کنید", { position: toast.POSITION.TOP_CENTER });
                }
            } else {
                toast.error("! نام تیم را وارد کنید", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            this.props.history.replace('/login');
        }

    }


    render() {
        const { searchPlayers, exceptThesePlayers } = this.state;
        const provinces = this.state.provinces;
        const cities = this.state.cities;
        // غیر فعال کردن شهر قبل از استان
        let isCityDisabled = true;
        if (this.state.TeamProvince !== '') {
            isCityDisabled = false;
        } else {
            isCityDisabled = true;
        }
        // تایتل صفحه
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت | ساخت تیم`;
        return (
            <Fragment>
                <div className='createTeam-container'>
                    <div className='row createTeam-searchbox-and-results-container'>
                        {/* بخش سرچ باکس */}
                        <div className="input-group createTeam-searchbox-styles" style={{ direction: 'ltr' }}>
                            <input className="form-control py-2 border" type="search" placeholder='بازیکن مورد نظر را به تیم اضافه کنید' style={{ height: 58, textAlign: 'right', fontFamily: 'iranyekanBold', background: '#F3F3F3' }} value={this.state.searchValue} onChange={this.handleSearchBox} />
                            <span className="input-group-append">
                                <button className="btn btn-outline-secondary border-left-0 border " type="button" style={{ background: '#F3F3F3', paddingBottom: 0 }}>
                                    <span style={{ border: '1px solid #4A4A4A', height: 45, display: 'inline-block' }}></span>
                                    <span className='createTeam-searchbox-btn' onClick={this.handleSearchBtn}></span>
                                </button>
                            </span>
                        </div>
                        <div className='createTeam-search-result' id='createTeam-search-result'>

                            <div className='row'>
                                <div style={{ width: '100%', fontFamily: 'iranYekanBold', fontSize: 15 }}>
                                    {this.state.loadingOrNoResult}
                                </div>



                                {
                                    searchPlayers.map((player, index) => {
                                        let playerAvatar = '/src/icon/defaultAvatar.png';

                                        if (player.PlayerAvatar !== null && player.PlayerAvatar !== undefined && player.PlayerAvatar !== '') {
                                            playerAvatar = player.PlayerAvatar;
                                        }
                                        let userName = `(${player.PlayerUsername})`

                                        return (
                                            <Fragment key={index}>
                                                <div className='col-md-12'>
                                                    <div className='createTeam-search-result-contain'>
                                                        <div className='createTeam-search-result-contain-contain' onClick={() => { this.addNewPlayerToTeam(player.PlayerID, player.PlayerName, player.PlayerUsername, player.PlayerAvatar) }}>
                                                            <div className='createTeam-search-result-contain-avatar'>
                                                                <img src={playerAvatar} className='createTeam-search-result-contain-avatar-img' alt={player.PlayerName} />
                                                            </div>

                                                            <div className='createTeam-search-result-contain-txt'>
                                                                <span className='createTeam-search-result-contain-text-spn'>{player.PlayerName} {userName}</span>
                                                            </div>

                                                            <div className='createTeam-search-result-contain-plus'></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                }

                            </div>

                        </div>
                    </div>

                    <div className='row'>
                        {/* right side */}
                        <div className='col-md-6'>

                            <div className='row'>
                                <div className='col-md-12' style={{ marginBottom: 20 }}>
                                    <img src='/src/icon/createTeamheadIcon.png' alt='create team' className='createTeam-header-img' />
                                    <span className='createTeam-header-title'>ساخت تیم</span>
                                </div>
                                <div className='col-md-12' style={{ marginBottom: 20 }}>
                                    <div className='form-group'>
                                        <input className='form-control createTeam-teamName-input' placeholder='نام تیم خود را وارد کنید' value={this.state.createTeamName} onChange={(e) => { this.setState({ createTeamName: e.target.value }) }} />
                                    </div>
                                </div>
                            </div>

                            <div className='row' style={{ direction: 'rtl', textAlign: 'center', marginBottom: 70 }}>
                                <div className='col-md-6'>
                                    <h3 className='createTeamThreeSelectBoxTitle'>ورزش لیگ</h3>
                                    <select className='createTeamThreeSelectBoxStyle' id="createTeam-leagueSport" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.TeamSport} onChange={this.handleSports}>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}>ـ انتخاب کنید ـ</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="1" style={{ color: '#0D6A12' }}>فوتبال</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="2" style={{ color: '#0D6A12' }}>فوتسال</option>
                                    </select>
                                </div>
                                <div className='col-md-6'>
                                    <h3 className='createTeamThreeSelectBoxTitle'>جنسیت بازیکنان</h3>
                                    <select className='createTeamThreeSelectBoxStyle' id="createTeam-leagueGender" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.TeamGender} onChange={this.handleGenders}>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}>ـ انتخاب کنید ـ</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="1" style={{ color: '#0D6A12' }}>آقا</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="2" style={{ color: '#0D6A12' }}>خانم</option>
                                    </select>
                                </div>
                                <div className='col-md-6'>
                                    <h3 className='createTeamThreeSelectBoxTitle'>رده سنی بازیکنان</h3>
                                    <select className='createTeamThreeSelectBoxStyle' id="createTeam-leagueAges" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.TeamAgeRange} onChange={this.handleAgeRange}>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}>ـ انتخاب کنید ـ</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="1" style={{ color: '#0D6A12' }}>نونهالان(14-10)</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="2" style={{ color: '#0D6A12' }}>نوجوانان(16-14)</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="3" style={{ color: '#0D6A12' }}>جوانان(19-16)</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="4" style={{ color: '#0D6A12' }}>امید(21-19)</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="5" style={{ color: '#0D6A12' }}>بزرگسالان(21 به بالا)</option>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="6" style={{ color: '#0D6A12' }}>تمام رده های سنی</option>
                                    </select>
                                </div>
                                <div className='col-md-6'>
                                    <h3 className='createTeamThreeSelectBoxTitle'>استان</h3>
                                    <select className='createTeamThreeSelectBoxStyle' id="createTeam-leagueSport" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.TeamProvince} onChange={this.getCities}>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}>ـ انتخاب کنید ـ</option>
                                        {
                                            provinces.map((p, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <option className='createTeamThreeSelectBoxStyle-Options' value={p.ProvinceID} style={{ color: '#fff', fontSize: 10 }}>{p.ProvinceName}</option>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-md-6'>
                                    <h3 className='createTeamThreeSelectBoxTitle'>شهر</h3>
                                    <select className='createTeamThreeSelectBoxStyle' id="createTeam-leagueSport" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.TeamCity} onChange={this.handleTeamCity} disabled={isCityDisabled}>
                                        <option className='createTeamThreeSelectBoxStyle-Options' value="" style={{ display: 'none' }}>ـ انتخاب کنید ـ</option>
                                        {
                                            cities.map((city, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <option className='createTeamThreeSelectBoxStyle-Options' value={city.CityID} style={{ color: '#fff', fontSize: 10 }}>{city.CityName}</option>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className='row' style={{ marginBottom: 30 }}>

                                <div className='col-md-12' style={{ paddingLeft: 35 }}>
                                    <div className='createTeamChooseTeamAvatarContainer'>
                                        <TeamAvatarUploader {...this.props} handler={(img) => { this.handlerAvatar(img) }} onRef={ref => (this.AvatarUploader = ref)} />
                                    </div>
                                    <span style={{ fontFamily: 'iranyekanBold', fontSize: 15, color: '#5C5D5B', marginRight: 20 }}>انتخاب عکس آواتار برای لیگ</span>
                                </div>

                            </div>
                            <div className='row' style={{ marginBottom: 30 }}>
                                <div className='col-md-12' style={{ paddingLeft: 35 }}>
                                    <div className='crop-avatar' id='crop-me'>
                                        <div className="crop-avatar-container">
                                            <Cropper
                                                image={this.state.imageSrc}
                                                crop={this.state.crop}
                                                zoom={this.state.zoom}
                                                aspect={this.state.aspect}
                                                onCropChange={this.onCropChange}
                                                onCropComplete={this.onCropComplete}
                                                onZoomChange={this.onZoomChange}
                                                cropSize={{ width: 200, height: 200 }}
                                            />
                                            <div id='croped-AVATAR' className='done-croping-container' onClick={this.showCroppedImageAvatar}>
                                                <span className='done-croping'>تایید آواتار</span>
                                            </div>
                                            <div id='croped-COVER' className='done-croping-container' onClick={this.showCroppedImageCover}>
                                                <span className='done-croping'>تایید کاور</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row' style={{ marginBottom: 30 }}>
                                <div className='col-md-12' style={{ padding: '0px 0px' }}>
                                    <div className='row'>
                                        <div className='col-md-12' style={{ direction: 'ltr', paddingLeft: 50 }}>
                                            <p style={{ fontFamily: 'iranyekanBold', fontSize: 15, color: '#5C5D5B', textAlign: 'right' }}>انتخاب عکس هدر برای لیگ</p>
                                        </div>

                                        <div className='col-md-12 createTeam-swiper'>
                                            <CreateLeagueSwiper />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row' style={{ marginBottom: 30 }}>
                                <div className='col-md-12 createTeam-textarea-header-container'>
                                    <h3 className='createTeam-textarea-header'>توضیحات تیم</h3>
                                </div>
                                <div className='col-md-12 createTeam-textarea-container'>
                                    <textarea className='createTeam-textarea' value={this.state.teamDescription} onChange={(e) => { this.setState({ teamDescription: e.target.value }) }}></textarea>
                                </div>
                            </div>

                        </div>

                        {/* left side */}
                        <div className='col-md-6' style={{ paddingRight: 50, paddingLeft: 50 }}>
                            <div className='row' style={{ paddingTop: 15, marginTop: 40 }}>
                                <div className='addmember-playerList-header'>
                                    <span className='addmember-playerList-header-txt'>لیست اعضای تیم</span>
                                    <div className='addmember-select-container'>
                                        <select className="form-control addmember-select" value={this.state.teamCaptain} onChange={this.handleCaptain}>
                                            <option value={0} style={{ display: 'none' }}>
                                                انتخاب کنید
                                            </option>
                                            {
                                                exceptThesePlayers.map((player, index) => {

                                                    return (
                                                        <Fragment key={index}>
                                                            <option value={player.PlayerID}>
                                                                {player.PlayerName}
                                                            </option>
                                                        </Fragment>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='row' style={{ paddingTop: 15, marginTop: 25, position: 'relative', minHeight: 425 }}>
                                <div className='addmember-playerList'>


                                    {
                                        exceptThesePlayers.map((player, index) => {
                                            let userName = `(${player.PlayerUserName})`
                                            return (
                                                <Fragment key={index}>
                                                    <div className='addmember-playerList-items'>
                                                        <div className='addmember-playerList-items-contain'>
                                                            <span className='addmember-playerList-items-txt'>{player.PlayerName} {`${userName}`}</span>
                                                            <img className='addmember-playerList-items-delete' src='/src/icon/delete-item.png' alt='delete' onClick={() => { this.deleteTeamFromLeague(player.PlayerID) }} />
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            )
                                        })
                                    }

                                </div>
                            </div>
                            <div className='row' style={{ marginTop: 50, textAlign: 'left' }}>
                                <div className='col-md-12'>
                                    <button className='addmember-playerList-requestBtn' onClick={this.createTeam}>ساخت تیم</button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </Fragment>
        );
    }
}

// انتخاب عکس تیم
const CreateLeagueSwiper = (props) => {
    const params = {
        modules: [Navigation],
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3,
        loop: false,
        loopFillGroupWithBlank: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    };

    const leagueCover1Clicked = () => {

        document.getElementById('createTeamSelectedItem1').style.opacity = 1;
        document.getElementById('createTeamSelectedItem2').style.opacity = 0;
        document.getElementById('createTeamSelectedItem3').style.opacity = 0;
        document.getElementById('createTeamSelectedItem4').style.opacity = 0;


        createTeamBackgroundId = 1;
    }
    const leagueCover2Clicked = () => {


        document.getElementById('createTeamSelectedItem1').style.opacity = 0;
        document.getElementById('createTeamSelectedItem2').style.opacity = 1;
        document.getElementById('createTeamSelectedItem3').style.opacity = 0;
        document.getElementById('createTeamSelectedItem4').style.opacity = 0;

        createTeamBackgroundId = 2;
    }
    const leagueCover3Clicked = () => {

        document.getElementById('createTeamSelectedItem1').style.opacity = 0;
        document.getElementById('createTeamSelectedItem2').style.opacity = 0;
        document.getElementById('createTeamSelectedItem3').style.opacity = 1;
        document.getElementById('createTeamSelectedItem4').style.opacity = 0;

        createTeamBackgroundId = 3;
    }
    const leagueCover4Clicked = () => {


        document.getElementById('createTeamSelectedItem1').style.opacity = 0;
        document.getElementById('createTeamSelectedItem2').style.opacity = 0;
        document.getElementById('createTeamSelectedItem3').style.opacity = 0;
        document.getElementById('createTeamSelectedItem4').style.opacity = 1;

        createTeamBackgroundId = 4;
    }


    let selectItem1 = 0;
    let selectItem2 = 0;
    let selectItem3 = 0;
    let selectItem4 = 0;
    switch (createTeamBackgroundId) {
        case 1:
            selectItem1 = 1;
            selectItem2 = 0;
            selectItem3 = 0;
            selectItem4 = 0;
            break;
        case 2:
            selectItem1 = 0;
            selectItem2 = 1;
            selectItem3 = 0;
            selectItem4 = 0;
            break;
        case 3:
            selectItem1 = 0;
            selectItem2 = 0;
            selectItem3 = 1;
            selectItem4 = 0;
            break;
        case 4:
            selectItem1 = 0;
            selectItem2 = 0;
            selectItem3 = 0;
            selectItem4 = 1;
            break;
        default:
    }

    return (
        <Swiper {...params}>

            <div className='createTeamBgs' onClick={leagueCover1Clicked}>
                <img className='createTeamBgs-img' src='/src/backgrounds/CreateLeagueBgs/createLeagueBg1.jpg' alt='1' />
                <span id='createTeamSelectedItem1' className='createTeamSelectedItem' style={{ opacity: selectItem1 }}></span>
            </div>
            <div className='createTeamBgs' onClick={leagueCover2Clicked}>
                <img className='createTeamBgs-img' src='/src/backgrounds/CreateLeagueBgs/createLeagueBg2.jpg' alt='2' />
                <span id='createTeamSelectedItem2' className='createTeamSelectedItem' style={{ opacity: selectItem2 }}></span>
            </div>
            <div className='createTeamBgs' onClick={leagueCover3Clicked}>
                <img className='createTeamBgs-img' src='/src/backgrounds/CreateLeagueBgs/createLeagueBg3.jpg' alt='3' />
                <span id='createTeamSelectedItem3' className='createTeamSelectedItem' style={{ opacity: selectItem3 }}></span>
            </div>
            <div className='createTeamBgs' onClick={leagueCover4Clicked}>
                <img className='createTeamBgs-img' src='/src/backgrounds/CreateLeagueBgs/createLeagueBg4.jpg' alt='4' />
                <span id='createTeamSelectedItem4' className='createTeamSelectedItem' style={{ opacity: selectItem4 }}></span>
            </div>

        </Swiper>
    )
}

// آپلود آواتار 
export class TeamAvatarUploader extends React.Component {
    static displayName = TeamAvatarUploader.name;

    constructor(props) {
        super(props);

        this.state = {
            pictures: [],
            src: teamAvatar
        };
        this.onDrop = this.onDrop.bind(this);

    }

    componentDidMount() {
        this.props.onRef(this);
    };

    onDrop(picture) {
        let file = picture[picture.length - 1];
        let validateFileExt = /\.(gif|jpg|jpeg|png)$/i;
        if (file) {
            if (validateFileExt.test(file.name)) {
                if (file.size < 5242880) {
                    getBase64(file, (result) => {
                        let cardBase64 = result;
                        //ارسال عکس دریافتی از کاربر به دیتابیس
                        this.setState({
                            pictures: this.state.pictures.concat(picture),
                            src: cardBase64
                        });
                        teamAvatar = cardBase64;
                        this.props.handler(cardBase64);

                    });
                } else {
                    toast.error("! سایز فایل انتخاب شده بیش از اندازه میباشد", { position: toast.POSITION.TOP_CENTER });
                }
            } else {
                toast.error("! فرمت فایل انتخابی نادرست است", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            toast.error("! فرمت یا سایز فایل انتخابی نادرست است", { position: toast.POSITION.TOP_CENTER });
        }
    }

    setCroppedImg = (img) => {
        this.setState({
            src: img
        })
    }

    render() {
        const { src } = this.state;
        return (
            <React.Fragment>
                <ImageUploader
                    withIcon={false}
                    buttonText=''
                    buttonStyles={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 115, height: 115, backgroundColor: 'transparent', margin: 0, padding: 0, marginTop: '-15px' }}
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.png']}
                    maxFileSize={5242880}
                    singleImage={true}
                    withLable={false}
                    withPreview={false}
                    label=""
                    fileContainerStyle={{
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        borderColor: 'transparent',
                        width: '115px',
                        height: '115px',
                        borderRadius: '50%',
                        marginLeft: '-3px',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: '1px solid #8D8D8D',
                        padding: 0,
                        margin: 0,
                        marginTop: '-15px',
                    }}
                    fileTypeError="فرمت عکس مورد نظر شما پشتیبانی نمیشود"
                    fileSizeError="سایز عکس شما بیش از اندازه می باشد"

                />
            </React.Fragment>
        );
    }
}



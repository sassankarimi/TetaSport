import React, { Component, Fragment } from 'react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import { toast } from 'react-toastify';
import { LogoutSoft } from '../logout/UserLogout';
import Logout from '../logout/UserLogout';
import { handleMSG } from '../../../jsFunctions/all.js';
import Hashids from 'hashids';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);


export class NewTeam extends Component {
    static displayName = NewTeam.name;

    constructor(props) {
        super(props);
        this.state = {
            timeOut: 0,
            searchValue: '',
            loadingOrNoResult: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            coverPhoto: this.props.CoverPhoto,
            Avatar: this.props.Avatar,
            whichSport: 0,
            whichGender: 0,
            whichAgeRange: 0,
            teamCaptain:0,
            provinces: [],
            cities: [],
            TeamProvince: '',
            TeamCity: '',
            searchPlayers: [],
            exceptThesePlayers: [],
            TshirtNumber: '',
            teamDescription: '',
            createTeamName:'',
            //برای color picker
            displayColorPickerShirtOne: false,
            shirtOneColor: '#fff',
            displayColorPickerShirtTwo: false,
            shirtTwoColor: '#fff',
            //قبل از ارسال درخواست حالت لودینگ
            showThisBtn: <button className={`${localStorage.getItem('theme') === 'dark' ? 'addmember-playerList-requestBtn--dark' : 'addmember-playerList-requestBtn'}`} onClick={this.createTeam}>ساخت تیم</button>,
            orginalBtn: <button className={`${localStorage.getItem('theme') === 'dark' ? 'addmember-playerList-requestBtn--dark' : 'addmember-playerList-requestBtn'}`} onClick={this.createTeam}>ساخت تیم</button>,
            doneBtn: <div className='requestBtn-result-container'><img style={{ height: 36 }} src='src/icon/done-icon.png ' alt='done' /></div>,
            failBtn: <div className='requestBtn-result-container'><img style={{ height: 36 }} src='src/icon/fail-icon.svg ' alt='failed' /></div>,
            btnLoading: <button className={`${localStorage.getItem('theme') === 'dark' ? 'addmember-playerList-requestBtn--dark' : 'addmember-playerList-requestBtn'}`}><img style={{ height: 36 }} src='src/icon/loading.gif ' alt='loading' /></button>,
        }
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
                        if (data.Provinces) {
                            this.setState({ provinces: data.Provinces });
                        }
                    }
                });
        }

    }

    //هندل ورزش
    handleRadioButtonWhichSport = (value) => {
        this.setState({ whichSport: value });
    }

    //هندل جنسیت
    handleRadioButtonWhichGender = (value) => {
        this.setState({ whichGender: value });
    }

    //هندل رده سنی
    handleRadioButtonWhichAgeRange = (value) => {
        this.setState({ whichAgeRange: value });
    }

    //هندل شهر انتخاب شده
    handleTeamCity = (e) => {
        this.setState({ TeamCity: e.target.value })
    }

    //هندل رنگ لباس ۱
    handleShirtOne = (color) => {
        this.setState({ shirtOneColor: color.hex });
    };

    //هندل رنگ لباس 2
    handleShirtTwo = (color) => {
        this.setState({ shirtTwoColor: color.hex });
    };

    //هندل شماره لباس
    handleTshirt = (e) => {
        let onlyNum = /^\d*$/;
        if (onlyNum.test(e.target.value) && e.target.value <= 99) {
            this.setState({
                TshirtNumber: e.target.value
            })
        }
    }

    //1 انتخاب رنگ
    handleClickShirtOne = () => {
        this.setState({ displayColorPickerShirtOne: !this.state.displayColorPickerShirtOne })
    };
    handleCloseShirtOne = () => {
        this.setState({ displayColorPickerShirtOne: false })
    };
    handleChangeShirtOne = (color) => {
        this.setState({ shirtOneColor: color.hex })
    };
    //2 انتخاب رنگ
    handleClickShirtTwo = () => {
        this.setState({ displayColorPickerShirtTwo: !this.state.displayColorPickerShirtTwo })
    };
    handleCloseShirtTwo = () => {
        this.setState({ displayColorPickerShirtTwo: false })
    };
    handleChangeShirtTwo = (color) => {
        this.setState({ shirtTwoColor: color.hex })
    };


    // توابع بخش سرچ
    handleSearchBox = (e) => {
        let searchTxt = e.target.value;
        this.setState({
            searchValue: e.target.value,
        })
        if (this.state.exceptThesePlayers.length < 1) {
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

    addNewCaptainToTeam = (playerID, playerName, playerUserName, avatar) => {
        let obj = { 'PlayerID': playerID, 'PlayerName': playerName, 'PlayerUserName': playerUserName, 'PlayerAvatar': avatar };

        if (this.state.exceptThesePlayers.length < 1) {
            this.setState({
                exceptThesePlayers: [...this.state.exceptThesePlayers, obj],
                teamCaptain: playerID,
            })
        }

        this.setState({ searchPlayers: [] });

        document.getElementById('createTeam-search-result').style.opacity = 0;
        document.getElementById('createTeam-search-result').style.visibility = 'hidden';
        document.getElementById('createTeam-search-result').style.zIndex = -1;

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
            TshirtNumber:'',
        })

    }

    handleSearchBtn = () => {
        this.setState({
            searchPlayers: [],
        })
        if (this.state.exceptThesePlayers.length < 1) {
            if (this.state.searchValue !== '') {
                this.getSearchPlayers(this.state.searchValue);
                document.getElementById('createTeam-search-result').style.opacity = 1;
                document.getElementById('createTeam-search-result').style.visibility = 'visible';
                document.getElementById('createTeam-search-result').style.zIndex = 10000;
            }
        }

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
        //قبل از ارسال
        this.setState({
            showThisBtn: this.state.btnLoading,
        });
        //دریافت بازیکنان
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('Name', this.state.createTeamName);
        form.append('SportFieldID', this.state.whichSport);
        form.append('GenderCategoryID', this.state.whichGender);
        form.append('AgeCategoryID', this.state.whichAgeRange);
        if (this.state.Avatar !== '/src/icon/photo-camera.png') {
            form.append('Avatar', this.props.Avatar);
        }
        form.append('CoverPhotoID', this.props.CoverPhoto); 
        form.append('ProvinceID', this.state.TeamProvince);
        form.append('CityID', this.state.TeamCity);
        form.append('Description', this.state.teamDescription);
        form.append('CaptainID', this.state.teamCaptain);
        let EceptArray = [];
        for (let i = 0; i < this.state.exceptThesePlayers.length; i++) {
            EceptArray.push(this.state.exceptThesePlayers[i].PlayerID);
            form.append('PlayersID[]', this.state.exceptThesePlayers[i].PlayerID);
        }
        form.append('Kit1Color', this.state.shirtOneColor);
        form.append('Kit2Color', this.state.shirtTwoColor);
        form.append('CaptainKitNumber', this.state.TshirtNumber);
        if (localStorage.getItem('exID') && localStorage.getItem('exID') !== '0' && localStorage.getItem('exID') !== null && localStorage.getItem('exID') !== undefined && localStorage.getItem('exID') !== '') {
            if (this.state.createTeamName !== '') {
                if (this.state.TeamSport !== 0) {
                    if (this.state.TeamGender !== 0) {
                        if (this.state.TeamAgeRange !== 0) {
                            if (this.state.TeamProvince !== '') {
                                if (this.state.TeamCity !== '') {
                                    if (this.props.coverPhoto !== 0) {
                                        if (EceptArray.length !== 0) {
                                            if (this.state.teamCaptain !== 0) {
                                                fetch(`${configPort.TetaSport}${configUrl.AddTeamNew}`, {
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
                                                                Avatar: '/src/icon/photo-camera.png',
                                                                coverPhoto: 0,
                                                                showThisBtn: this.state.doneBtn,
                                                            })
                                                            return response.json();
                                                        case 401:
                                                            Logout({ ...this.props });
                                                            return false;
                                                        case 420:
                                                            this.setState({
                                                                showThisBtn: this.state.failBtn,
                                                            })
                                                            LogoutSoft({ ...this.props });
                                                            return false;
                                                        default:
                                                            this.setState({
                                                                showThisBtn: this.state.failBtn,
                                                            })
                                                            this.setState({
                                                                showThisBtn: this.state.orginalBtn,
                                                            });
                                                            handleMSG(code, response.json());
                                                            return false;
                                                    }
                                                }).then(data => {
                                                    if (data) {
                                                        let teamID = hashid.encode(data.TeamID);
                                                        setTimeout(function () {
                                                            window.location.replace(`teamProfile/${teamID}`);
                                                        }, 5000)
                                                    }

                                                })


                                            } else {
                                                this.setState({
                                                    showThisBtn: this.state.orginalBtn,
                                                });
                                                toast.error("! انتخاب کاپیتان الزامی است", { position: toast.POSITION.TOP_CENTER });
                                            }
                                        } else {
                                            this.setState({
                                                showThisBtn: this.state.orginalBtn,
                                            });
                                            toast.error("! بازیکنان تیم را مشخص کنید", { position: toast.POSITION.TOP_CENTER });
                                        }
                                    } else {
                                        this.setState({
                                            showThisBtn: this.state.orginalBtn,
                                        });
                                        toast.error("! انتخاب عکس کاور برای تیم الزامی است", { position: toast.POSITION.TOP_CENTER });
                                    }
                                } else {
                                    this.setState({
                                        showThisBtn: this.state.orginalBtn,
                                    });
                                    toast.error("! شهر تیم را انتخاب کنید", { position: toast.POSITION.TOP_CENTER });
                                }
                            } else {
                                this.setState({
                                    showThisBtn: this.state.orginalBtn,
                                });
                                toast.error("! استان تیم را انتخاب کنید", { position: toast.POSITION.TOP_CENTER });
                            }
                        } else {
                            this.setState({
                                showThisBtn: this.state.orginalBtn,
                            });
                            toast.error("! محدوده سنی تیم را وارد کنید", { position: toast.POSITION.TOP_CENTER });
                        }
                    } else {
                        this.setState({
                            showThisBtn: this.state.orginalBtn,
                        });
                        toast.error("! جنسیت تیم را وارد کنید", { position: toast.POSITION.TOP_CENTER });
                    }
                } else {
                    this.setState({
                        showThisBtn: this.state.orginalBtn,
                    });
                    toast.error("! نوع ورزش را وارد کنید", { position: toast.POSITION.TOP_CENTER });
                }
            } else {
                this.setState({
                    showThisBtn: this.state.orginalBtn,
                });
                toast.error("! نام تیم را وارد کنید", { position: toast.POSITION.TOP_CENTER });
            }
        } else {
            this.props.history.replace('/login');
        }

    }

    render() {
        //1 استایل های انتخاب کننده رنگ
        const stylesOne = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: this.state.shirtOneColor,
                },
                colorCustomize: {
                    background: this.state.shirtOneColor,
                },
                swatch: {
                    padding: '5px',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'block',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });
        //2 استایل های انتخاب کننده رنگ
        const stylesTwo = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: this.state.shirtTwoColor,
                },
                colorCustomize: {
                    background: this.state.shirtTwoColor,
                },
                swatch: {
                    padding: '5px',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'block',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });
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
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'crTeamContainerNew--dark' : 'crTeamContainerNew'}`}>
                    <div className='row'>
                        <div className='col-12' style={{ marginBottom: 5 }}>
                            <input type="text" className={`${localStorage.getItem('theme') === 'dark' ? 'createTeam-teamInputs--dark' : 'createTeam-teamInputs'} createTeam-teamName-new form-control`} placeholder='نام تیم خود را وارد کنید' value={this.state.createTeamName} onChange={(e) => { this.setState({ createTeamName: e.target.value }) }} title='نام تیم' />
                        </div>
                        <div className='col-12' style={{ marginBottom: 5 }}>
                            <div className="form-group">
                                <textarea style={{ textAlign: 'right', fontFamily: 'iranyekanBold' }} className={`form-control rounded-0 ${localStorage.getItem('theme') === 'dark' ? 'createTeamTextArea-new--dark' : 'createTeamTextArea-new'}`} rows="4" placeholder='درباره تیم' value={this.state.teamDescription} onChange={(e) => { this.setState({ teamDescription: e.target.value }) }} title='درباره تیم'></textarea>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-6'>
                            <div className='createTeam-newTeam-titles'>
                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'createTeam-newTeam-titles-heading--dark' : 'createTeam-newTeam-titles-heading'}`}>ورزش</span>
                                <br />
                                <div className='row'>
                                    <div className='col-md-6 createTeam-cols'>
                                        <div className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input createTeam-Radio-input" id="createTeamSportFootball" name="createTeamSportFootball" value={1} checked={this.state.whichSport === 1} onChange={() => this.handleRadioButtonWhichSport(1)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamSportFootball" style={{ color: (this.state.whichSport === 1) ? '#09A603' : null }}>فوتبال</label>
                                        </div>
                                    </div>
                                    <div className='col-md-6 createTeam-cols'>
                                        <div style={{ textAlign: 'center' }} className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input createTeam-Radio-input" id="createTeamSportFutsal" name="createTeamSportFutsal" value={2} checked={this.state.whichSport === 2} onChange={() => this.handleRadioButtonWhichSport(2)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamSportFutsal" style={{ color: (this.state.whichSport === 2) ? '#09A603' : null }}>فوتسال</label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='createTeam-newTeam-titles'>
                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'createTeam-newTeam-titles-heading--dark' : 'createTeam-newTeam-titles-heading'}`}>جنسیت</span>
                                <br />
                                <div className='row'>
                                    <div className='col-md-6 createTeam-cols'>
                                        <div className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input createTeam-Radio-input" id="createTeamGenderMale" name="createTeamGenderMale" value={1} checked={this.state.whichGender === 1} onChange={() => this.handleRadioButtonWhichGender(1)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamGenderMale" style={{ color: (this.state.whichGender === 1) ? '#09A603' : null }}>آقا</label>
                                        </div>
                                    </div>
                                    <div className='col-md-6col-6 createTeam-cols'>
                                        <div style={{ textAlign: 'center' }} className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input createTeam-Radio-input" id="createTeamGenderFemale" name="createTeamGenderFemale" value={2} checked={this.state.whichGender === 2} onChange={() => this.handleRadioButtonWhichGender(2)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamGenderFemale" style={{ color: (this.state.whichGender === 2) ? '#09A603' : null }}>خانم</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className='createTeam-newTeam-titles'>
                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'createTeam-newTeam-titles-heading--dark' : 'createTeam-newTeam-titles-heading'}`}>رده سنی</span>
                                <br />
                                <div className='row'>
                                    <div className='col-md-6 createTeam-cols'>
                                        <div className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input createTeam-Radio-input" id="createTeamAgeRangeA" name="createTeamAgeRangeA" value={1} checked={this.state.whichAgeRange === 1} onChange={() => this.handleRadioButtonWhichAgeRange(1)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamAgeRangeA" style={{ color: (this.state.whichAgeRange === 1) ? '#09A603' : null }}>نونهالان (14_10)</label>
                                        </div>
                                        <div style={{ textAlign: 'center' }} className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input createTeam-Radio-input" id="createTeamAgeRangeB" name="createTeamAgeRangeB" value={2} checked={this.state.whichAgeRange === 2} onChange={() => this.handleRadioButtonWhichAgeRange(2)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamAgeRangeB" style={{ color: (this.state.whichAgeRange === 2) ? '#09A603' : null }}>نوجوانان (16_14)</label>
                                        </div>
                                    </div>

                                    <div className='col-md-6 createTeam-cols'>

                                        <div className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input createTeam-Radio-input" id="createTeamAgeRangeC" name="createTeamAgeRangeC" value={3} checked={this.state.whichAgeRange === 3} onChange={() => this.handleRadioButtonWhichAgeRange(3)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamAgeRangeC" style={{ color: (this.state.whichAgeRange === 3) ? '#09A603' : null }}>جوانان (19_16)</label>
                                        </div>

                                        <div className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input createTeam-Radio-input" id="createTeamAgeRangeD" name="createTeamAgeRangeD" value={4} checked={this.state.whichAgeRange === 4} onChange={() => this.handleRadioButtonWhichAgeRange(4)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamAgeRangeD" style={{ color: (this.state.whichAgeRange === 4) ? '#09A603' : null }}>امید (21_19)</label>
                                        </div>
                                    </div>

                                    <div className='col-md-6 createTeam-cols'>
                                        <div style={{ textAlign: 'center' }} className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input" id="createTeamAgeRangeE" name="createTeamAgeRangeE" value={5} checked={this.state.whichAgeRange === 5} onChange={() => this.handleRadioButtonWhichAgeRange(5)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamAgeRangeE" style={{ color: (this.state.whichAgeRange === 5) ? '#09A603' : null }}>بزرگسالان <br /><span className='createTeamSplitAgeRange'>(21 به بالا)</span></label>
                                        </div>

                                        <div style={{ textAlign: 'center' }} className="custom-control custom-radio myStyledRadio myStyledRadio-createTeam">
                                            <input type="radio" className="custom-control-input createTeam-Radio-input" id="createTeamAgeRangeF" name="createTeamAgeRangeF" value={6} checked={this.state.whichAgeRange === 6} onChange={() => this.handleRadioButtonWhichAgeRange(6)} />
                                            <label className={`custom-control-label ${localStorage.getItem('theme') === 'dark' ? 'createTeam-Radio--dark' : 'createTeam-Radio'}`} htmlFor="createTeamAgeRangeF" style={{ color: (this.state.whichAgeRange === 6) ? '#09A603' : null }}>تمام رده های سنی</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createTeamThreeSelectBoxStyle-new--dark' : 'createTeamThreeSelectBoxStyle-new'}`} id="createTeam-leagueSport" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.TeamProvince} onChange={this.getCities} title='استان'>
                                <option className='createTeamThreeSelectBoxStyle-new-Options' value="" style={{ display: 'none' }}>استان</option>
                                {
                                    provinces.map((p, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <option className='createTeamThreeSelectBoxStyle-new-Options' value={p.ProvinceID} style={{ color: '#fff', fontSize: 10 }}>{p.ProvinceName}</option>
                                            </Fragment>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-md-6'>
                            <select className={`${localStorage.getItem('theme') === 'dark' ? 'createTeamThreeSelectBoxStyle-new--dark' : 'createTeamThreeSelectBoxStyle-new'}`} id="createTeam-leagueSport" style={{ color: '#fff', fontFamily: 'iranyekanRegular' }} value={this.state.TeamCity} onChange={this.handleTeamCity} disabled={isCityDisabled} title='شهر'>
                                <option className='createTeamThreeSelectBoxStyle-new-Options' value="" style={{ display: 'none' }}>شهر</option>
                                {
                                    cities.map((city, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <option className='createTeamThreeSelectBoxStyle-new-Options' value={city.CityID} style={{ color: '#fff', fontSize: 10 }}>{city.CityName}</option>
                                            </Fragment>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: 60, marginBottom: 60 }}>
                        <div className='col-md-6'>
                            <div className='createTeam-newTeam-titles'>
                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'createTeam-newTeam-titles-heading--dark' : 'createTeam-newTeam-titles-heading'}`} style={{ fontSize: 12 }}>رنگ لباس ۱</span>
                                <br />
                                <div style={{ minHeight: (this.state.displayColorPickerShirtOne) ? 310 : null, paddingRight: 25 }}>
                                    <div style={stylesOne.swatch} onClick={this.handleClickShirtOne} className={`${localStorage.getItem('theme') === 'dark' ? 'Tshirt-container-container--dark' : 'Tshirt-container-container'}`}>
                                        <div className='Tshirt-container' style={stylesOne.color}></div>
                                        <div className='Tshirt-container Tshirt-1' style={stylesOne.color}></div>
                                        <div className='Tshirt-container Tshirt-2' style={stylesOne.color}></div>
                                        <div className='Tshirt-container Tshirt-3' style={stylesOne.color}></div>
                                        <div className='Tshirt-inside' style={stylesOne.color}></div>
                                    </div>
                                    {this.state.displayColorPickerShirtOne ? <div style={stylesOne.popover}>
                                        <SketchPicker color={this.state.shirtOneColor} onChange={this.handleChangeShirtOne} />
                                        <div onClick={this.handleCloseShirtOne} className='colorPickerDone'>تایید</div>
                                    </div> : null}
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='createTeam-newTeam-titles'>
                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'createTeam-newTeam-titles-heading--dark' : 'createTeam-newTeam-titles-heading'}`} style={{ fontSize: 12 }}>رنگ لباس 2</span>
                                <br />
                                <div style={{ minHeight: (this.state.displayColorPickerShirtTwo) ? 310 : null, paddingRight: 25 }}>
                                    <div style={stylesTwo.swatch} onClick={this.handleClickShirtTwo} className={`${localStorage.getItem('theme') === 'dark' ? 'Tshirt-container-container--dark' : 'Tshirt-container-container'}`}>
                                        <div className='Tshirt-container' style={stylesTwo.color}></div>
                                        <div className='Tshirt-container Tshirt-1' style={stylesTwo.color}></div>
                                        <div className='Tshirt-container Tshirt-2' style={stylesTwo.color}></div>
                                        <div className='Tshirt-container Tshirt-3' style={stylesTwo.color}></div>
                                        <div className='Tshirt-inside' style={stylesTwo.color}></div>
                                    </div>
                                    {this.state.displayColorPickerShirtTwo ? <div style={stylesTwo.popover}>
                                        <SketchPicker color={this.state.shirtTwoColor} onChange={this.handleChangeShirtTwo} />
                                        <div onClick={this.handleCloseShirtTwo} className='colorPickerDone'>تایید</div>
                                    </div> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row' style={{ maxHeight: 120 }}>
                        <div className='col-md-12'>
                            <div className='createTeam-newTeam-titles'>
                                <span className={`${localStorage.getItem('theme') === 'dark' ? 'createTeam-newTeam-titles-heading--dark' : 'createTeam-newTeam-titles-heading'}`}>کاپیتان</span>
                                <br />
                                <div className='row createTeam-searchbox-and-results-container'>
                                    {/* بخش سرچ باکس */}
                                    <div className={`input-group ${localStorage.getItem('theme') === 'dark' ? 'newTeam-searchbox-styles--dark' : 'newTeam-searchbox-styles'}`} style={{ direction: 'ltr' }}>
                                        <span className="input-group-append newTeamSearch-input-btn-container">
                                            <button className="btn" type="button" style={{ paddingBottom: 0 }}>
                                                <span className='newTeam-searchbox-btn' onClick={this.handleSearchBtn}></span>
                                            </button>
                                        </span>
                                        <input className={`form-control py-2 ${localStorage.getItem('theme') === 'dark' ? 'newTeamSearch-input--dark' : 'newTeamSearch-input'}`} type="search" placeholder='بازیکن مورد نظر را به تیم اضافه کنید' style={{ height: 50, textAlign: 'right', fontFamily: 'iranyekanBold', background: '#F3F3F3', color: (this.state.searchValue !== '') ? '#000' : '#D6D6D6', border: 'none' }} value={this.state.searchValue} onChange={this.handleSearchBox} />
                                    </div>
                                    <div className='newTeam-search-result' id='createTeam-search-result'>

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
                                                                    <div className='createTeam-search-result-contain-contain' onClick={() => { this.addNewCaptainToTeam(player.PlayerID, player.PlayerName, player.PlayerUsername, player.PlayerAvatar) }}>
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
                            </div>
                        </div>
                    </div>
                    <div className='row' style={{ position: 'relative' }}>
                        <div className='col-md-6'>
                            <div className='newTeam-playerList'>
                                {
                                    exceptThesePlayers.map((player, index) => {
                                        let userName = player.PlayerUserName
                                        let playerAvatar = '/src/profilePic/defaultAvatar.png';
                                        if (player.PlayerAvatar !== null && player.PlayerAvatar !== undefined && player.PlayerAvatar !== '') {
                                            playerAvatar = player.PlayerAvatar;
                                        }
                                        return (
                                            <Fragment key={index}>
                                                <div className={`${localStorage.getItem('theme') === 'dark' ? 'newteam-playerCard-container--dark' : 'newteam-playerCard-container'}`}>
                                                    <a className='teamProfile-members-player-link' href={`profile/${userName}`} target={userName}><img className='newteam-playerCard-img' src={playerAvatar} title={player.PlayerName} alt={player.PlayerName} /></a>
                                                    <a className='teamProfile-members-player-link' href={`profile/${userName}`} target={userName}>
                                                        <span className='newteam-playerCard-playerName'>{player.PlayerName}</span>
                                                    </a>
                                                    <div className='newteam-playerCard-playerTshirt-container'>
                                                        <div className='newteam-playerCard-playerTshirt'>
                                                            <input type="text" className='newTeam-Tshirt-input form-control' placeholder='شماره پیراهن' value={this.state.TshirtNumber} onChange={this.handleTshirt} />
                                                        </div>
                                                    </div>
                                                    <div className='newTeam-delete-player' onClick={() => { this.deleteTeamFromLeague(player.PlayerID) }} title='حذف' />
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            {this.state.showThisBtn}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

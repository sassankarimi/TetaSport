import React, { Component, Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import Modal from 'react-responsive-modal';
import { LeagueLastMatchDetails, LeagueLocation, LeagueTellYourFriend, LeagueReport, LeagueSettingShortcut, LeagueSettingPlayersListShortcut, LeagueSettingEditMyTeamsShortcut } from '../components/user/leagueProfile/LeagueProfileLeftSideBarDetails';
import { LeagueProfileBanner, LeagueProfileInfo, LeagueProfileAvatar, LeagueProfileCategories } from '../components/user/leagueProfile/LeagueProfileDetails';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';


export class LeagueProfileLayout extends Component {
    static displayName = LeagueProfileLayout.name;

    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;
        return (
            <Fragment>
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileBG--dark' : 'leagueProfileBG'}`}>
                    {/* Toast Component */}
                    <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                    {/* League Nav Menu */}
                    <NavMenuAccount {...this.props} />
                    {/* League Banner */}
                    <LeagueProfileBanner {...this.props} />
                    {/* League Profile Info */}
                    <LeagueProfileInfo {...this.props} />
                    {/* League Profile Avatar */}
                    <LeagueProfileAvatar {...this.props} />
                    {/* content */}
                    <div className='league-profile-footer'>

                        <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent--dark' : 'leagueProfileContent'}`} id='leagueProfileContent'>
                            <div className='row w-100 leagueProfileContent-overflow-height' id='leagueProfileContent-foot' style={{ margin:0 }}>
                                <div className='col-md-2'>
                                    <div className='league-profileContent-right'>
                                        <LeagueProfileCategories {...this.props} />
                                    </div>
                                </div>
                                <div className='col-md-8'>
                                    <div className='leagueProfileContent-left' id='contentItems'>
                                        {this.props.children}
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <div className='leagueProfileContent-left'>
                                        {/* افزودن تیم */}
                                        <LeagueSettingShortcut {...this.props} />

                                        {/* شرکت کنندگان در لیگ */}
                                        <LeagueSettingPlayersListShortcut {...this.props} />

                                        {/* ویرایش کنندگان در لیگ */}
                                        <LeagueSettingEditMyTeamsShortcut {...this.props} />

                                        {/* نتایج آخرین بازی برگذار شده */}
                                        <LeagueLastMatchDetails {...this.props} />

                                        {/* آدرس محل برگذاری */}
                                        <div className='leagueProfileContent-left-toolsBar'>
                                            <p className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-settingText--dark' : 'leagueProfileContent-left-toolsBar-settingText'}`}>آدرس محل برگزاری</p>
                                            <LeagueLocation {...this.props} />
                                        </div>
                                        {/* دوستان خود را به این لینک دعوت کنید */}
                                        <div className='leagueProfileContent-left-toolsBar'>
                                            <p className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-settingText--dark' : 'leagueProfileContent-left-toolsBar-settingText'}`}>دوستان خود را به این لینک دعوت کنید</p>
                                            <LeagueTellYourFriend {...this.props} />
                                        </div>
                                        {/* گزارش تخلف */}
                                        <div className='leagueProfileContent-left-toolsBar pos-relative'>
                                            <p className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-toolsBar-settingText--dark' : 'leagueProfileContent-left-toolsBar-settingText'}`}><span className='leagueProfileContent-left-toolsBar-report-txt'>گزارش تخلف</span><span className='leagueProfileContent-left-toolsBar-report-info' onClick={this.onOpenModal}></span></p>
                                            <LeagueReport {...this.props} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                {/* report info modal */}
                <Modal classNames={{ overlay: 'areUsureModal', modal: 'areUsureModal-bg', closeButton: 'areUsureModal-closeBtn' }} open={open} onClose={this.onCloseModal} closeOnEsc={true} closeOnOverlayClick={true} center>
                    <div className="w3-card-4 w3-animate-opacity"
                        style={{ borderRadius: 3, textAlign: 'center', background: (localStorage.getItem('theme') === 'dark') ? '#26262b' : '#fff' }}>
                        <div className="p-5" style={{ textAlign: 'right', direction: 'rtl' }}>
                            <div className="input-group mb-3">
                                <div className="row" style={{ width: "100%", textAlign: 'center' }}>
                                    <div className="col-md-12">
                                        <p className={`${localStorage.getItem('theme') === 'dark' ? 'report-class--dark' : 'report-class'}`} style={{ fontWeight: 'bold' }}>
                                            کاربرگرامی !<br /><br />
                                            درصورتیکه هنگام استفاده از سرویس تتا اسپورت به مواردی برخورد نمودید که به تشخیصتان مطابق با قوانین جمهوری اسلامی نبوده جهت بررسی تیم پشتیبانی مورد را عنوان و ارسال نمائید از همکاری شما متشکریم.
                                        </p>
                                        <button style={{ width: 140, backgroundColor: (localStorage.getItem('theme') === 'dark') ? '#7289da' : '#0D6A12', color: '#fff', fontFamily: 'iranyekanBold', fontSize: 22, marginTop: 30, marginleft: 25, height: 44, borderRadius: 5, paddingTop: 1, border: 'none', outline: 'none' }}
                                            className="btn mt-3 mr-4"
                                            onClick={this.onCloseModal}
                                        >
                                            بستن
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
}

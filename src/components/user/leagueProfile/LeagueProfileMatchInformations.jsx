import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

//متغییر های سراسری
let hashid = new Hashids('', 7);

export class LeagueProfileMatchInformations extends Component {
    static displayName = LeagueProfileMatchInformations.name;

    constructor(props) {
        super(props);
        this.state = ({
            LeagueMatchInfo: [],
            loading: <div id='Listleague-loading'>
                <div className='Listleague-loading-container'>
                    <img src='/src/icon/teta-logo.png' className='Listleague-loading-icon' alt='loading' />
                    <div className='Listleague-loading-gif'></div>
                </div>
            </div>,
        });
    }

    async componentDidMount() {
        let leagueID = this.props.match.params.leagueId;
        let leagueIdDecoded = hashid.decode(leagueID);
        let form = new FormData();
        form.append('LeagueID', leagueIdDecoded);
        form.append('UserID', localStorage.getItem('exID'));
        await fetch(`${configPort.TetaSport}${configUrl.GetLeagueInfo}`, {
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
                    if (data.MSG) {
                        this.setState({
                            loading: data.MSG
                        });
                    } else {
                        this.setState({
                            LeagueMatchInfo: data,
                        });
                    }
                }
            });
    }


    render() {
        let matchInfo = this.state.LeagueMatchInfo;
        let awards = [];
        let contact = [];
        let rules = [];
        let structure = [];
        if (matchInfo && matchInfo.length !== 0) {
            awards = matchInfo.Awards.Awards;
            contact = matchInfo.ContactWithAdmin;
            rules = matchInfo.Rules.Rules;
            structure = matchInfo.Structure;

            //اگر جایزه داشتیم
            let awardContent = '';
            if (awards.length !== 0) {
                awardContent = awards.map((award, index) => {
                    return (
                        <Fragment key={index}>
                            <p className='leagueProfileContent-left-fontFam-giftTexts'>{award.Description}</p>
                        </Fragment>
                    );
                })
            } else {
                awardContent = <p style={{ fontFamily: 'iranyekanRegular', textAlign: 'right', fontSize: 14, marginTop: 10, marginRight: 10, height: 128, overflow: 'auto', overflowX: 'hidden' }}>آیتمی برای نمایش موجود نیست</p>
            }

            //اگر ساختار لیگ داشتیم
            let structureContent = '';
            if (structure.length !== 0) {
                structureContent = `ساختار  ${structure.LeagueStructureTitle} است`;
            } else {
                structureContent = <p style={{ fontFamily: 'iranyekanRegular', textAlign: 'right', fontSize: 14, marginTop: 10 }}>ساختاری برای این لیگ تعیین نشده است</p>
            }

            //اگر کانتکت نامبر داشتیم
            let contactContent = '';
            if (contact.length !== 0) {
                contactContent = `${contact.AdminMobile} : شماره تماس `;
            } else {
                contactContent = <p style={{ fontFamily: 'iranyekanRegular', textAlign: 'right', fontSize: 14, marginTop: 10 }}>آیتمی برای نمایش موجود نیست</p>
            }

            //اگر قانون داشتیم
            let ruleContent = '';
            if (rules.length !== 0) {
                ruleContent = rules.map((rule, index) => {
                    return (
                        <Fragment key={index}>
                            <p className='leagueProfileContent-left-fontFam-giftTexts'>{rule.Rule}</p>
                        </Fragment>
                    );
                });
            } else {
                ruleContent = <p style={{ fontFamily: 'iranyekanRegular', textAlign: 'right', fontSize: 14, marginTop:10 }}>قانونی یافت نشد</p>
            }

            //ساختار لیگ چی است؟
            let leagueStructureIcon = '';
            switch (structure.LeagueStructureTitle) {
                case 'لیگ':
                    leagueStructureIcon = '/src/icon/leagueStructureIcon.png';
                    break;
                case 'حذفی':
                    leagueStructureIcon = '/src/icon/leagueStructureSchemaIcon.png';
                    break;
                default:
            }

            return (
                <Fragment>
                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-center-container-matchInformations--dark' : 'leagueProfileContent-center-container-matchInformations'}`}>

                        <span className='leagueProfileContent-left-fontFam-icon league-gifts-icon'></span>
                        <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-fontFam--dark' : 'leagueProfileContent-left-fontFam'}`}>جوایز مسابقه</h3>

                        {awardContent}

                        <br />
                        <br />
                        <br />

                        <span className='leagueProfileContent-left-fontFam-icon league-structure-icon'></span>
                        <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-fontFam--dark' : 'leagueProfileContent-left-fontFam'}`}>ساختار مسابقات</h3>
                        <div className='leagueProfileContent-left-fontFam-structure-container'>
                            <span className='leagueStructureIcon' style={{ background: `url(${leagueStructureIcon}) no-repeat center center` }}></span>
                            <span className={`${localStorage.getItem('theme') === 'dark' ? 'leagueStructureTxt--dark' : 'leagueStructureTxt'}`}>{structureContent}</span>
                        </div>

                        <br />
                        <br />
                        <br />

                        <span className='leagueProfileContent-left-fontFam-icon league-contacts-icon'></span>
                        <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-fontFam--dark' : 'leagueProfileContent-left-fontFam'}`}>راه ارتباطی با سازنده لیگ</h3>
                        <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-ContactText--dark' : 'leagueProfileContent-left-ContactText'}`}>
                            <p style={{ direction: 'ltr' }}>{contactContent}</p>
                        </div>

                        <br />
                        <br />
                        <br />

                        <span className='leagueProfileContent-left-fontFam-icon league-rules-icon'></span>
                        <h3 className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-fontFam--dark' : 'leagueProfileContent-left-fontFam'}`}>قوانین مسابقه</h3>
                        <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-left-fontFam-rules-container--dark' : 'leagueProfileContent-left-fontFam-rules-container'}`} style={{ padding:10 }}>
                            {ruleContent}
                        </div>

                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueProfileContent-center-container-matchInformations--dark' : 'leagueProfileContent-center-container-matchInformations'}`}>
                        {this.state.loading}
                    </div>
                </Fragment>
            );
        }

    }
}
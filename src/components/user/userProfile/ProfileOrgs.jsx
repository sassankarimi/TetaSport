import React, { Component, Fragment } from 'react';
import Hashids from 'hashids';
import { LogoutSoft } from '../logout/UserLogout';
import configPort from '../../../configPort.json';
import configUrl from '../../../configUrl.json';

// متغییر های سراسری
let hashid = new Hashids('', 7);

export default class ProfileOrgs extends Component {
    static displayName = ProfileOrgs.name;

    constructor(props) {
        super(props)
        this.state = {
            joinedTeams: true,
            orgs: <img style={{ height: 50 }} src='src/icon/loading.gif ' alt='loading' />,
            resOrgs: [],
        }

    }

    componentDidMount() {
        var form = new FormData();
        form.append('UserID', localStorage.getItem('exID'));
        form.append('PlayerID', localStorage.getItem('view_profile'));

        fetch(`${configPort.TetaSport}${configUrl.GetUserOrgCards}`, {
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
                case 210:
                    this.setState({ orgs: 'سازمانی برای نمایش یافت نشد', resOrgs: [] });
                    return false;
                case 400:
                    this.setState({ orgs: 'خطایی رخ داده دوباره تلاش کنید', resOrgs: [] });
                    return false;
                case 420:
                    LogoutSoft({ ...this.props });
                    return false;
                case 500:
                    this.setState({ orgs: 'خطایی رخ داده دوباره تلاش کنید', resOrgs: [] });
                    return false;
                default:
                    this.setState({ orgs: 'خطایی رخ داده دوباره تلاش کنید', resOrgs: [] });
                    return false;
            }
        }).then(
            data => {
                if (data) {
                    if (data.Orgs) {
                        this.setState({
                            orgs: null,
                            resOrgs: data.Orgs
                        });
                    } else {
                        this.setState({
                            orgs: 'سازمانی برای نمایش یافت نشد',
                            resOrgs: [],
                        });
                    }
                }
            });

    }



    render() {
        const { orgs, resOrgs } = this.state;
        if (resOrgs.length !== 0) {
            return (
                <Fragment>
                    <div className='row'>
                        {
                            resOrgs.map((org, index) => {
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
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <div className='profileContent-left-container'>
                        <h4 className='profileContent-left-fontFam'>
                            {orgs}
                        </h4>
                    </div>
                </Fragment>
            )
        }

    }
}
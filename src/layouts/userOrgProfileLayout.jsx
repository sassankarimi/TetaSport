import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { Container } from 'reactstrap';
import { UserOrgProfileBanner, UserOrgProfileInfo, UserOrgProfileAvatar, UserOrgProfileCategories, UserOrgProfileLeftBoxInfo } from '../components/user/userOrgProfile/UserOrgProfileDetails';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';

export class UserOrgProfileLayout extends Component {
    static displayName = UserOrgProfileLayout.name;
    render() {
        return (
            <div className='profileBG'>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu بخش */}
                <NavMenuAccount  {...this.props} />
                {/* Banner بخش */}
                <UserOrgProfileBanner {...this.props} />
                {/* profile Info بخش */}
                <UserOrgProfileInfo  {...this.props}  />
                {/* content بخش */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'profile-footer--dark' : 'profile-footer'}`}>
                    {/* profile Avatar بخش */}
                    <UserOrgProfileAvatar  {...this.props}  />
                    {/* profile left box info بخش */}
                    <UserOrgProfileLeftBoxInfo  {...this.props} />
                    <Container>
                        <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent--dark' : 'profileContent'}`} style={{ height:500 }}>
                            <div className='row w-100'>
                                <div className='col-md-3'>
                                    <div className='profileContent-right'>
                                        <UserOrgProfileCategories {...this.props} />
                                    </div>
                                </div>
                                <div className='col-md-9 overflow-left-content' id='mayScrollSomeTimes'>
                                    <div className='profileContent-left' id='contentItems'>
                                        {this.props.children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}

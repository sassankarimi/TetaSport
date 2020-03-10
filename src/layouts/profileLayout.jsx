import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { ProfileBanner, ProfileInfo, ProfileCategories } from '../components/user/userProfile/ProfileDetails';
import { Container } from 'reactstrap';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';

export class ProfileLayout extends Component {
    static displayName = ProfileLayout.name;

    render() {
        return (
            <div className='profileBG'>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu بخش */}
                <NavMenuAccount {...this.props} />
                {/* Banner بخش */}
                <ProfileBanner  {...this.props} />
                {/* Sports بخش */}
                <Container className='sportsContainer'></Container>
                {/* profile Info + avatar بخش */}
                <ProfileInfo  {...this.props} />
                {/* content بخش */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'profile-footer--dark' : 'profile-footer'} op-marg-profile-footer`}>
                    <Container>
                        <div className={`${localStorage.getItem('theme') === 'dark' ? 'profileContent--dark' : 'profileContent'}`}>
                            <div className='row w-100'>
                                <div className='col-md-3'>
                                    <div className='profileContent-right'>
                                        <ProfileCategories  {...this.props}/>
                                    </div>
                                </div>
                                <div className='col-md-9 overflow-left-content' id='contentItems'>
                                    <div className='profileContent-left'>
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
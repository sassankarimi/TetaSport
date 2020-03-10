import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { Container } from 'reactstrap';
import { TeamBanner, TeamInfo, TeamAvatar, TeamLeftBoxInfo, TeamCategories } from '../components/user/team/TeamDetails';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';

export class TeamLayout extends Component {
    static displayName = TeamLayout.name;
    render() {
        return (
            <div className='profileBG'>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu بخش */}
                <NavMenuAccount  {...this.props} />
                {/* Banner بخش */}
                <TeamBanner {...this.props} />
                {/* profile Info بخش */}
                <TeamInfo  {...this.props} />
                {/* content بخش */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'profile-footer--dark' : 'profile-footer'}`}>
                    {/* profile Avatar بخش */}
                    <TeamAvatar  {...this.props} />
                    {/* profile left box info بخش */}
                    <TeamLeftBoxInfo  {...this.props} />
                    <Container>
                        <div className='profileContent' style={{ height: 500 }}>
                            <div className='row w-100'>
                                <div className='col-md-3'>
                                    <div className='profileContent-right'>
                                        <TeamCategories {...this.props} />
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

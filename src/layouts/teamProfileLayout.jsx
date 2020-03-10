import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { TeamProfileAvatar, TeamProfileInfo, TeamProfileBanner } from '../components/user/teamProfile/TeamProfileDetails';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';


export class TeamProfileLayout extends Component {
    static displayName = TeamProfileLayout.name;
    render() {
        return (
            <div className='profileBG'>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu بخش */}
                <NavMenuAccount {...this.props} />
                {/* team Banner بخش */}
                <TeamProfileBanner {...this.props} />
                {/* team Profile Info بخش */}
                <TeamProfileInfo {...this.props} />
                {/* team Profile Avatar بخش */}
                <TeamProfileAvatar {...this.props} />
                <div className='teamProfile-Container'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
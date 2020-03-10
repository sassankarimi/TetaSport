import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { Container } from 'reactstrap';
import { PlayerProfileBanner, PlayerProfileInfo, PlayerProfileCategories } from '../components/user/playerProfile/PlayerProfileDetails';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';


export class PlayerProfileLayout extends Component {
    static displayName = PlayerProfileLayout.name;
    render() {
        return (
            <div className='profileBG'>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu بخش */}
                <NavMenuAccount {...this.props} />
                {/* Banner بخش */}
                <PlayerProfileBanner  {...this.props}  />
                {/* Sports بخش */}
                <Container className='sportsContainer'></Container>
                {/* profile Info + avatar  بخش های */}
                <PlayerProfileInfo  {...this.props}  />
                {/* content بخش */}
                <div className='profile-footer op-marg-profile-footer'>
                    <Container>
                        <div className='profileContent'>
                            <div className='row w-100'>
                                <div className='col-md-3'>
                                    <div className='profileContent-right'>
                                        <PlayerProfileCategories {...this.props} />
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
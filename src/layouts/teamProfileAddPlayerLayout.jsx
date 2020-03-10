import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';


export class TeamProfileAddPlayerLayout extends Component {
    static displayName = TeamProfileAddPlayerLayout.name;
    render() {
        return (
            <div className='profileBG'>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu بخش */}
                <NavMenuAccount {...this.props} />

                <div className='teamProfile-Container'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
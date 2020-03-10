import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';

export class PaymentLayout extends Component {
    static displayName = PaymentLayout.name;
    render() {
        return (
            <div className='leagueBG'>
                {/* Toast Component */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu */}
                <NavMenuAccount {...this.props} />
                {/* content */}
                {this.props.children}
            </div >
        );
    }
}
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';



export class SortOrganizationLayout extends Component {
    static displayName = SortOrganizationLayout.name;
    render() {
        return (
            <div className='leagueBG'>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu بخش */}
                <NavMenuAccount {...this.props} />
                {/* content بخش */}
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'sortOrgContainer--dark' : 'sortOrgContainer'}`}>
                    {this.props.children}
                </div>
            </div >
        );
    }
}

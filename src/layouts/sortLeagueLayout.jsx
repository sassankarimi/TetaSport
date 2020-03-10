import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { NavMenuAccount } from '../components/user/navMenu/NavMenuAccount';



export class SortLeagueLayout extends Component {
    static displayName = SortLeagueLayout.name;
    render() {
        return (
            <div className={`${localStorage.getItem('theme') === 'dark' ? 'leagueBG--dark' : 'leagueBG'}`}>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer className='toast-container' toastClassName="custom-my-toast" />
                {/* nav menu بخش */}
                <NavMenuAccount {...this.props} />
            
                {/* content بخش */}
                {this.props.children}
            </div >
        );
    }
}

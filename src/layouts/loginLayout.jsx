import React, { Component } from 'react';
import '../css/pagesBg.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


export default class LoginLayout extends Component {
    static displayName = LoginLayout.name;

    render() {
        return (  
            <div className={`${localStorage.getItem('theme') === 'dark' ? 'pagesBG--dark' : 'pagesBG'}`}>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer
                    className='toast-container'
                    toastClassName="custom-my-toast"
                />
                {this.props.children}
            </div>
        );
    }
}
import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenuPages } from '../components/NavMenu';
import '../css/pagesBg.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


export class PagesLayout extends Component {
    static displayName = PagesLayout.name;

    render() {
        return (
            <div className='pagesBG'>
                {/* Toast کانتینر کامپوننت */}
                <ToastContainer
                    className='toast-container'
                    toastClassName="custom-my-toast"
                />
                <NavMenuPages {...this.props} />
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
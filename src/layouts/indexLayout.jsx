import React, { Component, Fragment } from 'react';
import '../css/indexBg.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';



export class IndexLayout extends Component {
    static displayName = IndexLayout.name;

    render() {
        return (
            <Fragment>
                <div className='index'>
                    {/* Toast کانتینر کامپوننت */}
                    <ToastContainer
                        className='toast-container'
                        toastClassName="custom-my-toast"
                    />
                    {this.props.children}
                </div>

            </Fragment>
        );
    }
}
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NotFound extends Component {
    static displayName = NotFound.name;


    render() {
        let historylength = this.props.history.length;
        if (historylength === 1) {
            return (
                <div style={{ textAlign: 'center', paddingTop: '25%', fontFamily: 'iranyekanBold' }}>
                    <h2 className='notFondNumber'>404</h2>
                    <p className='notFoundText'>! صفحه مورد نظر یافت نشد دوباره امتحان کنید</p>
                    <Link className='btn btn-sm btn-success' to='/'>بازگشت به صفحه اصلی سایت</Link>
                </div>
            );
        } else {

            return (
                <div style={{ textAlign: 'center', paddingTop: '25%', fontFamily: 'iranyekanBold' }}>
                    <h2 className='notFondNumber'>404</h2>
                    <p className='notFoundText'>! صفحه مورد نظر یافت نشد دوباره امتحان کنید</p>
                    <button className='btn btn-sm btn-success' onClick={() => { this.props.history.goBack() }}>بازگشت</button>
                </div>
            );
        }
    }
}
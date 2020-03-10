import React, { Component } from 'react';

export default class Traffic extends Component {
    static displayName = Traffic.name;


    render() {
        let historylength = this.props.history.length;
        if (historylength === 1) {
            return (
                <div className='traffic-contain' style={{ textAlign: 'center', paddingTop: '5%', fontFamily: 'iranyekanBold' }}>
                    <img className='traffic-img' src='/src/backgrounds/tetasport-traffic.png' alt='500'></img>
                </div>
            );
        } else {

            return (
                <div className='' style={{ textAlign: 'center', paddingTop: '5%', fontFamily: 'iranyekanBold' }}>
                    <img className='traffic-img' src='/src/backgrounds/tetasport-traffic.png' alt='500'></img>
                </div>
            );
        }
    }
}
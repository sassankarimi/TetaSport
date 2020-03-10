import React, { Component } from 'react';
import { Container } from 'reactstrap';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';


export class TrafficLayout extends Component {
    static displayName = TrafficLayout.name;

    render() {
        return (
            <div className='tetasport-traffic'>
                <Container className='w3-display-middle'>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
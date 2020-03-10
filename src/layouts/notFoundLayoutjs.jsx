import React, { Component } from 'react';
import { Container } from 'reactstrap';
import '../css/pagesBg.css';
import 'react-toastify/dist/ReactToastify.min.css';


export class NotFoundLayout extends Component {
    static displayName = NotFoundLayout.name;

    render() {
        return (
            <div className='BG404'>
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
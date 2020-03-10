import React, { Component, Fragment } from 'react';

export class ProfileIndex extends Component {
    static displayName = ProfileIndex.name;
    constructor(props) {
        super(props)
        this.state = {
            joinedLeague: false
        }
    }

    render() {
        return (
            this.state.joinedLeague ?
                <Fragment>
                    <div className='profileContent-left-container'>
                        <h4 className='profileContent-left-fontFam'>شما در لیگ شرکت اید</h4>
                    </div>
                </Fragment>
                :   
                <Fragment>
                    <div className='profileContent-left-container'>
                        <h4 className='profileContent-left-fontFam'>شما در هیچ لیگی شرکت نکرده اید</h4>
                    </div>
                </Fragment>
        )
    }
}
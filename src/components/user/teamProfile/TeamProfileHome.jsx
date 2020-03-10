import React, { Component, Fragment } from 'react';
import { TeamProfileMembers } from './TeamProfileMembers';
import { TeamProfileLeagues } from './TeamProfileLeagues';

export class TeamProfileHome extends Component {
    static displayName = TeamProfileHome.name;

    render() {
        return (
            <Fragment>
                <div className='row'>
                    <TeamProfileMembers {...this.props} />
                    <TeamProfileLeagues {...this.props} />
                </div>
            </Fragment>
        );
    }
}

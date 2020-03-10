import React, { Component, Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

export default class HelpLeagueStructure extends Component {
    static displayName = HelpLeagueStructure.name;

    render() {
        // تایتل صفحه
        document.getElementsByTagName("title")[0].innerHTML = `راهنمای ساختار لیگ ها`;
        return (
            <Fragment>
                <ReactTooltip place="top" type="dark" effect="solid" />
                <div className='leagueStructure-container'>
                    <h1 className='leagueStructure-title'>راهنمای ساختار لیگ</h1>
                    {/* ساختار حذفی */}
                    <div className='row' style={{ marginBottom:50 }}>
                        <div className='col-md-12'>
                            <img className='leagueStructure-hazfi-img' alt='حذفی' src='/src/icon/hazfiStructureIcon.png' data-tip='ساختار حذفی' />

                            <div className='leagueStructure-hazfi-text-container'>
                                <span className='leagueStructure-hazfi-text'>این ساختار حذفی است</span>
                            </div>
                        </div>
                    </div>

                    {/* ساختار لیگ */}
                    <div className='row' style={{ marginBottom: 50 }}>
                        <div className='col-md-12'>
                            <img className='leagueStructure-hazfi-img' alt='لیگ' src='/src/icon/leagueStructureIcon.png' data-tip='ساختار لیگ' />

                            <div className='leagueStructure-hazfi-text-container'>
                                <span className='leagueStructure-hazfi-text'>این ساختار لیگ است</span>
                            </div>
                        </div>
                    </div>

                </div>
            </Fragment>
        );
    }
}
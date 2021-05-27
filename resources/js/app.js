require('./bootstrap');

require('./components/Job');
require('./components/Toasts/ToastContainer');
require('./components/Proteomes/ProteomeManager');
require('./components/Modifications/ModificationManager');

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import ToastContainer from "./components/Toasts/ToastContainer";
import FingerprintView from "./components/Analysis/FingerprintView";

export default class App extends Component {

    constructor(props)
    {
        super(props);

        this.state = {

            //Application toasts
            toastList: [],

        };
    }


    render() {
      return (
        <div>

            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#"><i className="fas fa-fw fa-fingerprint fa-rotate-180"></i> malDB</a>
            </header>

            <ToastContainer />

            <div className="container-fluid">
                <div className="row">
                    <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">

                        <div className="position-sticky pt-3 pb-3">

                            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-2 mb-2 text-muted">Controls</h6>

                            <ul className="list-group">

                                <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Search
                                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-search"></i></span>
                                </a>

                                <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Results
                                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-chart-bar"></i></span>
                                </a>

                                <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Proteomes
                                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-bacterium"></i></span>
                                </a>

                                <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Modifications
                                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-dumbbell"></i></span>
                                </a>

                                <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Job Queue
                                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-line-columns"></i></span>
                                </a>

                                <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Neural Network
                                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-code-branch fa-rotate-90"></i></span>
                                </a>

                                <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Settings
                                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-cog"></i></span>
                                </a>

                            </ul>


                            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">Nick Ostan</h6>

                            <ul className="list-group">

                                <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Quit Application
                                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-times"></i></span>
                                </a>

                                <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Log Out
                                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-sign-out"></i></span>
                                </a>

                            </ul>

                        </div>
                    </nav>
                
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        {/* HEADER TOOLBAR BEGIN */}
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">

                            
                            <h2>Search</h2>

                            <div className="btn-toolbar mb-2 mb-md-0">

                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-light">Left</button>
                                    <button type="button" className="btn btn-light">Middle</button>
                                    <button type="button" className="btn btn-light">Right</button>
                                </div>

                            </div>
                            

                        </div>
                        {/* HEADER TOOLBAR END */}

                        <FingerprintView />

                    </main>
                </div>
            </div>
        </div>
      );
    }
  }


if (document.getElementById('spa'))
{
  ReactDOM.render(<App />, document.getElementById('spa'));
}
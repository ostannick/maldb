import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import SideNav from './SideNav';

import FadeIn from 'react-fade-in';

import SearchFrame from './Frames/SearchFrame';
import ResultsFrame from './Frames/ResultsFrame';
import HistoryFrame from './Frames/HistoryFrame';
import ProteomesFrame from './Frames/ProteomesFrame';
//import ModificationsFrame from './Frames/ModificationsFrame';
import QueueFrame from './Frames/QueueFrame';
import SettingsFrame from './Frames/SettingsFrame';
import ReadmeFrame from './Frames/ReadmeFrame';
import ProtocolFrame from "./Frames/ProtocolFrame";
import PerceptronFrame from "./Frames/PerceptronFrame";
import ModificationsFrame from "./Frames/ModificationsFrame";

export default class ApplicationContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {

      //Side Navigation Items
      controlItems: [
        { title: 'Search', icon: 'fa-search', index: 0},
        { title: 'Results', icon: 'fa-chart-bar', index: 1 },
        { title: 'History', icon: 'fa-history', index: 2 },
        
      ],

      manageItems: [
        { title: 'Proteomes', icon: 'fa-bacterium', index: 3 },
        { title: 'Modifications', icon: 'fa-weight-hanging', index: 4 },
        { title: 'Job Queue', icon: 'fa-line-columns', index: 5 },
        { title: 'Perceptron', icon: 'fa-code-branch fa-rotate-90', index: 6 },
        { title: 'Settings', icon: 'fa-cog', index: 7 },
      ],

      learnItems:[
        { title: 'Using malDB', icon: 'fa-info-circle', index: 8 },
        { title: 'Performing PMF', icon: 'fa-vial', index: 9 },
      ],


      containerState: 0,
      


    }
  }

  changeContainerState = (index) =>
  {
    console.log('Changing container state... ' + index)
    this.setState({containerState: index});
  }

  updateResults = (results) =>
  {
    this.props.updateResults(results);
    
    this.changeContainerState(1);
  }

  render() {
    
    var containerContent = [
      //PANEL 1
      <SearchFrame updateResults={(results) => this.updateResults(results)} />,
      <ResultsFrame results={this.props.results} />,
      <HistoryFrame updateResults={(results) => this.updateResults(results)} />,

      //PANEL 2
      <ProteomesFrame />,
      <ModificationsFrame />,
      <QueueFrame />,
      <PerceptronFrame />,
      <SettingsFrame />,

      //PANEL 3
      <ReadmeFrame />,
      <ProtocolFrame />,
    ]

    var content = containerContent[this.state.containerState];


    return (
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">

            <div className="position-sticky pt-3 pb-3">

              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-2 mb-2 text-primary">Controls</h6>

              {/*Items in the sidenav need to be able to change the container state*/}
              <SideNav 
                items={this.state.controlItems}
                handleClick={(index) => this.changeContainerState(index)}
              />

              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-2 mb-2 text-primary">Management</h6>

              {/*Items in the sidenav need to be able to change the container state*/}
              <SideNav 
                items={this.state.manageItems}
                handleClick={(index) => this.changeContainerState(index)}
              />

              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-2 mb-2 text-muted">Learn</h6>

              {/*Items in the sidenav need to be able to change the container state*/}
              <SideNav
                items={this.state.learnItems}
                handleClick={(index) => this.changeContainerState(index)}
              />

              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">Nick Ostan</h6>

              <ul className="list-group">

                <FadeIn>

                  <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" href="/">
                    Quit Application
                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-times"></i></span>
                  </a>

                  <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" href="/logout">
                    Log Out
                    <span className="badge bg-light text-dark rounded-pill"><i className="fad fa-fw fa-sign-out"></i></span>
                  </a>

                </FadeIn>

              </ul>

            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">

            {content}

          </main>
        </div>
      </div>
    );
  }
}

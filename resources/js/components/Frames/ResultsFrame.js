import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import FadeIn from 'react-fade-in';
import Toolbar from './Toolbar';
import FingerprintView from '../Analysis/FingerprintView';

export default class ResultsFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toolbarButtons: [
        { type: 'btn btn-primary btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-up', disabled: false, clickCallback: false },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: false },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: false },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: false },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: false },
      ]
    }
  }

  render() {
    return (
      <div>
        <FadeIn>

          <Toolbar 
            title="Results"
            buttons={this.state.toolbarButtons}
          />

          {/*Top 10 */}

          {/*Stats */}

          <h3 className="pb-2 border-bottom">Sequence Map</h3>
          {/*Sequence View */}


          <h3 className="pb-2 border-bottom">Spectra</h3>
          <FingerprintView />


          <h3 className="pb-2 border-bottom">Observability Table</h3>
          {/*Table */}

        </FadeIn>
      </div>
    );
  }
}
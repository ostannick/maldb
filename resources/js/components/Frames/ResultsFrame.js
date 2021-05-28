import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import FadeIn from 'react-fade-in';
import Toolbar from './Toolbar';
import FingerprintView from '../Analysis/FingerprintView';
import SequenceView from "../Analysis/SequenceView";
import TableView from "../Analysis/TableView";

export default class ResultsFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toolbarButtons: [
        { type: 'btn btn-primary btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-up', disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 0 }, callback()) },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 1 }, callback()) },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 2 }, callback()) },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 3 }, callback()) },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 4 }, callback()) },
      ],

      resultIndex: 0,

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

          {/*Protein Name */}
          <h3 className="text-primary">
            {this.props.results.results[this.state.resultIndex].parent_name}
          </h3>

          {/*Sequence View */}
          <div className="progress mt-3 mb-3" style={{'height': '20px'}}>
            <div className="progress-bar" role="progressbar" style={{'width': '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25% Coverage</div>
          </div>

          <SequenceView data={this.props.results.results[this.state.resultIndex]}/>


          <h3 className="pb-2 border-bottom">Spectra</h3>
          <FingerprintView />


          <h3 className="pb-2 border-bottom">Observability Table</h3>
          <TableView data={this.props.results.results[this.state.resultIndex]} />

        </FadeIn>
      </div>
    );
  }
}
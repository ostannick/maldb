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
      
      resultIndex: 0,

      sequenceViewData: {},
      tableViewData: {},


    }
  }

  render() {

    var toolbarButtons = [
      { type: 'btn btn-primary btn-lg', tooltip: 'Top Match', txt: this.props.results.results['0'].score, disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 0 }, callback()) },
      { type: 'btn btn-light btn-lg', tooltip: 'Match 2', txt: this.props.results.results['1'].score, disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 1 }, callback()) },
      { type: 'btn btn-light btn-lg', tooltip: 'Match 3', txt: this.props.results.results['2'].score, disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 2 }, callback()) },
      { type: 'btn btn-light btn-lg', tooltip: 'Match 4', txt: this.props.results.results['3'].score, disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 3 }, callback()) },
      { type: 'btn btn-light btn-lg', tooltip: 'Match 5', txt: this.props.results.results['4'].score, disabled: false, clickCallback: (callback) => this.setState({ resultIndex: 4 }, callback()) },
    ];

    return (
      <div>
        <FadeIn>

          <Toolbar 
            title="Results"
            buttons={toolbarButtons}
          />

          {/*Protein Name */}
          <h3 className="text-primary">
            {this.props.results.results[this.state.resultIndex].parent_name}
          </h3>

          {/*Sequence View */}
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
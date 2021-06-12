import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from '../Toolbar';

import ProgressBar from 'react-bootstrap/ProgressBar';

import SpectralDisplay from '../Analysis/SpectralDisplay';
import TablePicker from '../TablePicker';
import ModificationPicker from '../ModificationPicker';

import SearchJobListener from '../SearchJobListener';

import FadeIn from "react-fade-in";

export default class SearchFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toolbarButtons: [

        [{ type: 'btn btn-primary btn-lg col-6', tooltip: 'Search', icon: 'fas fa-running', disabled: false, clickCallback: (callback) => this.runSearch(callback)}],

      ],

      //Search Settings
      missedCleavages: 1,
      tolerance: 1.2,
      matchLimit: 5,
      selectedTables: [],

      massMods: [
        {name: 'carbamidomethyl_cys', type: 'fixed', enabled: true, mass: 57.0214, resi: 'C'},
      ],

      //Data
      massList: "1170.260461\r1375.483557\r1653.520751\r1752.469679\r1765.517257\r1849.43973\r2105.47983\r2128.467221\r2178.484802\r2211.44009\r2222.209515\r2389.285925\r2424.412107\r2551.361535\r2668.518994\r2855.366387",     
      
      //Job Listener Visiblity
      searchJobListenerVisibility: false,

      //Metadata
      metadata: {
        process_id: null
      }
    }

    this.jobListener = React.createRef();
  }

  runSearch = (callback) =>
  {

    const sendData = {
      missedCleavages: this.state.missedCleavages,
      massList: this.state.massList,
      massMods: this.state.massMods,
      selectedTables: this.state.selectedTables,
      matchLimit: this.state.matchLimit,
    };

    //Make the AJAX call
    axios.post(`/search`, sendData)
      .then(res => {

        const response = res.data;

        this.setState({
          searchJobListenerVisibility: true,
          metadata: response,
        });

        console.log(response);

        this.jobListener.current.startPolling();

        if(callback) callback();

      })
      .catch(function(e) {
        console.log(e.response.data.message);

        if (callback) callback();
      });
  }

  render() {
    return (
      <div>

        <FadeIn>

          <Toolbar 
            title="Search"
            buttons={this.state.toolbarButtons}
          />

          <div className="row">

            <SearchJobListener 
              processId={this.state.metadata.process_id}
              visibility={this.state.searchJobListenerVisibility}
              metadata={this.state.metadata}
              updateResults={(results) => this.props.updateResults(results)}
              ref={this.jobListener}
            />

            <div className="col-md-3">
              <label htmlFor="dataset" className="form-label"><i className="fal fa-stream"></i>
                &nbsp;
                <a style={{cursor: 'pointer'}} onClick={() => this.populateRandomFingerprint() }>Mass List</a>
                &nbsp;
                or
                &nbsp;
                <a style={{cursor: 'pointer'}} onClick={() => this.populateRandomSpectra() }>Spectra</a>
              </label>
              <textarea
                className="form-control"
                id="dataset"
                rows="10"
                onChange={this.updateMassList}
                defaultValue="1170.260461
                    1228.382739
                    1375.483557
                    1653.520751
                    1752.469679
                    1765.517257
                    1849.43973
                    2105.47983
                    2128.467221
                    2178.484802
                    2211.44009
                    2222.209515
                    2389.285925
                    2424.412107
                    2551.361535
                    2668.518994
                    2855.366387"
                value={this.state.massList}
                >
              </textarea>
            </div>

            <div className="col-md-9">
              <SpectralDisplay 
                data={this.state.massList}
              />
            </div>

            <div className="col-md-4">
              <TablePicker
                updateTables={(selectedTables) => this.updateTables(selectedTables)}
                updateMissedCleavages={() => this.updateMissedCleavages}
              />
            </div>

            <div className="col-md-4">
              <ModificationPicker />
            </div>

          </div>
          
        </FadeIn>
        

      </div>
    );
  }

  updateTables = (selectedTables, event) =>
  {
    this.setState({selectedTables: selectedTables});
  }

  updateMassList = (e) =>
  {
    this.setState({massList: e.target.value})
  }

  updateMissedCleavages = (e) =>
  {
    this.setState({missedCleavages: e.target.value})
  }

  populateRandomFingerprint = () =>
  {
    //Make the AJAX call
    axios.post(`/analysis/rdm_fingerprint`, {})
      .then(res => {

        const response = res.data;

        this.setState({massList: response});

        console.log(response);

      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  populateRandomSpectra = () =>
  {
    axios.post(`/analysis/rdm_spectra`, {})
      .then(res => {

        const response = res.data;

        this.setState({massList: response});

        console.log(response);

      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }
  
}
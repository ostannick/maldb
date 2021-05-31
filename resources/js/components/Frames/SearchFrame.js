import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from './Toolbar';

import TablePicker from '../TablePicker';
import ModificationPicker from '../ModificationPicker';

import ButtonGroup from './ButtonGroup';
import FadeIn from "react-fade-in";

export default class SearchFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toolbarButtons: [
        [{ type: 'btn btn-warning btn-lg col-6', tooltip: 'Search', icon: 'fas fa-running', disabled: false, clickCallback: (callback) => this.runSearch(callback)}],

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
      massList: "1170.260461 1375.483557 1653.520751 1752.469679 1765.517257 1849.43973 2105.47983 2128.467221 2178.484802 2211.44009 2222.209515 2389.285925 2424.412107 2551.361535 2668.518994 2855.366387",     
      
    }
  }

  runSearch = (callback) =>
  {

    const sendData = {
      missedCleavages: this.state.missedCleavages,
      tolerance: this.state.tolerance,
      massList: this.state.massList,
      massMods: this.state.massMods,
      selectedTables: this.state.selectedTables,
      matchLimit: this.state.matchLimit,
    };

    //Make the AJAX call
    axios.post(`/search`, sendData)
      .then(res => {

        const response = res.data;

        this.props.updateResults(response);

        if(callback) callback();

      })
      .catch(function(e) {
        console.log(e);

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
            

            <div className="col-md-4 s">
              <div className="mb-3">
                <label htmlFor="tolerance" className="form-label"><i className="fal fa-arrows-alt-h"></i> Tolerance (Da)</label>
                <input type="text" className="form-control" id="tolerance" defaultValue="1.2" onChange={this.updateTolerance} />
              </div>

              <div className="mb-3">
                <label htmlFor="dataset" className="form-label"><i className="fal fa-stream"></i> Mass List</label>
                <textarea
                  className="form-control"
                  id="dataset"
                  rows="16"
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
                    2855.366387">
                </textarea>
              </div>
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

  updateTolerance = (e) =>
  {
    this.setState({tolerance: e.target.value})
  }

  updateMissedCleavages = (e) =>
  {
    this.setState({missedCleavages: e.target.value})
  }
}
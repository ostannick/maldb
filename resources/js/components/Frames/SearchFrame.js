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
        { type: 'btn btn-light btn-lg col-6', tooltip: 'Search', icon: 'fas fa-running', disabled: false, clickCallback: false },

      ]
    }

    var buttonGroup = <ButtonGroup />
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
            <div className="col-md-4">
              <TablePicker
                updateTables={this.props.updateTables}
              />
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="tolerance" className="form-label"><i className="fal fa-arrows-alt-h"></i> Tolerance (Da)</label>
                <input type="text" className="form-control" id="tolerance" defaultValue="1.2" onChange={this.props.handleToleranceChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="dataset" className="form-label"><i className="fal fa-stream"></i> Mass List</label>
                <textarea
                  className="form-control"
                  id="dataset"
                  rows="16"
                  onChange={this.props.handleMassListChange}
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
              <ModificationPicker />
            </div>

          </div>
          
        </FadeIn>
        

      </div>
    );
  }
}
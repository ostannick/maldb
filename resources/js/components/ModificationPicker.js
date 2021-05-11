import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class ModificationPicker extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }

  }

  render() {
    return (
      <div>

      <div className="mb-3">
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="mod-fixed-cys-carbamidomethyl" checked disabled />
          <label className="form-check-label" htmlFor="mod-fixed-cys-carbamidomethyl"><span className="font-monospace"><i className="fas fa-fw fa-anchor" data-bs-toggle="tooltip" data-bs-placement="top" title="Fixed Modification"></i> CYS</span>: Iodoacetamide</label>
        </div>

        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="mod-var-met-oxidation" checked disabled />
          <label className="form-check-label" htmlFor="mod-var-met-oxidation"><span className="font-monospace"><i className="fas fa-fw fa-feather-alt" data-bs-toggle="tooltip" data-bs-placement="top" title="Variable Modification"></i> MET</span>: Oxidation</label>
        </div>
      </div>

      </div>
    );
  }
}

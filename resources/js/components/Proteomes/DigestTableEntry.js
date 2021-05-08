import React, { Component } from "react";
import ReactDOM from 'react-dom';

class DigestTableEntry extends Component {
  constructor(props)
  {
    super(props);

    this.state = {

    }
  }

  render()
  {
    return (
      <a href="#" className="list-group-item list-group-item-action bg-light" aria-current="true">
        <div className="d-flex w-100 justify-content-between">
          <h6 className="mb-1">{this.props.data.table_name}</h6>
          <small><span className="badge rounded-pill bg-primary">{this.props.data.size} peptides</span></small>
        </div>

        {/* STATUS BAR */}
        <div className="row">
          <div className="col-lg-6">
            <div className="progress">
              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100" style={{width: '35%'}}></div>
            </div>
          </div>

          <div className="col-lg-6">
          <p className="font-monospace"><i className="fal fa-cog fa-spin"></i> Status...</p>
          </div>
        </div>
      </a>
    );
  }
}

export default DigestTableEntry;

import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import GenericButton from './GenericButton';

export default class QueueJob extends Component {

  constructor(props) {
    super(props);
  }

  

  render() {
    return (
      <a href="#" className="list-group-item list-group-item-action" aria-current="true">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1"><span className="badge rounded-pill bg-primary">{this.props.data.id} </span> {this.props.data.payload.data.commandName}</h5>
          <small>
            <GenericButton
              type='btn btn-light'
              tooltip='Cancel Job'
              icon='fas fa-ban'
              disabled={false}
              clickCallback={(callback, id) => this.props.cancelJob(callback, id)}
            />
          </small>
        </div>
        <p className="mb-1"></p>
        <small className="text-break">{this.props.data.payload.data.command}</small>
      </a>
    );
  }
}

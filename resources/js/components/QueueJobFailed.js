import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class QueueJobFailed extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a href="#" className="list-group-item list-group-item-action" aria-current="true">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1"><span className="badge rounded-pill bg-warning">{this.props.data.id} </span> {this.props.data.payload.displayName}</h5>
          <small>Failed At: {this.props.data.failed_at}</small>
        </div>
        <p className="mb-1"></p>
        <small>{this.props.data.exception[0]}</small>
      </a>
    );
  }
}

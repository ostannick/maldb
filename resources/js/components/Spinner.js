import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class Spinner extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
}

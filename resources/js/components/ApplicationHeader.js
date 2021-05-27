import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class ApplicationHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#"><i className="fas fa-fw fa-fingerprint fa-rotate-180"></i> malDB</a>
      </header>
    );
  }
}

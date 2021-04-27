import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

class ProteomeSwitch extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div key={this.props.id} className="custom-control custom-switch">
        <input type="checkbox" className="custom-control-input" id={this.props.name}></input>
        <label className="custom-control-label" htmlFor={this.props.name}>{this.props.name}</label>
      </div>
    );
  }
}

export default ProteomeSwitch;

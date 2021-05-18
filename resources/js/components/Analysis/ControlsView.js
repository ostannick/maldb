import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class ControlsView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: [],
    }

  }

  render() {
    return(
      <button className="btn btn-lg btn-primary">Add to Neural Training Set</button>
    );
  }

}

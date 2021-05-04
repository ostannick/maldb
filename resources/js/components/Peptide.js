import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

class Peptide extends Component {

  constructor(props) {
    super(props);

    this.state = {
      highlight: ""
    }
  }

  render() {
    return(
      <span
        className={this.props.observed ? "bg-primary" : ""}
        data-toggle="tooltip"
        data-placement="top"
        title={this.props.data.mz1_monoisotopic + " Da"}>{this.props.data.sequence}</span>
    );
  }

  componentDidMount()
  {
    //Re-run jQuery so all peptides get registered
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }
}

export default Peptide;

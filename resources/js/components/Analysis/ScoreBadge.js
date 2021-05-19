import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class ScoreBadge extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    let badge;

    if(this.props.significant)
    {
      badge = <span className="badge rounded-pill bg-primary"><i className="fad fa-chart-bar"></i> &nbsp; {this.props.score}</span>;
    }
    else
    {
      badge = <span className="badge rounded-pill bg-light text-dark"><i className="fad fa-chart-bar"></i> &nbsp; {this.props.score}</span>;
    }

    return(
      badge
    );
  }

}

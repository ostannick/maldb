import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class SideNavItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={(index) => this.props.handleClick(this.props.index)}>
        {this.props.title}
        <span className="badge bg-light text-dark rounded-pill"><i className={'fad fa-fw ' + this.props.icon}></i></span>
      </a>
    );
  }
}

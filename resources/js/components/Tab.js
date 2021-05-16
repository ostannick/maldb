import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class Tab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      className: 'nav-item',
    }

    this.setActive = this.setActive.bind(this);
  }

  setActive(b)
  {
    if(b)
    {
      this.setState({className: 'nav-item active'}, this.props.handleClick);
    }
    else
    {
      this.setState({className: 'nav-item'});
    }
  }



  render() {
    return(
      <li className={this.state.className} onClick={(b) => this.setActive(true)}>
        <a className="nav-link" href="#">{this.props.header}</a>
      </li>
    )
  }
}


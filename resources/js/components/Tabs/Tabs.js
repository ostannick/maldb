import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import Tab from './Tab';

export default class Tabs extends Component {

  constructor(props) {
    super(props);

  }

  renderTab(header, index)
  {
    return(
      <Tab 
        key={header}
        header={header}
        tabIndex={index}
        changeTab={(index) => this.props.changeTab(index)}
      />
    );
  }

  render() {
    return(
      <ul className="nav nav-tabs mb-3">
    
        {this.props.headers.map((header, index) => (

          this.renderTab(header, index)

        ))}
        
      </ul>
    );
  }
}
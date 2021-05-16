import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import Tab from './Tab';

export default class Tabs extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0
    }

    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  handleTabSelect()
  {
    this.setState({activeTab: 1})
  }

  renderTab(header)
  {
    return(
      <Tab 
        key={header}
        header={header}
        handleClick={this.handleTabSelect}
      />
    );
  }

  render() {
    return(
      <ul className="nav nav-tabs mb-3">
    
        {this.props.headers.map(header => (

          this.renderTab(header)

        ))}
        
      </ul>
    );
  }
}
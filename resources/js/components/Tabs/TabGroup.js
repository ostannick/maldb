import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import Tabs from './Tabs';

export default class TabGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    }

  }

  changeTab(index)
  {
    this.setState({activeTab: index});
  }

  render() {

    return(
 
      <div>
        
      <Tabs 
        headers={['Sequence Map', 'Fingerprint', 'Table', 'Statistics', 'Controls']}
        changeTab={(index) => this.changeTab(index)}
      />

        {this.props.tabContent[this.state.activeTab]}

      </div>
      

    );
  }
}
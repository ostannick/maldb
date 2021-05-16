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

  render() {
    
    var content;
    switch(this.state.activeTab)
      {
        case 0:
          content = 'aa';
        case 1:
          content = 'bb';
        case 2:
          content = 'cc';
        default:
          content = 'Some ting went wong.';
      }

    return(
 
      <div>
        
      <Tabs 
        headers={['Sequence Map', 'Fingerprint', 'Table', 'Statistics', 'Controls']}
      />

      {content}

      </div>
      

    );
  }
}
import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from '../Toolbar';

import FadeIn from "react-fade-in";

export default class ReadmeFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toolbarButtons: 

      [
        //First Group
        [],
        //Second group...
        [],
      ],


    }
  }

  render() {
    return (
      <FadeIn>
        
        <Toolbar
          title="Using malDB"
          buttons={this.state.toolbarButtons}
        />

        
      </FadeIn>
    );
  }

}
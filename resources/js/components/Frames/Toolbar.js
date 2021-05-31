import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import ButtonGroup from './ButtonGroup';

export default class Toolbar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">


        <h2>{this.props.title}</h2>

        <div className="btn-toolbar mb-2 mb-md-0">

          {this.props.buttons.map(buttonGroup => (

            <ButtonGroup
              buttons={buttonGroup}
            />

          ))}

        </div>


      </div>
    );
  }
}
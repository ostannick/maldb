import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import GenericButton from './GenericButton';

export default class Toolbar extends Component {

  constructor(props) {
    super(props);
  }

  renderButton(button, idx)
  {
    return(
      <GenericButton
        key={idx}
        type={button.type}
        tooltip={button.tooltip}
        icon={button.icon}
        disabled={button.disabled}
        txt={button.txt}
        clickCallback={button.clickCallback}
        
      />
    )
  }

  render() {
    return (
      <div className="btn-group mx-2" role="group">
        
        {this.props.buttons.map((button, idx) => (

          this.renderButton(button, idx)

        ))}

      </div>
    );
  }

  componentDidMount()
  {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }
}
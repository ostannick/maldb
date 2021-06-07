import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import ButtonGroup from './ButtonGroup';
import GenericButton from "./GenericButton";

export default class Setting extends Component {

  constructor(props) {
    super(props);

    this.state = {
      type: null,
      value: null
    }
  }

  render() {

    let val;

    if(this.props.val_integer != null)
    {
      val = this.props.val_integer
    }
    else if (this.props.val_decimal != null)
    {
      val = this.props.val_decimal
    }
    else
    {
      val = this.props.val_string
    }

    return (
        <tr>
          <td>{this.props.name}</td>
          <td>
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Value" defaultValue={val}/>
            </div>
          </td>
          <td>

            <GenericButton
              type='btn btn-light'
              tooltip='Information'
              icon='fal fa-info-circle'
              disabled={false}
              clickCallback={false}
            />

            <GenericButton
              type='btn btn-light'
              tooltip='Reset to Default'
              icon='fas fa-sync-alt'
              disabled={false}
              clickCallback={false}
            />

          </td>
        </tr>
    );
  }
}
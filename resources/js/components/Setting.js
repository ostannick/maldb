import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import ButtonGroup from './ButtonGroup';
import GenericButton from "./GenericButton";

export default class Setting extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: null
    }
  }

  handleValueChange = (event) =>
  {
    this.setState({value: event.target.value})
  }

  updateRemoteValue = () =>
  {
    var sendData = {
      id: this.props.data.id,
      value: this.state.value,
    }
    //Make the AJAX call
    axios.put('/usersettings/' + this.props.id, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
      })
      .catch(function(e) {
        console.log(e.response);
      });
  }

  componentDidMount()
  {
    if(this.props.data.type == 'int')
    {
      this.setState({value: parseInt(this.props.data.value)})
    }
    else if(this.props.data.type == 'float')
    {
      this.setState({value: parseFloat(this.props.data.value)})
    }
    else if(this.props.data.type == 'string')
    {
      this.setState({value: this.props.data.value})
    }
    else if(this.props.data.type === 'bool')
    {
      this.setState({value: (this.props.data.value === "true")})
    }
  }

  render() {

    return (
        <tr>
          <td className="text-end">{this.props.data.name}</td>
          <td>
            <input className="form-control" type="text" placeholder={this.state.value} disabled readOnly />
          </td>
          <td>
            <input type="range" className="form-range" min={this.props.data.min} max={this.props.data.max} step={this.props.data.step} value={this.state.value} onChange={this.handleValueChange} onMouseUp={this.updateRemoteValue}/>
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
              icon='fal fa-sync-alt'
              disabled={false}
              clickCallback={false}
            />

          </td>
        </tr>
    );
  }
}
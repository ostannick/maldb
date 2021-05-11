import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import ProteomeSwitch from './ProteomeSwitch'

class TablePicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      proteomes: [],
      selected: [],
    }

    this.handleToggle = this.handleToggle.bind(this);
  }

  renderSwitch(proteome)
  {
    return (
      <ProteomeSwitch
      key={proteome.id}
      id={proteome.id}
      name={proteome.name}
      toggleCallback={() => this.handleToggle(proteome.id, event)}
    />
    )
  }

  handleToggle(id, event)
  {
    var p = {id: event.target.checked};
    this.setState(p)
  }

  componentDidMount()
  {
    //Load the user's proteome tables via AJAX call to proteome API
    //Make the AJAX call
    axios.get('/proteomes/list')
      .then(res => {
        const response = res.data;
        this.setState({proteomes: response});
        console.log(response);
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });

  }

  render() {
    return (
      <div>

      <div className="mb-3">
        <label htmlFor="input-enzyme" className="form-label">Enzyme</label>
        <select id="input-enzyme" className="form-select">
          <option value="trypsin">Trypsin</option>
          <option value="chymotrypsin">Chymotrypsin</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="input-enzyme" className="form-label">Missed Cleavages</label>
        <select id="input-enzyme" className="form-select">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      </div>
    );
  }
}

export default TablePicker;

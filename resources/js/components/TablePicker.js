import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import DigestTableSwitch from './DigestTableSwitch';

class TablePicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      enzyme: "trypsin",
      mc: 0,
      tables: [],
      selectedTables: [],
    }

    this.handleMissedCleavages = this.handleMissedCleavages.bind(this);
    this.handleEnzyme = this.handleEnzyme.bind(this);
    this.toggleTable = this.toggleTable.bind(this);
  }



  handleEnzyme(event)
  {
    this.setState({enzyme: event.target.value}, this.loadTables);
  }

  handleMissedCleavages(event)
  {
    this.setState({mc: event.target.value}, this.loadTables);
  }

  toggleTable(id)
  {
    //Remove the entry regardless 
    var arr = this.state.selectedTables;
    var index = arr.indexOf(id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
    
    if(event.target.checked)
    {
      arr.push(id);
    }

    this.setState({selectedTables: arr});

  }

  componentDidMount()
  {
    //Load the user's proteome tables via AJAX call to proteome API
    //Make the AJAX call
    this.loadTables();
  }

  loadTables()
  {
    const sendData = {
      enzyme: this.state.enzyme,
      mc: this.state.mc,
    }

    axios.post('/digest/sort', sendData)
      .then(res => {
        const response = res.data;
        this.setState({tables: response});
        console.log(response);
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  renderSwitch(table)
  {
    return (
      <DigestTableSwitch
      key={table.id}
      data={table}
      toggleTable={(id) => this.toggleTable(table.id)}
      />
    )
  }

  render() {
    return (
      <div>

      <div className="mb-3">
        <label htmlFor="input-enzyme" className="form-label"><i className="fal fa-heart-broken fa-rotate-90"></i> Enzyme</label>
        <select id="input-enzyme" className="form-select" onChange={this.handleEnzyme}>
          <option value="trypsin">Trypsin</option>
          <option value="chymotrypsin">Chymotrypsin</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="input-enzyme" className="form-label"><i className="fal fa-compass-slash"></i> Missed Cleavages</label>
        <select id="input-enzyme" className="form-select" onChange={this.handleMissedCleavages}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      {this.state.tables.map(table => (

        this.renderSwitch(table)

      ))}

      </div>
    );
  }
}

export default TablePicker;

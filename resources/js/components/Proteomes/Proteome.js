import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import DigestTableEntry from './DigestTableEntry';

import GenericButton from '../GenericButton';

class Proteome extends Component {
  constructor(props)
  {
    super(props);

    this.state = {
      enzyme: 'trypsin',
      missedCleavages: 1,
      digestTables: [],
    }

    this.handleEnzyme = this.handleEnzyme.bind(this);
    this.handleMissedCleavages = this.handleMissedCleavages.bind(this);
    this.handleDigest = this.handleDigest.bind(this);
    this.handleDeleteProteome = this.handleDeleteProteome.bind(this);
  
    this.testCallback = this.testCallback.bind(this);
  }

  handleEnzyme(event)
  {
    this.setState({enzyme: event.target.value});
  }

  handleMissedCleavages(event)
  {
    this.setState({missedCleavages: event.target.value});
  }

  testCallback(resetButton)
  {
    console.log('waiting two seconds...')
    setTimeout(function(){
      console.log('done');
      resetButton();
    }, 2000);
  }

  handleDigest(callback, event)
  {
    const sendData = {
      proteome_id: this.props.data.id,
      opt_enzyme: this.state.enzyme,
      opt_mc: this.state.missedCleavages,
    };

    axios.post('/digest', sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        callback();
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  handleDeleteProteome(callback)
  {
    const sendData = {
      proteome_id: this.props.data.id,
    };

    axios.post('/proteomes/delete', sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        this.props.handleRefresh();
        callback();
      })
      .catch(function (e) {
        console.log(e.response.data.message);
        this.props.handleRefresh();
        callback();
      });
  }

  componentDidMount()
  {
    const sendData = {
      proteome_id: this.props.data.id
    };

    axios.post('/digest/list', sendData)
      .then(res => {
        const response = res.data;
        this.setState({digestTables: response});
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });

      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new window.bootstrap.Tooltip(tooltipTriggerEl)
      })
  }

  renderDigestTable(digestTable)
  {
    return(
      <DigestTableEntry
        key={digestTable.id}
        data={digestTable}
      />
    )
  }

  render()
  {
    return (

      <div className="col">
        <div className="card h-100 shadow">
          <div className="card-body">
            <h5 className="card-title border-bottom pb-2 text-primary">{this.props.data.name}, {this.props.data.organism}</h5>
        
            <div className="mb-3">
              <label htmlFor="enzyme" className="form-label">Enzyme:</label>
              <select id="enzyme" className="form-select" onChange={this.handleEnzyme}>
                <option value="trypsin">Trypsin</option>
                <option value="chymotrypsin">Chymotrypsin</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="enzyme" className="form-label">Include missed cleavages up to:</label>
              <select defaultValue="1" id="enzyme" className="form-select" onChange={this.handleMissedCleavages}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2" disabled>2</option>
              </select>
            </div>

            <div className="mb-3">
              <div className="btn-group" role="group">

                <GenericButton
                  type='btn btn-light'
                  tooltip='Begin Digestion'
                  icon='fad fa-running'
                  disabled={false}
                  clickCallback={this.handleDigest}
                />
                
                <a 
                  href={'/proteomes/' + this.props.data.id + '/edit'} 
                  className="btn btn-light" 
                  data-bs-toggle="tooltip" 
                  data-bs-placement="bottom" 
                  title="Edit Proteome">
                    <i className="fas fa-pencil-alt"></i>
                </a>

                <GenericButton
                  type='btn btn-light'
                  tooltip='Delete Proteome'
                  icon='fad fa-trash'
                  disabled={false}
                  clickCallback={this.handleDeleteProteome}
                />

              </div>
            </div>

            <h5>Existing Digest Tables</h5>

            <div className="list-group">

            {this.state.digestTables.map(digestTable => (

              this.renderDigestTable(digestTable)

            ))}
          
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default Proteome;

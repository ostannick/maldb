import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import DigestTableEntry from './DigestTableEntry';

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
  }

  handleEnzyme(event)
  {
    this.setState({enzyme: event.target.value});
  }

  handleMissedCleavages(event)
  {
    this.setState({missedCleavages: event.target.value});
  }

  handleDigest(event)
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
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  handleDeleteProteome()
  {
    const sendData = {
      proteome_id: this.props.data.id,
    };

    axios.post('/proteomes/delete', sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
      })
      .catch(function (e) {
        console.log(e.response.data.message);
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
      <div className="accordion-item">
        <h2 className="accordion-header collapsed" id={'proteome-' + this.props.data.id}>
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={'#proteome-' + this.props.data.id + '-body'} aria-expanded="false" aria-controls={'proteome-' + this.props.data.id + '-body'}>
            <span className="badge rounded-pill bg-primary"><i className="fal fa-bacterium"></i> &nbsp; {this.props.data.organism}</span> &nbsp;
            {this.props.data.name}
          </button>
        </h2>
        <div id={'proteome-' + this.props.data.id + '-body'} className="accordion-collapse collapse" aria-labelledby={'heading' + this.props.data.id} data-bs-parent="#proteome_manager">
          <div className="accordion-body">

            <div className="row">
              <div className="col-lg-6">
                <h5>Generate Digest Table</h5>
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
                    <option value="3" disabled>3</option>
                    <option value="4" disabled>4</option>
                    <option value="5" disabled>5</option>
                    <option value="6" disabled>6</option>
                    <option value="7" disabled>7</option>
                    <option value="8" disabled>8</option>
                    <option value="9" disabled>9</option>
                  </select>
                </div>

                <div className="mb-3">
                  <div className="btn-group" role="group">
                    
                    <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Submit Digest Job to Queue" onClick={this.handleDigest}><i className="fas fa-angle-double-right"></i></button>
                    
                    <a href={'/proteomes/' + this.props.data.id + '/edit'} className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Proteome"><i className="fas fa-pen-nib"></i></a>
                    
                    <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Proteome" onClick={this.handleDeleteProteome}><i className="fas fa-times"></i></button>
                  </div>
                </div>




              </div>


              <div className="col-lg-6">

                <h5>Existing Digest Tables</h5>

                <div className="list-group">

                {this.state.digestTables.map(digestTable => (

                  this.renderDigestTable(digestTable)

                ))}

                </div>
            </div>

          </div>
        </div>
      </div>

      </div>
    );
  }
}

export default Proteome;

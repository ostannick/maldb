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
      missedCleavages: 2,
      digestTables: [],
    }

    this.handleEnzyme = this.handleEnzyme.bind(this);
    this.handleMissedCleavages = this.handleMissedCleavages.bind(this);
    this.handleDigest = this.handleDigest.bind(this);

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
        <h2 className="accordion-header">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={'proteome_' + this.props.data.id} aria-expanded="false" aria-controls={'proteome_' + this.props.data.id}>
          <span className="badge rounded-pill bg-light text-dark">{this.props.data.id + " - " + this.props.data.organism}</span>
            {this.props.data.name}
          </button>
        </h2>
        <div id={'proteome_' + this.props.data.id} className="accordion-collapse collapse show" aria-labelledby={'proteome_' + this.props.data.id} data-bs-parent="#accordionExample">
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
                  <select defaultValue="2" id="enzyme" className="form-select" onChange={this.handleMissedCleavages}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="mb-3">
                  <button type="button" className="btn btn-primary" onClick={this.handleDigest}>Generate Digestion Table</button>
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

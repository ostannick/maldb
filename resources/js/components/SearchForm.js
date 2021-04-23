import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

class SearchForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      enzyme: props.params.enzyme,
      missedCleavages: props.params.missedCleavages,
      massList: props.params.dataset,
      tolerance: props.params.tolerance,
    }

    this.handleEnzymeChange = this.handleEnzymeChange.bind(this);
    this.handleMissedCleavageChange = this.handleMissedCleavageChange.bind(this);
    this.handleToleranceChange = this.handleToleranceChange.bind(this);

    this.handleMassListChange = this.handleMassListChange.bind(this);

  }

  handleEnzymeChange(event) {
    this.setState({enzyme: event.target.value});
  }

  handleMissedCleavageChange(event) {
    this.setState({missedCleavages: event.target.value});
  }

  handleToleranceChange(event) {
    this.setState({tolerance: event.target.value});
  }

  handleMassListChange(event) {
    this.setState({massList: event.target.value});
  }

  render() {
    return (
      <div className="row">
      <form>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="enzymeSelect">Enzyme</label>
            <select value={this.state.enzyme} onChange={this.handleEnzymeChange} name="enzyme" className="form-control" id="enzymeSelect">
              <option value="Trypsin">Trypsin</option>
              <option value="Chymotrypsin">Chymotrypsin</option>
            </select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="missedCleavages">Missed Cleavages</label>
            <select value={this.state.missedCleavages} onChange={this.handleMissedCleavageChange} name="missedCleavages" className="form-control" id="missedCleavages">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroupPrepend2"><i className="fal fa-fw fa-arrows-h"></i></span>
              </div>
              <input value={this.state.tolerance} onChange={this.handleToleranceChange} type="text" className="form-control" id="validationDefaultUsername" placeholder="Tolerance" required></input>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroupPrepend2"><i className="fal fa-fw fa-plus"></i></span>
              </div>
              <input type="text" className="form-control open-settings" id="validationDefaultUsername" placeholder="Modifications" aria-describedby="inputGroupPrepend2"></input>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroupPrepend2"><i className="fal fa-fw fa-bacterium"></i></span>
              </div>
              <input type="text" className="form-control open-settings" id="validationDefaultUsername" placeholder="Organisms" aria-describedby="inputGroupPrepend2" required></input>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="tolerance">Dataset</label>
            <textarea className="form-control" id="massList" rows="3" placeholder="Mass List" value={this.state.massList} onChange={this.handleMassListChange} />
          </div>
        </div>

        <hr/>

        <div className="col-12">
          <button className="btn btn-secondary search-help"><i className="fas fa-fw fa-question"></i></button>
          <button id="start-search" onClick={this.props.searchCallback} className="btn btn-primary float-right"><i className="fas fa-fw fa-play"></i></button>
        </div>

      </form>
      </div>
    );
  }
}

export default SearchForm;

/*
if (document.getElementById('search-form')) {
    ReactDOM.render(<SearchForm />, document.getElementById('search-form'));
}
*/

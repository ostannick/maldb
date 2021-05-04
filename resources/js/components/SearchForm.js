import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

class SearchForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchIcon: 'fas fa-fw fa-play'
    }

    this.doSearch = this.doSearch.bind(this);
  }

  doSearch(event)
  {
    this.startSpin();
    this.props.searchCallback(event);
  }

  startSpin()
  {
    this.setState({searchIcon: 'fas fa-cog fa-spin'});
  }

  stopSpin()
  {
    this.setState({searchIcon: 'fas fa-fw fa-play'});
  }

  render() {
    return (
      <div className="row">
      <form>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="enzymeSelect">Enzyme</label>
            <select onChange={this.props.handleEnzymeChange} name="enzyme" className="form-control" id="enzymeSelect">
              <option value="Trypsin">Trypsin</option>
              <option value="Chymotrypsin">Chymotrypsin</option>
            </select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="missedCleavages">Missed Cleavages</label>
            <select onChange={this.props.handleMissedCleavageChange} name="missedCleavages" className="form-control" id="missedCleavages">
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
              <input defaultValue="0.8" onChange={this.props.handleToleranceChange} type="text" className="form-control" id="validationDefaultUsername" placeholder="Tolerance" data-toggle="tooltip" data-placement="top" title="Tolerance" required></input>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroupPrepend2"><i className="fal fa-fw fa-plus"></i></span>
              </div>
              <input type="text" className="form-control mass-mods" id="validationDefaultUsername" placeholder="Modifications" aria-describedby="inputGroupPrepend2"></input>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroupPrepend2"><i className="fal fa-fw fa-bacterium"></i></span>
              </div>
              <input type="text" className="form-control open-settings" id="validationDefaultUsername" placeholder="Proteomes" aria-describedby="inputGroupPrepend2" required></input>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="massList">Dataset</label>
            <textarea className="form-control" id="massList" rows="3" placeholder="Mass List"  onChange={this.props.handleMassListChange} defaultValue="1170.260461 1375.483557 1653.520751 1752.469679 1765.517257 1849.43973 2105.47983 2128.467221 2178.484802 2211.44009 2222.209515 2389.285925 2424.412107 2551.361535 2668.518994 2855.366387"/>
          </div>
        </div>

        <hr/>

        <div className="col-12">
          <button className="btn btn-secondary search-help"><i className="fas fa-fw fa-question"></i></button>
          <button id="start-search" onClick={this.doSearch} className="btn btn-primary float-right"><i className={this.state.searchIcon}></i></button>
        </div>

      </form>
      </div>
    );
  }
}

export default SearchForm;

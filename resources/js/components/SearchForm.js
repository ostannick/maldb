import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import TablePicker from './TablePicker';
import ModificationPicker from './ModificationPicker';

class SearchForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchIcon: 'fas fa-fw fa-running'
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
    this.setState({searchIcon: 'fas fa-fw fa-cog fa-spin'});
  }

  stopSpin()
  {
    this.setState({searchIcon: 'fas fa-fw fa-running'});
  }

  render() {
    return (
      <div className="row">
        <div className="accordion" id="accordionPanelsStayOpenExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                Tables
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
              <div className="accordion-body">
                <TablePicker 
                  updateTables={this.props.updateTables}
                />
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                Mass Modifications
              </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
              <div className="accordion-body">
                <ModificationPicker />
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                Dataset
              </button>
            </h2>
            <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
              <div className="accordion-body">

                <div className="mb-3">
                  <label htmlFor="tolerance" className="form-label"><i className="fal fa-arrows-alt-h"></i> Tolerance (Da)</label>
                  <input type="text" className="form-control" id="tolerance" defaultValue="0.8" onChange={this.props.handleToleranceChange}/>
                </div>

                <div className="mb-3">
                  <label htmlFor="dataset" className="form-label"><i className="fal fa-stream"></i> Mass List</label>
                  <textarea 
                    className="form-control" 
                    id="dataset" 
                    rows="3" 
                    onChange={this.props.handleMassListChange}
                    defaultValue="1170.260461
                    1228.382739
                    1375.483557
                    1653.520751
                    1752.469679
                    1765.517257
                    1849.43973
                    2105.47983
                    2128.467221
                    2178.484802
                    2211.44009
                    2222.209515
                    2389.285925
                    2424.412107
                    2551.361535
                    2668.518994
                    2855.366387">
                  </textarea>
                </div>

              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 mt-3">
              <div className="d-grid gap-2">
                <button className="btn btn-lg btn-primary" type="button" onClick={this.doSearch}><i className={this.state.searchIcon}></i></button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 mt-3">
              <div className="progress">
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{"width": "75%"}}></div>
              </div>
            </div>
          </div>

          </div>

      </div>
    );
  }
}

export default SearchForm;

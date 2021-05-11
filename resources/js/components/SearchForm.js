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
        <div className="accordion" id="accordionPanelsStayOpenExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                Tables
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
              <div className="accordion-body">
                CONTENT
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo">
                Mass Modifications
              </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse show" aria-labelledby="panelsStayOpen-headingTwo">
              <div className="accordion-body">
                CONTENT
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingThree">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true" aria-controls="panelsStayOpen-collapseThree">
                Dataset
              </button>
            </h2>
            <div id="panelsStayOpen-collapseThree" className="accordion-collapse show" aria-labelledby="panelsStayOpen-headingThree">
              <div className="accordion-body">
                  CONTENT
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 mt-3">
              <div class="d-grid gap-2">
                <button class="btn btn-lg btn-primary" type="button"><i class="fas fa-running"></i></button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 mt-3">
              <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{"width": "75%"}}></div>
              </div>
            </div>
          </div>

          </div>

      </div>
    );
  }
}

export default SearchForm;

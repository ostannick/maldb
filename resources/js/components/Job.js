import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import SearchForm from './SearchForm';
import Results from './Results';

class Job extends Component {
  constructor(props)
  {
    super(props);

    this.state = {
      missedCleavages: 1,
      massMods: [
        {name: 'carbamidomethyl_cys', type: 'fixed', enabled: true, mass: 57.0214, resi: 'C'},
      ],
      tolerance: 0.8,
      tableList: [],
      massList: "1170.260461 1375.483557 1653.520751 1752.469679 1765.517257 1849.43973 2105.47983 2128.467221 2178.484802 2211.44009 2222.209515 2389.285925 2424.412107 2551.361535 2668.518994 2855.366387",
      results: {
        code: 'init',
        message: '0x00000',
      },
      status: 'init',
      
      matchLimit: 5,
    }

    this.searchForm = React.createRef();
    this.analysisModal = React.createRef();

    this.handleMissedCleavageChange = this.handleMissedCleavageChange.bind(this);
    this.handleToleranceChange = this.handleToleranceChange.bind(this);
    this.handleMassListChange = this.handleMassListChange.bind(this);
    this.updateTables = this.updateTables.bind(this);
    this.runSearch = this.runSearch.bind(this);

  }



  runSearch(event)
  {
    //Stop the page from refreshing
    event.preventDefault();

    //Set the status
    this.setState({status: 'searching'});

    //Create some data object
    const sendData = {
      missedCleavages: this.state.missedCleavages,
      tolerance: this.state.tolerance,
      massList: this.state.massList,
      massMods: this.state.massMods,
      selectedTables: this.state.selectedTables,
      matchLimit: this.state.matchLimit,
    };

    //Make the AJAX call
    axios.post(`/search`, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({results: response});
        this.setState({status: response.code});

        //Change spinner back to play button
        this.resetSearchButton();

      })
      .catch(function(e) {
        console.log(e.response.data.message);

        //Change spinner back to play button
        this.resetSearchButton();
      });
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

  updateTables(selectedTables, event)
  {
    this.setState({selectedTables: selectedTables});
  }

  resetSearchButton()
  {
    this.searchForm.current.stopSpin();
  }

  render()
  {
    return (
      <div className="row justify-content-center">
          <div className="col-md-3 mb-3">
              <div className="card">
                  <div className="card-header">Search Space</div>
                  <div className="card-body">

                    <SearchForm
                      ref={this.searchForm}
                      params={this.state.searchParameters}
                      updateTables={(selectedTables) => this.updateTables(selectedTables)}
                      searchCallback={this.runSearch}
                      handleEnzymeChange={this.handleEnzymeChange}
                      handleMassListChange={this.handleMassListChange}
                      handleToleranceChange={this.handleToleranceChange}
                      handleMissedCleavageChange={this.handleMissedCleavageChange}
                    />

                  </div>

              </div>
          </div>

          <div className="col-md-9">
            <div className="card">
                <div className="card-header">Search Hits</div>
                <div className="card-body">

                  <Results 
                    status={this.state.status}
                    message={this.state.results.message}
                    hits={this.state.results}
                  />

                </div>
            </div>
          </div>

      </div>

    );
  }
}

export default Job;

if (document.getElementById('job-app'))
{
  ReactDOM.render(<Job />, document.getElementById('job-app'));
}

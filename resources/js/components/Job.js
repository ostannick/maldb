import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import SearchForm from './SearchForm';
import SummaryChart from './Chart';

class Job extends Component {
  constructor(props)
  {
    super(props);

    this.state = {
      enzyme: 'trypsin',
      missedCleavages: 1,
      tolerance: 1.15,
      massList: "500.0 600.0",
      chartData: {
        xlabels: {},
        matches: {},
      },
    }

    this.handleEnzymeChange = this.handleEnzymeChange.bind(this);
    this.handleMissedCleavageChange = this.handleMissedCleavageChange.bind(this);
    this.handleToleranceChange = this.handleToleranceChange.bind(this);
    this.handleMassListChange = this.handleMassListChange.bind(this);
    this.runSearch = this.runSearch.bind(this);
    this.updateChart = this.updateChart.bind(this);

  }

  runSearch(event)
  {

    //Stop the page from refreshing
    event.preventDefault();

    //Create some data object
    const sendData = {
      enzyme: this.state.enzyme,
      missedCleavages: this.state.missedCleavages,
      tolerance: this.state.tolerance,
      massList: this.state.massList
    };

    //Make the AJAX call
    axios.post(`/test2`, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);

        //Do something with the returned data
        this.updateChart(response);
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  //This method is responsible for updating the chart.
  updateChart(data)
  {

    //Create our labels for top hits 0 to 9.
    const topHits = Object.keys(data).slice(9);
    //Create an array for our positive matches
    const posMatches = [];

    for(var i = 0; i < topHits.length; i++)
    {
      posMatches[i] = Object.keys(data[topHits[i]]).length;
    }

    //Static method that executes updateOptions.
    ApexCharts.exec('Matches', 'updateOptions', {
      xaxis: {
        categories: topHits,
      }
    });

    //Static method that executes updateSeries.
    ApexCharts.exec('Matches', 'updateSeries', [{
      data: posMatches
    }]);

    //This is a static method that takes the chart ID (declared in the SummaryChart component) and executes the render method.
    ApexCharts.exec('Matches', 'render');
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

  render()
  {
    return (
      <div className="row justify-content-center">
          <div className="col-md-3">
              <div className="card">
                  <div className="card-header">Experimental Setup</div>
                  <div className="card-body">

                    <SearchForm
                      params={this.state.searchParameters}
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
                <div className="card-header">Result Summary</div>
                <div className="card-body">

                  <SummaryChart />

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

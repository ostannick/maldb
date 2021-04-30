import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import SearchForm from './SearchForm';
import SummaryChart from './Chart';
import ProteomePicker from './ProteomePicker';
import SequenceModal from './SequenceModal';

class Job extends Component {
  constructor(props)
  {
    super(props);

    this.state = {

      enzyme: 'trypsin',
      missedCleavages: 1,
      tolerance: 1.15,
      proteomes: null,
      massList: "500.0 600.0",
      selectedHit: null,
      results: null,
      massMods: [
        {name: 'carbamidomethyl_cys', type: 'fixed', enabled: true, mass: 57.0214, resi: 'C'},
        {name: 'oxidation_met', type: 'variable', enabled: true, mass: 16.0, resi: 'M'},
      ],
      chartData: {
        xlabels: {},
        matches: {},
      },
    }

    this.searchForm = React.createRef();

    this.handleEnzymeChange = this.handleEnzymeChange.bind(this);
    this.handleMissedCleavageChange = this.handleMissedCleavageChange.bind(this);
    this.handleToleranceChange = this.handleToleranceChange.bind(this);
    this.handleMassListChange = this.handleMassListChange.bind(this);
    this.handleProteomeUpdate = this.handleProteomeUpdate.bind(this);
    this.runSearch = this.runSearch.bind(this);
    this.updateChart = this.updateChart.bind(this);

    this.getSequenceView = this.getSequenceView.bind(this);

  }

  resetSearchButton()
  {
    this.searchForm.current.stopSpin();
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
      massList: this.state.massList,
      massMods: this.state.massMods
    };

    //Make the AJAX call
    axios.post(`/submit`, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({results: response});

        //Do something with the returned data
        this.updateChart(response);

        //Change spinner back to play button
        this.resetSearchButton();

      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  //This method is responsible for updating the chart.
  updateChart(data)
  {
    //Create our labels for top hits 0 to 9.
    const topHits = Object.keys(data.hits);
    const labels = [];

    //Create an array for our positive matches
    const posMatches = [];

    for(var i = 0; i < topHits.length; i++)
    {
      labels[i] = topHits[i].split('|')[2].split(' ')[0];
      posMatches[i] = Object.keys(data.hits[topHits[i]]).length;
    }

    //Static method that executes updateOptions.
    ApexCharts.exec('Matches', 'updateOptions', {
      xaxis: {
        categories: labels,
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

  handleProteomeUpdate(event)
  {
    this.setState({proteomes: event.target.value});
  }

  getSequenceView(index, event)
  {
    this.setState({selectedHit: index});
    $('#sequence-view-modal').modal();
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
                      ref={this.searchForm}
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

                  <SummaryChart
                    handleBarClick={(config, event) => this.getSequenceView(config, event)}
                  />

                </div>
            </div>
          </div>


          <ProteomePicker />
          <SequenceModal
            hitId={this.state.selectedHit}
          />

      </div>




    );
  }
}

export default Job;

if (document.getElementById('job-app'))
{
  ReactDOM.render(<Job />, document.getElementById('job-app'));
}

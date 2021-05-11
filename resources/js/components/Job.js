import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import SearchForm from './SearchForm';
import SummaryChart from './Chart';
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
      massList: "1170.260461 1375.483557 1653.520751 1752.469679 1765.517257 1849.43973 2105.47983 2128.467221 2178.484802 2211.44009 2222.209515 2389.285925 2424.412107 2551.361535 2668.518994 2855.366387",
      selectedHit: null,
      results: null,
      analysis: null,
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
    this.analysisModal = React.createRef();

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
    const unkMatches = [];

    for(var i = 0; i < topHits.length; i++)
    {
      labels[i] = topHits[i].split('|')[2].split(' ')[0];
      posMatches[i] = Object.keys(data.hits[topHits[i]]).length;
      unkMatches[i] = data.peak_count - posMatches[i];
    }

    //Static method that executes updateOptions.
    ApexCharts.exec('Matches', 'updateOptions', {
      xaxis: {
        categories: labels,
      }
    });

    //Static method that executes updateSeries.
    ApexCharts.exec('Matches', 'updateSeries', [
      {name: "Positive Coverage", data: posMatches},
      {name: "Unknown Source", data: unkMatches}
    ]);

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
    const keys = Object.keys(this.state.results.hits);
    const experimentalData = this.state.results.hits[keys[index]];
    console.log(experimentalData);

    const sendData = {
      protein: keys[index],
    };

    //Make the AJAX call to retrieve the peptides
    axios.post(`/analysis`, sendData)
      .then(res => {
        const response = res.data;
        this.analysisModal.current.updateMatch(response);
        this.analysisModal.current.updateData(experimentalData);
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });

    //Open the modal
    $('#sequence-view-modal').modal();

  }

  render()
  {
    return (
      <div className="row justify-content-center">
          <div className="col-md-3">
              <div className="card">
                  <div className="card-header">Search Space</div>
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
          
          <SequenceModal
            ref={this.analysisModal}
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

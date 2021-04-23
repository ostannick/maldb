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
      searchParameters: {
        enzyme: 'trypsin',
        missedCleavages: 1,
        tolerance: 1.15,
        dataset: "889.258\n1111.5525\n1568.2213\n1629.692\n",
      },
      chartData: {

      },
    }

  }

  runSearch(event)
  {
    console.log('Running search...');

    var params = {
      enzyme: this.state.searchParameters.enzyme,
      missedCleavages: this.state.searchParameters.missedCleavages,
    };


    axios.post('/job', {params})
      .then(res => {
        console.log(res);
        console.log(res.data);
      });
  }


  render()
  {
    return (
      <div className="row justify-content-center">
          <div className="col-md-3">
              <div className="card">
                  <div className="card-header">Experimental Setup</div>
                  <div className="card-body">

                    <SearchForm params={this.state.searchParameters} searchCallback={this.runSearch}/>

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

import React, { Component } from "react";
import ReactDOM from 'react-dom'
import Chart from "react-apexcharts";

class SummaryChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "Matches",
          width: "100%",
          events: {
          markerClick:  function(event, chartContext, {seriesIndex, dataPointIndex, config}) {
            alert(dataPointIndex);
          },
        }
        },
        stroke: {
          curve: 'stepline',
        },
        markers: {
            size: 6,
        },
        xaxis: {
          categories: ["TbpB", "LbpB", "MBP", "HpuA", "AjjA", "SlpX", "YhhA", "TntA", "TnaA", "greP", "bbNa" ]
        }
      },
      series: [
        {
          name: "Positive Matches",
          data: [15, 6, 4, 3, 7, 1, 3, 4, 1, 6, 1,7, 1, 3, 4, 1, 6, 1,7, 1, 3, 4, 1, 6, 1,7, 1, 3, 4, 1, 6, 1]
        },
        {
          name: "Negative Matches",
          data: [2, 10, 12, 13, 6, 1, 4, 4, 3, 9, 11, 17, 15, 22, 8, 3, 6, 11, 11, 5, 5, 5, 8, 10, 2, 5, 7, 3, 3, 2, 11, 11]
        }
      ]
    };
  }

  render() {
    return (
      <div className="summarychart">
        <div className="row">
        <div className="col-12">
        <div className="mixed-chart">
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="line"
            width="100%"
          />
        </div>
        </div>
        </div>
      </div>
    );
  }
}

export default SummaryChart;

if (document.getElementById('summarychart')) {
    ReactDOM.render(<SummaryChart />, document.getElementById('summarychart'));
}

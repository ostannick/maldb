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
            dataPointSelection:  function(event, chartContext, config) {
              props.handleBarClick(config.dataPointIndex, event)
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
          categories: ["TbpB", "LbpB", "MBP", "HpuA", "AjjA", "SlpX", "YhhA", "TntA", "TnaA", "greP"]
        }
      },
      series: [
        {
          name: "Positive Coverage",
          data: [24, 13, 7, 3, 2, 2, 2, 2, 1, 1]
        },
        {
          name: "Negative Coverage",
          data: [3, 12, 14, 18, 18, 16, 12, 18, 5, 12]
        },
        {
          name: "Unknown Source",
          data: [2, 3, 6, 1, 5, 4, 1, 5, 6, 8]
        },
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
            type="bar"
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

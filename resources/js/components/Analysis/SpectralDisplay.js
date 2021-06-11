import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import ReactApexChart from 'react-apexcharts'

export default class SpectralDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {
          
      series: [

    ],
      options: {
        chart: {
          type: 'area',
          height: 350,
          zoom: {
            enabled: true
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          width: 1,
          colors: ['#21ff94']

        },
        fill: {
          type: 'gradient',
          colors: ['#21ff94'],
        },
        
        title: {
          align: 'left'
        },
        subtitle: {
          //text: props.data.parent_name,
          align: 'left'
        },
        labels: ['Experimental Data'],
        xaxis: {
          type: 'numeric',
          title: {
            text: 'm/z'
          }
        },
        yaxis: {
          opposite: false,
          title: {
            text: 'Intensity'
          }
        },
        legend: {
          horizontalAlign: 'left'
        }
      },
    };


  }

  render()
  {
    return(
      <div id="search-display">
        <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={300} />
      </div>  
    )
  }

  componentDidMount()
  {
    this.processIntoSpectra();
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.processIntoSpectra();
    }
  }

  processIntoSpectra = () =>
  {

    const sendData = {
      type: 'list',
      data: this.props.data
    };

    console.log(sendData);

    axios.post(`/analysis/drawspectra`, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({series: response});
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
      
  }

}

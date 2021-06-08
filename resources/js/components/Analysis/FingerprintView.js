import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import ReactApexChart from 'react-apexcharts'

export default class FingerprintView extends Component {

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
          colors: ['#21ff94', '#1f87ff']

        },
        fill: {
          type: 'gradient',
          colors: ['#21ff94', '#1f87ff'],
        },
        
        title: {
          align: 'left'
        },
        subtitle: {
          //text: props.data.parent_name,
          align: 'left'
        },
        labels: ['A'],
        xaxis: {
          type: 'numeric',
          title: {
            text: 'm/z'
          }
        },
        yaxis: {
          opposite: false,
          title: {
            text: 'Ionization Probability'
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
      <div id="fingerprint">
        <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={500} />
      </div>  
    )
  }

  componentDidMount()
  {

    const sendData = {};

    axios.post(`/analysis/fingerprint`, sendData)
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

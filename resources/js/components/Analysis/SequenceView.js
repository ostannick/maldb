import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import MapSeq from './MapSeq';
import Spinner from '../Spinner';

export default class SequenceView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        seqview: [],
        coverage: 0,
      },
      isLoading: true,
    }

  }

  render() {

    if(this.state.isLoading)
    {
      return ( <Spinner /> );
    }
    else
    {
      return (
        <div>

          {/*SEQUENCE VIEW*/}
          <div className="progress mt-3 mb-3" style={{'height': '20px'}}>
            <div className="progress-bar" role="progressbar" style={{'width': this.state.data.coverage + '%'}} aria-valuenow={this.state.data.coverage} aria-valuemin="0" aria-valuemax="100">{this.state.data.coverage}% Coverage</div>
          </div>

          <div className="col-lg-12 mb-3">
            <div className="font-monospace text-break fs-4 mt-3 mb-3 text-muted">

              {this.state.data.seqview.map((mapSeq, index) => (

                <MapSeq
                  key={index}
                  seq={mapSeq.seq}
                  obs={mapSeq.obs}
                />

              ))}

            </div>
          </div>

        </div>
      );
    }

  }

  componentDidMount()
  {
    this.fetchFromServer();
  }

  componentDidUpdate(prevProps)
  {
    if(this.props.data !== prevProps.data)
    {
      this.fetchFromServer();
    }
  }

  fetchFromServer = () =>
  {

    const sendData = {
      data: this.props.data,
    };

    axios.post(`/analysis/seqview`, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({data: response, isLoading: false});
      })
      .catch(function (e) {
        console.log(e.response.data.message);
      });
  }
}

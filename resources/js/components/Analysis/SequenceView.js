import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import MapSeq from './MapSeq';
import Spinner from '../Spinner';

export default class SequenceView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sequenceMap: [],
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
          <div className="col-lg-12 mb-3">
            <div className="font-monospace text-break fs-4 mt-3 mb-3 text-muted">

              {this.state.sequenceMap.map((mapSeq, index) => (

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

  fetchFromServer = () =>
  {

    this.setState({isLoading: true})

    const sendData = {
      data: this.props.data,
    };

    axios.post(`/analysis/seqview`, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({ sequenceMap: response, isLoading: false});
      })
      .catch(function (e) {
        console.log(e.response.data.message);
      });
  }
}

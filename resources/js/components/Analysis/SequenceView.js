import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import MapSeq from './MapSeq';

export default class SequenceView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sequenceMap: [],
    }

  }

  render() {
    return(
      <div>

        {/*SEQUENCE VIEW*/}
        <div className="col-lg-12 mb-3">
          <div className="font-monospace text-break fs-5">

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

  componentDidMount()
  {

    const sendData = {
      data: this.props.data,
    };

    axios.post(`/analysis/seqview`, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({sequenceMap: response});
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  
  }
}

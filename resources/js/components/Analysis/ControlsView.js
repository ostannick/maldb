import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class ControlsView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      status : 'init',
    }

    this.appendTrainingData = this.appendTrainingData.bind(this);

  }

  appendTrainingData()
  {

    this.setState({status: 'processing'});

    const sendData = {
      data: this.props.data,
    };

    axios.post(`/analysis/appendnn`, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({ status: response });
      })
      .catch(function (e) {
        console.log(e.response.data.message);
      });
  }

  render() {
    let button;

    if(this.state.status == 'init')
    {
      button = <button className="btn btn-lg btn-primary" onClick={this.appendTrainingData}>Add to Neural Network Training Set</button>
    }
    else if (this.state.status == 'processing')
    {
      button = <button className="btn btn-lg btn-primary disabled" onClick={this.appendTrainingData}><i className="fad fa-spin fa-cog"></i></button>
    }
    else if (this.state.status == 'success')
    {
      button = <button className="btn btn-lg btn-primary disabled" onClick={this.appendTrainingData}><i className="fad fa-check"></i></button>
    }
    else
    {
      button = <button className="btn btn-lg btn-primary disabled" onClick={this.appendTrainingData}><i className="fad fa-times"></i></button>
    }

    return(
      button
    );
  }

}

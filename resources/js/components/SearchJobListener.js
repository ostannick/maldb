import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import FadeIn from 'react-fade-in';

export default class SearchJobListener extends Component {

  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      description: 'Idle',
      interval: null,
      //Timer
      timerInterval: null,
      elapsed: 0,
    }

  }

  render() {
    if(this.props.visibility)
    {
      return (
        <FadeIn>
          <div className="col-lg-12 mb-3">
            <h4 className="text-center"><Spinner animation="grow" variant="primary" /></h4>
            <h4 className="text-center text-muted"> {this.state.description}</h4>
            <h6 className="text-center text-muted">{this.state.elapsed}</h6>
            <ProgressBar animated now={this.state.progress * 100} />
          </div>
        </FadeIn>
        
      )
    }
    else
    {
      return (<></>)
    }
    
  }

  downloadResults = () =>
  {
    console.log("Downloading results from server...");

    const sendData = {
      metadata: this.props.metadata
    }

    axios.post('/analysis/results', sendData)
      .then(res => {
        const response = res.data;

        this.props.updateResults(response);

      })
      .catch(function (e) {
        console.log(e.response.data.message);
      });
  }

  startTimer = () =>
  {
    clearInterval(this.state.timerInterval);
    this.setState({elapsed: 0});
    this.setState({ timerInterval: setInterval(() => { this.setState({elapsed: this.state.elapsed + 1}) }, 1000) });
  }

  stopTimer = () =>
  {
    clearInterval(this.state.timerInterval);
  }

  startPolling = () =>
  {
    clearInterval(this.state.interval);
    this.startTimer();
    this.setState({ interval: setInterval(() => { this.poll() }, 1500) })
  }

  stopPolling = () =>
  {
    clearInterval(this.state.interval);
  }

  poll() {
    console.log('Polling...');

    const sendData = {
      id: this.props.processId
    }

    axios.post('/process/status', sendData)
      .then(res => {
        const response = res.data;

        console.log(response);

        this.setState({
          progress: response.progress,
          description: response.description,
        })

        if (this.state.description == 'Complete') {
          clearInterval(this.state.interval);
          this.downloadResults();
        }

      })
      .catch(function (e) {
        console.log(e.response.data.message);
      });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
}

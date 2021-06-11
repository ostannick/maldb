import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import ProgressBar from 'react-bootstrap/ProgressBar';
import FadeIn from 'react-fade-in';

export default class SearchJobListener extends Component {

  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      description: 'Idle',
      interval: null,
    }

  }

  render() {
    if(this.props.visibility)
    {
      return (
        <FadeIn>
          <div className="col-lg-12 mb-3">
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

  startPolling = () =>
  {
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

        if (this.state.status == 'Complete') {
          clearInterval(this.state.interval);
          //Update app results
          //Change container state
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

import React, { Component } from "react";
import ReactDOM from 'react-dom';

class DigestTableEntry extends Component {
  constructor(props)
  {
    super(props);

    this.state = {
      shouldPoll: true,
      peptides: 0,
      progress: 0,
      status: 'init',
      console: '',
      interval: null
    }

    this.poll = this.poll.bind(this);
  }

  poll()
  {
    console.log('Polling...');

    const sendData = {
      digest_id: this.props.data.id
    }

    axios.post('/digest/poll', sendData)
      .then(res => {
        const response = res.data;
        this.setState({progress: response.status.progress});
        this.setState({console: response.status.description});
        this.setState({status: response.digest.status});

        if(this.state.status == 'ready')
        {
          clearInterval(this.state.interval);
        }

      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  componentDidMount()
  {
    const sendData = {
      digest_id: this.props.data.id
    }

    axios.post('/digest/poll', sendData)
      .then(res => {
        const response = res.data;
        this.setState({progress: response.status.progress});
        this.setState({console: response.status.description});
        this.setState({status: response.digest.status});

        if(this.state.status == 'processing')
        {
          this.setState({interval: setInterval(() => {this.poll()}, 5000)})
        }

      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  componentWillUnmount()
  {
    clearInterval(this.state.interval);
  }

  render()
  {
    switch(this.state.status)
    {
      case 'init':
        return(
          <a className="list-group-item list-group-item-action bg-light" aria-current="true">
            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-1"><i className="fal fa-ellipsis-h-alt"></i> {this.props.data.table_name}</h6>
              <small><span className="badge rounded-pill bg-primary">{this.props.data.size}Initializing...</span></small>
            </div>
          </a>
        );
      case 'processing':
        return(
          <a href={'/digest/' + this.props.data.id} className="list-group-item list-group-item-action bg-light" aria-current="true">
            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-1">{this.props.data.table_name}</h6>
              <small><span className="badge rounded-pill bg-primary">{this.props.data.size} peptides</span></small>
            </div>

            {/* STATUS BAR */}
            <div className="row">
              <div className="col-lg-12">
                <div className="progress">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={this.state.progress*100} aria-valuemin="0" aria-valuemax="100" style={{width: this.state.progress * 100 + "%"}}></div>
                </div>
              </div>

              <div className="col-lg-12">
              <p className="font-monospace"><i className="fal fa-cog fa-spin"></i> {this.state.console}</p>
              </div>
            </div>
          </a>
        );
      case 'ready':
        return(
          <a href={'/digest/' + this.props.data.id} className="list-group-item list-group-item-action bg-light" aria-current="true">
            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-1"><i className="fal fa-check"></i> {this.props.data.table_name}</h6>
              <small><span className="badge rounded-pill bg-primary">{this.props.data.size} peptides</span></small>
            </div>
          </a>
        );
    }

  }
}

export default DigestTableEntry;

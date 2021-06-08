import React, { Component, useEffect, useState} from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from '../Toolbar';

import FadeIn from "react-fade-in";

import QueueJob from '../QueueJob';
import QueueJobFailed from '../QueueJobFailed';

export default class JobsFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //Toolbar button
      toolbarButtons: [
        //First Button Group
        [
          { type: 'btn btn-light btn-lg', tooltip: 'Refresh', icon: 'fas fa-sync-alt', disabled: false, clickCallback: (callback) => this.fetchJobs(callback) },
          { type: 'btn btn-light btn-lg', tooltip: 'Clear Failed Jobs', icon: 'fas fa-layer-minus', disabled: false, clickCallback: (callback) => this.clearFailedJobs(callback) },
        ],

        //Second Button Group...

      ],

      //Jobs
      jobs: {
        jobs: [],
        failed_jobs: [],
      },

      //Modal
      modal: false,

    }
  }

  clearFailedJobs = (callback) => 
  {
    axios.post('/jobs/failed/delete', {})
      .then(res => {
        const response = res.data;
        console.log(response);
        if (callback) callback();
        this.fetchJobs();
      })
      .catch(function (e) {
        console.log(e);
        if (callback) callback();
      });
  }

  fetchJobs = (callback) => 
  {
    //Load the user's proteomes via AJAX call
    //Make the AJAX call
    axios.get('/queue')
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({ jobs: response });
        if (callback) callback();
      })
      .catch(function (e) {
        console.log(e);
        if (callback) callback();
      });

      
  }

  cancelJob = (callback, id) =>
  {
    var sendData = {
      id: id
    }
    //Make the axios call
    axios.post('/jobs/delete', sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        if (callback) callback();
        this.fetchJobs(callback)
      })
      .catch(function (e) {
        console.log(e);
        if (callback) callback();
      });
    
  }

  componentDidMount() {
    this.fetchJobs();
  }

  render() {
    return (

      <div>

        <FadeIn>

          <Toolbar 
            title="Job Queue"
            buttons={this.state.toolbarButtons}
          />

          <div className="row">

            <div className="col-md-6 list-group">
            <FadeIn>
            <h3 className="mb-3">Active Jobs</h3>
                {this.state.jobs.jobs.map((job, idx) => (

                  <QueueJob
                    key={idx}
                    data={job}
                    cancelJob={(callback, id) => this.cancelJob(callback, id)}
                  />

                ))}
            </FadeIn>

            </div>

              
            <div className="col-md-6 list-group">
            <FadeIn>
            <h3 className="mb-3">Failed Jobs</h3>      
                {this.state.jobs.failed_jobs.map((job, idx) => (

                  <QueueJobFailed 
                    key={idx}
                    data={job}
                  />

                ))}
            </FadeIn>

            </div>
          
            
            
          </div>

        </FadeIn>

      </div>
     
    );
  }
  
}



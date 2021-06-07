import React, { Component, useEffect, useState} from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from '../Toolbar';

import FadeIn from "react-fade-in";

import Job from '../Job';

export default class JobsFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //Toolbar button
      toolbarButtons: [
        //First Button Group
        [
          { type: 'btn btn-light btn-lg', tooltip: 'Refresh', icon: 'fas fa-sync-alt', disabled: false, clickCallback: (callback) => this.fetchJobs(callback) },
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

  fetchJobs = (callback) => {
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

  componentDidMount() {
    this.fetchJobs();
  }

  renderJob(job) {
    return (
      <a href="#" className="list-group-item list-group-item-action" aria-current="true">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1"><span className="badge rounded-pill bg-primary">{job.id}</span>{job.payload.displayName}</h5>
          <small>{job.created_at}</small>
        </div>
        <p className="mb-1"></p>
        <small>{job.queue}</small>
      </a>
    )
  }

  render() {
    return (

      <div>

        <FadeIn>

          <Toolbar 
            title="Job Queue"
            buttons={this.state.toolbarButtons}
          />

          <div className="row list-group">
          
            <FadeIn>
                {this.state.jobs.failed_jobs.map(job => (

                  this.renderJob(job)

                ))}
            </FadeIn>
            
          </div>

        </FadeIn>

      </div>
     
    );
  }
  
}



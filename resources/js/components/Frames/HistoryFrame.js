import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from '../Toolbar';

import FadeIn from "react-fade-in";

export default class HistoryFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toolbarButtons: 

      [
        //First Group
        [],
        //Second group...
        [],
      ],

      history: [],


    }
  }

  renderHistoryJob(search, idx)
  {
    return(
      <a key={idx} href="#a" className="list-group-item list-group-item-action" onClick={(jobString) => this.downloadResults(search.name)}>
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">Search ID: {search.name}</h5>
        <small>{search.created_at}</small>
      </div>
      </a>
    )
  }

  downloadResults = (jobString) =>
  {
    axios.post(`/analysis/results/name`, {name: jobString})
      .then(res => {

        const response = res.data;

        this.props.updateResults(response);

      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  render() 
  {
    return (
      <FadeIn>
        
        <Toolbar
          title="Search History"
          buttons={this.state.toolbarButtons}
        />

        <div className="row">

          <div className="col-lg-12">

            <div className="list-group">

              <FadeIn>

              {this.state.history.map((search, idx) => (

                this.renderHistoryJob(search, idx)

              ))}

              </FadeIn>

            </div>

          </div>

        </div>

        
      </FadeIn>
    );
  }
  

  componentDidMount()
  {
    axios.post(`/history/searches`, {})
      .then(res => {

        const response = res.data;

        this.setState({history: response});

        console.log(response);

      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

}
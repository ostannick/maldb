import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from '../Toolbar';

import FadeIn from "react-fade-in";

import Setting from "../Setting";

export default class SearchFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toolbarButtons: 

      [
        //First Group
        [{ type: 'btn btn-danger btn-lg col-6', tooltip: 'Factory Reset All', icon: 'fad fa-industry-alt', disabled: false, clickCallback: (callback) => this.factoryReset(callback)}],
        //Second group...
        [],
      ],

      settings: [],


    }
  }

  factoryReset = (callback) =>
  {
    axios.post('/usersettings/reset', {})
      .then(res => {
        const response = res.data;
        console.log(response);
        this.fetchSettings();
        if(callback) callback();

      })
      .catch(function(e) {
        console.log(e.response.data);
        if (callback) callback();
      });

    this.forceUpdate()
  }

  fetchSettings = (callback) =>
  {
    //Make the AJAX call
    axios.get('/usersettings')
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({settings: response})
        if(callback) callback();

      })
      .catch(function(e) {
        console.log(e.response.data);
        if (callback) callback();
      });
  }

  componentDidMount()
  {
    this.fetchSettings();
  }

  render() {
    return (
      <FadeIn>
        
        <Toolbar
          title="Settings"
          buttons={this.state.toolbarButtons}
        />

        <table className="table align-middle">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Current</th>
              <th scope="col">Input</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            
              {this.state.settings.map((setting, idx) => (

                <Setting 
                  key={idx}
                  data={setting}
                />

              ))}

          </tbody>
        </table>
      </FadeIn>
    );
  }

}
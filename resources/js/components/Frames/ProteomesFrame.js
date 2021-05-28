import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from './Toolbar';

import TablePicker from '../TablePicker';
import ModificationPicker from '../ModificationPicker';

import ButtonGroup from './ButtonGroup';
import FadeIn from "react-fade-in";
import Proteome from '../Proteomes/Proteome';

import Modal from 'react-bootstrap-v5';

export default class ProteomesFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //Toolbar button
      toolbarButtons: [
        { type: 'btn btn-light btn-lg', tooltip: 'Add New Proteome', icon: 'fas fa-plus', disabled: false, clickCallback: false },
        { type: 'btn btn-light btn-lg', tooltip: 'Refresh', icon: 'fad fa-sync-alt', disabled: false, clickCallback: false },
        
      ],

      //Proteomes
      proteomes: [],

      //Modal
      modal: null,

    }
  }

  fetchProteomes() {
    //Load the user's proteomes via AJAX call
    //Make the AJAX call
    axios.get('/proteomes/list')
      .then(res => {
        const response = res.data;
        this.setState({ proteomes: response });
        console.log(response);
      })
      .catch(function (e) {
        console.log(e.response.data.message);
      });
  }

  componentDidMount() {
    this.fetchProteomes();
  }

  renderProteome(proteome) {
    return (
      <Proteome
        data={proteome}
        key={proteome.id}
        handleRefresh={this.fetchProteomes}
      />
    )
  }

  render() {
    return (

      <div>

        <FadeIn>

          <Toolbar 
            title="My Proteomes"
            buttons={this.state.toolbarButtons}
          />

          <div className="row row-cols-1 row-cols-md-3 g-4">
          

                {this.state.proteomes.map(proteome => (

                  this.renderProteome(proteome)

                ))}

            
          </div>

        </FadeIn>

      </div>
     
    );
  }
}
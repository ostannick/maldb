import React, { Component, useEffect, useState} from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from '../Toolbar';

import FadeIn from "react-fade-in";
import Proteome from '../Proteomes/Proteome';
import LongButton from '../LongButton';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

export default class ProteomesFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //Toolbar button
      toolbarButtons: [
        //First Button Group
        [
          { type: 'btn btn-light btn-lg', tooltip: 'Add New Proteome', icon: 'fas fa-plus', disabled: false, clickCallback: (callback) => this.setState({modal: true}, callback) },
          { type: 'btn btn-light btn-lg', tooltip: 'Refresh', icon: 'fad fa-sync-alt', disabled: false, clickCallback: (callback) => this.fetchProteomes(callback) }
        ],

        //Second Button Group...

      ],

      //Proteomes
      proteomes: [],

      //Modal
      modal: false,

    }
  }

  fetchProteomes = (callback) => {
    //Load the user's proteomes via AJAX call
    //Make the AJAX call
    axios.get('/proteomes/list')
      .then(res => {
        const response = res.data;
        this.setState({ proteomes: response });
        console.log(response);
        if (callback) callback();
      })
      .catch(function (e) {
        console.log(e);
        if (callback) callback();
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

        <NewProteomeModal 
          show={this.state.modal}
          uploadProgress={this.state.uploadProgress}
          handleClose={() => this.setState({modal: false})}
          handleUpload={(name, organism, file) => this.handleUpload(name, organism, file)}
        />
        

      </div>
     
    );
  }

  handleUpload = (name, organism, file) => {

    //Validation

    const formData = new FormData();
    formData.append('name', name)
    formData.append('organism', organism)
    formData.append('file', file)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: function(progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.setState({uploadProgress: percentCompleted})
        console.log(progressEvent.loaded + ' of ' + progressEvent.total)
      }.bind(this)
    }

    //Make the AJAX call
    axios.post('/proteomes', formData, config)
      .then(res => {
        const response = res.data;
        console.log(response);

        this.fetchProteomes();

      })
      .catch(function (e) {
        console.log(e);
      });
  }
  
}

function NewProteomeModal(props) {

  const [name, setName] = useState('default');
  const [organism, setOrganism] = useState('default');
  const [file, setFile] = useState(null);

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header>
          <Modal.Title>Add New Proteome</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="input-group mb-3">
            <span className="input-group-text"><i className="fal fa-portrait"></i></span>
            <input type="text" className="form-control" placeholder="Proteome Name" aria-describedby="basic-addon1" onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text"><i className="fal fa-bacterium"></i></span>
            <input type="text" className="form-control" placeholder="Organism" aria-describedby="basic-addon1" onChange={(e) => setOrganism(e.target.value)} />
          </div>

          <div className="input-group mb-3">
            <input type="file" className="form-control" aria-label="Upload" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <div className="d-grid mb-3">
            <LongButton 
              type='btn btn-primary'
              tooltip='Upload'
              icon='fad fa-upload'
              disabled={false}
              clickCallback={() => props.handleUpload(name, organism, file)}
            />
          </div>

          <ProgressBar animated now={props.uploadProgress} />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


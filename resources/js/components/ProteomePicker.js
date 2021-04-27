import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import ProteomeSwitch from './ProteomeSwitch'

class ProteomePicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      proteomes: [],
      list: {},
    }
  }

  componentDidMount()
  {
    //Load the user's proteome tables via AJAX call to proteome API
    //Make the AJAX call
    axios.get('/proteomes/list')
      .then(res => {
        const response = res.data;
        this.setState({proteomes: response});
        console.log(response);
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });

  }

  render() {
    return (
      <div className="modal fade" id="settings-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Proteome Search Space</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">

                </div>
                <div className="col-md-6">
                  <h6>My Proteomes</h6>

                  {this.state.proteomes.map(proteome => (

                    <ProteomeSwitch
                      key={proteome.id}
                      id={proteome.id}
                      name={proteome.name}
                    />

                  ))}

                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default ProteomePicker;

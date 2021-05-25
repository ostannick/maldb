import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class ModificationManager extends Component {
  constructor(props)
  {
    super(props);

    this.state = {
      mods: [],
    }

  }

  componentDidMount()
  {
    //Load the user's proteomes via AJAX call
    //Make the AJAX call
    axios.post('/modifications/list')
      .then(res => {
        const response = res.data;
        this.setState({mods: response});
        console.log(response);
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  render()
  {
    return(
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">My Modifications</div>

            <div className="card-body">

                {this.state.mods.map(mod => (

                  this.renderModification(mod)

                ))}

            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Define New Modification</div>

            <div className="card-body">

              

            </div>
          </div>
        </div>
      </div>
    )
  }

  renderModification(mod)
  {

    let icon;
    if(mod.type == 'fixed')
    {
      icon = <i className="fas fa-anchor"></i>;
    }
    else
    {
      icon = <i className="fas fa-feather-alt"></i>;
    }

    return(
      <div className="row mb-2" key={mod.id}>
        <div className="col-lg-12">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{icon} {mod.name}</h5>
          </div>

          <div className="list-group">
            <a className="list-group-item"><span className="badge bg-light text-dark"><i className="fas fa-bullseye"></i>: {mod.target}</span></a>
            <a className="list-group-item"><span className="badge bg-light text-dark"><i className="fas fa-weight-hanging"></i>: {mod.mass}</span></a>
            <a className="list-group-item"><button className="btn btn-primary">Delete Modification</button></a>
          </div>

        </div>


      </div>
    )
  }
}

if (document.getElementById('modification-manager'))
{
  ReactDOM.render(<ModificationManager />, document.getElementById('modification-manager'));
}

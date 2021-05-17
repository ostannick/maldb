import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import Proteome from './Proteome';

class ProteomeManager extends Component {
  constructor(props)
  {
    super(props);

    this.state = {
      proteomes: [],

      newProteomeName: '',
      newProteomeOrganism: '',
      newProteomeFasta: null,

    }

    this.handleNewName = this.handleNewName.bind(this);
    this.handleNewOrganism = this.handleNewOrganism.bind(this);
    this.handleNewFile = this.handleNewFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);

  }

  componentDidMount()
  {
    //Load the user's proteomes via AJAX call
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

  renderProteome(data)
  {
    return(
      <Proteome
        data={data}
        key={data.id}
      />
    )
  }

  handleNewName(event)
  {
    this.setState({newProteomeName: event.target.value});
  }

  handleNewOrganism(event)
  {
    this.setState({newProteomeOrganism: event.target.value});
  }

  handleNewFile(event)
  {
    this.setState({newProteomeFasta: event.target.files[0]});
    console.log(event.target.files[0]);
  }

  handleUpload(event)
  {
    //Validation

    const formData = new FormData();
    formData.append('name', this.state.newProteomeName)
    formData.append('organism', this.state.newProteomeOrganism)
    formData.append('file', this.state.newProteomeFasta)

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    console.log(formData);

    //Make the AJAX call
    axios.post('/proteomes', formData, config)
      .then(res => {
        const response = res.data;
        console.log(response);

        location.reload();

      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  }

  render()
  {
    return (
      <div className="row justify-content-center">
          <div className="col-md-12">
              <div className="card">
                  <div className="card-header">My Proteomes</div>

                  <div className="card-body">

                      <div className="accordion" id="proteome_manager">

                          {this.state.proteomes.map(proteome => (

                            this.renderProteome(proteome)

                          ))}

                          <div className="accordion-item">
                            <h2 className="accordion-header collapsed" id="upload_new">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                <i class="fad fa-plus-circle"></i> &nbsp; Upload New Proteome
                              </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                              <div className="accordion-body">

                              <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1"><i className="fal fa-portrait"></i></span>
                                <input type="text" className="form-control" placeholder="Proteome Name" aria-label="Username" aria-describedby="basic-addon1" onChange={this.handleNewName} />
                              </div>

                              <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1"><i className="fal fa-bacterium"></i></span>
                                <input type="text" className="form-control" placeholder="Organism" aria-label="Username" aria-describedby="basic-addon1" onChange={this.handleNewOrganism} />
                              </div>

                              <div className="input-group">
                                <input type="file" className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" onChange={this.handleNewFile} />
                                <button className="btn btn-primary" type="button" id="inputGroupFileAddon04" onClick={this.handleUpload}>Upload</button>
                              </div>

                              </div>
                            </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

    );
  }
}

export default ProteomeManager;

if (document.getElementById('proteome-manager'))
{
  ReactDOM.render(<ProteomeManager />, document.getElementById('proteome-manager'));
}

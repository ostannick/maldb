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

    }

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

  render()
  {
    return (
      <div className="row justify-content-center">
          <div className="col-md-12">
              <div className="card">
                  <div className="card-header">My Proteomes</div>

                  <div className="card-body">

                      <div className="accordion" id="accordionExample">

                          {this.state.proteomes.map(proteome => (

                            this.renderProteome(proteome)

                          ))}

                          <div className="accordion-item">
                            <h2 className="accordion-header" id="upload_new">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                <span className="badge rounded-pill bg-light text-dark"><i className="fa fa-plus"></i> </span> Add Proteome
                              </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                              <div className="accordion-body">

                                <form method="POST" action="/proteomes" encType="multipart/form-data">
                                  @csrf

                                  <div className="col-md-12 mb-3">
                                    <div className="form-row">
                                      <input type="text" name="name" className="form-control" placeholder="Protein collection name"></input>
                                    </div>
                                  </div>

                                  <div className="col-md-12 mb-3">
                                    <div className="form-row">
                                      <input type="text" name="organism" className="form-control" placeholder="Organism (if relevant)"></input>
                                    </div>
                                  </div>

                                  <div className="col-md-12 mb-3">
                                    <div className="form-row">
                                      <textarea className="form-control" name="description" rows="5" placeholder="Description (optional)"></textarea>
                                    </div>
                                  </div>

                                  <div className="col-md-12 mb-3">
                                    <div className="input-group">
                                      <div className="custom-file">
                                        <input type="file" name="file" className="custom-file-input" id="inputGroupFile01"></input>
                                        <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-12 mb-3">
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                  </div>

                                </form>

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

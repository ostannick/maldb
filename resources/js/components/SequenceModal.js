import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';
import Peptide from './Peptide';

class SequenceModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: null,
      data: [],
      analysis: [],
      observed: [],
    };

    this.updateMatch = this.updateMatch.bind(this);
    this.updateData = this.updateData.bind(this);
    this.renderPeptide = this.renderPeptide.bind(this);
    this.checkIfObserved = this.checkIfObserved.bind(this);
  }

  updateData(data)
  {
    this.setState({data: data});

    //Set the observed peptides array
    var observed = [];
    this.state.data.forEach(function(peptide)
    {
      observed.push(peptide.id);
    });
    this.setState({observed: observed});
  }

  updateMatch(data)
  {
    //Set the data
    console.log(data);
    this.setState({name: data[0].parent});
    this.setState({analysis: data});
  }

  renderPeptide(peptide)
  {
    return(
      <Peptide data={peptide} observed={this.checkIfObserved(peptide.id)} key={peptide.id}/>
    );
  }

  checkIfObserved(peptideId)
  {
    if(this.state.observed.includes(peptideId))
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  render() {
    return(
      <div className="modal fade" id="sequence-view-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Single Match Analysis</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">

                </div>
                <div className="col-md-12">
                  <h4>{this.state.name}</h4>

                  <p className="text-monospace text-break">
                  {this.state.analysis.map(peptide => (

                    this.renderPeptide(peptide)

                  ))}
                  </p>

                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SequenceModal;

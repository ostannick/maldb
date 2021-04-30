import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

class SequenceModal extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="modal fade" id="sequence-view-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Test..</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">

                </div>
                <div className="col-md-6">
                  <h6>{this.props.hitId}</h6>



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

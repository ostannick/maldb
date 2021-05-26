import React, { Component } from "react";
import ReactDOM from 'react-dom'

export default class Toast extends Component {

  constructor(props) {
    super(props);

    this.state = {
      title: 'malDB',
      time: 'Just now',
      content: 'Some test content',
    }
  }

  render() {
    return(
      <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">

        <div className="toast-header">
          <strong className="me-auto">{this.props.title}</strong>
          <small className="text-muted">{this.props.time}</small>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>

        <div className="toast-body">
          {this.props.content}
        </div>
        
      </div>
    );
  }

  componentDidMount()
  {
    var defaultOptions = {
      animation: true,
      autohide: true,
      delay: 10000
    }

    
    new bootstrap.Toast(ReactDOM.findDOMNode(this), defaultOptions).show()

  }
}

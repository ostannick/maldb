import React, { Component } from "react";
import ReactDOM from 'react-dom'

class Toast extends Component {

  constructor(props) {
    super(props);

    this.state = {
      highlight: ""
    }
  }

  render() {
    return(
      <div className="position-fixed bottom-0 end-0 p-3" style={{"zIndex": "5"}}>
        <div id="liveToast" className="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            Hello, world! This is a toast message.
          </div>
        </div>
      </div>
    );
  }

  componentDidMount()
  {

  }
}

export default Toast;

if (document.getElementById('toast'))
{
  ReactDOM.render(<Toast />, document.getElementById('toast'));
}

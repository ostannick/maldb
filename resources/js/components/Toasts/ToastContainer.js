import React, { Component } from "react";
import ReactDOM from 'react-dom'

import Toast from './Toast';

const ToastContext = React.createContext();

export default class ToastContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toastList: [],
    }
  }

  render() {
    return(

      <div id="toast-container" aria-live="polite" aria-atomic="true" className="position-relative" style={{'zIndex': 999}}>

        <div className="toast-container position-absolute top-0 end-0 p-3">

        {this.state.toastList.map(toast => (

          <Toast 
            key={new Date().now}
            title={toast.title}
            time={new Date().now}
            content={toast.content}
          />

        ))}

        </div>
      
      </div>
      
    )
  }

  pushToast = (title, time, content) =>
  {

    var newToast = {
      title: title,
      time: time,
      content: content,
    }

    this.setState({
      toastList: [...this.state.toastList, newToast]
    })
  }

  componentDidMount()
  {
    setInterval(() => this.pushToast('test1', 'test2', 'test3'), 2500);
  }

}

if (document.getElementById('toast-container'))
{
  ReactDOM.render(<ToastContainer />, document.getElementById('toast-container'));
}

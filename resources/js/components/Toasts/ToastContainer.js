import React, { Component } from "react";
import ReactDOM from 'react-dom'

import Toast from './Toast';

export default class ToastContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toastList: [],
    }

    this.pushToast = this.pushToast.bind(this);
  }

  render() {
    return(
      
      <div id="toast-container" className="toast-container position-absolute top-0 end-0 p-3" style={{'zIndex': 999}}>

        {this.state.toastList.map(toast => (

          <Toast 
            key={1}
            title={toast.title}
            time={toast.time}
            content={toast.content}
          />

        ))}

      </div>
    )
  }

  pushToast(title, time, content)
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

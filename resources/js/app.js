require('./bootstrap');

require('./components/Job');
require('./components/Toasts/ToastContainer');
require('./components/Proteomes/ProteomeManager');
require('./components/Modifications/ModificationManager');

import React, { Component } from "react";
import ReactDOM from 'react-dom';

export default class App extends Component {
    render() {
      // Use a Provider to pass the current theme to the tree below.
      // Any component can read it, no matter how deep it is.
      // In this example, we're passing "dark" as the current value.
      return (
        <div>a</div>
      );
    }
  }

  /*
if (document.getElementById('app'))
{
  ReactDOM.render(<App />, document.getElementById('app'));
}

*/
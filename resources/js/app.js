require('./bootstrap');

require('./components/Job');
require('./components/Toasts/ToastContainer');
require('./components/Proteomes/ProteomeManager');
require('./components/Modifications/ModificationManager');

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import ToastContainer from "./components/Toasts/ToastContainer";
import FingerprintView from "./components/Analysis/FingerprintView";


import ApplicationHeader from './components/ApplicationHeader';
import ApplicationContainer from './components/ApplicationContainer';


import FadeIn from 'react-fade-in';

export default class App extends Component {

    constructor(props)
    {
        super(props);

        this.state = {

            //Application toasts
            toastList: [],

        };
    }


    render() {
      return (
        <div>

            <ApplicationHeader />

            <ToastContainer />

            <ApplicationContainer />
            
        </div>
      );
    }
  }


if (document.getElementById('spa'))
{
  ReactDOM.render(<App />, document.getElementById('spa'));
}
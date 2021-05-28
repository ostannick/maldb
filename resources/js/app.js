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

const ToastContext = React.createContext();

export default class App extends Component {

    constructor(props)
    {
        super(props);

        this.state = {

            //Application toasts
            toastList: [],

            //Application's current result set
            results: {}

        };
    }

    updateResults = (results) =>
    {
      //Update the results
      this.setState({results: results}, () => console.log(this.state.results));

      //Change the frame
      
    }


    render() {
      return (
        <div>

            <ApplicationHeader />

            <ToastContainer 
              toastList={this.state.toastList}
            />

            <ToastContext.Provider value={this.testFunction}>
              <ApplicationContainer 
                updateResults={(results) => this.updateResults(results)} 
                results={this.state.results}/>
            </ToastContext.Provider>
            
        </div>
      );
    }

    testFunction = () =>
    {
      var newToast = {
        title: 'title',
        time: 'time',
        content: 'content',
      }
  
      this.setState({
        toastList: [...this.state.toastList, newToast]
      })
    }
  }


if (document.getElementById('spa'))
{
  ReactDOM.render(<App />, document.getElementById('spa'));
}
import React, { Component } from "react";
import ReactDOM from 'react-dom'
import Chart from "react-apexcharts";

import TabGroup from './Tabs/TabGroup';

import SequenceView from './Analysis/SequenceView';
import TableView from './Analysis/TableView';
import ControlsView from './Analysis/ControlsView';
import FingerprintView from "./Analysis/FingerprintView";

export default class ResultHit extends Component {
  constructor(props) {

    super(props);

    this.state = {
      
    }
  }

  render() {
    return (
      <div>
        {/*A SINGLE ACCORDION ITEM.. MAP THESE TO RESULTS ARRAY*/}
        <div className="accordion-item">
          <h2 className="accordion-header collapsed" id={"hit-" + this.props.id}>
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#hit-" + this.props.id + "-body"} aria-expanded="false" aria-controls={"hit-" + this.props.id + "-body"}>
              
              <span className="badge rounded-pill bg-primary"><i className="fad fa-chart-bar"></i> &nbsp; {this.props.data.score}</span>
                &nbsp;
                <small>{this.props.data.parent_name}</small>
              </button>
          </h2>
          <div id={"hit-" + this.props.id + "-body"} className="accordion-collapse collapse" aria-labelledby={"hit-" + this.props.id}>
            <div className="accordion-body">

              <TabGroup 
                tabContent={
                  {
                    0: <SequenceView data={this.props.data}/>,
                    1: <FingerprintView data={this.props.data}/>,
                    2: <TableView data={this.props.data}/>, 
                    3: "test3", 
                    4: <ControlsView data={this.props.data}/>
                  }
                }
              />

              <div className="row">

                {/*APEX CHART*/}
                <div className="col-lg-12 mb-3">
                  <div id="hit-1-chart"></div>
                </div>

                {/*STATISTICAL SCORES*/}

                {/*PEPTIDE TABLE*/}

                {/*CONTROLS*/}


              </div>




            </div>
          </div>
        </div>
        {/*A SINGLE ACCORDION ITEM.. MAP THESE TO RESULTS ARRAY*/}
      </div>
    );
  }

}

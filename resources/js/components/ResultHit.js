import React, { Component } from "react";
import ReactDOM from 'react-dom'
import Chart from "react-apexcharts";

import TabGroup from './Tabs/TabGroup';

import SequenceView from './Analysis/SequenceView';
import FingerprintView from "./Analysis/FingerprintView";
import TableView from './Analysis/TableView';
import StatisticsView from './Analysis/StatisticsView';
import ControlsView from './Analysis/ControlsView';

import ScoreBadge from "./Analysis/ScoreBadge";


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
                <ScoreBadge score={this.props.data.score} significant={false} />
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
                    3: <StatisticsView data={this.props.data} />, 
                    4: <ControlsView data={this.props.data}/>
                  }
                }
              />

            </div>
          </div>
        </div>
        {/*A SINGLE ACCORDION ITEM.. MAP THESE TO RESULTS ARRAY*/}
      </div>
    );
  }

}

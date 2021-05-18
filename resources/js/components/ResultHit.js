import React, { Component } from "react";
import ReactDOM from 'react-dom'
import Chart from "react-apexcharts";

import TabGroup from './TabGroup'

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
              
              <span className="badge rounded-pill bg-primary"><i className="fas fa-star"></i> Score: 85</span>
                &nbsp;
                <span className="badge rounded-pill bg-light text-dark"><i class="fal fa-table"></i> name_of_table</span>

                {this.props.id}
              </button>
          </h2>
          <div id={"hit-" + this.props.id + "-body"} className="accordion-collapse collapse" aria-labelledby={"hit-" + this.props.id}>
            <div className="accordion-body">

              <TabGroup />

              <div className="row">

                {/*SEQUENCE VIEW*/}
                <div className="col-lg-12 mb-3">
                  <div className="font-monospace">CTISQPEWFKCRRWQWRMKKLGAPSITCVRRAFALECIRAIAEKKADAVTLDGGMVFEACRDPYKLRPVAAEIYGTKESPQTHYYAVAVVKKGSNFQLDQLQGRKSCHTGLGRSAGWIIPMGILRPYLSWTESLEPLQGAVAKFFSASCVPCIDRQAYPNLCQLCKGEGENQCACSSREPYFGYSGAFKCLQDGAGDVAFVKETTVFENLPEKADRDQYELLCLNNSRAPVDAFKECHLAQVPSHAVVARSVDGKEDLIWKLLSKAQEKFGKNKSRSFQLFGSPPGQRDLLFKDSALGFLRIPSKVDSALYLGSRYLTTLKNLRETAEEVKARYTRVVWCAVGPEEQKKCQQWSQQSGQNVTCATASTTDDCIVLVLKGEADALNLDGGYIYTAGKCGLVPVLAENRKSSKHSSLDCVLRPTEGYLAVAVVKKANEGLTWNSLKDKKSCHTAVDRTAGWNIPMGLIVNQTGSCAFDEFFSQSCAPGADPKSRLCALCAGDDQGLDKCVPNSKEKYYGYTGAFRCLAEDVGDVAFVKNDTVWENTNGESTADWAKNLNREDFRLLCLDGTRKPVTEAQSCHLAVAPNHAVVSRSDRAAHVKQVLLHQQALFGKNGKNCPDKFCLFKSETKNLLFNDNTECLAKLGGRPTYEEYLGTEYVTAIANLKKCSTSPLLEACAFLTRR
                  </div>
                </div>

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

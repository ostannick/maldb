import React, { Component } from "react";
import ReactDOM from 'react-dom'
import Chart from "react-apexcharts";

export default class Results extends Component {
  constructor(props) {

    super(props);

    this.state = {
      status: 'init',
      hits: [],
    }
  }


  render() {
    if(this.state.status == 'init')
    {
      return(
        <div>
          <h1 className="text-center display-6 text-primary">awaiting your input...</h1>
          <h1 className="text-center display-6 text-primary"><i class="fal fa-arrow-left"></i></h1>
        </div>
      );
    }
    else if(this.state.status == 'searching')
    {
      return (
        <div>
          <h1 className="text-center display-6 text-primary">now searching</h1>
          <div className="d-flex justify-content-center">
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          </div>
        </div>
      );
    }
    else if(this.state.status == 'failure')
    {
      return (
        <div>
          <h1 className="text-center display-6 text-primary">something went wrong</h1>
          <h1 className="text-center display-6 text-primary"><i class="fal fa-times"></i></h1>
          <div className="d-flex justify-content-center">

            <p className="text-center font-monospace">There was a snake in your boot.</p>
          </div>
        </div>
      );
    }
    else if(this.state.status == 'results')
    {
      return (
        <div>
        <div class="accordion" id="results-accordion">


          {/*A SINGLE ACCORDION ITEM.. MAP THESE TO RESULTS ARRAY*/}
          <div class="accordion-item">
            <h2 class="accordion-header" id="hit-1">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#hit-1-body" aria-expanded="true" aria-controls="hit-1-body">
                <span class="badge rounded-pill bg-primary"><i class="fas fa-star"></i> Score: 85</span>
                &nbsp;
                glmS Glutamine oxo de fructose hydrogenase
              </button>
            </h2>
            <div id="hit-1-body" class="accordion-collapse collapse show" aria-labelledby="hit-1">
              <div class="accordion-body">

              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">Sequence Map</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Fingerprint</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Table</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Statistics</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Controls</a>
                </li>
              </ul>

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
        </div>
      );
    }
  }
}

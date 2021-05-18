import React, { Component } from "react";
import ReactDOM from 'react-dom'
import Chart from "react-apexcharts";

import ResultHit from './ResultHit';

export default class Results extends Component {
  constructor(props) {

    super(props);

    this.state = {

    }
  }

  render() {
    if(this.props.status == 'init')
    {
      return(this.renderInit());
    }
    else if(this.props.status == 'searching')
    {
      return(this.renderSearching());
    }
    else if(this.props.status == 'failure')
    {
      return(this.renderFailure());
    }
    else if(this.props.status == 'results')
    {
      return (
        <div>
          <div className="accordion" id="results-accordion">

            {Object.entries(this.props.hits.results).map(hit => (

              <ResultHit 
                key={hit[0]}
                id={hit[0]}
                data={hit[1]}
              />

            ))}

          </div>
        </div>
      );
    }
  }

  renderInit()
  {
    return (
      <div>
        <h1 className="text-center display-6 text-primary">initialized</h1>
      </div>
    );
  }

  renderFailure()
  {
    return(
      <div>
        <h1 className="text-center display-6 text-primary">ZOINKS!</h1>
        <h1 className="text-center display-6 text-primary"><i className="fal fa-times"></i></h1>
        <div className="d-flex justify-content-center">

          <p className="text-center font-monospace">{this.props.message}</p>
        </div>
      </div>
    );
  }

  renderSearching()
  {
    return(
      <div>
        <h1 className="text-center display-6 text-primary">now searching</h1>
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Searching...</span>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 mt-3">
            <div className="progress">
              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ "width": "75%" }}></div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  renderAccordionItem()
  {
    return(
      <div>
        {/*A SINGLE ACCORDION ITEM.. MAP THESE TO RESULTS ARRAY*/}
        <div className="accordion-item">
          <h2 className="accordion-header" id="hit-1">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#hit-1-body" aria-expanded="true" aria-controls="hit-1-body">
              <span className="badge rounded-pill bg-primary"><i className="fas fa-star"></i> Score: 85</span>
                &nbsp;
                glmS Glutamine oxo de fructose hydrogenase
              </button>
          </h2>
          <div id="hit-1-body" className="accordion-collapse collapse show" aria-labelledby="hit-1">
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

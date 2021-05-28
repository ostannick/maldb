import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import FadeIn from 'react-fade-in';
import Toolbar from './Toolbar';
import FingerprintView from '../Analysis/FingerprintView';

export default class ResultsFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toolbarButtons: [
        { type: 'btn btn-primary btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-up', disabled: false, clickCallback: false },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: false },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: false },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: false },
        { type: 'btn btn-light btn-lg', tooltip: 'Search', icon: 'fad fa-thumbs-down', disabled: false, clickCallback: false },
      ],

      results: {
        code: 'init',
        message: '0x00000',
      },
    }
  }

  render() {
    return (
      <div>
        <FadeIn>

          <Toolbar 
            title="Results"
            buttons={this.state.toolbarButtons}
          />

          {/*Protein Name */}
          <h3 className="text-primary">
            >tr|Q6LBN7|Q6LBN7_BOVIN Lactoferrin (Fragment) OS=Bos taurus OX=9913 PE=2 SV=1
          </h3>

          {/*Sequence View */}
          <div className="progress mt-3 mb-3" style={{'height': '20px'}}>
            <div class="progress-bar" role="progressbar" style={{'width': '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25% Coverage</div>
          </div>

          
          <div className="font-monospace text-break fs-4 mt-3 mb-3 text-muted">
          CTISQPEWFKCRRWQWRMKKLGAPSITCVRRAFALECIRAIAEKKADAVTLDGGMVFEACRDPYKLRPVAAEIYGTKESPQTHYYAVAVVKKGSNFQLDQLQGRKSCHTGLGRSAGWIIPMGILRPYLSWTESLEPLQGAVAKFFSASCVPCIDRQAYPNLCQLCKGEGENQCACSSREPYFGYSGAFKCLQDGAGDVAFVKETTVFENLPEKADRDQYELLCLNNSRAPVDAFKECHLAQVPSHAVVARSVDGKEDLIWKLLSKAQEKFGKNKSRSFQLFGSPPGQRDLLFKDSALGFLRIPSKVDSALYLGSRYLTTLKNLRETAEEVKARYTRVVWCAVGPEEQKKCQQWSQQSGQNVTCATASTTDDCIVLVLKGEADALNLDGGYIYTAGKCGLVPVLAENRKSSKHSSLDCVLRPTEGYLAVAVVKKANEGLTWNSLKDKKSCHTAVDRTAGWNIPMGLIVNQTGSCAFDEFFSQSCAPGADPKSRLCALCAGDDQGLDKCVPNSKEKYYGYTGAFRCLAEDVGDVAFVKNDTVWENTNGESTADWAKNLNREDFRLLCLDGTRKPVTEAQSCHLAVAPNHAVVSRSDRAAHVKQVLLHQQALFGKNGKNCPDKFCLFKSETKNLLFNDNTECLAKLGGRPTYEEYLGTEYVTAIANLKKCSTSPLLEACAFLTR
          </div>
          


          <h3 className="pb-2 border-bottom">Spectra</h3>
          <FingerprintView />


          <h3 className="pb-2 border-bottom">Observability Table</h3>
          {/*Table */}

        </FadeIn>
      </div>
    );
  }
}
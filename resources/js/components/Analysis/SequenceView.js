import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class SequenceView extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return(
      <div>

        {/*SEQUENCE VIEW*/}
        <div className="col-lg-12 mb-3">
          <div className="font-monospace fs-4">CTISQPEWFKCRRWQWRMKKLGAPSITCVRRAFALECIRAIAEKKADAVTLDGGMVFEACRDPYKLRPVAAEIYGTKESPQTHYYAVAVVKKGSNFQLDQLQGRKSCHTGLGRSAGWIIPMGILRPYLSWTESLEPLQGAVAKFFSASCVPCIDRQAYPNLCQLCKGEGENQCACSSREPYFGYSGAFKCLQDGAGDVAFVKETTVFENLPEKADRDQYELLCLNNSRAPVDAFKECHLAQVPSHAVVARSVDGKEDLIWKLLSKAQEKFGKNKSRSFQLFGSPPGQRDLLFKDSALGFLRIPSKVDSALYLGSRYLTTLKNLRETAEEVKARYTRVVWCAVGPEEQKKCQQWSQQSGQNVTCATASTTDDCIVLVLKGEADALNLDGGYIYTAGKCGLVPVLAENRKSSKHSSLDCVLRPTEGYLAVAVVKKANEGLTWNSLKDKKSCHTAVDRTAGWNIPMGLIVNQTGSCAFDEFFSQSCAPGADPKSRLCALCAGDDQGLDKCVPNSKEKYYGYTGAFRCLAEDVGDVAFVKNDTVWENTNGESTADWAKNLNREDFRLLCLDGTRKPVTEAQSCHLAVAPNHAVVSRSDRAAHVKQVLLHQQALFGKNGKNCPDKFCLFKSETKNLLFNDNTECLAKLGGRPTYEEYLGTEYVTAIANLKKCSTSPLLEACAFLTRR</div>
        </div>

      </div>
    );
  }

  componentDidMount()
  {
    //Load the sequence view via an API call.
  }
}
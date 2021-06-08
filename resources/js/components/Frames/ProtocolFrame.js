import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import Toolbar from '../Toolbar';

import FadeIn from "react-fade-in";

export default class ProtocolFrame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toolbarButtons: 

      [
        //First Group
        [],
        //Second group...
        [],
      ],


    }
  }

  render() {
    return (
      <FadeIn>
        
        <Toolbar
          title="Peptide Mass Fingerprinting Protocol"
          buttons={this.state.toolbarButtons}
        />

        {/* REAGENTS TABLE */}
        <h3>Reagents</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Reagent</th>
              <th scope="col">Concentration</th>
              <th scope="col">Day Required</th>
              <th scope="col">Half Life</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ultra-filtered Water</td>
              <td>100%</td>
              <td>1</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Ammonium Carbonate</td>
              <td>50mM</td>
              <td>1</td>
              <td>Long</td>
            </tr>
            <tr>
              <td>Methanol / Water</td>
              <td>50% / 50%</td>
              <td>1</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Acetonitrile / Water</td>
              <td>50% / 50%</td>
              <td>1</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Acetonitrile</td>
              <td>100%</td>
              <td>1</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Ammonium Carbonate / DTT</td>
              <td>50mM / 50mM</td>
              <td>1</td>
              <td>Very Short</td>
            </tr>
            <tr>
              <td>Ammonium Carbonate / Iodoacetamide</td>
              <td>50mM / 50mM</td>
              <td>1</td>
              <td>Short, Light Sensitive</td>
            </tr>
            <tr>
              <td>Acetic Acid / Trypsin</td>
              <td>50mM / 20ng/uL</td>
              <td>1</td>
              <td>Store at -80C</td>
            </tr>
            <tr>
              <td>Water / Acetonitrile / Trifluoroacetic Acid</td>
              <td>49.5% / 49.5% / 1%</td>
              <td>2</td>
              <td>Long</td>
            </tr>
            <tr>
              <td>Water / Acetonitrile / Trifluoroacetic Acid</td>
              <td>89.5% / 9.5% / 1%</td>
              <td>2</td>
              <td>Long</td>
            </tr>
          </tbody>
        </table>

        {/* In- */}
        <h3>In-Gel Digestion</h3>

        <ol>

          <li className="mb-3">
            Using a clean scalpel blade, excise the minimum amount of gel around the gel band to maximize protein yield. If doing multiple gel bands, rinse the blade with excess Ultra-pure water, and dry with a Kim wipe.
          </li>

          <li className="mb-3">
            Slice the gel into 1mm3 pieces such that they are small, but not small enough to be aspirated by a P200 tip. Place these gel bits into the bottom of a 1.5mL Eppendorf tube.
          </li>

          <li className="mb-3">
            Destain the gel using 1mL of 50% H2O and 50% MeOH. This step may require multiple washes. Use large volumes (500-1000uL with heavy stirring/vortexing (1400RPM), 50oC). Older gels take longer to destain.
          </li>

          <li className="mb-3">
            Dehydrate the gel using 50% ACN solution (2min) followed by 100% ACN solution (30sec). Dry by placing in the thermal mixer with the caps open to evaporate any small amounts of remaining acetonitrile. Mixing is not required during this step, but if you choose to do so, mix at a low RPM such that your gel bits do not fly out of your tube.
          </li>

          <div class="alert alert-warning" role="alert">
            Full dehydration is achieved when gel pieces look opaque, chalky, and white. Gel pieces with a milky white appearance are not fully dehydrated and will not absorb water as effectively.
          </div>

          <li className="mb-3">
            Rehydrate gel in 50mM DTT solution to reduce cysteines. Place in the thermal mixer for 20-60min at 56oC, shaking, lids closed. Make this fresh every time you do MS. Never re-use DTT.
          </li>

          <li className="mb-3">
            Remove the reducing solution and add iodoacetamide alkylating solution. Leave these tubes in an area away from light (i.e. drawer, cupboard) for 20-60min. Shaking is not necessary. This solution must be made up fresh at 10mg/mL iodoacetamide (55mM) in 50mM ammonium carbonate.
          </li>

          <li className="mb-3">
            Remove the alkylating solution and wash twice with 1mL of 50mM ammonium carbonate. Dehydrate the gel pieces again as in (4). Dry again by placing in the hot thermal mixer for 1-2mins. It is crucial at this step that all liquid/acetonitrile be removed from the tubes. If you find your gel pieces are not completely white, but rather have a ‘milky white’ appearance (white edges, grey interior), add more pure acetonitrile and dry until the gel pieces take on the appearance of white chalk.
          </li>

          <li className="mb-3">
            Add enough trypsin solution (typically 20-30uL) at 0.02ug/uL (aka 20ng/uL) to barely cover the gel pieces. Wait ~10min to ensure the pieces are covered after rehydration and add more 50mM ammonium carbonate if necessary. **As of June 1st 2018, I put 50uL aliquots of 100ng/uL trypsin in box B3-2. Aliquots should be labelled “MS TRYPSIN”. Trypsin will never be in an unlabelled tube -- always in labelled 500uL tubes (-80oC). You will need 1 tube for every 12 samples. Thaw with your hand, and leave on ice until you are ready to trypsinize. Add 200uL of 50mM ammonium carbonate, to yield a 250uL final volume.
          </li>

          <li className="mb-3">
            Parafilm tubes and allow digest to proceed for 5 to 18 hours at 37oC. Do not mix.
          </li>

          {/*SECOND HEADER */}
          <h3>Peptide Elution & Data Acquisition</h3>

          <li className="mb-3">
            To the gel pieces, add 90% ACN/8.5% H2O/2.5% trifluoroacetic acid and place in a bath sonicator or thermal mixer for 30min at 1,400 RPM. Ensure you place the lid on the mixer or the tubes may fly out.
          </li>

          <li className="mb-3">
            Extract the elution and place in a new tube. You may do multiple elution steps using solvents such as 50/50, 90/10 ACN:H2O and combine the fractions.
          </li>

          <li className="mb-3">
            Dry in vaccum centrifuge to volume of ~10uL. This process may take a while depending on how many fractions you have pooled, but do not use the heating function on the centrifuge. Lyophilize at room temp!
          </li>

          <div class="alert alert-primary" role="alert">
            (OPTIONAL) Desalt using a C18 ZipTip (improves quality of spectra but is expensive).
          </div>

          <li className="mb-3">
            Using the forced dried droplet method, apply 0.5uL of matrix and 0.5uL to a stainless-steel target plate. Collect in positive ion mode.
          </li>
          
        </ol>
        
      </FadeIn>
    );
  }

}
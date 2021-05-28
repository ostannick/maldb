import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class MapSeq extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    let color;
    if(this.props.obs)
    {
      color = 'bg-primary text-light'
    }
    else
    {
      color = ''
    }



    


    return(
      <span className={color}>{this.props.seq}</span>
    );
  }


}

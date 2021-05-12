import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class DigestTableSwitch extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id={"digest_table_" + this.props.data.id} />
          <label className="form-check-label text-truncate" htmlFor={"digest_table_" + this.props.data.id}>{this.props.data.table_name}</label>
        </div>
      </div>
    );
  }
}

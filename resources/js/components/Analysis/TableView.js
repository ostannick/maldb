import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class TableView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: [],
    }

  }

  renderRow(row, index)
  {
    let icon;
    {if(row.observed == true)
      {
        icon = <i className="fad fa-check-circle text-primary"></i>
      }
      else
      {
        icon = <i class="fad fa-eye-slash text-danger"></i> 
      }
    }

    return(
      <tr key={index}>
        <th><span className="font-monospace">{row.sequence}</span></th>
        <td>{row.mz1_monoisotopic}</td>
        <td>{row.mz1_average}</td>
        <td>{row.missed_cleavages}</td>
        <td>{row.met_ox_count}</td>
        <td>{icon}</td>
      </tr>
    );
  }

  render() {
    return(
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Sequence</th>
            <th scope="col">Mass Mono</th>
            <th scope="col">Mass Avg</th>
            <th scope="col">Missed</th>
            <th scope="col">MSO</th>
            <th scope="col">Observed?</th>
          </tr>
        </thead>
        <tbody>

        {this.state.results.map((row, index) => (

          this.renderRow(row, index)

        ))}
          
          

        </tbody>
      </table>
    );
  }

  componentDidMount()
  {

    const sendData = {
      data: this.props.data,
    };

    axios.post(`/analysis/table`, sendData)
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({results: response});
      })
      .catch(function(e) {
        console.log(e.response.data.message);
      });
  
  }

}

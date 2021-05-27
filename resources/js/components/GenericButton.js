import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';
import { times } from "lodash";

export default class GenericButton extends Component {

  constructor(props) {
    super(props);

    this.state = {
      type: this.props.type,
      tooltip: this.props.tooltip,
      icon: this.props.icon,
      disabled: this.props.disabled
    }

    this.handleClick = this.handleClick.bind(this);
    this.resetButton = this.resetButton.bind(this);
  }

  handleClick(resetCallback)
  {
    this.setState({type: this.props.type + ' disabled'});
    this.setState({icon: 'fas fa-spin fa-cog'});
    this.setState({tooltip: 'Working...' });
    this.setState({disabled: true});

    if(this.props.clickCallback != false)
    {
      this.props.clickCallback(this.resetButton);
    }
    else
    {
      console.log('This button has no callback function.');
      console.log('Button was clicked, but nothing happened.');
      setTimeout(function(){
        resetCallback();
      }, 300);
      
    }
  }

  resetButton()
  {
    this.setState({ type: this.props.type});
    this.setState({ icon: this.props.icon});
    this.setState({ tooltip: this.props.tooltip});
    this.setState({ disabled: this.props.disabled});
  }

  render() {
    return (
      <button
        type="button"
        className={this.props.type}
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title={this.props.tooltip}
        onClick={() => this.handleClick(this.resetButton)}
        disabled={this.state.disabled}
        >  
          <i className={this.state.icon}></i>
      </button>
    );
  }

  componentDidMount()
  {
    
  }
}

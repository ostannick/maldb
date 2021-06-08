import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import FadeIn from 'react-fade-in';

import SideNavItem from './SideNavItem'

export default class SideNav extends Component {

  constructor(props) {
    super(props);
  }

  renderSideNavItem(item, idx)
  {
    return(
      <SideNavItem
        key={item.index}
        index={item.index}
        title={item.title}
        icon={item.icon}
        handleClick={(index) => this.props.handleClick(index)}
      />
    )
  }

  render() {
    return (
      <ul className="list-group mb-3">

        <FadeIn>

          {this.props.items.map((item, idx) => (

            this.renderSideNavItem(item, idx)

          ))}

        </FadeIn>

      </ul>
    );
  }
}

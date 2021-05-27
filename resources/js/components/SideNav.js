import React, { Component } from "react";
import ReactDOM from 'react-dom'
import axios from 'axios';

import FadeIn from 'react-fade-in';

import SideNavItem from './SideNavItem'

export default class SideNav extends Component {

  constructor(props) {
    super(props);
  }

  renderSideNavItem(item)
  {
    return(
      <SideNavItem
        index={item.index}
        title={item.title}
        icon={item.icon}
        handleClick={(index) => this.props.handleClick(index)}
      />
    )
  }

  render() {
    return (
      <ul className="list-group">

        <FadeIn>

          {this.props.items.map((item) => (

            this.renderSideNavItem(item)

          ))}

        </FadeIn>

      </ul>
    );
  }
}

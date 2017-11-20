import React, { Component } from 'react'

export default class CustomLink extends Component {
  componentDidMount() {
    this.link.parentNode.scrollLeft = this.link.offsetLeft;
  }

  onClick = () => {
      this.props.callback()
  }

  render() {
      const isActive = true;
//    const isActive = browserHistory.getCurrentLocation().pathname === this.props.to
    const className = isActive ? this.props.activeClassName : '';

    return (
      <a onClick={this.onClick}
          style={{cursor: 'pointer'}}
          className={className}
          ref={input => this.link = input}>
        {this.props.children}
      </a>
    )
  }
}

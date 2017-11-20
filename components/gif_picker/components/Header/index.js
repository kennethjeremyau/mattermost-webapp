import React, { Component } from 'react'
import constants from 'components/gif_picker/utils/constants'
import SearchBar from 'components/gif_picker/components/SearchBar'
import CustomLink from 'components/gif_picker/components/CustomLink'
import './Header.scss'

export default class Header extends Component {
  renderTab(className, title, callback, key) {
    const { appProps } = this.props

    return (
      <CustomLink
          callback={callback}
          activeClassName="active"
          onlyActiveOnIndex
          key={key}>
        <div>
          <i className={`ic ${className}`} />
          <span className="header-text">{appProps.header.displayText ? title : ''}</span>
        </div>
      </CustomLink>
    )
  }

  renderTabs(props) {
    const { appProps, onTrending, onCategories } = props
    const { header } = appProps
    return header.tabs.map((tab, index) => {
      let link;
      if (tab == constants.Tab.TRENDING) {
        link = this.renderTab('ic-trending', 'Trending', onTrending, index)
      } else if (tab == constants.Tab.REACTIONS) {
        link = this.renderTab('ic-reactions', 'Reactions', onCategories, index)
      }
      return link
    })
  }

  render() {
    const { appProps } = this.props

    return (
      <header className="header-container">
        <SearchBar {...this.props}/>
        <nav className="nav-bar">
          {this.renderTabs(this.props)}
        </nav>
      </header>
    )
  }
}

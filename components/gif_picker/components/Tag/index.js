import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  searchCategory,
  searchIfNeededInitial,
  saveSearchScrollPosition
} from 'reducers/SearchReducer'
import SearchGrid from 'components/SearchGrid'

const mapDispatchToProps = ({
  searchCategory,
  searchIfNeededInitial,
  saveSearchScrollPosition
})

@connect(null, mapDispatchToProps)
export default class Trending extends Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    this.props.saveSearchScrollPosition(0)
  }

  componentWillMount() {
    const { searchIfNeededInitial, tagName } = this.props
    searchIfNeededInitial(tagName)
  }

  loadMore = () => {
    const { searchCategory, tagName } = this.props
    searchCategory({tagName})
  }

  render() {
    return (
      <SearchGrid
        containerClassName={this.props.className}
        keyword={this.props.tagName}
        loadMore={this.loadMore}
        appProps={this.props.appProps}
      />
    )
  }
}

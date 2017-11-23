import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  searchCategory,
  searchIfNeededInitial,
  saveSearchScrollPosition
} from 'mattermost-redux/actions/gifs'
import SearchGrid from 'components/gif_picker/components/SearchGrid'

const mapDispatchToProps = ({
  searchCategory,
  searchIfNeededInitial,
  saveSearchScrollPosition
})

export class Trending extends Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    this.props.saveSearchScrollPosition(0)
  }

  componentWillMount() {
    const { searchIfNeededInitial } = this.props
    searchIfNeededInitial('trending')
  }

  loadMore = () => {
    const { searchCategory } = this.props
    searchCategory({tagName: 'trending'})
  }

  render() {
    const { handleItemClick } = this.props
    return (
      <SearchGrid
        keyword="trending"
        handleItemClick={handleItemClick}
        loadMore={this.loadMore}
      />
    )
  }
}

export default connect(null, mapDispatchToProps)(Trending);

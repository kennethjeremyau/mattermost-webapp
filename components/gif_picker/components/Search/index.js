import React, { Component } from 'react'
import  { connect } from 'react-redux'
import { searchIfNeededInitial, searchGfycat } from 'mattermost-redux/actions/gifs'
import SearchGrid from 'components/gif_picker/components/SearchGrid'

const mapStateToProps = state => ({
  ...state.entities.gifs.search
})

const mapDispatchToProps = ({
  searchGfycat,
  searchIfNeededInitial
})

export class Search extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { searchText } = this.props
    this.props.searchIfNeededInitial(searchText.split('-').join(' '))
  }

  componentWillReceiveProps(nextProps) {
    const { searchText } = nextProps
    if (this.props.searchText !== searchText) {
      this.props.searchIfNeededInitial(searchText.split('-').join(' '))
    }
  }
  
  loadMore = () => {
    const { searchText, searchGfycat } = this.props
    searchGfycat({searchText})
  }

  render() {
    const { appProps, searchText } = this.props

    return (
      <SearchGrid
        keyword={searchText}
        loadMore={this.loadMore}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);

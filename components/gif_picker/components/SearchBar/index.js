import React, { Component } from 'react'
import { connect } from 'react-redux'
import { saveSearchScrollPosition, saveSearchPriorLocation, saveSearchBarText, searchTextUpdate } from 'mattermost-redux/actions/gifs'
import { navigateTo } from 'components/gif_picker/utils/navigation'
import './SearchBar.scss'

const mapStateToProps = state => ({
  ...state.entities.gifs.categories,
  ...state.entities.gifs.search,
//  location: state.routing.locationBeforeTransitions,
  appProps: state.entities.gifs.app
})

const mapDispatchToProps = ({
  saveSearchBarText,
  saveSearchPriorLocation,
  saveSearchScrollPosition,
  searchTextUpdate
})

export class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inputFocused: false
    }

    this.searchTimeout = null
  }

  componentWillReceiveProps(nextProps) {
    const { tagsDict } = this.props
    const { searchBarText } = nextProps

    if (this.props.searchBarText !== searchBarText) {
      // empty input for trending or reactions
      if (searchBarText === 'trending') {
        this.updateSearchInputValue('')
      } else {
        this.updateSearchInputValue(searchBarText)
      }
    }
  }

  /**
   * Returns search text form the path with spaces
   */
  getSearchTextFromPath = pathname => {
    let split = pathname.split('/')
    return split[split.length - 1].split('-').join(' ')
  }

  /**
   * Returns text request with hyphens
   */
  parseSearchText = (searchText) => {
    return searchText.trim().split(/ +/).join('-')
  }

  removeExtraSpaces = searchText => {
    return searchText.trim().split(/ +/).join(' ')
  }

  updateSearchInputValue = searchText => {
    const { saveSearchBarText } = this.props
    this.searchInput.value = searchText
    saveSearchBarText(searchText)
  }

  handleSubmit = event => {
    event.preventDefault()
    this.triggerSearch(this.searchInput.value)
    this.searchInput.blur()
  }

  triggerSearch = searchText => {
    const { appProps, saveSearchScrollPosition, saveSearchPriorLocation, searchTextUpdate, onSearch } = this.props

    searchText = this.parseSearchText(searchText)
      /*
    const newSearchUrl = `${appProps.basePath}/search/${searchText}`

    if (location && location.pathname.indexOf('search') !== -1) {
      browserHistory.replace(newSearchUrl)
    } else {
      saveSearchPriorLocation(browserHistory.getCurrentLocation().pathname)
      navigateTo(newSearchUrl, appProps.enableHistory)
    }
    */
    searchTextUpdate(searchText)
    onSearch()
    saveSearchScrollPosition(0)
  }

  handleChange = event => {
    clearTimeout(this.searchTimeout)

    const searchText = event.target.value

    const { saveSearchBarText } = this.props
    saveSearchBarText(searchText)

    if (searchText === '') {
      this.showReactions()
      // not reactions page or there's no reactions for this search request
    } else if (location && location.pathname.indexOf('/reactions') === -1 ||
               !this.isFilteredTags(searchText)) {
      this.searchTimeout = setTimeout(() => {
        this.triggerSearch(searchText)
      }, 500)
    }
  }

  focusInput = () => {
    this.setState({ inputFocused: true })
  }

  blurInput = () => {
    this.setState({ inputFocused: false })
  }

  /**
   * Checks if there're reactions for a current searchText
   */
  isFilteredTags = (searchText) => {
    searchText = this.removeExtraSpaces(searchText)

    const { tagsList } = this.props
    const substr = searchText.toLowerCase()
    const filteredTags = tagsList && tagsList.length ? tagsList.filter(tag => {
      if (!searchText || tag.tagName.indexOf(substr) != -1)
      return tag
    }) : []

    return !!filteredTags.length
  }

  showReactions = () => {
    const { appProps } = this.props
    navigateTo(`${appProps.basePath}/reactions`, appProps.enableHistory)
  }

  clearSearchHandle = () => {
    this.updateSearchInputValue('')
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.searchBarText && this.props.searchBarText ||
      nextProps.searchBarText && !this.props.searchBarText ||
      nextState.inputFocused != this.state.inputFocused) {
        return true
    }
    return false
  }

  render() {
    const { searchBarText } = this.props
    const clearSearchButton = searchBarText ?
      <div
        className="ic-clear-search"
        onClick={this.clearSearchHandle} /> : null

    const placeholder = !searchBarText && !this.state.inputFocused ? <span className="placeholder">{'Search Gfycat'}</span> : null

    return (
      <form className="search-form" onSubmit={this.handleSubmit} method="get" target="_top" noValidate="">
        <div className="search-bar">
          <div className="search-input-bg"></div>
          {placeholder}
          <input className="search-input" name="searchText"
            required onChange={this.handleChange}
            autoComplete="off"
            autoCapitalize="off"
            onFocus={this.focusInput}
            onBlur={this.blurInput}
            ref={input => this.searchInput = input}
          />
          <div className="ic ic-search"></div>
          {clearSearchButton}
        </div>
        <button type="submit" className="submit-button"></button>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);


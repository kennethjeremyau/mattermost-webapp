import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
//import { sendEvent } from 'components/gif_picker/components/Analytics'

// TODO: move to SearchGrid reducer?
import { saveSearchScrollPosition } from 'mattermost-redux/actions/gifs'
import InfiniteScroll from 'components/gif_picker/components/InfiniteScroll'
import SearchItem from 'components/gif_picker/components/SearchItem'
import constants from 'components/gif_picker/utils/constants'
import CustomLink from 'components/gif_picker/components/CustomLink'
import './SearchGrid.scss'

const ITEMS_PADDING = 2
const NUMBER_OF_COLUMNS_PORTRAIT = 3
const NUMBER_OF_COLUMNS_LANDSCAPE = 3

const mapStateToProps = state => ({
  ...state.entities.gifs.cache,
  ...state.entities.gifs.search,
//  webpSupported: state.featureDetection.webpSupported,
  webpSupported: true,
  appProps: state.entities.gifs.app
})

const mapDispatchToProps = ({
  saveSearchScrollPosition,
//  sendEvent
})

export class SearchGrid extends Component {
  static propTypes = {
    containerClassName: PropTypes.string,
    keyword: PropTypes.string, // searchText, tagName
    handleItemClick: PropTypes.func,
    loadMore: PropTypes.func,
    numberOfColumns: PropTypes.number,
    scrollPosition: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state = {
      containerWidth: null
    }
    this.scrollPosition = this.props.scrollPosition
    this.setNumberOfColumns()

    /**
     * Inital values for columns heights
     */
    this.columnsHeights = Array(this.numberOfColumns).fill(0)

    /**
     * Items padding value
     */
    this.padding = ITEMS_PADDING
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.keyword != this.props.keyword) {
      window.scrollTo(0, 0)
    }
  }

  componentDidMount() {
    this.container = document.getElementById('search-grid-container')

    this.setState({
      ...this.state,
      containerWidth: this.container.offsetWidth
    })
    window.addEventListener('resize', this.resizeHandler)
    window.addEventListener('scroll', this.scrollHandler)
  }

  componentWillUnmount() {
    const { saveSearchScrollPosition, keyword } = this.props
    if (keyword !== 'trending') {
      saveSearchScrollPosition(this.scrollPosition)
    }

    window.removeEventListener('resize', this.resizeHandler)
    window.removeEventListener('scroll', this.scrollHandler)
  }

  setNumberOfColumns = () => {
    if (window.matchMedia("(orientation: portrait)").matches) {
      this.numberOfColumns = NUMBER_OF_COLUMNS_PORTRAIT
    } else {
      this.numberOfColumns = NUMBER_OF_COLUMNS_LANDSCAPE
    }
  }

  itemClickHandler = gfyItem => {
    const { appProps, saveSearchScrollPosition, sendEvent, keyword, handleItemClick } = this.props
    saveSearchScrollPosition(this.scrollPosition)

/*    sendEvent({
      event: appProps.shareEvent,
      params: {
        gfyid: gfyItem.gfyId,
        app_id: appProps.appId,
        keyword: keyword
      }
    })*/
    handleItemClick(gfyItem)
  }

  minHeightColumnIndex = () => {
    return this.columnsHeights.indexOf(Math.min(...this.columnsHeights))
  }

  maxHeightColumnIndex = () => {
    return this.columnsHeights.indexOf(Math.max(...this.columnsHeights))
  }

  maxColumnHeight = () => {
    return Math.max(...this.columnsHeights)
  }

  resizeHandler = () => {
    if (this.state.containerWidth !== this.container.offsetWidth) {
      this.setNumberOfColumns()
      this.setState({
        ...this.state,
        containerWidth: this.container.offsetWidth
      })
      this.columnsHeights = Array(this.numberOfColumns).fill(0)
    }
  }

  scrollHandler = () => {
    this.scrollPosition = window.scrollY
  }

  render() {
    const {
      appProps,
      containerClassName,
      gifs,
      keyword,
      resultsByTerm,
      webpSupported,
      scrollPosition,
      loadMore
    } = this.props

    const { containerWidth } = this.state
    const { moreRemaining, items=[], isFetching, isEmpty } = resultsByTerm[keyword] ? resultsByTerm[keyword] : {}

    /**
     * Columns 'left' values
     */
    const columnWidth = parseInt(containerWidth / this.numberOfColumns)
    const leftPosition = Array(this.numberOfColumns)
      .fill(0).map((item, index) => index * columnWidth)

    this.columnsHeights = Array(this.numberOfColumns).fill(0)

    // Item width in %
    const itemWidth = this.numberOfColumns == NUMBER_OF_COLUMNS_PORTRAIT ? 100 / NUMBER_OF_COLUMNS_PORTRAIT : 100 / this.numberOfColumns

    const searchItems = containerWidth && items.length ?
      items.map((item, index) => {
        const gfyItem = gifs[item]
        const { gfyId, gfyName, width, height, max1mbGif, avgColor } = gfyItem

        // Position calculation
        const colIndex = this.minHeightColumnIndex()
        const top = this.columnsHeights[colIndex] + 'px'
        const left = leftPosition[colIndex] + 'px'
        const itemHeight = containerWidth / this.numberOfColumns / gfyItem.width * gfyItem.height + this.padding
        this.columnsHeights[colIndex] += itemHeight

        return (
          <SearchItem
            webpSupported={webpSupported}
            gfyItem={gfyItem}
            top={top}
            left={left}
            itemWidth={itemWidth}
            itemClickHandler={this.itemClickHandler}
            key={`${index}-${gfyId}`}
          />
        )
    }) : null

    this.containerHeight = this.maxColumnHeight()

    const content = searchItems ? (
      <InfiniteScroll
        className="search-grid-infinite-scroll"
        pageStart={0}
        loadMore={loadMore}
        initialLoad={false}
        hasMore={moreRemaining}
        threshold={1}
        containerHeight={this.containerHeight}
        scrollPosition={scrollPosition}
        useWindow={false}
      >
        {searchItems}
      </InfiniteScroll>
    ) : null

    const emptySearch = isEmpty ? (
      <div className="empty-search">
        <div className="empty-search-image"></div>
        <p>0 Gifs found for <strong>{keyword}</strong></p>
        <CustomLink to={`${appProps.basePath}/reactions`} enableHistory={appProps.enableHistory}>
          <div className="empty-search-button">Go to Reactions</div>
        </CustomLink>
      </div>
    ) : null

    return (
      <div
        id="search-grid-container"
        className={`search-grid-container ${containerClassName}`}
      >
        {content}
        {emptySearch}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchGrid);

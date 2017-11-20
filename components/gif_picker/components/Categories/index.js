import React, { Component } from 'react'
import { connect } from 'react-redux'
import CustomLink from 'components/gif_picker/components/CustomLink'
import { requestCategoriesListIfNeeded } from 'mattermost-redux/actions/gifs'
import { saveSearchBarText, saveSearchScrollPosition, searchTextUpdate } from 'mattermost-redux/actions/gifs'
//import { sendViewCountBatch } from 'components/Analytics'
import './Categories.scss'

const mapStateToProps = (state) => ({
  ...state.entities.gifs.categories,
  ...state.entities.gifs.cache,
  appProps: state.entities.gifs.app,
  searchText: state.entities.gifs.search.searchText,
  searchBarText: state.entities.gifs.search.searchBarText,
  webpSupported: true
  //webpSupported: state.entities.gifs.featureDetection.webpSupported,
})

const mapDispatchToProps = ({
  saveSearchBarText,
  saveSearchScrollPosition,
  searchTextUpdate,
  requestCategoriesListIfNeeded,
  //sendViewCountBatch
})

export class Categories extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.props.requestCategoriesListIfNeeded()
    this.sendImpressions()
  }

  sendImpressions = () => {
//    const { tagsList, sendViewCountBatch, appProps } = this.props
    const { tagsList, appProps } = this.props
    const gfycats = tagsList.map(tag => {
      return { gfyId: tag.gfyId }
    })

/*
    if (gfycats.length) {
      sendViewCountBatch({
        gfycats,
        params: {
          app_id: appProps.appId,
          context: 'category_list'
        }
      })
    }
*/
  }

  componentWillUnmount() {
    const { saveSearchScrollPosition } = this.props
    saveSearchScrollPosition(0)
  }

  filterTagsList = () => {
    const { searchBarText, tagsList } = this.props

    const substr = searchBarText.toLowerCase().trim().split(/ +/).join(' ')
    return tagsList && tagsList.length ? tagsList.filter(tag => {
      if (!searchBarText || tag.tagName.indexOf(substr) != -1) {
        return tag
      }
    }) : []
  }

  render() {
    const { tagsList, webpSupported, gifs, appProps, onSearch, onTrending, saveSearchBarText } = this.props

    const content = tagsList && tagsList.length ? this.filterTagsList(tagsList).map((item, index) => {
      const { tagName, gfyId } = item
      
      if (!gifs[gfyId]) return null

      const gfyItem = gifs[gfyId]
      const { gfyName, max1mbGif, avgColor } = gfyItem
      const searchText = tagName.replace(/\s/g, '-')
      const webpUrl = `https://thumbs.gfycat.com/${gfyName}.webp`
      const backgroundImage = { backgroundImage: webpSupported ? `url(${webpUrl})` : `url(${max1mbGif})` }
      const backgroundColor = { backgroundColor: avgColor }
      const callback = searchText === 'trending' ? onTrending : () => {
          saveSearchBarText(tagName)
          searchTextUpdate(tagName)
          onSearch()
      }
      return (
        <CustomLink callback={callback} key={index} enableHistory={appProps.enableHistory}>
          <div className="category-container">
            <div className="category" style={{...backgroundImage, ...backgroundColor}}>
              <div className="category-name">{tagName}</div>
            </div>
          </div>
        </CustomLink>
      )
    }) : []

    return (
      <div className="categories-container">
        {content}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);

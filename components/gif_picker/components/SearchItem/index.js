import React, { Component } from 'react'
import './SearchItem.scss'

export default class SearchItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      webpSupported,
      gfyItem,
      top,
      left,
      itemWidth,
      itemClickHandler
    } = this.props

    const { gfyId, gfyName, width, height, max1mbGif, avgColor } = gfyItem

    const webpUrl = `https://thumbs.gfycat.com/${gfyName}.webp`
    const backgroundImage = { backgroundImage: webpSupported ? `url(${webpUrl})` : `url(${max1mbGif})` }
    const backgroundColor = { backgroundColor: avgColor }
    const paddingBottom = { paddingBottom: 100 / width * height + '%' }


    return (
      <div className="search-item-wrapper" style={{top: top, left: left, width: itemWidth ? `${itemWidth}%` : ''}}>
        <div className="search-item"
          style={{...backgroundImage, ...backgroundColor, ...paddingBottom}}
          onClick={() => itemClickHandler(gfyItem)} />
      </div>
    )
  }
}

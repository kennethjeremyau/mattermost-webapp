import SkypeActions from './skypeSdkActions'

/**
 * Get one of the supported aspect ratios, the closest to the original
 */
const aspectRatio = gfyItem => {
  const { width, height } = gfyItem
  const aspect = width / height
  const aspectStrings = ['16:9', '1:1', '9:16']

  if (aspect > 1) {
    return aspectStrings[0]
  } else if (aspect < 1) {
    return aspectStrings[2]
  } else {
    return aspectStrings[1]
  }
}

const createGifCard = gfyItem => {
  return {
    type: 'message/card',
    attachments: [{
      contentType: 'application/vnd.microsoft.card.flex',
      content: {
        aspect: `${gfyItem.width}:${gfyItem.height}`,
        subtitle: 'Gfycat - Send a GIF',
        images: [{
          url: gfyItem.max5mbGif,
          tap: {
            type: 'openUrl',
            value: 'https://gfycat.com/skypewebviews?utm_source=skype&utm_medium=chat'
          }
        }],
        tap: {
          type: 'openUrl',
          value: 'https://gfycat.com/skypewebviews?utm_source=skype&utm_medium=chat'
        }
      }
    }]
  }
}

const share = ({gfyItem}) => {
  SkypeActions.share(createGifCard(gfyItem))
}

const readyToShare = gfyItem => {
  SkypeActions.readyToShare(createGifCard(gfyItem))
}

const hideShare = () => {
  SkypeActions.hideShare()
}

export default {
  share,
  readyToShare,
  hideShare
}

const share = ({embedData}) => {
  window.parent.postMessage({
    messageType: 'embed',
    embedData: {
      ...embedData
    }
  }, '*')
}

export default {
  share
}
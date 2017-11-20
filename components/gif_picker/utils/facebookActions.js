const share = ({url, gfyItem}) => {
  const payload = {
    attachment: {
      type: 'image',
      payload: {
        url: url ? url : gfyItem.max5mbGif
      }
    }
  }

  // TODO: this should go in config eventually
  const facebookAppId = window.location.host == 'gfycat.com' ? 989121307884833 : 1882589368667481
  MessengerExtensions.getContext(facebookAppId,
    response => {
      MessengerExtensions.beginShareFlow(
        (response) => {
          if (response.is_sent) {
            MessengerExtensions.requestCloseBrowser()
          }
        },
        (errorCode, errorMessage) => { alert(errorCode + ' ' + errorMessage) },
        payload,
        response.thread_type == 'USER_TO_PAGE' ? 'broadcast' : 'current_thread');
    },
    (errorCode, errorMessage) => {
      alert(errorCode + ' ' + errorMessage)
    })
}

export default {
  share
}

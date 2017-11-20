import constants from './constants'

export const getAppName = () => {
  if (window.location.pathname.indexOf('/facebookwebviews') == 0) {
    return constants.appName.facebook
  } else if (window.location.pathname.indexOf('/skypewebviews') == 0) {
    return constants.appName.skype
  } else if (window.location.pathname.indexOf('/wordpressplugin') == 0) {
    return constants.appName.wordpress
  }
}

export default getAppName
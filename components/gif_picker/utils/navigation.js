import { browserHistory } from 'react-router';

export const navigateTo = function(location, enableHistory) {
  if (enableHistory) {
    browserHistory.push(location)
  } else {
    browserHistory.replace(location)
  }
}

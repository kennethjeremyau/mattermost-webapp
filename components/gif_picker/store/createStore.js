import { createStore } from 'redux'
//import { applyMiddleware, compose, createStore } from 'redux'
//import { routerMiddleware } from 'react-router-redux'
//import think from 'redux-thunk'
import rootReducer from 'mattermost-redux/reducers/entities/gifs'

export default (initialState={}) => {
//export default (initialState={}, history) => {
//  const middleware = [think, routerMiddleware(history)]

  // Used by Redux DevTools extension
//  const enhancers = []
//  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window) {
//    const devToolsExtension = window.devToolsExtension
//    if (typeof devToolsExtension === 'function') {
//      enhancers.push(devToolsExtension())
//    }
//  }

  const store = createStore(
    rootReducer,
    initialState,
//    compose(
//      applyMiddleware(...middleware),
//      ...enhancers
//    )
  )

  return store
}

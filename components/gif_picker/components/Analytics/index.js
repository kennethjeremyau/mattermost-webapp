import fetch from 'isomorphic-fetch'
import { readCookie, setCookie } from 'components/gif_picker/utils/cookies'
import { generateUUID } from 'components/gif_picker/utils/utils'


/**
 *  Action types
 */
export const SEND_VIEW_COUNT = 'SEND_VIEW_COUNT'
export const SEND_EVENT = 'SEND_EVENT'
export const SET_USER_COOKIE = 'SET_USER_COOKIE'
export const SET_SESSION_COOKIE = 'SET_SESSION_COOKIE'

export const BATCH_MAX_LENGTH = 30


/**
 *  Actions
 */
export const viewCount = ({gfyId, params}) => ({
  type: SEND_VIEW_COUNT,
  payload: {
    gfyId,
    params
  }
})

export const analyticsEvent = ({event, params}) => ({
  type: SEND_EVENT,
  payload: {
    event,
    params
  }
})


export const setUserIdCookie = utc => ({
  type: SET_USER_COOKIE,
  payload: {
    utc
  }
})

export const setSessionIdCookie = stc => ({
  type: SET_SESSION_COOKIE,
  payload: {
    stc
  }
})

const metricsEndpoint = 'https://metrics.gfycat.com/pix.gif'
const pixelEndpoint = 'https://px.gfycat.com/px.gif'
const defaultAppId = 'com.gfycat.website'

/**
 *  Action Creators
 */
export const sendViewCount = ({gfyId, params}) => {
  return (dispatch, getState) => {
    if (typeof document === 'undefined') return

    if (!params.app_id) params.add_id = defaultAppId

    dispatch(viewCount({gfyId, params}))
    const { utc, stc } = getUserAndSessionIds({dispatch, getState})
    const _utc = encodeURIComponent(utc)
    const _stc = encodeURIComponent(stc)
    const deviceType = getState().featureDetection.mobileDevice ? 'mobile' : 'desktop'

    const extendedParams = {
      gfyid: gfyId,
      ...params,
      device_type: deviceType,
      utc: _utc,
      stc: _stc,
      rand: Math.random() * 100000
    }

    const queryString = queryParamsString(extendedParams)
    const url = `${pixelEndpoint}?${queryString}`
    fetch(url)
  }
}

export const sendViewCountBatch = ({gfycats, params}) => {
  return (dispatch, getState) => {
    if (typeof document === 'undefined') return

    if (!params.app_id) params.add_id = defaultAppId

    const { utc, stc } = getUserAndSessionIds({dispatch, getState})
    const _utc = encodeURIComponent(utc)
    const _stc = encodeURIComponent(stc)

    if (gfycats.length > BATCH_MAX_LENGTH) {
      let chunks = []
      while (gfycats.length) {
        chunks.push(gfycats.splice(0, BATCH_MAX_LENGTH))
      }
      for (let i = 0; i < chunks.length; i++) {
        dispatch(sendViewCountBatch({gfycats: chunks[i], params}))
      }
      return
    }

    let gfyIds = gfycats.reduce((gfyIds, gfyItem, index) => {
      let key = index == 0 ? 'gfyid' : `gfyid_${index}`
      gfyIds[key] = gfyItem.gfyId
      return gfyIds
    }, {})

    const extendedParams = {
      ...params,
      ...gfyIds,
      utc: _utc,
      stc: _stc
    }

    const queryString = queryParamsString(extendedParams)

    const url = `${pixelEndpoint}?${queryString}`
    fetch(url)
  }
}

export const splitBatchRequest = ({gfycats, params, dispatch}) => {
  dispatch(sendViewCountBatch({gfycats, params}))
}

export const sendEvent = ({event, params}) => {
  return (dispatch, getState) => {
    if (typeof document === 'undefined') return

    dispatch(analyticsEvent({event, params}))
    const { utc, stc } = getUserAndSessionIds({dispatch, getState})
    const _utc = encodeURIComponent(utc)
    const _stc = encodeURIComponent(stc)
    const dataString = queryParamsString(params)
    const ref = typeof document.referrer !== 'undefined' && document.referrer.length ?
      document.referrer : 'https://gfycat.com'
    const deviceType = getState().featureDetection.mobileDevice ? 'mobile' : 'desktop'

    const extendedParams = {
      ...params,
      event: event,
      utc: _utc,
      stc: _stc,
      ref: ref,
      device_type: deviceType
    }

    const queryString = queryParamsString(extendedParams)

    const url = `${metricsEndpoint}?${queryString}`
    fetch(url)
  }
}

const queryParamsString = (params) => {
  return params ? Object.keys(params).map(key => {
    if (params[key]) return `&${key}=${params[key]}`
  }).join('') : ''
}

const getUserAndSessionIds = ({dispatch, getState}) => {
  const { utc, stc } = getState().analytics

  let userId = utc
  let sessionId = stc

  if (!utc) {
    userId = readCookie('_utc')
    if (!userId) {
      userId = generateUUID()
      setCookie({name: '_utc', value: userId, exseconds: 2 * 365 * 24 * 60 * 60})
    }
    dispatch(setUserIdCookie(userId))
  }

  if (!stc) {
    sessionId = readCookie('_stc')
    if (!sessionId) {
      sessionId = generateUUID()
      setCookie({name: '_stc', value: sessionId, exseconds: 30 * 60})
    }
    dispatch(setSessionIdCookie(sessionId))
  }

  return { utc: userId, stc: sessionId }
}


/**
 *  Export all action creators in one object
 */
export const actions = { sendViewCount, sendViewCountBatch, sendEvent }


/**
 *  Selectors
 */
const SELECTORS = {
  [SET_USER_COOKIE]: (state, action) => ({
    ...state,
    ...action.payload
  }),
  [SET_SESSION_COOKIE]: (state, action) => ({
    ...state,
    ...action.payload
  })
}


// utc - user tracking cookie, stc - session tracking cookie
const initialState = { utc: 0, stc: 0 }

export const analyticsReducer = (state = initialState, action) => {
  const selector = SELECTORS[action.type]

  return selector ? selector(state, action) : state
}

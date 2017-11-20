import gfycatSdk from 'components/gif_picker/utils/gfycatSdk'

/**
 *  Action types
 */
export const SDK_AUTH_REQUEST = 'AUTHENTICATE_SDK'
export const SDK_AUTH_SUCCESS = 'SDK_AUTH_SUCCESS'
export const SDK_AUTH_FAIL = 'SDK_AUTH_FAIL'

/**
 *  Actions
 */
export const sdkAuthRequest = () => ({
  type: SDK_AUTH_REQUEST
})

export const sdkAuthSuccess = () => ({
  type: SDK_AUTH_SUCCESS
})


export const sdkAuthFail = err => ({
  type: SDK_AUTH_FAIL,
  err
})

/**
 *  Action Creators
 */
export const authenticateSdk = () => {
  return (dispatch, getState) => {
    const state = getState().authSdk
    if (!state.authenticated) {
      dispatch(sdkAuthRequest())
      return gfycatSdk.authenticate()
        .then(() => dispatch(sdkAuthSuccess()))
        .catch(err => dispatch(sdkAuthFail(err)))
    }
  }
}

const SELECTORS = {
  [SDK_AUTH_SUCCESS]: (state, action) => ({
    ...state,
    authenticated: true
  })
}

const initialState = { authenticated: false }

export const authSdkReducer = (state = initialState, action) => {
  const selector = SELECTORS[action.type]

  return selector ? selector(state, action) : state
}

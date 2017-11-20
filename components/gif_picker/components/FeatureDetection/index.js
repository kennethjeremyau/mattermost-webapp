/**
 *  Action types
 */
export const FEATURE_DETECTION = 'FEATURE_DETECTION'


/**
 *  Actions
 */
export const detectFeature = (feature, value) => ({
  type: FEATURE_DETECTION,
  feature,
  value
})


/**
 *  Export all action creators in one object
 */
export const actions = { detectFeature }


/**
 *  Selectors
 */
const SELECTORS = {
  [FEATURE_DETECTION]: (state, action) => ({
    ...state,
    [action.feature]: action.value
  })
}


/**
 *  Reducers
 */
const initialState = { webpSupported: false }
export const featureDetectionReducer = (state = initialState, action) => {
  const selector = SELECTORS[action.type]

  return selector ? selector(state, action) : state
}

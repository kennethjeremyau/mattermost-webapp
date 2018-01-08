import React, { Component } from 'react'
import PropTypes from 'prop-types'
//import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { authenticateSdk } from 'mattermost-redux/actions/gifs';
import Header from 'components/gif_picker/components/Header'
import { saveAppProps } from 'mattermost-redux/actions/gifs';

const mapDispatchToProps = ({
  saveAppProps,
  authenticateSdk
})

export class App extends Component {
  static propTypes = {
    appProps: PropTypes.object,
    onCategories: PropTypes.func,
    onSearch: PropTypes.func,
    onTrending: PropTypes.func,
    children: PropTypes.object
  }

  constructor(props) {
    super(props)
    const { saveAppProps, appProps, authenticateSdk } = this.props
    saveAppProps(appProps)
    authenticateSdk()
  }

  render() {
    const {
        appProps,
        action,
        onCategories,
        onSearch,
        onTrending,
        children
    } = this.props
    const appClassName = 'main-container ' + (appProps.appClassName || '')
    return (
      <div className={appClassName}>
        <Header
            appProps={appProps}
            action={action}
            onCategories={onCategories}
            onSearch={onSearch}
            onTrending={onTrending}
        />
        <div className="component-container">
          {children}
        </div>
      </div>
    )
  }
}

//@asyncConnect([{
//  promise: ({params, store}) => {
//    return store.dispatch(authenticateSdk())
//  }
//}])
export default connect(null, mapDispatchToProps)(App);

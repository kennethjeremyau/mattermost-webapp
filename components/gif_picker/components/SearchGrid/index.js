import {connect} from 'react-redux';
import {sendEvent} from 'components/gif_picker/components/Analytics';
import {saveSearchScrollPosition} from 'mattermost-redux/actions/gifs';
import SearchGrid from './SearchGrid.js';

function mapStateToProps(state) {
    return {
        ...state.entities.gifs.cache,
        ...state.entities.gifs.search,
//        webpSupported: state.featureDetection.webpSupported,
        webpSupported: true,
        appProps: state.entities.gifs.app
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveSearchScrollPosition,
        sendEvent
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchGrid);

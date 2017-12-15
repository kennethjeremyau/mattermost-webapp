// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    updateSearchTerms,
    showSearchResults,
    showMentions,
    showFlaggedPosts,
    closeRightHandSide
} from 'actions/views/rhs';

import {getRhsState, getSearchTerms, getIsSearching} from 'selectors/rhs';

import {RHSStates} from 'utils/constants.jsx';

import SearchBar from './search_bar.jsx';

function mapStateToProps(state) {
    const rhsState = getRhsState(state);

    return {
        isSearching: getIsSearching(state),
        searchTerms: getSearchTerms(state),
        isMentionSearch: rhsState === RHSStates.MENTION,
        isFlaggedPosts: rhsState === RHSStates.FLAG
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            updateSearchTerms,
            showSearchResults,
            showMentions,
            showFlaggedPosts,
            closeRightHandSide
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);

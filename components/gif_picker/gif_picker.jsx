// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import App from 'components/gif_picker/components/App';
import Categories from 'components/gif_picker/components/Categories';
import Search from 'components/gif_picker/components/Search';
import Trending from 'components/gif_picker/components/Trending';
import constants from 'components/gif_picker/utils/constants';

export const appProps = {
    appName: constants.appName.mattermost,
    basePath: '/mattermost',
    itemTapType: constants.ItemTapAction.SHARE,
    appClassName: 'mattermost',
    shareEvent: 'shareMattermost',
    appId: 'mattermostwebviews',
    enableHistory: true,
    header: {
        tabs: [constants.Tab.TRENDING, constants.Tab.REACTIONS],
        displayText: false
    }
};

export default class GifPicker extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        rightOffset: PropTypes.number,
        topOffset: PropTypes.number,
        placement: PropTypes.oneOf(['top', 'bottom', 'left']),
        onGifClick: PropTypes.func.isRequired
    }

    static defaultProps = {
        rightOffset: 0,
        topOffset: 0
    };

    constructor(props) {
        super(props);

        // All props are primitives or treated as immutable
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

        this.handleTrending = this.handleTrending.bind(this);
        this.handleCategories = this.handleCategories.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);

        this.state = {
            action: 'trending'
        };
    }

    handleTrending() {
        this.setState({
            action: 'trending'
        });
    }

    handleCategories() {
        this.setState({
            action: 'reactions'
        });
    }

    handleSearch() {
        this.setState({
            action: 'search'
        });
    }

    handleItemClick(gif) {
        this.props.onGifClick(gif.max5mbGif);
    }

    render() {
        let pickerStyle;
        if (this.props.style && !(this.props.style.left === 0 || this.props.style.top === 0)) {
            if (this.props.placement === 'top' || this.props.placement === 'bottom') {
                // Only take the top/bottom position passed by React Bootstrap since we want to be right-aligned
                pickerStyle = {
                    top: this.props.style.top,
                    bottom: this.props.style.bottom,
                    right: this.props.rightOffset
                };
            } else {
                pickerStyle = {...this.props.style};
            }
        }

        if (pickerStyle && pickerStyle.top) {
            pickerStyle.top += this.props.topOffset;
        }

        const {action} = this.state;
        let component;
        switch (action) {
        case 'reactions':
            component = (
                <Categories
                    appProps={appProps}
                    action={action}
                    onTrending={this.handleTrending}
                    onSearch={this.handleSearch}
                />
            );
            break;
        case 'search':
            component = (
                <Search
                    appProps={appProps}
                    action={action}
                    handleItemClick={this.handleItemClick}
                />
            );
            break;
        case 'trending':
            component = (
                <Trending
                    appProps={appProps}
                    action={action}
                    handleItemClick={this.handleItemClick}
                />
            );
            break;
        }
        return (
            <div
                className='emoji-picker'
                style={pickerStyle}
            >
                <App
                    appProps={appProps}
                    action={action}
                    onTrending={this.handleTrending}
                    onCategories={this.handleCategories}
                    onSearch={this.handleSearch}
                >
                    {component}
                </App>
            </div>
        );
    }
}

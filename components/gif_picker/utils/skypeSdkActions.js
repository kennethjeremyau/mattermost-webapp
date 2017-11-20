/**
 * SkypeActions.ts
 * Author: Prasanna Narayanasamy
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Skype actions like share, readyToShare and hideShare.
 */
"use strict";
var _retryDelay = 100;
var _maxAttempts = 25;
/**
 * SkypeActions provides the apis that an app hosted within Skype can call to pass messages across to Skype.
 *
 * @export
 * @class SkypeActions
 */
var SkypeActions = (function () {
    function SkypeActions() {
        var _this = this;
        this.requestCount = 1;
        this._callbackSets = {};
        this._onMessage = function (message) {
            if (!message) {
                console.error('onMessage: No message is received over the bridge.');
                return;
            }
            var bridgeResponse = JSON.parse(message);
            if (!bridgeResponse || typeof bridgeResponse !== 'object') {
                console.error('Invalid bridgeResponse received. message: ' + message);
                return;
            }
            if (typeof bridgeResponse.id !== 'number' || bridgeResponse.id === 'undefined' || bridgeResponse.id <= 0) {
                console.error('Unexpected id found in response. message: ' + message);
                return;
            }
            var responseCallbackSet = _this._callbackSets[bridgeResponse.id];
            if (!responseCallbackSet) {
                console.error('Unable to find callbacks for bridge response id: ' + bridgeResponse.id);
                return;
            }
            // If web page has passed callback functions to have response back
            // if response has errorCode or errorMessage then call error handler
            if (bridgeResponse.errorCode || bridgeResponse.errorMessage) {
                if (responseCallbackSet.onError) {
                    console.debug('Invoking onError callback for bridge response id: ' + bridgeResponse.id);
                    responseCallbackSet.onError(bridgeResponse);
                }
            }
            else if (responseCallbackSet.onSuccess) {
                // If web page has passed success callback, then call success handler
                console.debug('Invoking onSuccess callback for bridge response id: ' + bridgeResponse.id);
                responseCallbackSet.onSuccess(bridgeResponse);
            }
            // Delete CallbackSet from dictionary for given id as it is handled
            delete _this._callbackSets[bridgeResponse.id];
        };
    }
    /**
     * Share the given Swift card immediately. Use this to build inline share buttons in web page.
     *
     * @param {Types.SwiftMessage} swiftMessage The swift message to be shared.
     * @param {boolean} [shareAndStay=false] Stop the browser from closing after share. Default is to close browser after share.
     * @param {boolean} [hidePreview=false] Hide preview before share. Default is to show the preview before sharing.
     * @param {string} sharePingUrl Skype pings back this url after sharing. Use this to be notified when a card is shared.
     *
     * @memberof SkypeActions
     */
    SkypeActions.prototype.share = function (swiftMessage, shareAndStay, hidePreview, sharePingUrl) {
        if (shareAndStay === void 0) { shareAndStay = false; }
        if (hidePreview === void 0) { hidePreview = false; }
        this._send({
            bridgeRequestType: 'bridge/share',
            swiftMessage: swiftMessage,
            shareAndStay: shareAndStay,
            hidePreview: hidePreview,
            sharePingUrl: sharePingUrl
        });
    };
    /**
     * Share the given url immediately. Use this to build inline share buttons in web page.
     *
     * @param {string} url The url to be shared.
     * @param {boolean} [shareAndStay=false] Stop the browser from closing after share. Default is to close browser after share.
     * @param {boolean} [hidePreview=false] Hide preview before share. Default is to show the preview before sharing.
     * @param {string} sharePingUrl Skype pings back this url after sharing. Use this to be notified when a url is shared.
     *
     * @memberOf SkypeActions
     */
    SkypeActions.prototype.shareUrl = function (url, shareAndStay, hidePreview, sharePingUrl) {
        if (shareAndStay === void 0) { shareAndStay = false; }
        if (hidePreview === void 0) { hidePreview = false; }
        this._send({
            bridgeRequestType: 'bridge/share',
            url: url,
            shareAndStay: shareAndStay,
            hidePreview: hidePreview,
            sharePingUrl: sharePingUrl
        });
    };
    /**
     * Inform Skype to share a given card when user taps on 'Send to chat' button in WebView.
     *
     * @param {Types.SwiftMessage} swiftMessage The swift message to be shared.
     * @param {boolean} [hidePreview=false] Hide preview before share. Default is to show the preview before sharing.
     * @param {string} sharePingUrl Skype pings back this url after sharing. Use this to be notified when a card is shared.
     *
     * @memberOf SkypeActions
     */
    SkypeActions.prototype.readyToShare = function (swiftMessage, hidePreview, sharePingUrl) {
        if (hidePreview === void 0) { hidePreview = false; }
        this._send({
            bridgeRequestType: 'bridge/readytoshare',
            swiftMessage: swiftMessage,
            hidePreview: hidePreview,
            sharePingUrl: sharePingUrl
        });
    };
    /**
     * Inform Skype to share a given url when user taps on 'Send to chat' button in WebView.
     *
     * @param {string} url The url to be shared.
     * @param {boolean} [hidePreview=false] Hide preview before share. Default is to show the preview before sharing.
     * @param {string} sharePingUrl Skype pings back this url after sharing. Use this to be notified when a url is shared.
     *
     * @memberOf SkypeActions
     */
    SkypeActions.prototype.readyToShareUrl = function (url, hidePreview, sharePingUrl) {
        if (hidePreview === void 0) { hidePreview = false; }
        this._send({
            bridgeRequestType: 'bridge/readytoshare',
            url: url,
            hidePreview: hidePreview,
            sharePingUrl: sharePingUrl
        });
    };
    /**
     * Hide the 'Send to chat' button in WebView footer. Use when web page has nothing to share.
     *
     * @memberOf SkypeActions
     */
    SkypeActions.prototype.hideShare = function () {
        this._send({
            bridgeRequestType: 'bridge/hideshare'
        });
    };
    /**
     * Save a url to backpack. Use this to build inline save to backpack buttons.
     *
     * @param {string} url The url to be saved to backpack.
     *
     * @memberOf SkypeActions
     */
    SkypeActions.prototype.saveToBackpack = function (url) {
        this._send({
            bridgeRequestType: 'bridge/savetobackpack',
            url: url
        });
    };
    /**
     * Close the WebView. Useful to close WebView when either the transaction is complete or user cancels the transaction.
     *
     * @memberOf SkypeActions
     */
    SkypeActions.prototype.closeWebView = function () {
        this._send({
            bridgeRequestType: 'bridge/closewebview'
        });
    };
    /**
     * Get bot userId asynchronously.
     * Useful when web page needs to post something to bot on behalf of Skype me user.
     *
     * The onSuccess callback provides 'userId' in response.
     * @callback onSuccess
     * @param {Types.SkypeResponse} response
     *
     * The onError callback provides 'errorCode' and 'errorMessage' in 'error' object. It is optional.
     * @callback [onError]
     * @param {Types.SkypeResponse} error
     *
     * @memberOf SkypeActions
     */
    SkypeActions.prototype.getUserId = function (onSuccess, onError) {
        if (!onSuccess) {
            console.error('getUserId: onSuccess callback is not defined.');
            return;
        }
        this._send({
            bridgeRequestType: 'bridge/getuserid'
        }, {
            onSuccess: onSuccess,
            onError: onError
        });
    };
    /**
     * Get current conversation information asynchronously.
     * Useful when web page needs to post something to bot on behalf of Skype me user in context of current conversation.
     *
     * The onSuccess callback provides 'conversationId', 'userId' and 'userDisplayName' in response.
     * @callback onSuccess
     * @param {Types.SkypeResponse} response
     *
     * The onError callback provides 'errorCode' and 'errorMessage' in 'error' object. It is optional.
     * @callback [onError]
     * @param {Types.SkypeResponse} error
     *
     * @memberOf SkypeActions
     */
    SkypeActions.prototype.getConversationInfo = function (onSuccess, onError) {
        if (!onSuccess) {
            console.error('getConversationInfo: onSuccess callback is not defined.');
            return;
        }
        this._send({
            bridgeRequestType: 'bridge/getconversationinfo'
        }, {
            onSuccess: onSuccess,
            onError: onError
        });
    };
    /*global WebViewBridge*/
    /**
     * Send a message to Skype with retries.
     *
     * @private
     * @param {Types.SkypeRequest} request
     * @param {Types.CallbackSet} [callbackSet]
     * @param {number} [count=0]
     *
     * @memberOf SkypeActions
     */
    SkypeActions.prototype._send = function (request, callbackSet, count) {
        var _this = this;
        if (count === void 0) { count = 0; }
        if (!request) {
            console.warn('Request was not supplied to bridge for sharing.');
            return;
        }
        if (count === _maxAttempts) {
            console.debug(request.bridgeRequestType + ' max attempts reached');
        }
        var bridge;
        try {
            bridge = WebViewBridge;
        }
        catch (e) {
            bridge = undefined;
        }
        if (!bridge || typeof bridge !== 'object') {
            // If web page calls an API before page load then WebViewBridge object might not be available
            // So below code is retrying 25 times at 100ms interval to check if WebViewBridge object is available
            // TODO: Investigate if this can be reliably implemented using window.onload handler
            if (count < _maxAttempts) {
                setTimeout(function () { return _this._send(request, callbackSet, count + 1); }, _retryDelay);
            }
            return;
        }
        if (callbackSet && (callbackSet.onSuccess || callbackSet.onError)) {
            // Keep mapping of requestId and Callback functions in dictionary
            request.id = this._getUniqueRequestId();
            this._callbackSets[request.id] = callbackSet;
            if (!bridge.onMessage) {
                // As now WebViewBridge is available, define bridge's onMessage handler
                bridge.onMessage = this._onMessage;
            }
        }
        var message = JSON.stringify(request);
        bridge.send(message);
    };
    SkypeActions.prototype._getUniqueRequestId = function () {
        return this.requestCount++;
    };
    return SkypeActions;
}());

// Export globally for non ES6 modules.
var instance = new SkypeActions();
export default instance;
window['SkypeActions'] = instance;

// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import EventEmitter from 'events';

const CHANGE_EVENT = 'change';

import store from 'stores/redux_store.jsx';

class GifStoreClass extends EventEmitter {
    constructor() {
        super();

        this.entities = {};

        store.subscribe(() => {
            const newEntities = store.getState().entities;

            if (newEntities.gifs !== this.entities.gifs) {
                this.emitChange();
            }

            this.entities = newEntities;
        });
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    get() {
        return JSON.parse(JSON.stringify(store.getState().entities.gifs));
    }
}

var GifStore = new GifStoreClass();
export default GifStore;

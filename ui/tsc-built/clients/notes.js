"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notes = void 0;
const mobx_js_1 = require("/mobx.js");
const notes_client_js_1 = require("./notes-client.js");
const loading_bar_js_1 = require("../components/loading-bar.js");
const link_shrink_client_js_1 = require("./link-shrink-client.js");
class _Notes {
    constructor() {
        this.client = new notes_client_js_1.NotesClient();
        this.links = new link_shrink_client_js_1.LinkShrinkClient();
        this.inProgress = {};
        this.state = mobx_js_1.observable({});
    }
    start(key, deferable) {
        if (!this.inProgress[key]) {
            this.inProgress[key] = true;
            loading_bar_js_1.LoadingBarState.transient.enqueue(async () => {
                await deferable()
                    .then(v => {
                    this.state[key] = { timestamp: Date.now(), value: v };
                }).catch(e => {
                    console.log('Failed to process', key);
                }).finally(() => {
                    this.inProgress[key] = false;
                });
            });
        }
    }
    getIfRecentOrLoad(key, howRecent, deferable) {
        if (this.state[key] === undefined) {
            mobx_js_1.set(this.state, { [key]: null });
        }
        if (this.state[key] && (howRecent == null || ((Date.now() - this.state[key].timestamp) < howRecent))) {
            return this.state[key].value;
        }
        this.start(key, deferable);
    }
    getNote(note) {
        if (!note) {
            return null;
        }
        return this.getIfRecentOrLoad(note, 500, () => this.client.get(note));
    }
    genLink() {
        const currentLink = window.location.href;
        return this.getIfRecentOrLoad(currentLink, null, () => this.links.shrink(currentLink));
    }
}
__decorate([
    mobx_js_1.action
], _Notes.prototype, "start", null);
exports.Notes = new _Notes();

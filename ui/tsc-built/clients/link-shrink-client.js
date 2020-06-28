"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkShrinkClient = void 0;
const client_config_js_1 = require("../config/client-config.js");
const settings_js_1 = require("../components/settings.js");
class LinkShrinkClient {
    async shrink(destination) {
        const headers = new Headers();
        if (settings_js_1.SettingsState.stored.linkShrinkApiKey) {
            headers.set('x-api-key', settings_js_1.SettingsState.stored.linkShrinkApiKey);
        }
        const result = await fetch(`${client_config_js_1.Config.linkShrinkDomain}`, {
            method: "POST",
            credentials: "omit",
            headers: headers,
            body: JSON.stringify({
                value: encodeURIComponent(destination)
            })
        });
        const body = await result.json();
        if (result.status == 200) {
            return 'https://link.sammons.io/s/' + body.value;
        }
        else {
            throw new Error(`Failed to shrink link ${destination}: ${body.message}`);
        }
    }
}
exports.LinkShrinkClient = LinkShrinkClient;

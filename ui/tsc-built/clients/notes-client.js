"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesClient = void 0;
const client_config_js_1 = require("../config/client-config.js");
const settings_js_1 = require("../components/settings.js");
class NotesClient {
    async save(note, name) {
        const headers = new Headers();
        if (settings_js_1.SettingsState.stored.notesApiKey) {
            headers.set('x-api-key', settings_js_1.SettingsState.stored.notesApiKey);
        }
        const result = await fetch(`${client_config_js_1.Config.notesDomain}/notes`, {
            method: "POST",
            credentials: "omit",
            headers: headers,
            body: JSON.stringify({
                name: encodeURIComponent(name), note
            })
        });
        const body = await result.json();
        if (result.status == 200) {
            return;
        }
        else {
            throw new Error(`Failed to save note ${name}`);
        }
    }
    async get(name) {
        var _a;
        const headers = new Headers();
        if (settings_js_1.SettingsState.stored.notesApiKey) {
            headers.set('x-api-key', settings_js_1.SettingsState.stored.notesApiKey);
        }
        const result = await fetch(`${client_config_js_1.Config.notesDomain}/notes/${encodeURIComponent(name)}`, {
            method: "GET",
            credentials: "omit",
            headers: headers
        });
        const body = await result.json();
        if (result.status >= 200 && result.status < 300) {
            const lastResult = (_a = body.value) === null || _a === void 0 ? void 0 : _a.values.slice(-1)[0];
            if (lastResult != null) {
                return JSON.parse(lastResult.value);
            }
        }
        return null;
    }
}
exports.NotesClient = NotesClient;

"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsState = exports.Settings = void 0;
const react_js_1 = require("/react.js");
const core_js_1 = require("/@material-ui/core.js");
const state_maker_js_1 = require("../lib/state-maker.js");
const debouncer_js_1 = require("../lib/debouncer.js");
const loading_bar_js_1 = require("../components/loading-bar.js");
_a = state_maker_js_1.MakeStateful('settings', { /* nav */}, {
    linkShrinkApiKey: '',
    notesApiKey: ''
}, { /* transient */}, () => {
    return react_js_1.default.createElement(react_js_1.Fragment, null,
        react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "column", spacing: 1 },
            react_js_1.default.createElement(core_js_1.Grid, { item: true },
                react_js_1.default.createElement(core_js_1.Card, null,
                    react_js_1.default.createElement(core_js_1.CardHeader, { title: "Global Config" }),
                    react_js_1.default.createElement(core_js_1.CardContent, null,
                        react_js_1.default.createElement(core_js_1.Grid, { container: true, direction: "row", alignItems: 'flex-start', justify: 'space-between', spacing: 1 },
                            react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 8 },
                                react_js_1.default.createElement(core_js_1.TextField, { label: "link shrink aws api key", fullWidth: true, defaultValue: exports.SettingsState.stored.linkShrinkApiKey, onChange: (e) => {
                                        var _a;
                                        const val = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value;
                                        debouncer_js_1.Debounced('link-shrink-aws-api-key-change', () => {
                                            if (val != null) {
                                                exports.SettingsState.stored.linkShrinkApiKey = val.trim();
                                            }
                                        });
                                    } })),
                            react_js_1.default.createElement(core_js_1.Grid, { item: true, xs: 8 },
                                react_js_1.default.createElement(core_js_1.TextField, { label: "notes aws api key", fullWidth: true, defaultValue: exports.SettingsState.stored.notesApiKey, onChange: (e) => {
                                        var _a;
                                        const val = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value;
                                        debouncer_js_1.Debounced('notes-aws-api-key-change', () => {
                                            if (val != null) {
                                                exports.SettingsState.stored.notesApiKey = val.trim();
                                            }
                                        });
                                    } })),
                            react_js_1.default.createElement(core_js_1.Grid, { item: true },
                                react_js_1.default.createElement(core_js_1.Button, { variant: "outlined", onClick: () => {
                                        loading_bar_js_1.LoadingBarState.transient.enqueue(() => new Promise((res) => {
                                            setTimeout(res, 500);
                                        }));
                                    } }, "Validate")))))),
            react_js_1.default.createElement(core_js_1.Grid, { item: true },
                react_js_1.default.createElement(core_js_1.Card, null,
                    react_js_1.default.createElement(core_js_1.CardHeader, { title: "Grocery List Config" }),
                    react_js_1.default.createElement(core_js_1.CardContent, null,
                        react_js_1.default.createElement(core_js_1.TextField, { label: "TBD" })))),
            react_js_1.default.createElement(core_js_1.Grid, { item: true },
                react_js_1.default.createElement(core_js_1.Card, null,
                    react_js_1.default.createElement(core_js_1.CardHeader, { title: "Todo List Config" }),
                    react_js_1.default.createElement(core_js_1.CardContent, null,
                        react_js_1.default.createElement(core_js_1.TextField, { label: "TBD" }))))));
}), exports.Settings = _a.component, exports.SettingsState = _a.state;
